// Tests for scripts/export-findings.mjs — the deterministic business exports.
// Run: node --test "scripts/test/*.test.mjs"   (Node ≥ 21 expands the glob itself)
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";

import {
  CCM_DOMAINS,
  WCAG22_A_AA,
  deriveControls,
  findingCriteria,
  findingLocations,
  toAcrCsv,
  toQuestionnaireCsv,
  toTrustCenterHtml,
  stableUuid,
  toEvidenceManifest,
  toExecutiveReport,
  toFindingsCsv,
  toGapMatrixCsv,
  toOscal,
  toSarif,
  validateRun,
} from "../export-findings.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = join(here, "..", "..");
const fixture = JSON.parse(readFileSync(join(here, "fixtures", "audit-run.example.json"), "utf8"));
const clone = () => JSON.parse(JSON.stringify(fixture));

test("the fixture satisfies the run contract and lists every required finding field", () => {
  assert.deepEqual(validateRun(fixture), []);
  // The contract must stay in lock-step with the field list the prompts gate enforces.
  const gate = readFileSync(join(ROOT, "scripts", "check-prompts.mjs"), "utf8");
  const gateFields = [...gate.matchAll(/^\s+"([a-z_]+)",$/gm)].map((m) => m[1]);
  const schema = JSON.parse(readFileSync(join(ROOT, "schemas", "finding.schema.json"), "utf8"));
  assert.deepEqual([...schema.required].sort(), [...gateFields].sort(), "finding.schema.json required == check-prompts SCHEMA_FIELDS");
});

test("validateRun names concrete problems", () => {
  const bad = clone();
  bad.findings[0].severity = "HIGH";
  bad.findings[1].controls = ["not-a-control"];
  delete bad.findings[2].fine_exposure;
  bad.findings[3].id = "SEC-001"; // duplicate
  bad.output_lang = "fr";
  const problems = validateRun(bad);
  assert.ok(problems.some((p) => p.includes("severity must be P0–P3")));
  assert.ok(problems.some((p) => p.includes('"not-a-control" is not <FRAMEWORK>:<ID>')));
  assert.ok(problems.some((p) => p.includes('missing required field "fine_exposure"')));
  assert.ok(problems.some((p) => p.includes("duplicate id")));
  assert.ok(problems.some((p) => p.includes("output_lang")));
});

test("findingLocations prefers explicit locations and otherwise parses path:line from evidence", () => {
  const [sec001, i2004, sec014, sec020] = fixture.findings;
  assert.deepEqual(findingLocations(sec001), [{ path: "handlers/orders.ts", line: 42 }]);
  assert.deepEqual(findingLocations(i2004).map((l) => `${l.path}:${l.line}`), ["infra/network.tf:61", "infra/rds.tf:22"]);
  assert.deepEqual(findingLocations(sec014), [{ path: "next.config.ts", line: 12 }]);
  // "lines 1-20 of the file" and dates must not become locations.
  assert.deepEqual(findingLocations(sec020), []);
  assert.deepEqual(findingLocations({ evidence: "Art. 32 at 10:30 on 2026-09-16; see GDPR Art. 6(1)(a)" }), []);
});

test("stableUuid is deterministic and UUID-shaped", () => {
  assert.equal(stableUuid("x"), stableUuid("x"));
  assert.notEqual(stableUuid("x"), stableUuid("y"));
  assert.match(stableUuid("anything"), /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-8[0-9a-f]{3}-[0-9a-f]{12}$/);
});

test("SARIF 2.1.0: one rule and one result per finding, levels and locations mapped", () => {
  const sarif = toSarif(fixture);
  assert.equal(sarif.version, "2.1.0");
  const run = sarif.runs[0];
  assert.equal(run.tool.driver.name, "auditor");
  assert.equal(run.tool.driver.rules.length, fixture.findings.length);
  assert.equal(run.results.length, fixture.findings.length);
  const byId = Object.fromEntries(run.results.map((r) => [r.ruleId, r]));
  assert.equal(byId["SEC-001"].level, "error");
  assert.equal(byId["I2-004"].level, "error");
  assert.equal(byId["SEC-014"].level, "warning");
  assert.equal(byId["SEC-020"].level, "note");
  assert.equal(byId["I2-004"].locations.length, 2);
  assert.equal(byId["I2-004"].locations[0].physicalLocation.artifactLocation.uri, "infra/network.tf");
  assert.equal(byId["I2-004"].locations[0].physicalLocation.region.startLine, 61);
  assert.equal(byId["SEC-020"].locations, undefined, "no fabricated location");
  assert.equal(run.tool.driver.rules[0].properties["security-severity"], "9.5");
  assert.deepEqual(byId["SEC-001"].properties.controls, fixture.findings[0].controls);
  assert.equal(run.versionControlProvenance[0].revisionId, fixture.target.commit);
  assert.equal(run.properties.readiness_score_percent, 62.5);
});

test("OSCAL assessment-results: one observation per finding, one finding per (finding × control)", () => {
  const oscal = toOscal(fixture);
  const ar = oscal["assessment-results"];
  assert.equal(ar.metadata["oscal-version"], "1.1.2");
  assert.match(ar.metadata.remarks, /not a certification audit opinion/);
  const result = ar.results[0];
  assert.equal(result.observations.length, fixture.findings.length);
  const expected = fixture.findings.reduce((n, f) => n + Math.max(1, f.controls.length), 0);
  assert.equal(result.findings.length, expected);
  const uncategorised = result.findings.filter((f) => f.target["target-id"].startsWith("AUDITOR:"));
  assert.equal(uncategorised.length, 1, "a finding without controls still lands under its audit");
  assert.equal(result.findings[0].target.status.reason, "major-nonconformity");
  const included = result["reviewed-controls"]["control-selections"][0]["include-controls"].map((c) => c["control-id"]);
  assert.ok(included.includes("ISO27001:A.8.24"), "implemented controls from the readiness block are reviewed too");
  // Re-export is byte-identical (stable UUIDs).
  assert.deepEqual(toOscal(clone()), oscal);
});

test("deriveControls turns findings into a control view with NC classes", () => {
  const view = Object.fromEntries(deriveControls(fixture).map((c) => [c.id, c]));
  assert.equal(view["ISO27001:A.8.3"].status, "missing");
  assert.equal(view["ISO27001:A.8.3"].nc_class, "major");
  assert.equal(view["ISO27001:A.8.9"].status, "partial");
  assert.equal(view["ISO27001:A.8.9"].nc_class, "minor");
  assert.equal(view["SOC2:CC6.1"].effort_days, 2.5, "M (2) + S (0.5)");
  assert.equal(view["SOC2:CC6.1"].deal_blocker, true);
});

test("gap-matrix.csv uses the explicit readiness block and appends not-assessable rows", () => {
  const text = toGapMatrixCsv(fixture);
  const lines = text.trim().split("\n");
  assert.equal(lines[0], "framework,control_id,status,nc_class,finding_ids,severity_max,effort_days,deal_blocker,evidence,owner");
  assert.equal(lines.length - 1, fixture.readiness.controls.length + fixture.readiness.not_assessable.length);
  assert.ok(lines.some((l) => l.startsWith("ISO27001,ISO27001:A.8.3,missing,major,SEC-001,P0,2,true,")));
  assert.ok(lines.some((l) => l.startsWith("ISO27001,ISO27001:A.5.1,not-assessable,")));
  // Without a readiness block the derived view is used.
  const derivedOnly = clone();
  delete derivedOnly.readiness;
  const d = toGapMatrixCsv(derivedOnly).trim().split("\n");
  assert.equal(d.length - 1, deriveControls(derivedOnly).length);
});

test("findings.csv quotes commas and newlines and flattens controls", () => {
  const text = toFindingsCsv(fixture);
  const lines = text.trim().split("\n");
  assert.equal(lines.length - 1, fixture.findings.length);
  assert.ok(lines[1].includes('"Scope the query to the caller: find({ id, ownerId: req.user.id }); return 404 on miss."'), "field with a comma is quoted");
  assert.ok(lines[1].includes(",IDOR on GET /api/orders/{id} — any user reads any order,"), "field without CSV specials stays bare");
  assert.ok(lines[1].includes("ISO27001:A.8.3; ISO27001:A.5.15"), "controls joined with '; '");
  assert.ok(lines[2].includes("infra/network.tf:61; infra/rds.tf:22"));
});

test("executive report renders the board sections in the run's language", () => {
  const en = toExecutiveReport(fixture);
  for (const h of ["# Executive audit report: acme/shop", "## Key numbers", "## Scorecard", "## Deal-blockers", "## Fine exposure", "## Certification readiness: iso27001", "## Roadmap", "## Coverage and limitations", "## Appendix — all findings"]) {
    assert.ok(en.includes(h), `missing section ${h}`);
  }
  assert.ok(en.includes("**62.5 %**"));
  assert.ok(en.includes("| Deal-blockers | 3 |"));
  assert.ok(en.includes("GDPR Art. 83(5): up to EUR 20M / 4 % of global annual turnover | SEC-001"));
  assert.ok(en.includes("Estimated time to audit-ready: **3–6 person-days**"));
  assert.ok(en.includes("not a certificate"));
  assert.ok(en.includes("`data` — no database in scope"));
  const de = toExecutiveReport({ ...clone(), output_lang: "de" });
  assert.ok(de.includes("# Executive-Audit-Bericht: acme/shop"));
  assert.ok(de.includes("## Bussgeld-Exposition"));
  assert.ok(de.includes("kein Zertifikat"));
  assert.ok(!de.includes("ß"), "de-CH: no Eszett");
  const noSummary = clone();
  delete noSummary.summary;
  assert.ok(toExecutiveReport(noSummary).includes("_The agent writes 5–8 sentences here"));
});

test("evidence manifest hashes cited artifacts that exist and lists the rest as unresolved", () => {
  const repo = mkdtempSync(join(tmpdir(), "auditor-evidence-"));
  mkdirSync(join(repo, "handlers"), { recursive: true });
  const content = "export const orders = db.orders.find({ id });\n";
  writeFileSync(join(repo, "handlers", "orders.ts"), content);
  const manifest = toEvidenceManifest(fixture, repo);
  const byPath = Object.fromEntries(manifest.artifacts.map((a) => [a.path, a]));
  assert.equal(byPath["handlers/orders.ts"].present, true);
  assert.equal(byPath["handlers/orders.ts"].sha256, createHash("sha256").update(content).digest("hex"));
  assert.deepEqual(byPath["handlers/orders.ts"].finding_ids, ["SEC-001"]);
  assert.deepEqual(byPath["handlers/orders.ts"].lines, [42]);
  assert.equal(byPath["infra/network.tf"].present, false);
  assert.ok(manifest.unresolved.includes("infra/network.tf"));
  assert.equal(manifest.target.commit, fixture.target.commit);
  assert.ok(!JSON.stringify(manifest).includes("db.orders"), "no file content is copied into the manifest");
});

test("caiq-answers.csv pre-fills every CCM domain from control statuses, worst status first", () => {
  const lines = toQuestionnaireCsv(fixture).trim().split("\n");
  assert.equal(lines[0], "domain,domain_name,control_id,answer,finding_ids,evidence,notes");
  // Domain names may contain commas (quoted), so key rows by the CCM: token instead of a naive split.
  const rows = Object.fromEntries(lines.slice(1).map((l) => [l.match(/(CCM:[A-Z&]+(?:-\d+)?)/)[1], l]));
  assert.ok(Object.keys(rows).length >= CCM_DOMAINS.length, "one row per domain at least");
  assert.ok(rows["CCM:IAM"].startsWith("IAM,Identity & Access Management,CCM:IAM,No,SEC-001,"), "a P0 makes the domain a No");
  assert.ok(rows["CCM:CEK"].includes(",Yes,,"), "implemented readiness control answers Yes");
  assert.ok(rows["CCM:HRS"].includes("Not assessed by this run"), "untouched domain is honest");
  // Every domain appears exactly once at domain level.
  for (const [d] of CCM_DOMAINS) assert.ok(rows[`CCM:${d}`], `domain ${d} present`);
});

test("findingCriteria reads WCAG controls and the wcag field", () => {
  assert.deepEqual(findingCriteria(fixture.findings[4]).sort(), ["1.1.1", "4.1.2"]);
  assert.deepEqual(findingCriteria({ wcag: "SC 2.4.7 Focus Visible; 1.4.11" }).sort(), ["1.4.11", "2.4.7"]);
  assert.deepEqual(findingCriteria(fixture.findings[0]), []);
});

test("acr-wcag22.csv has every A/AA criterion with a VPAT status", () => {
  const lines = toAcrCsv(fixture).trim().split("\n");
  assert.equal(lines[0], "criteria,name,level,conformance_level,finding_ids,remarks");
  assert.equal(lines.length - 1, WCAG22_A_AA.length);
  const byId = Object.fromEntries(lines.slice(1).map((l) => [l.split(",")[0], l]));
  assert.ok(byId["4.1.2"].includes(",Does Not Support,X4-008,"), "P0 → Does Not Support");
  assert.ok(byId["1.1.1"].includes(",Does Not Support,X4-008,"));
  assert.ok(byId["2.4.7"].includes(",Supports,,"), "uncited criterion Supports when the accessibility audit ran");
  const noA11y = clone();
  noA11y.audits = ["security"];
  noA11y.findings = noA11y.findings.filter((f) => f.id !== "X4-008");
  const na = Object.fromEntries(toAcrCsv(noA11y).trim().split("\n").slice(1).map((l) => [l.split(",")[0], l]));
  assert.ok(na["2.4.7"].includes(",Not Evaluated,,"), "no accessibility audit → Not Evaluated, never Supports");
  // An AAA criterion cited by a finding is appended, not dropped.
  const aaa = clone();
  aaa.findings[4].controls = ["WCAG:1.4.6"];
  aaa.findings[4].wcag = "SC 1.4.6";
  const extra = toAcrCsv(aaa).trim().split("\n");
  assert.equal(extra.length - 1, WCAG22_A_AA.length + 1);
  assert.ok(extra.at(-1).startsWith("1.4.6,,AAA / other,Does Not Support,X4-008,"));
});

test("trust-center.html is aggregate-only, escaped, and carries the readiness caveat", () => {
  const run = clone();
  run.target.name = "acme/<shop> & co";
  const html = toTrustCenterHtml(run);
  assert.ok(html.startsWith("<!doctype html>"));
  assert.ok(html.includes("acme/&lt;shop&gt; &amp; co"), "target name is escaped");
  assert.ok(html.includes("62.5 %"));
  assert.ok(html.includes("not a certificate") || html.includes("Readiness, not certification"));
  assert.ok(!html.includes("handlers/orders.ts"), "no evidence or finding detail leaks into the page");
  assert.ok(!html.includes("IDOR"), "no finding titles");
  assert.ok(html.includes("ISO27001 · PCI · SOC2") || html.includes("ISO27001"), "frameworks listed");
  const de = toTrustCenterHtml({ ...clone(), output_lang: "de" });
  assert.ok(de.includes('lang="de-CH"'));
  assert.ok(de.includes("kein Zertifikat"));
});

test("CLI: validates, writes every export, and rejects an invalid run", () => {
  const out = mkdtempSync(join(tmpdir(), "auditor-out-"));
  const stdout = execFileSync(process.execPath, [join(ROOT, "scripts", "export-findings.mjs"), join(here, "fixtures", "audit-run.example.json"), "--out", out], { encoding: "utf8" });
  assert.match(stdout, /✓ audit-run.example.json valid — 5 finding\(s\)/);
  for (const f of ["findings.sarif", "assessment-results.oscal.json", "gap-matrix.csv", "findings.csv", "EXECUTIVE-REPORT.md", "evidence-manifest.json", "caiq-answers.csv", "acr-wcag22.csv", "trust-center.html"]) {
    assert.ok(readFileSync(join(out, f), "utf8").length > 50, `${f} written`);
  }
  const badPath = join(out, "bad.json");
  const bad = clone();
  bad.findings[0].deal_blocker = "yes";
  writeFileSync(badPath, JSON.stringify(bad));
  const r = (() => {
    try {
      execFileSync(process.execPath, [join(ROOT, "scripts", "export-findings.mjs"), badPath, "--validate"], { encoding: "utf8", stdio: "pipe" });
      return { status: 0 };
    } catch (err) {
      return { status: err.status, stderr: String(err.stderr) };
    }
  })();
  assert.equal(r.status, 1);
  assert.match(r.stderr, /deal_blocker must be boolean/);
});
