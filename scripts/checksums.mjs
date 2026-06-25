#!/usr/bin/env node
// Regenerates (or verifies) CHECKSUMS.txt — the supply-chain trust anchor that
// external agents use to verify prompt files they fetch from an immutable tag.
//
// CHECKSUMS.txt is produced in GNU coreutils BINARY format, byte-for-byte
// identical to:
//
//   sha256sum -b audit-prompts/*.md ISSUE-OUTPUT-STANDARD.md DOCUMENTATION-STANDARD*.md
//
// i.e. each line is `<64-hex>␠*<repo-relative-path>\n`. This script is the
// single source of the checksummed file list so the manifest can't silently
// drift from what CI verifies.
//
// Usage:
//   node scripts/checksums.mjs           # regenerate CHECKSUMS.txt in place
//   node scripts/checksums.mjs --check   # verify; exit non-zero on any drift
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST = "CHECKSUMS.txt";

// The checksummed set, expressed as the same globs the manual command used,
// expanded in shell-glob order: each glob is sorted, the groups concatenated.
// `audit-prompts/*.md` (sorted) · `ISSUE-OUTPUT-STANDARD.md` ·
// `DOCUMENTATION-STANDARD*.md` (sorted: .en.md before .md).
function sortedMatches(dir, predicate) {
  return readdirSync(join(ROOT, dir))
    .filter(predicate)
    .sort()
    .map((name) => (dir === "." ? name : `${dir}/${name}`));
}

function checksummedFiles() {
  return [
    ...sortedMatches("audit-prompts", (f) => f.endsWith(".md")),
    "ISSUE-OUTPUT-STANDARD.md",
    ...sortedMatches(".", (f) => /^DOCUMENTATION-STANDARD.*\.md$/.test(f)),
  ];
}

// Build the manifest content exactly as `sha256sum -b` would: the digest is
// over the raw file bytes, the path is prefixed with `*` (binary marker).
function generate() {
  return (
    checksummedFiles()
      .map((rel) => {
        const digest = createHash("sha256")
          .update(readFileSync(join(ROOT, rel)))
          .digest("hex");
        return `${digest} *${rel}`;
      })
      .join("\n") + "\n"
  );
}

const expected = generate();
const manifestPath = join(ROOT, MANIFEST);

if (process.argv.includes("--check")) {
  let actual;
  try {
    actual = readFileSync(manifestPath, "utf8");
  } catch {
    console.error(`✗ ${MANIFEST} is missing — run: node scripts/checksums.mjs`);
    process.exit(1);
  }
  if (actual === expected) {
    console.log(`✓ ${MANIFEST} is up to date (${checksummedFiles().length} files).`);
    process.exit(0);
  }
  // Show the offending lines so a failing CI run is self-explanatory.
  const exp = expected.split("\n");
  const act = actual.split("\n");
  console.error(`✗ ${MANIFEST} is out of date. Regenerate with: node scripts/checksums.mjs\n`);
  const max = Math.max(exp.length, act.length);
  for (let i = 0; i < max; i++) {
    if (exp[i] !== act[i]) {
      if (act[i] !== undefined) console.error(`  - committed: ${act[i]}`);
      if (exp[i] !== undefined) console.error(`  + expected:  ${exp[i]}`);
    }
  }
  process.exit(1);
}

writeFileSync(manifestPath, expected);
console.log(`Wrote ${MANIFEST} (${checksummedFiles().length} files).`);
