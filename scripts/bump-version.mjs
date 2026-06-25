#!/usr/bin/env node
// Single source of truth for the release tag pinned in fetch URLs.
//
// The orchestrator prompt and llms.txt instruct external agents to fetch the
// specialist prompts from an immutable tag. That tag is duplicated across
// several files (see scripts/pin-locations.mjs); this script bumps every pin
// atomically so a release never ships a stale or mismatched URL, then
// regenerates the CHECKSUMS.txt trust anchor. See RELEASING.md for the full
// release flow.
//
// Usage: node scripts/bump-version.mjs vX.Y.Z
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { PIN_LOCATIONS, VERSION_RE } from "./pin-locations.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const version = process.argv[2];
if (!version || !VERSION_RE.test(version)) {
  console.error("Usage: node scripts/bump-version.mjs vX.Y.Z");
  process.exit(1);
}

let total = 0;
for (const { file, re } of PIN_LOCATIONS) {
  const p = join(ROOT, file);
  const before = readFileSync(p, "utf8");
  let n = 0;
  // Group 1 of each pin regex is the literal vX.Y.Z token to rewrite.
  const after = before.replace(re(), (m, token) => {
    n++;
    return m.replace(token, version);
  });
  if (n) writeFileSync(p, after);
  total += n;
  console.log(`${file}: ${n} pin(s) updated`);
}

console.log(`\n${total} pin(s) set to ${version}.`);

// Regenerate the checksums so the trust anchor matches the bumped tree. Done
// here (not left as a manual reminder) so a version bump can't ship a stale
// CHECKSUMS.txt. Inherits stdout/stderr so its summary line is visible.
console.log("Regenerating CHECKSUMS.txt ...");
execFileSync(process.execPath, [join(ROOT, "scripts/checksums.mjs")], {
  stdio: "inherit",
});

console.log("\nNext: commit and tag (see RELEASING.md).");
