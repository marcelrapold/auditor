// Tests for scripts/diff-runs.mjs — the run-to-run diff and its CI gate.
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

import { diffMarkdown, diffRuns } from "../diff-runs.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = join(here, "..", "..");
const baseline = JSON.parse(readFileSync(join(here, "fixtures", "audit-run.example.json"), "utf8"));

/** A plausible follow-up run: SEC-001 fixed, SEC-014 got worse, one new P1, readiness up. */
function current() {
  const c = JSON.parse(JSON.stringify(baseline));
  c.target.commit = "fedcba9876543210fedcba9876543210fedcba98";
  c.target.audited_at = "2026-10-01T08:00:00Z";
  c.findings = c.findings.filter((f) => f.id !== "SEC-001");
  const sec014 = c.findings.find((f) => f.id === "SEC-014");
  sec014.severity = "P1";
  sec014.deal_blocker = true;
  // Renumbered but same audit + title → must match, not count as new.
  const i2 = c.findings.find((f) => f.id === "I2-004");
  i2.id = "I2-001";
  c.findings.push({
    id: "SEC-031",
    audit: "security",
    title: "JWT accepted with alg=none",
    severity: "P1",
    confidence: 0.9,
    effort: "S",
    controls: ["ISO27001:A.8.5", "SOC2:CC6.1"],
    deal_blocker: true,
    fine_exposure: "none",
    evidence: "lib/auth.ts:19 jwt.verify(token, key, { algorithms: undefined })",
    fix: "Pin algorithms: ['RS256'].",
    expected_impact: "Closes token forgery.",
  });
  c.scorecard = [
    { audit: "security", grade: "B+", score: 82 },
    { audit: "infrastructure", grade: "A-", score: 90 },
    { audit: "accessibility", grade: "B", score: 80 },
  ];
  c.readiness.score_percent = 75;
  c.readiness.controls.find((x) => x.id === "ISO27001:A.8.3").status = "implemented";
  c.readiness.controls.find((x) => x.id === "ISO27001:A.8.9").status = "missing";
  return c;
}

test("diffRuns classifies added, fixed, persisting (incl. renumbered) and severity changes", () => {
  const d = diffRuns(baseline, current());
  assert.deepEqual(d.added.map((f) => f.id), ["SEC-031"]);
  assert.deepEqual(d.fixed.map((f) => f.id), ["SEC-001"]);
  const renumbered = d.persisting.find((p) => p.id === "I2-001");
  assert.equal(renumbered.baseline_id, "I2-004", "matched by audit + title despite the new id");
  const worse = d.persisting.find((p) => p.id === "SEC-014");
  assert.equal(worse.severity_change, "worse");
  assert.equal(d.summary.new_p0p1, 1);
  assert.equal(d.summary.severity_worsened, 1);
  assert.equal(d.summary.deal_blockers_before, 3);
  assert.equal(d.summary.deal_blockers_after, 4);
  assert.deepEqual(d.summary, { ...d.summary, readiness_before: 62.5, readiness_after: 75 });
});

test("scorecard and control deltas", () => {
  const d = diffRuns(baseline, current());
  const sec = d.scorecard.find((s) => s.audit === "security");
  assert.equal(sec.delta, 4);
  const acc = d.scorecard.find((s) => s.audit === "accessibility");
  assert.equal(acc.delta, -4);
  const byId = Object.fromEntries(d.controls.map((c) => [c.id, c]));
  assert.equal(byId["ISO27001:A.8.3"].direction, "better");
  assert.equal(byId["ISO27001:A.8.9"].direction, "worse");
  assert.equal(d.summary.controls_regressed, 1);
  assert.equal(d.summary.controls_improved, 1);
});

test("conditions reflect the diff; an identical run hits none except deal-blocker", () => {
  const d = diffRuns(baseline, current());
  assert.deepEqual(d.conditions, { "new-p0p1": true, "deal-blocker": true, regression: true, "score-drop": true });
  const same = diffRuns(baseline, JSON.parse(JSON.stringify(baseline)));
  assert.deepEqual(same.conditions, { "new-p0p1": false, "deal-blocker": true, regression: false, "score-drop": false });
  assert.equal(same.summary.added, 0);
  assert.equal(same.summary.fixed, 0);
});

test("markdown renders the sections", () => {
  const md = diffMarkdown(diffRuns(baseline, current()));
  for (const h of ["# Audit diff: acme/shop", "## Summary", "## Added", "## Fixed", "## Changed", "## Scorecard", "## Controls"]) assert.ok(md.includes(h), h);
  assert.ok(md.includes("| Readiness score | 62.5 → 75 % |"));
  assert.ok(md.includes("Conditions hit: `new-p0p1`, `deal-blocker`, `regression`, `score-drop`"));
});

test("CLI writes the diff and exits 2 only when a --fail-on condition is hit", () => {
  const dir = mkdtempSync(join(tmpdir(), "auditor-diff-"));
  const cur = join(dir, "current.json");
  writeFileSync(cur, JSON.stringify(current()));
  const base = join(here, "fixtures", "audit-run.example.json");
  const script = join(ROOT, "scripts", "diff-runs.mjs");
  const ok = execFileSync(process.execPath, [script, base, cur, "--out", dir], { encoding: "utf8" });
  assert.match(ok, /\+1 added, -1 fixed, 4 persisting; new P0\/P1: 1/);
  assert.ok(readFileSync(join(dir, "AUDIT-DIFF.md"), "utf8").includes("## Added"));
  let status = 0;
  try {
    execFileSync(process.execPath, [script, base, cur, "--out", dir, "--fail-on", "new-p0p1"], { encoding: "utf8", stdio: "pipe" });
  } catch (err) {
    status = err.status;
    assert.match(String(err.stderr), /fail-on condition hit: new-p0p1/);
  }
  assert.equal(status, 2);
  // A condition that is not hit passes.
  const same = join(dir, "same.json");
  writeFileSync(same, JSON.stringify(baseline));
  const pass = execFileSync(process.execPath, [script, base, same, "--out", dir, "--fail-on", "new-p0p1,regression"], { encoding: "utf8" });
  assert.match(pass, /\+0 added/);
});
