#!/usr/bin/env node
// Runs the executable re-audit criteria (`finding.check`) of a canonical run
// against a checkout — compliance-as-code: a finding is "fixed" when its check
// passes. Used by the auditor/verify GitHub Action on every PR.
//
//   node scripts/verify-checks.mjs <audit-run.json> [--repo <path>] [--out <dir>] [--strict]
//
// Exit codes: 0 every check passed (or none defined), 3 at least one check
// failed (the finding is still open), 1 invalid input. With --strict, a finding
// that has no check counts as failed too.
//
// SAFETY: checks are shell commands taken from the run file and executed with
// this process's privileges. Run only runs you produced or reviewed.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { validateRun } from "./export-findings.mjs";

/** Execute one check; returns {status: "pass"|"fail"|"error", exit_code, expected, stdout, stderr, duration_ms}. */
export function runCheck(check, cwd) {
  const expect = check.expect ?? "exit-zero";
  const started = Date.now();
  const r = spawnSync(check.run, { cwd, shell: true, encoding: "utf8", timeout: (check.timeout_seconds ?? 60) * 1000 });
  const duration_ms = Date.now() - started;
  if (r.error) return { status: "error", exit_code: null, expected: expect, stdout: "", stderr: String(r.error.message), duration_ms };
  const met = expect === "exit-zero" ? r.status === 0 : r.status !== 0;
  return { status: met ? "pass" : "fail", exit_code: r.status, expected: expect, stdout: (r.stdout ?? "").slice(-2000), stderr: (r.stderr ?? "").slice(-2000), duration_ms };
}

export function verifyRun(run, repoRoot, { strict = false } = {}) {
  const results = [];
  for (const f of run.findings) {
    if (!f.check) {
      results.push({ finding_id: f.id, severity: f.severity, title: f.title, status: strict ? "missing-check" : "no-check" });
      continue;
    }
    results.push({ finding_id: f.id, severity: f.severity, title: f.title, run: f.check.run, description: f.check.description ?? "", ...runCheck(f.check, repoRoot) });
  }
  const counts = results.reduce((acc, r) => ({ ...acc, [r.status]: (acc[r.status] ?? 0) + 1 }), {});
  const failed = results.filter((r) => r.status === "fail" || r.status === "error" || r.status === "missing-check");
  return {
    schema_version: "1.0",
    target: run.target,
    verified_at: new Date().toISOString(),
    strict,
    counts,
    ok: failed.length === 0,
    results,
  };
}

export function verifyMarkdown(report) {
  const esc = (v) => String(v ?? "").replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
  const rows = report.results.map((r) => `| ${esc(r.finding_id)} | ${esc(r.severity)} | ${esc(r.status)} | ${esc(r.run ?? "")} | ${esc(r.description ?? "")} |`);
  const c = report.counts;
  return [
    `# Re-audit checks: ${report.target.name}`,
    "",
    `${report.ok ? "All checks passed" : "Open findings remain"} — pass ${c.pass ?? 0}, fail ${c.fail ?? 0}, error ${c.error ?? 0}, no check ${(c["no-check"] ?? 0) + (c["missing-check"] ?? 0)}${report.strict ? " (strict: counted as failed)" : ""}.`,
    "",
    "| Finding | Severity | Status | Check | Proves |",
    "|---|---|---|---|---|",
    ...rows,
    "",
  ].join("\n");
}

function main() {
  const argv = process.argv.slice(2);
  const opts = { repo: ".", out: "auditor-out", strict: false, input: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--repo") opts.repo = argv[++i];
    else if (argv[i] === "--out") opts.out = argv[++i];
    else if (argv[i] === "--strict") opts.strict = true;
    else if (argv[i].startsWith("--")) { console.error(`✗ unknown option ${argv[i]}`); process.exit(1); }
    else opts.input = argv[i];
  }
  if (!opts.input) {
    console.error("Usage: node scripts/verify-checks.mjs <audit-run.json> [--repo <path>] [--out <dir>] [--strict]");
    process.exit(1);
  }
  const run = JSON.parse(readFileSync(resolve(opts.input), "utf8"));
  const problems = validateRun(run);
  if (problems.length) {
    console.error(`✗ ${basename(opts.input)} is not a valid run:`);
    for (const p of problems) console.error(`    ${p}`);
    process.exit(1);
  }
  const report = verifyRun(run, resolve(opts.repo), { strict: opts.strict });
  const out = resolve(opts.out);
  mkdirSync(out, { recursive: true });
  writeFileSync(join(out, "checks-report.json"), JSON.stringify(report, null, 2) + "\n");
  writeFileSync(join(out, "CHECKS-REPORT.md"), verifyMarkdown(report));
  const c = report.counts;
  console.log(`${report.ok ? "✓" : "✗"} checks: pass ${c.pass ?? 0}, fail ${c.fail ?? 0}, error ${c.error ?? 0}, no check ${(c["no-check"] ?? 0) + (c["missing-check"] ?? 0)}`);
  for (const r of report.results.filter((x) => x.status === "fail" || x.status === "error" || x.status === "missing-check")) {
    console.log(`    ${r.finding_id} [${r.severity}] ${r.status}${r.exit_code !== undefined && r.exit_code !== null ? ` (exit ${r.exit_code}, expected ${r.expected})` : ""}: ${r.title}`);
  }
  console.log(`  wrote ${join(opts.out, "checks-report.json")}, ${join(opts.out, "CHECKS-REPORT.md")}`);
  if (!report.ok) process.exit(3);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
