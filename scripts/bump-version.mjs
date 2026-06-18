#!/usr/bin/env node
// Single source of truth for the release tag pinned in fetch URLs.
//
// The orchestrator prompt and llms.txt instruct external agents to fetch the
// specialist prompts from an immutable tag. That tag is duplicated across both
// files; this script bumps every pin atomically so a release never ships a
// stale or mismatched URL. See RELEASING.md for the full release flow.
//
// Usage: node scripts/bump-version.mjs vX.Y.Z
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const version = process.argv[2];
if (!version || !/^v\d+\.\d+\.\d+$/.test(version)) {
  console.error("Usage: node scripts/bump-version.mjs vX.Y.Z");
  process.exit(1);
}

// Every pinned fetch URL looks like .../marcelrapold/auditor/vX.Y.Z/...
const FILES = ["audit-prompts/full-audit-master-prompt.md", "web/public/llms.txt"];
const PIN = /(marcelrapold\/auditor\/)v\d+\.\d+\.\d+(\/)/g;

let total = 0;
for (const rel of FILES) {
  const p = join(ROOT, rel);
  const before = readFileSync(p, "utf8");
  let n = 0;
  const after = before.replace(PIN, (_m, a, b) => {
    n++;
    return `${a}${version}${b}`;
  });
  if (n) writeFileSync(p, after);
  total += n;
  console.log(`${rel}: ${n} pin(s) updated`);
}

// The landing-page badge surfaces the release tag from a single constant.
{
  const rel = "web/lib/content.ts";
  const p = join(ROOT, rel);
  const before = readFileSync(p, "utf8");
  let n = 0;
  const after = before.replace(
    /(export const VERSION = ")v\d+\.\d+\.\d+(")/,
    (_m, a, b) => {
      n++;
      return `${a}${version}${b}`;
    },
  );
  if (n) writeFileSync(p, after);
  total += n;
  console.log(`${rel}: ${n} pin(s) updated`);
}

console.log(`\n${total} pin(s) set to ${version}.`);
console.log("Next: regenerate checksums, then commit and tag (see RELEASING.md):");
console.log(
  "  sha256sum audit-prompts/*.md ISSUE-OUTPUT-STANDARD.md DOCUMENTATION-STANDARD*.md > CHECKSUMS.txt",
);
