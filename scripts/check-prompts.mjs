#!/usr/bin/env node
// Enforces the canonical structure across all audit master prompts so their
// findings compose (interoperability). The orchestrator (full-audit) is exempt.
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join(ROOT, "audit-prompts");
const EXEMPT = new Set(["full-audit-master-prompt.md"]);

// Required H2/H1 sections, matched case-insensitively by prefix.
const REQUIRED = [
  /^#{1,2}\s+how to use this prompt/im,
  /^#{1,2}\s+operating principles/im,
  /^#{1,2}\s+phase 0\b/im,
  /^#{1,2}\s+phase 1\b/im,
  /^#{1,2}\s+phase 2\b/im,
  /^#{1,2}\s+phase 3\b/im,
  /^#{1,2}\s+phase 4\b/im,
  /^#{1,2}\s+phase 5\b/im,
  /^#{1,2}\s+issue output/im,
  /^#{1,2}\s+shared finding schema/im,
  /^#{1,2}\s+definition of done/im,
];
const LABELS = [
  "How to use this prompt",
  "Operating principles",
  "Phase 0",
  "Phase 1",
  "Phase 2",
  "Phase 3",
  "Phase 4",
  "Phase 5",
  "Issue output",
  "Shared finding schema",
  "Definition of done",
];

// Uniform severity vocabulary (P0–P3) and no legacy German severities in headings/schema.
const HAS_P0 = /\bP0\b/;
const HAS_P3 = /\bP3\b/;
const LEGACY_SEVERITY = /KRITISCH\|HOCH\|MITTEL\|NIEDRIG\|INFO/;

const files = readdirSync(DIR)
  .filter((f) => f.endsWith("-audit-master-prompt.md") && !EXEMPT.has(f))
  .sort();

let failed = 0;
for (const f of files) {
  const text = readFileSync(join(DIR, f), "utf8");
  const missing = [];
  REQUIRED.forEach((re, i) => {
    if (!re.test(text)) missing.push(LABELS[i]);
  });
  if (!HAS_P0.test(text) || !HAS_P3.test(text)) missing.push("P0–P3 severity scale");
  if (LEGACY_SEVERITY.test(text)) missing.push("legacy severity vocabulary present");

  if (missing.length) {
    failed++;
    console.error(`✗ ${f}\n    missing/invalid: ${missing.join(" · ")}`);
  } else {
    console.log(`✓ ${f}`);
  }
}

console.log(`\n${files.length - failed}/${files.length} prompts conform to the canonical skeleton.`);
if (failed) {
  console.error(`\n${failed} prompt(s) break interoperability — see CONTRIBUTING.md house structure.`);
  process.exit(1);
}
