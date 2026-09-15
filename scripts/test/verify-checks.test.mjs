// Tests for scripts/verify-checks.mjs — executable re-audit criteria.
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

import { runCheck, verifyMarkdown, verifyRun } from "../verify-checks.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = join(here, "..", "..");
const fixture = JSON.parse(readFileSync(join(here, "fixtures", "audit-run.example.json"), "utf8"));

// Portable checks: node is the only tool a checkout is guaranteed to have here.
const includesCheck = (file, needle) => ({
  run: `node -e "process.exit(require('fs').readFileSync('${file}','utf8').includes('${needle}')?0:1)"`,
  expect: "exit-zero",
  description: `${file} contains ${needle}`,
});

function repoWith(content) {
  const repo = mkdtempSync(join(tmpdir(), "auditor-checks-"));
  mkdirSync(join(repo, "handlers"), { recursive: true });
  writeFileSync(join(repo, "handlers", "orders.ts"), content);
  return repo;
}

test("runCheck honours expect and reports exit codes", () => {
  const repo = repoWith("find({ id, ownerId })");
  assert.equal(runCheck(includesCheck("handlers/orders.ts", "ownerId"), repo).status, "pass");
  assert.equal(runCheck(includesCheck("handlers/orders.ts", "nope"), repo).status, "fail");
  assert.equal(runCheck({ run: 'node -e "process.exit(2)"', expect: "exit-nonzero" }, repo).status, "pass");
  assert.equal(runCheck({ run: 'node -e "process.exit(0)"', expect: "exit-nonzero" }, repo).status, "fail");
  const r = runCheck({ run: 'node -e "process.exit(7)"' }, repo);
  assert.equal(r.exit_code, 7);
});

test("verifyRun: fixed findings pass, open ones fail, checkless ones are reported (strict makes them fail)", () => {
  const run = JSON.parse(JSON.stringify(fixture));
  run.findings[0].check = includesCheck("handlers/orders.ts", "ownerId"); // SEC-001 — fixed in this checkout
  run.findings[2].check = includesCheck("handlers/orders.ts", "Content-Security-Policy"); // SEC-014 — still open
  const repo = repoWith("db.orders.find({ id, ownerId: req.user.id })");
  const report = verifyRun(run, repo);
  const byId = Object.fromEntries(report.results.map((r) => [r.finding_id, r.status]));
  assert.equal(byId["SEC-001"], "pass");
  assert.equal(byId["SEC-014"], "fail");
  assert.equal(byId["I2-004"], "no-check");
  assert.equal(report.ok, false);
  assert.deepEqual(report.counts, { pass: 1, fail: 1, "no-check": 3 });
  const strict = verifyRun(run, repo, { strict: true });
  assert.equal(strict.counts["missing-check"], 3);
  const md = verifyMarkdown(report);
  assert.ok(md.includes("# Re-audit checks: acme/shop"));
  assert.ok(md.includes("| SEC-014 | P2 | fail |"));
});

test("CLI exits 3 when a check fails and 0 when all pass", () => {
  const dir = mkdtempSync(join(tmpdir(), "auditor-checks-cli-"));
  const run = JSON.parse(JSON.stringify(fixture));
  run.findings[0].check = includesCheck("handlers/orders.ts", "ownerId");
  const runPath = join(dir, "run.json");
  writeFileSync(runPath, JSON.stringify(run));
  const script = join(ROOT, "scripts", "verify-checks.mjs");
  const fixedRepo = repoWith("ownerId");
  const ok = execFileSync(process.execPath, [script, runPath, "--repo", fixedRepo, "--out", dir], { encoding: "utf8" });
  assert.match(ok, /✓ checks: pass 1, fail 0, error 0, no check 4/);
  assert.ok(readFileSync(join(dir, "CHECKS-REPORT.md"), "utf8").includes("All checks passed"));
  const openRepo = repoWith("no owner check here");
  let status = 0;
  try {
    execFileSync(process.execPath, [script, runPath, "--repo", openRepo, "--out", dir], { encoding: "utf8", stdio: "pipe" });
  } catch (err) {
    status = err.status;
    assert.match(String(err.stdout), /SEC-001 \[P0\] fail \(exit 1, expected exit-zero\)/);
  }
  assert.equal(status, 3);
});
