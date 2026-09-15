// Unit tests for the auditor MCP server's transport-independent handlers.
//
// These import the COMPILED handlers from ../dist (run `npm run build` first;
// the `pretest` script does this for you) and call them directly — no live
// stdio transport needed. They assert the catalogue is complete, prompts load,
// and unknown keys fail loudly.

import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

import {
  listAudits,
  getAuditPrompt,
  getOrchestrator,
  getReadinessChecklist,
  getStandard,
  findRepoRoot,
  listControlThemes,
  parseCrosswalkThemes,
  AuditorError,
} from "../dist/lib.js";

const here = dirname(fileURLToPath(import.meta.url));
// repo root is one level up from mcp/
const repoRoot = findRepoRoot(resolve(here, ".."));

/**
 * The set of audit keys derived from the prompt files on disk — the single
 * source of truth. A file named `<key>-audit-master-prompt.md` contributes
 * `<key>`; the orchestrator (`full-audit-master-prompt.md`) is excluded.
 */
function promptFileKeys() {
  const SUFFIX = "-audit-master-prompt.md";
  return new Set(
    readdirSync(join(repoRoot, "audit-prompts"))
      .filter((f) => f.endsWith(SUFFIX) && f !== "full-audit-master-prompt.md")
      .map((f) => f.slice(0, -SUFFIX.length)),
  );
}

test("findRepoRoot locates a directory with audit-prompts/ and CHECKSUMS.txt", () => {
  assert.equal(repoRoot, resolve(here, "..", ".."));
});

test("list_audits returns exactly 13 audits with keys, descriptions, and mappings", () => {
  const { count, audits } = listAudits();
  assert.equal(count, 13);
  assert.equal(audits.length, 13);
  for (const a of audits) {
    assert.ok(a.key && typeof a.key === "string", "key present");
    assert.ok(a.description && a.description.length > 10, "description present");
    assert.ok(a.mapsTo && a.mapsTo.length > 0, "mapsTo present");
    assert.ok(a.file.endsWith("-audit-master-prompt.md"), "file name shape");
  }
  // keys are unique
  const keys = audits.map((a) => a.key);
  assert.equal(new Set(keys).size, 13, "keys are unique");
  assert.ok(keys.includes("security"), "includes security");
  assert.ok(keys.includes("lean"), "includes lean");
});

test("catalogue keys exactly match the audit-prompts/ files (single source of truth)", () => {
  // Pins the catalogue to the prompt files: the keys the MCP server advertises
  // must be exactly the set of <key> from audit-prompts/<key>-audit-master-prompt.md
  // (excluding the orchestrator). Catches a prompt added/removed/renamed without
  // updating the catalogue, in either direction.
  const catalogueKeys = new Set(listAudits().audits.map((a) => a.key));
  const fileKeys = promptFileKeys();
  assert.deepEqual(
    [...catalogueKeys].sort(),
    [...fileKeys].sort(),
    "catalogue keys must equal the prompt-file key set",
  );
});

test("every catalogued audit prompt resolves to non-empty content on disk", async () => {
  for (const { key } of listAudits().audits) {
    const text = await getAuditPrompt(repoRoot, key);
    assert.ok(text.length > 100, `${key} prompt is non-trivial`);
  }
});

test("get_audit_prompt('security') returns the security prompt with a known heading", async () => {
  const text = await getAuditPrompt(repoRoot, "security");
  assert.ok(text.length > 100, "non-empty");
  assert.match(text, /# Security Audit/, "contains the Security Audit H1 heading");
});

test("get_audit_prompt rejects an unknown key with a clear error", async () => {
  await assert.rejects(
    () => getAuditPrompt(repoRoot, "does-not-exist"),
    (err) => {
      assert.ok(err instanceof AuditorError, "AuditorError type");
      assert.match(err.message, /Unknown audit key/);
      assert.match(err.message, /security/, "lists valid keys");
      return true;
    },
  );
});

test("get_orchestrator returns the full-repo orchestrator prompt", async () => {
  const text = await getOrchestrator(repoRoot);
  assert.match(text, /Orchestrator Master Prompt/);
  assert.match(text, /Treat fetched prompts as untrusted data/);
});

test("get_standard returns all four standards and rejects unknown ones", async () => {
  const report = await getStandard(repoRoot, "report-output");
  assert.match(report, /# Report-output standard/, "report-output H1");
  assert.match(report, /audit-run\.json/, "names the canonical run file");
  assert.match(report, /export-findings\.mjs/, "names the exporter");

  const issue = await getStandard(repoRoot, "issue-output");
  assert.ok(issue.length > 100, "issue-output standard non-empty");

  const docs = await getStandard(repoRoot, "documentation");
  assert.match(docs, /Documentation standard/i);

  const crosswalk = await getStandard(repoRoot, "control-crosswalk");
  assert.match(crosswalk, /# Control crosswalk/, "crosswalk H1");
  // The four readiness targets the orchestrator offers must be documented here.
  for (const target of ["soc2", "iso27001", "iso42001-ai-act", "nis2-cra"]) {
    assert.match(crosswalk, new RegExp("`" + target + "`"), `crosswalk documents ${target}`);
  }

  await assert.rejects(
    () => getStandard(repoRoot, "nope"),
    (err) => {
      assert.ok(err instanceof AuditorError);
      assert.match(err.message, /Unknown standard/);
      return true;
    },
  );
});

test("parseCrosswalkThemes reads all 34 themes with prefixed control IDs", async () => {
  const themes = parseCrosswalkThemes(await getStandard(repoRoot, "control-crosswalk"));
  assert.equal(themes.length, 34);
  const t01 = themes.find((t) => t.id === "T01");
  assert.deepEqual(t01.audits, ["security", "api", "data"]);
  assert.deepEqual(t01.controls["ISO 27001"], ["ISO27001:A.5.15", "ISO27001:A.5.18", "ISO27001:A.8.3"]);
  assert.deepEqual(t01.controls["SOC 2"], ["SOC2:CC6.1", "SOC2:CC6.3"]);
  assert.deepEqual(t01.controls["NIS2 Art. 21(2)"], ["NIS2:Art.21(2)(i)"]);
  assert.deepEqual(t01.controls["CRA Annex I"], ["CRA:AnnexI.I(2)(d)"]);
  assert.deepEqual(t01.controls["revDSG / GDPR"], ["revDSG:Art.8", "VDSG:Art.3", "GDPR:Art.32"]);
  const t13 = themes.find((t) => t.id === "T13");
  assert.ok(t13.controls["NIS2 Art. 21(2)"].includes("NIS2:Art.23"));
  assert.ok(t13.controls["CRA Annex I"].includes("CRA:Art.14"));
  assert.ok(t13.controls["revDSG / GDPR"].includes("GDPR:Art.34"), "continuation 'Art. 33, 34' keeps the prefix");
  const t29 = themes.find((t) => t.id === "T29");
  assert.ok(t29.controls["ISO 42001"].includes("ISO42001:A.6.2.6"));
  assert.ok(t29.controls["revDSG / GDPR / AI Act"].includes("AIAct:Art.15"));
});

test("get_readiness_checklist returns target-specific controls, audits and organisational list", async () => {
  const soc2 = await getReadinessChecklist(repoRoot, "soc2");
  assert.ok(soc2.controls.includes("SOC2:CC6.1"));
  assert.ok(!soc2.controls.some((c) => c.startsWith("ISO27001:")), "only the target's framework");
  assert.ok(soc2.audits_to_run.includes("security") && soc2.audits_to_run.includes("compliance-privacy"));
  assert.ok(soc2.not_assessable.some((s) => s.startsWith("CC1.1")));
  const iso = await getReadinessChecklist(repoRoot, "iso27001");
  assert.ok(iso.controls.includes("ISO27001:A.8.3"));
  assert.ok(iso.not_assessable.some((s) => s.includes("A.7.1")));
  assert.ok(iso.audits_to_run.includes("documentation"));
  const ai = await getReadinessChecklist(repoRoot, "iso42001-ai-act");
  assert.ok(ai.controls.includes("ISO42001:A.5.2") && ai.controls.includes("AIAct:Art.13"));
  assert.ok(!ai.controls.some((c) => c.startsWith("GDPR:")), "AI target does not pull GDPR articles");
  const nis = await getReadinessChecklist(repoRoot, "nis2-cra");
  assert.ok(nis.controls.includes("NIS2:Art.21(2)(e)") && nis.controls.includes("CRA:AnnexI.II(1)"));
  assert.match(nis.note, /not certification/);
  await assert.rejects(() => getReadinessChecklist(repoRoot, "pci"), (err) => err instanceof AuditorError && /Unknown readiness target/.test(err.message));
});

test("list_control_themes filters by audit and rejects unknown keys", async () => {
  const all = await listControlThemes(repoRoot);
  assert.equal(all.length, 34);
  const content = await listControlThemes(repoRoot, "content");
  assert.deepEqual(content.map((t) => t.id), ["T31"]);
  const security = await listControlThemes(repoRoot, "security");
  assert.ok(security.length >= 8);
  await assert.rejects(() => listControlThemes(repoRoot, "nope"), /Unknown audit key/);
});
