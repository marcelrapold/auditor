#!/usr/bin/env node
// Self-verifying releases: asserts every release version pin equals the
// expected version (the git tag at release time).
//
// The pinned locations are imported from scripts/pin-locations.mjs — the same
// list the bumper writes to — so this check can never drift from the writer.
// On a tag build, run with the tag as the expected version; any file whose
// pins disagree (or that has no pins at all) fails the build and is named.
//
// Usage:
//   node scripts/verify-pins.mjs vX.Y.Z          # explicit expected version
//   GITHUB_REF_NAME=vX.Y.Z node scripts/verify-pins.mjs   # from tag ref
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { PIN_LOCATIONS, VERSION_RE } from "./pin-locations.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const expected = process.argv[2] || process.env.GITHUB_REF_NAME;
if (!expected || !VERSION_RE.test(expected)) {
  console.error("Usage: node scripts/verify-pins.mjs vX.Y.Z (or set GITHUB_REF_NAME=vX.Y.Z)");
  process.exit(1);
}

const problems = [];

for (const { file, re, description } of PIN_LOCATIONS) {
  let text;
  try {
    text = readFileSync(join(ROOT, file), "utf8");
  } catch {
    problems.push(`${file}: unreadable or missing (${description})`);
    continue;
  }

  const lines = text.split("\n");
  let pins = 0;
  let mismatches = 0;
  for (let i = 0; i < lines.length; i++) {
    const rx = re(); // fresh regex per line (global flag carries lastIndex)
    let m;
    while ((m = rx.exec(lines[i])) !== null) {
      pins++;
      const found = m[1];
      if (found !== expected) {
        mismatches++;
        problems.push(`${file}:${i + 1}: pin is ${found}, expected ${expected} (${description})`);
      }
    }
  }
  if (pins === 0) {
    problems.push(`${file}: no version pin found (${description})`);
  } else if (mismatches === 0) {
    console.log(`✓ ${file}: ${pins} pin(s) at ${expected}`);
  } else {
    console.log(`✗ ${file}: ${mismatches}/${pins} pin(s) mismatched`);
  }
}

if (problems.length) {
  console.error(`\n✗ Pin verification failed for ${expected}:`);
  for (const p of problems) console.error(`    ${p}`);
  console.error(
    `\n${problems.length} problem(s). Run \`node scripts/bump-version.mjs ${expected}\` to realign.`,
  );
  process.exit(1);
}

console.log(`\nAll pins agree with ${expected}.`);
