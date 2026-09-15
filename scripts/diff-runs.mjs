#!/usr/bin/env node
// Diff two canonical runs (schemas/audit-run.schema.json) — the "did we get
// better or worse since the last audit?" answer, deterministic and CI-gradable.
//
//   node scripts/diff-runs.mjs <baseline.json> <current.json> [--out <dir>]
//                              [--fail-on new-p0p1,deal-blocker,regression,score-drop]
//
// Writes audit-diff.json and AUDIT-DIFF.md. Exit codes: 0 no failure condition
// hit, 2 a --fail-on condition hit (so a CI job can gate on it), 1 invalid input.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { validateRun } from "./export-findings.mjs";

const SEVERITIES = ["P0", "P1", "P2", "P3"];
const rank = (s) => SEVERITIES.indexOf(s);
const STATUS_RANK = { implemented: 0, partial: 1, missing: 2, "n/a": 0, "not-assessable": 0 };

/** Match findings by id, falling back to (audit, title) when an id was renumbered. */
function index(run) {
  const byId = new Map();
  const byTitle = new Map();
  for (const f of run.findings) {
    byId.set(f.id, f);
    byTitle.set(`${f.audit ?? ""}::${f.title.trim().toLowerCase()}`, f);
  }
  return { byId, byTitle };
}

export function diffRuns(baseline, current) {
  const b = index(baseline);
  const c = index(current);
  const matchedBaselineIds = new Set();
  const persisting = [];
  const added = [];
  for (const f of current.findings) {
    const key = `${f.audit ?? ""}::${f.title.trim().toLowerCase()}`;
    const prev = b.byId.get(f.id) ?? b.byTitle.get(key);
    if (!prev) {
      added.push(f);
      continue;
    }
    matchedBaselineIds.add(prev.id);
    persisting.push({
      id: f.id,
      baseline_id: prev.id,
      title: f.title,
      severity_before: prev.severity,
      severity_after: f.severity,
      severity_change: rank(f.severity) < rank(prev.severity) ? "worse" : rank(f.severity) > rank(prev.severity) ? "better" : "same",
      deal_blocker_before: prev.deal_blocker,
      deal_blocker_after: f.deal_blocker,
    });
  }
  const fixed = baseline.findings.filter((f) => !matchedBaselineIds.has(f.id));

  const scoreBefore = new Map((baseline.scorecard ?? []).map((s) => [s.audit, s.score]));
  const scorecard = (current.scorecard ?? []).map((s) => ({
    audit: s.audit,
    before: scoreBefore.get(s.audit) ?? null,
    after: s.score,
    delta: scoreBefore.has(s.audit) ? +(s.score - scoreBefore.get(s.audit)).toFixed(1) : null,
  }));

  const ctrlBefore = new Map((baseline.readiness?.controls ?? []).map((x) => [x.id, x.status]));
  const controls = (current.readiness?.controls ?? [])
    .map((x) => ({ id: x.id, before: ctrlBefore.get(x.id) ?? null, after: x.status }))
    .filter((x) => x.before !== null && x.before !== x.after)
    .map((x) => ({ ...x, direction: (STATUS_RANK[x.after] ?? 0) > (STATUS_RANK[x.before] ?? 0) ? "worse" : "better" }));

  const count = (run, pred) => run.findings.filter(pred).length;
  const summary = {
    findings_before: baseline.findings.length,
    findings_after: current.findings.length,
    added: added.length,
    fixed: fixed.length,
    persisting: persisting.length,
    severity_worsened: persisting.filter((p) => p.severity_change === "worse").length,
    severity_improved: persisting.filter((p) => p.severity_change === "better").length,
    new_p0p1: added.filter((f) => rank(f.severity) <= 1).length,
    deal_blockers_before: count(baseline, (f) => f.deal_blocker),
    deal_blockers_after: count(current, (f) => f.deal_blocker),
    readiness_before: baseline.readiness?.score_percent ?? null,
    readiness_after: current.readiness?.score_percent ?? null,
    controls_regressed: controls.filter((x) => x.direction === "worse").length,
    controls_improved: controls.filter((x) => x.direction === "better").length,
  };
  const conditions = {
    "new-p0p1": summary.new_p0p1 > 0,
    "deal-blocker": summary.deal_blockers_after > 0,
    regression: summary.severity_worsened > 0 || summary.controls_regressed > 0 || summary.new_p0p1 > 0,
    "score-drop": scorecard.some((s) => s.delta !== null && s.delta < 0) || (summary.readiness_before !== null && summary.readiness_after !== null && summary.readiness_after < summary.readiness_before),
  };
  return {
    schema_version: "1.0",
    baseline: { target: baseline.target, tool: baseline.tool },
    current: { target: current.target, tool: current.tool },
    summary,
    conditions,
    added: added.map((f) => ({ id: f.id, severity: f.severity, title: f.title, deal_blocker: f.deal_blocker, controls: f.controls })),
    fixed: fixed.map((f) => ({ id: f.id, severity: f.severity, title: f.title })),
    persisting,
    scorecard,
    controls,
  };
}

function table(header, rows) {
  const esc = (v) => String(v ?? "").replace(/\|/g, "\\|");
  return [`| ${header.map(esc).join(" | ")} |`, `|${header.map(() => "---").join("|")}|`, ...rows.map((r) => `| ${r.map(esc).join(" | ")} |`)].join("\n");
}

export function diffMarkdown(d) {
  const s = d.summary;
  const arrow = (before, after) => (before === null || before === undefined ? `${after}` : `${before} → ${after}`);
  const out = [];
  out.push(`# Audit diff: ${d.current.target.name}`, "");
  out.push(`${d.baseline.target.audited_at.slice(0, 10)}${d.baseline.target.commit ? ` (\`${d.baseline.target.commit.slice(0, 12)}\`)` : ""} → ${d.current.target.audited_at.slice(0, 10)}${d.current.target.commit ? ` (\`${d.current.target.commit.slice(0, 12)}\`)` : ""}`, "");
  out.push("## Summary", "", table(["", "Value"], [
    ["Findings", arrow(s.findings_before, s.findings_after)],
    ["Added / fixed / persisting", `${s.added} / ${s.fixed} / ${s.persisting}`],
    ["New P0/P1", s.new_p0p1],
    ["Severity worsened / improved", `${s.severity_worsened} / ${s.severity_improved}`],
    ["Deal-blockers", arrow(s.deal_blockers_before, s.deal_blockers_after)],
    ["Readiness score", s.readiness_after === null ? "n/a" : `${arrow(s.readiness_before, s.readiness_after)} %`],
    ["Controls regressed / improved", `${s.controls_regressed} / ${s.controls_improved}`],
  ]), "");
  const hit = Object.entries(d.conditions).filter(([, v]) => v).map(([k]) => k);
  out.push(`Conditions hit: ${hit.length ? hit.map((k) => `\`${k}\``).join(", ") : "none"}`, "");
  if (d.added.length) out.push("## Added", "", table(["ID", "Severity", "Title", "Deal-blocker"], d.added.map((f) => [f.id, f.severity, f.title, f.deal_blocker])), "");
  if (d.fixed.length) out.push("## Fixed", "", table(["ID", "Severity", "Title"], d.fixed.map((f) => [f.id, f.severity, f.title])), "");
  const changed = d.persisting.filter((p) => p.severity_change !== "same" || p.deal_blocker_before !== p.deal_blocker_after);
  if (changed.length) out.push("## Changed", "", table(["ID", "Severity", "Deal-blocker", "Title"], changed.map((p) => [p.id, `${p.severity_before} → ${p.severity_after}`, `${p.deal_blocker_before} → ${p.deal_blocker_after}`, p.title])), "");
  if (d.scorecard.length) out.push("## Scorecard", "", table(["Audit", "Before", "After", "Δ"], d.scorecard.map((x) => [x.audit, x.before ?? "—", x.after, x.delta === null ? "—" : (x.delta > 0 ? `+${x.delta}` : x.delta)])), "");
  if (d.controls.length) out.push("## Controls", "", table(["Control", "Before", "After", "Direction"], d.controls.map((x) => [x.id, x.before, x.after, x.direction])), "");
  return out.join("\n");
}

function main() {
  const argv = process.argv.slice(2);
  const opts = { out: "auditor-out", failOn: [], files: [] };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--out") opts.out = argv[++i];
    else if (argv[i] === "--fail-on") opts.failOn = argv[++i].split(",").map((s) => s.trim()).filter(Boolean);
    else if (argv[i].startsWith("--")) { console.error(`✗ unknown option ${argv[i]}`); process.exit(1); }
    else opts.files.push(argv[i]);
  }
  if (opts.files.length !== 2) {
    console.error("Usage: node scripts/diff-runs.mjs <baseline.json> <current.json> [--out <dir>] [--fail-on new-p0p1,deal-blocker,regression,score-drop]");
    process.exit(1);
  }
  const [baseline, current] = opts.files.map((p) => JSON.parse(readFileSync(resolve(p), "utf8")));
  for (const [name, run] of [[opts.files[0], baseline], [opts.files[1], current]]) {
    const problems = validateRun(run);
    if (problems.length) {
      console.error(`✗ ${basename(name)} is not a valid run:`);
      for (const p of problems) console.error(`    ${p}`);
      process.exit(1);
    }
  }
  const d = diffRuns(baseline, current);
  const out = resolve(opts.out);
  mkdirSync(out, { recursive: true });
  writeFileSync(join(out, "audit-diff.json"), JSON.stringify(d, null, 2) + "\n");
  writeFileSync(join(out, "AUDIT-DIFF.md"), diffMarkdown(d) + "\n");
  const s = d.summary;
  console.log(`✓ diff: +${s.added} added, -${s.fixed} fixed, ${s.persisting} persisting; new P0/P1: ${s.new_p0p1}; deal-blockers ${s.deal_blockers_before} → ${s.deal_blockers_after}`);
  console.log(`  wrote ${join(opts.out, "audit-diff.json")}, ${join(opts.out, "AUDIT-DIFF.md")}`);
  const hit = opts.failOn.filter((k) => d.conditions[k]);
  const unknown = opts.failOn.filter((k) => !(k in d.conditions));
  if (unknown.length) { console.error(`✗ unknown --fail-on condition(s): ${unknown.join(", ")}`); process.exit(1); }
  if (hit.length) {
    console.error(`✗ fail-on condition hit: ${hit.join(", ")}`);
    process.exit(2);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
