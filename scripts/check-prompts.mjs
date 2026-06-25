#!/usr/bin/env node
// Enforces the canonical structure across all audit master prompts so their
// findings compose (interoperability). The orchestrator (full-audit) is exempt.
//
// Three layers of contract are enforced per prompt:
//   1. Presence  — every canonical heading exists (matched by prefix).
//   2. Order     — the phase pipeline and the closing sections appear in the
//                  canonical sequence (Phase 0 → … → Phase 5 → Issue output →
//                  Shared finding schema → Definition of done), with the two
//                  framing sections (How to use, Operating principles) both
//                  ahead of Phase 0.
//   3. Schema    — the Shared finding schema block carries the field keys that
//                  every audit in the library shares, so findings compose.
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

// Canonical ORDER. The pipeline and closing sections must appear in this exact
// sequence. The two framing sections (How to use / Operating principles) must
// both sit ahead of Phase 0; their relative order is intentionally not pinned —
// most prompts lead with "How to use", a few lead with "Operating principles".
const FRAMING = ["How to use this prompt", "Operating principles"];
const ORDERED = [
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

// Field keys shared by the finding schema of every audit in the library. These
// are exactly the keys present in all 13 specialist schemas today — the core
// contract that lets the orchestrator compose findings across audits. Audits
// add their own keys (cvss, harm_chain, class, …) on top; only this intersection
// is enforced so the gate stays strict without being flaky.
const SCHEMA_FIELDS = [
  "id",
  "title",
  "severity",
  "confidence",
  "effort",
  "evidence",
  "fix",
  "expected_impact",
];

// Uniform severity vocabulary (P0–P3) and no legacy German severities in headings/schema.
const HAS_P0 = /\bP0\b/;
const HAS_P3 = /\bP3\b/;
const LEGACY_SEVERITY = /\b(KRITISCH|HOCH|MITTEL|NIEDRIG|INFO)\b/;

// Self-test: the guard must actually match a reintroduced legacy severity and
// must not fire on ordinary prose. Prevents the regex from silently rotting
// (a previous version escaped the alternation pipes and matched nothing).
if (
  !LEGACY_SEVERITY.test("Severity: KRITISCH") ||
  LEGACY_SEVERITY.test("This is a critical, high-priority finding.")
) {
  console.error("✗ check-prompts self-test failed: LEGACY_SEVERITY guard is broken.");
  process.exit(1);
}

// Returns the character offset of a label's heading, or -1 if absent.
function headingOffset(text, label) {
  const i = REQUIRED.findIndex((_, k) => LABELS[k] === label);
  const m = REQUIRED[i].exec(text);
  return m ? m.index : -1;
}

// Extracts the first fenced ```json block under the "Shared finding schema" heading.
function schemaBlock(text) {
  const heading = /^#{1,2}\s+shared finding schema/im.exec(text);
  if (!heading) return "";
  const rest = text.slice(heading.index);
  const m = /```json\s*([\s\S]*?)```/.exec(rest);
  return m ? m[1] : "";
}

const files = readdirSync(DIR)
  .filter((f) => f.endsWith("-audit-master-prompt.md") && !EXEMPT.has(f))
  .sort();

let failed = 0;
for (const f of files) {
  const text = readFileSync(join(DIR, f), "utf8");
  const problems = [];

  // 1. Presence.
  REQUIRED.forEach((re, i) => {
    if (!re.test(text)) problems.push(`missing section: ${LABELS[i]}`);
  });
  if (!HAS_P0.test(text) || !HAS_P3.test(text)) problems.push("missing P0–P3 severity scale");
  if (LEGACY_SEVERITY.test(text)) problems.push("legacy severity vocabulary present");

  // 2. Order — only meaningful once the sections exist.
  const phase0 = headingOffset(text, "Phase 0");
  for (const label of FRAMING) {
    const off = headingOffset(text, label);
    if (off !== -1 && phase0 !== -1 && off > phase0) {
      problems.push(`out of order: "${label}" must precede Phase 0`);
    }
  }
  let prev = -1;
  let prevLabel = "";
  for (const label of ORDERED) {
    const off = headingOffset(text, label);
    if (off === -1) continue; // presence check already reported it
    if (off < prev) {
      problems.push(`out of order: "${label}" appears before "${prevLabel}"`);
    }
    prev = off;
    prevLabel = label;
  }

  // 3. Shared finding schema field contract.
  const schema = schemaBlock(text);
  if (!schema) {
    problems.push("Shared finding schema has no ```json block");
  } else {
    const missingFields = SCHEMA_FIELDS.filter(
      (k) => !new RegExp(`"${k}"\\s*:`).test(schema),
    );
    if (missingFields.length) {
      problems.push(`schema missing field(s): ${missingFields.join(", ")}`);
    }
  }

  if (problems.length) {
    failed++;
    console.error(`✗ ${f}\n    ${problems.join("\n    ")}`);
  } else {
    console.log(`✓ ${f}`);
  }
}

console.log(`\n${files.length - failed}/${files.length} prompts conform to the canonical skeleton.`);
if (failed) {
  console.error(`\n${failed} prompt(s) break interoperability — see CONTRIBUTING.md house structure.`);
  process.exit(1);
}
