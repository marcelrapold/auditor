#!/usr/bin/env node
// Turns one canonical `audit-run.json` (schemas/audit-run.schema.json) into the
// business outputs REPORT-OUTPUT-STANDARD.md promises — deterministically, so
// the formats never depend on an agent reproducing a spec from memory:
//
//   findings.sarif             SARIF 2.1.0  → GitHub Code Scanning, IDEs
//   assessment-results.oscal.json  OSCAL 1.1.2 assessment results → GRC tools
//   gap-matrix.csv             one row per control (readiness view)
//   findings.csv               one row per finding (Jira / spreadsheet import)
//   EXECUTIVE-REPORT.md        board-ready report skeleton (→ DOCX/PDF via pandoc)
//   evidence-manifest.json     sha256 + timestamp per cited artifact
//
// Dependency-free on purpose (node:fs, node:crypto only), like every script in
// this repo. Validation is a strict required-field / enum check of the schema's
// contract, not a full JSON Schema engine — run the file through a validator
// (ajv-cli, check-jsonschema) when you need the complete check.
//
// Usage:
//   node scripts/export-findings.mjs <audit-run.json> [--out <dir>] [--format all|sarif|oscal|csv|report|evidence]
//                                    [--repo <path>] [--docx] [--validate]
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// --- Contract ---------------------------------------------------------------

const SEVERITIES = ["P0", "P1", "P2", "P3"];
const EFFORTS = ["S", "M", "L", "XL"];
const EFFORT_DAYS = { S: 0.5, M: 2, L: 5, XL: 10 };
const READINESS_TARGETS = ["none", "soc2", "iso27001", "iso42001-ai-act", "nis2-cra"];
const CONTROL_STATUS = ["implemented", "partial", "missing", "not-assessable", "n/a"];
const REQUIRED_FINDING = [
  "id",
  "title",
  "severity",
  "confidence",
  "effort",
  "evidence",
  "fix",
  "expected_impact",
  "controls",
  "deal_blocker",
  "fine_exposure",
];
const CONTROL_ID = /^[A-Za-z0-9]+:[^\s]+$/;

/**
 * Validate a run against the contract of schemas/audit-run.schema.json.
 * Returns a list of human-readable problems (empty = valid).
 */
export function validateRun(run) {
  const problems = [];
  const p = (msg) => problems.push(msg);
  if (!run || typeof run !== "object") return ["run is not an object"];
  if (run.schema_version !== "1.0") p(`schema_version must be "1.0" (got ${JSON.stringify(run.schema_version)})`);
  if (!run.tool || run.tool.name !== "auditor") p('tool.name must be "auditor"');
  if (!run.tool || !/^v\d+\.\d+\.\d+$/.test(run.tool.version ?? "")) p("tool.version must look like vX.Y.Z");
  if (!run.target || typeof run.target.name !== "string") p("target.name is required");
  if (!run.target || Number.isNaN(Date.parse(run.target.audited_at ?? ""))) p("target.audited_at must be an ISO date-time");
  if (!["en", "de"].includes(run.output_lang)) p('output_lang must be "en" or "de"');
  if (run.readiness_target !== undefined && !READINESS_TARGETS.includes(run.readiness_target)) {
    p(`readiness_target must be one of ${READINESS_TARGETS.join(", ")}`);
  }
  if (!Array.isArray(run.audits) || run.audits.length === 0) p("audits must be a non-empty array");
  if (!Array.isArray(run.findings)) {
    p("findings must be an array");
    return problems;
  }
  const ids = new Set();
  run.findings.forEach((f, i) => {
    const where = `findings[${i}]${f && f.id ? ` (${f.id})` : ""}`;
    for (const k of REQUIRED_FINDING) {
      if (f[k] === undefined || f[k] === null) p(`${where}: missing required field "${k}"`);
    }
    if (f.id !== undefined) {
      if (ids.has(f.id)) p(`${where}: duplicate id`);
      ids.add(f.id);
    }
    if (f.severity !== undefined && !SEVERITIES.includes(f.severity)) p(`${where}: severity must be P0–P3`);
    if (f.effort !== undefined && !EFFORTS.includes(f.effort)) p(`${where}: effort must be S|M|L|XL`);
    if (f.confidence !== undefined && !(typeof f.confidence === "number" && f.confidence >= 0 && f.confidence <= 1)) {
      p(`${where}: confidence must be a number in [0,1]`);
    }
    if (f.controls !== undefined) {
      if (!Array.isArray(f.controls)) p(`${where}: controls must be an array`);
      else f.controls.forEach((c) => { if (!CONTROL_ID.test(String(c))) p(`${where}: control "${c}" is not <FRAMEWORK>:<ID>`); });
    }
    if (f.deal_blocker !== undefined && typeof f.deal_blocker !== "boolean") p(`${where}: deal_blocker must be boolean`);
    if (f.fine_exposure !== undefined && typeof f.fine_exposure !== "string") p(`${where}: fine_exposure must be a string`);
  });
  if (run.readiness) {
    if (typeof run.readiness.score_percent !== "number") p("readiness.score_percent must be a number");
    if (!Array.isArray(run.readiness.controls)) p("readiness.controls must be an array");
    else run.readiness.controls.forEach((c, i) => {
      if (!CONTROL_ID.test(String(c.id))) p(`readiness.controls[${i}]: id "${c.id}" is not <FRAMEWORK>:<ID>`);
      if (!CONTROL_STATUS.includes(c.status)) p(`readiness.controls[${i}]: status must be one of ${CONTROL_STATUS.join(", ")}`);
    });
  }
  return problems;
}

// --- Helpers ----------------------------------------------------------------

/** Deterministic, UUID-shaped identifier derived from a string (stable across re-exports). */
export function stableUuid(input) {
  const h = createHash("sha256").update(String(input)).digest("hex");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-8${h.slice(17, 20)}-${h.slice(20, 32)}`;
}

/**
 * Explicit `locations` win; otherwise pull `path:line` tokens out of the
 * evidence string. A path must contain a dot-extension or a slash so prose
 * like "Art. 32" or "10:30" is not mistaken for a file.
 */
export function findingLocations(finding) {
  if (Array.isArray(finding.locations) && finding.locations.length) {
    return finding.locations.map((l) => ({ path: normalizePath(l.path), line: l.line, end_line: l.end_line }));
  }
  const out = [];
  const seen = new Set();
  const re = /(?<![\w@])((?:[\w.-]+\/)*[\w.-]+\.[A-Za-z][\w]*):(\d{1,6})\b/g;
  let m;
  while ((m = re.exec(finding.evidence ?? "")) !== null) {
    const path = normalizePath(m[1]);
    const key = `${path}:${m[2]}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ path, line: Number(m[2]) });
  }
  return out;
}

function normalizePath(p) {
  return String(p).replace(/\\/g, "/").replace(/^\.\//, "");
}

const SARIF_LEVEL = { P0: "error", P1: "error", P2: "warning", P3: "note" };
// GitHub's `security-severity` property (CVSS-like 0–10) drives the alert badge.
const SECURITY_SEVERITY = { P0: "9.5", P1: "8.0", P2: "5.0", P3: "2.0" };
const NC_CLASS = { missing: "major", partial: "minor", implemented: "conform" };

function severityRank(s) {
  return SEVERITIES.indexOf(s);
}

function csvCell(v) {
  const s = v === undefined || v === null ? "" : Array.isArray(v) ? v.join("; ") : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function csv(rows, header) {
  return [header, ...rows].map((r) => r.map(csvCell).join(",")).join("\n") + "\n";
}

// --- Exporters ----------------------------------------------------------------

/** SARIF 2.1.0 — one run, one rule per finding, one result per finding. */
export function toSarif(run) {
  const rules = run.findings.map((f) => ({
    id: f.id,
    name: f.title.replace(/[^A-Za-z0-9]+/g, " ").trim().split(" ").slice(0, 8).join(""),
    shortDescription: { text: f.title },
    fullDescription: { text: f.fix },
    help: { text: `${f.fix}\n\nExpected impact: ${f.expected_impact}`, markdown: `**Fix.** ${f.fix}\n\n**Expected impact.** ${f.expected_impact}` },
    defaultConfiguration: { level: SARIF_LEVEL[f.severity] },
    properties: {
      severity: f.severity,
      "security-severity": SECURITY_SEVERITY[f.severity],
      audit: f.audit ?? run.audits[0],
      controls: f.controls,
      deal_blocker: f.deal_blocker,
      fine_exposure: f.fine_exposure,
      effort: f.effort,
      ...(f.standard ? { standard: f.standard } : {}),
      tags: ["auditor", f.severity, ...(f.audit ? [f.audit] : []), ...(f.deal_blocker ? ["deal-blocker"] : [])],
    },
  }));
  const results = run.findings.map((f, i) => {
    const locations = findingLocations(f).map((l) => ({
      physicalLocation: {
        artifactLocation: { uri: l.path, uriBaseId: "%SRCROOT%" },
        ...(l.line ? { region: { startLine: l.line, ...(l.end_line ? { endLine: l.end_line } : {}) } } : {}),
      },
    }));
    return {
      ruleId: f.id,
      ruleIndex: i,
      level: SARIF_LEVEL[f.severity],
      message: { text: `${f.title} — ${f.evidence}` },
      ...(locations.length ? { locations } : {}),
      partialFingerprints: { "auditor/findingId": f.id },
      properties: {
        severity: f.severity,
        confidence: f.confidence,
        effort: f.effort,
        controls: f.controls,
        deal_blocker: f.deal_blocker,
        fine_exposure: f.fine_exposure,
        ...(f.cvss ? { cvss: f.cvss } : {}),
      },
    };
  });
  return {
    $schema: "https://json.schemastore.org/sarif-2.1.0.json",
    version: "2.1.0",
    runs: [
      {
        tool: {
          driver: {
            name: "auditor",
            version: run.tool.version.replace(/^v/, ""),
            semanticVersion: run.tool.version.replace(/^v/, ""),
            informationUri: "https://auditor.rapold.io",
            rules,
          },
        },
        automationDetails: { id: `auditor/${run.audits.join("+")}/${run.target.audited_at.slice(0, 10)}` },
        ...(run.target.commit
          ? { versionControlProvenance: [{ repositoryUri: run.target.url ?? run.target.name, revisionId: run.target.commit }] }
          : {}),
        results,
        properties: {
          target: run.target.name,
          audits: run.audits,
          readiness_target: run.readiness_target ?? "none",
          ...(run.readiness ? { readiness_score_percent: run.readiness.score_percent } : {}),
        },
      },
    ],
  };
}

/**
 * Control view derived from findings (used when the run carries no explicit
 * readiness block, and to cross-check it when it does).
 */
export function deriveControls(run) {
  const byControl = new Map();
  for (const f of run.findings) {
    for (const c of f.controls ?? []) {
      const entry = byControl.get(c) ?? { id: c, finding_ids: [], worst: 3, effort_days: 0, deal_blocker: false, evidence: [] };
      entry.finding_ids.push(f.id);
      entry.worst = Math.min(entry.worst, severityRank(f.severity));
      entry.effort_days += EFFORT_DAYS[f.effort] ?? 0;
      entry.deal_blocker = entry.deal_blocker || f.deal_blocker === true;
      entry.evidence.push(f.evidence);
      byControl.set(c, entry);
    }
  }
  return [...byControl.values()]
    .map((e) => {
      const status = e.worst <= 1 ? "missing" : "partial";
      const nc_class = e.worst === 3 && status === "partial" ? "ofi" : NC_CLASS[status];
      return { ...e, status, nc_class, severity_max: SEVERITIES[e.worst] };
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}

/** OSCAL 1.1.2 assessment-results — one observation per finding, one OSCAL finding per (finding × control). */
export function toOscal(run) {
  const runKey = `${run.target.name}@${run.target.commit ?? run.target.audited_at}`;
  const observations = run.findings.map((f) => ({
    uuid: stableUuid(`${runKey}/obs/${f.id}`),
    title: f.title,
    description: f.evidence,
    methods: [run.coverage?.static_only === false ? "TEST" : "EXAMINE"],
    ...(findingLocations(f).length
      ? {
          subjects: findingLocations(f).map((l) => ({
            "subject-uuid": stableUuid(`${runKey}/subject/${l.path}`),
            type: "component",
            title: l.line ? `${l.path}:${l.line}` : l.path,
          })),
        }
      : {}),
    "relevant-evidence": [{ description: f.evidence }],
    props: [
      { name: "severity", ns: "https://auditor.rapold.io/ns/oscal", value: f.severity },
      { name: "finding-id", ns: "https://auditor.rapold.io/ns/oscal", value: f.id },
    ],
    collected: run.target.audited_at,
  }));
  const findings = run.findings.flatMap((f) => {
    const targets = f.controls && f.controls.length ? f.controls : [`AUDITOR:${f.audit ?? run.audits[0]}`];
    return targets.map((controlId) => ({
      uuid: stableUuid(`${runKey}/finding/${f.id}/${controlId}`),
      title: `${f.id}: ${f.title}`,
      description: `${f.fix}\n\nExpected impact: ${f.expected_impact}`,
      props: [
        { name: "severity", ns: "https://auditor.rapold.io/ns/oscal", value: f.severity },
        { name: "effort", ns: "https://auditor.rapold.io/ns/oscal", value: f.effort },
        { name: "deal-blocker", ns: "https://auditor.rapold.io/ns/oscal", value: String(f.deal_blocker) },
        { name: "fine-exposure", ns: "https://auditor.rapold.io/ns/oscal", value: f.fine_exposure },
      ],
      target: {
        type: "objective-id",
        "target-id": controlId,
        status: { state: "not-satisfied", reason: severityRank(f.severity) <= 1 ? "major-nonconformity" : "minor-nonconformity" },
      },
      "related-observations": [{ "observation-uuid": stableUuid(`${runKey}/obs/${f.id}`) }],
    }));
  });
  const controlIds = [...new Set([
    ...run.findings.flatMap((f) => f.controls ?? []),
    ...(run.readiness?.controls ?? []).map((c) => c.id),
  ])].sort();
  return {
    "assessment-results": {
      uuid: stableUuid(`${runKey}/assessment-results`),
      metadata: {
        title: `auditor assessment of ${run.target.name}`,
        "last-modified": run.target.audited_at,
        version: run.tool.version,
        "oscal-version": "1.1.2",
        props: [
          { name: "readiness-target", ns: "https://auditor.rapold.io/ns/oscal", value: run.readiness_target ?? "none" },
          ...(run.readiness ? [{ name: "readiness-score-percent", ns: "https://auditor.rapold.io/ns/oscal", value: String(run.readiness.score_percent) }] : []),
        ],
        remarks:
          "Readiness assessment produced by AI-assisted audits (auditor.rapold.io). It is not a certification audit opinion; organisational controls are reported as not assessable, never as missing.",
      },
      "import-ap": { href: "#auditor-assessment-plan", remarks: "The assessment plan is the audit master prompt set at the pinned release tag." },
      results: [
        {
          uuid: stableUuid(`${runKey}/result`),
          title: `Audits: ${run.audits.join(", ")}`,
          description: run.summary?.[run.output_lang] ?? run.summary?.en ?? "",
          start: run.target.audited_at,
          end: run.target.audited_at,
          "reviewed-controls": {
            "control-selections": [{ "include-controls": controlIds.map((id) => ({ "control-id": id })) }],
          },
          observations,
          findings,
        },
      ],
    },
  };
}

/** gap-matrix.csv — one row per control; explicit readiness block wins, derived view otherwise. */
export function toGapMatrixCsv(run) {
  const derived = new Map(deriveControls(run).map((c) => [c.id, c]));
  const rows = [];
  if (run.readiness?.controls?.length) {
    for (const c of run.readiness.controls) {
      const d = derived.get(c.id);
      rows.push([
        c.id.split(":")[0],
        c.id,
        c.status,
        c.nc_class ?? (c.status === "implemented" ? "conform" : NC_CLASS[c.status] ?? ""),
        c.finding_ids ?? d?.finding_ids ?? [],
        d?.severity_max ?? "",
        d ? d.effort_days : "",
        d ? d.deal_blocker : "",
        c.evidence ?? (d ? d.evidence.join(" | ") : ""),
        c.owner ?? "",
      ]);
    }
    for (const id of run.readiness.not_assessable ?? []) {
      rows.push([id.split(":")[0], id, "not-assessable", "", [], "", "", "", "requires organisational evidence", ""]);
    }
  } else {
    for (const c of derived.values()) {
      rows.push([c.id.split(":")[0], c.id, c.status, c.nc_class, c.finding_ids, c.severity_max, c.effort_days, c.deal_blocker, c.evidence.join(" | "), ""]);
    }
  }
  return csv(rows, ["framework", "control_id", "status", "nc_class", "finding_ids", "severity_max", "effort_days", "deal_blocker", "evidence", "owner"]);
}

/** findings.csv — one row per finding, flat, spreadsheet/Jira-import friendly. */
export function toFindingsCsv(run) {
  const rows = run.findings.map((f) => [
    f.id,
    f.audit ?? run.audits[0],
    f.severity,
    f.title,
    f.effort,
    f.confidence,
    f.deal_blocker,
    f.fine_exposure,
    f.controls,
    f.standard ?? "",
    findingLocations(f).map((l) => (l.line ? `${l.path}:${l.line}` : l.path)),
    f.evidence,
    f.fix,
    f.expected_impact,
    f.issue_url ?? "",
  ]);
  return csv(rows, ["id", "audit", "severity", "title", "effort", "confidence", "deal_blocker", "fine_exposure", "controls", "standard", "locations", "evidence", "fix", "expected_impact", "issue_url"]);
}

const L = {
  en: {
    title: "Executive audit report",
    summary: "Management summary",
    summaryMissing: "_The agent writes 5–8 sentences here: verdict, the single biggest exposure, what changes after remediation. Board-readable, no jargon._",
    keyNumbers: "Key numbers",
    findings: "Findings",
    dealBlockers: "Deal-blockers",
    dealBlockersLead: "Findings that would fail a SOC 2 / ISO 27001 audit, block enterprise procurement, or breach a statutory duty.",
    fine: "Fine exposure",
    fineLead: "Highest statutory tier that applies per regime, with the findings behind it.",
    readiness: "Certification readiness",
    readinessNote: "Technical control readiness, not a certificate. Organisational controls are listed separately as not assessable.",
    scorecard: "Scorecard",
    roadmap: "Roadmap",
    coverage: "Coverage and limitations",
    appendix: "Appendix — all findings",
    none: "none",
    horizons: { immediate: "Immediate (≤ 7 days)", 30: "30 days", 60: "60 days", 90: "90 days" },
    cols: { audit: "Audit", grade: "Grade", score: "Score", id: "ID", sev: "Severity", title: "Title", effort: "Effort", controls: "Controls", regime: "Regime", ids: "Findings", control: "Control", status: "Status", nc: "NC class", count: "Count" },
    status: { implemented: "implemented", partial: "partial", missing: "missing", "not-assessable": "not assessable", "n/a": "n/a" },
    timeToReady: "Estimated time to audit-ready",
    days: "person-days",
    notApplicable: "Declared not applicable",
    target: "Target",
    auditedAt: "Audited",
    audits: "Audits",
    produced: "Produced by auditor",
  },
  de: {
    title: "Executive-Audit-Bericht",
    summary: "Management-Summary",
    summaryMissing: "_Hier schreibt der Agent 5–8 Sätze: Gesamturteil, das grösste einzelne Risiko, was sich nach der Behebung ändert. Für die Geschäftsleitung lesbar, ohne Jargon._",
    keyNumbers: "Kennzahlen",
    findings: "Befunde",
    dealBlockers: "Deal-Blocker",
    dealBlockersLead: "Befunde, die ein SOC-2- oder ISO-27001-Audit scheitern lassen, ein Enterprise-Procurement blockieren oder eine gesetzliche Pflicht verletzen würden.",
    fine: "Bussgeld-Exposition",
    fineLead: "Höchste zutreffende gesetzliche Stufe je Regime, mit den Befunden dahinter.",
    readiness: "Zertifizierungs-Readiness",
    readinessNote: "Technische Control-Readiness, kein Zertifikat. Organisatorische Controls sind separat als nicht prüfbar ausgewiesen.",
    scorecard: "Scorecard",
    roadmap: "Roadmap",
    coverage: "Abdeckung und Grenzen",
    appendix: "Anhang — alle Befunde",
    none: "keine",
    horizons: { immediate: "Sofort (≤ 7 Tage)", 30: "30 Tage", 60: "60 Tage", 90: "90 Tage" },
    cols: { audit: "Audit", grade: "Note", score: "Score", id: "ID", sev: "Schweregrad", title: "Titel", effort: "Aufwand", controls: "Controls", regime: "Regime", ids: "Befunde", control: "Control", status: "Status", nc: "NC-Klasse", count: "Anzahl" },
    status: { implemented: "umgesetzt", partial: "teilweise", missing: "fehlend", "not-assessable": "nicht prüfbar", "n/a": "n/a" },
    timeToReady: "Geschätzte Zeit bis audit-ready",
    days: "Personentage",
    notApplicable: "Als nicht anwendbar deklariert",
    target: "Ziel",
    auditedAt: "Geprüft am",
    audits: "Audits",
    produced: "Erstellt mit auditor",
  },
};

function mdTable(header, rows) {
  const esc = (v) => String(v ?? "").replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
  return [`| ${header.map(esc).join(" | ")} |`, `|${header.map(() => "---").join("|")}|`, ...rows.map((r) => `| ${r.map(esc).join(" | ")} |`)].join("\n");
}

/** EXECUTIVE-REPORT.md — the board-ready skeleton with every table filled from the run. */
export function toExecutiveReport(run) {
  const t = L[run.output_lang] ?? L.en;
  const bySev = Object.fromEntries(SEVERITIES.map((s) => [s, run.findings.filter((f) => f.severity === s).length]));
  const dealBlockers = run.findings.filter((f) => f.deal_blocker);
  const fines = new Map();
  for (const f of run.findings) {
    if (!f.fine_exposure || f.fine_exposure === "none") continue;
    const list = fines.get(f.fine_exposure) ?? [];
    list.push(f.id);
    fines.set(f.fine_exposure, list);
  }
  const out = [];
  out.push(`# ${t.title}: ${run.target.name}`, "");
  out.push(`${t.target}: ${run.target.url ?? run.target.name}${run.target.commit ? ` @ \`${run.target.commit.slice(0, 12)}\`` : ""} · ${t.auditedAt}: ${run.target.audited_at.slice(0, 10)} · ${t.audits}: ${run.audits.join(", ")} · ${t.produced} ${run.tool.version}`, "");
  out.push("> [!NOTE]", `> **${t.summary}.** ${run.summary?.[run.output_lang] ?? run.summary?.en ?? t.summaryMissing}`, "");
  out.push(`## ${t.keyNumbers}`, "");
  const numbers = [
    [t.findings, run.findings.length],
    ["P0 / P1 / P2 / P3", `${bySev.P0} / ${bySev.P1} / ${bySev.P2} / ${bySev.P3}`],
    [t.dealBlockers, dealBlockers.length],
  ];
  if (run.readiness) numbers.push([`${t.readiness} (${run.readiness_target})`, `${run.readiness.score_percent} %`]);
  out.push(mdTable(["", t.cols.count], numbers), "");
  if (run.scorecard?.length) {
    out.push(`## ${t.scorecard}`, "", mdTable([t.cols.audit, t.cols.grade, t.cols.score], run.scorecard.map((s) => [s.audit, s.grade ?? "", s.score])), "");
  }
  if (run.not_applicable?.length) {
    out.push(`### ${t.notApplicable}`, "", ...run.not_applicable.map((n) => `- \`${n.audit}\` — ${n.reason}`), "");
  }
  out.push(`## ${t.dealBlockers}`, "", t.dealBlockersLead, "");
  out.push(dealBlockers.length
    ? mdTable([t.cols.id, t.cols.sev, t.cols.title, t.cols.effort, t.cols.controls], dealBlockers.map((f) => [f.id, f.severity, f.title, f.effort, f.controls.join(", ")]))
    : `_${t.none}_`, "");
  out.push(`## ${t.fine}`, "", t.fineLead, "");
  out.push(fines.size
    ? mdTable([t.cols.regime, t.cols.ids], [...fines.entries()].map(([k, v]) => [k, v.join(", ")]))
    : `_${t.none}_`, "");
  if (run.readiness) {
    out.push(`## ${t.readiness}: ${run.readiness_target}`, "", `**${run.readiness.score_percent} %** — ${t.readinessNote}`, "");
    const counts = {};
    for (const c of run.readiness.controls) counts[c.status] = (counts[c.status] ?? 0) + 1;
    out.push(mdTable([t.cols.status, t.cols.count], Object.entries(counts).map(([k, v]) => [t.status[k] ?? k, v])), "");
    if (run.readiness.time_to_ready_days) {
      out.push(`${t.timeToReady}: **${run.readiness.time_to_ready_days.min}–${run.readiness.time_to_ready_days.max} ${t.days}**`, "");
    }
    const gaps = run.readiness.controls.filter((c) => c.status === "missing" || c.status === "partial");
    if (gaps.length) {
      out.push(mdTable([t.cols.control, t.cols.status, t.cols.nc, t.cols.ids], gaps.map((c) => [c.id, t.status[c.status], c.nc_class ?? NC_CLASS[c.status] ?? "", (c.finding_ids ?? []).join(", ")])), "");
    }
    if (run.readiness.not_assessable?.length) {
      out.push(`${t.status["not-assessable"]}: ${run.readiness.not_assessable.map((c) => `\`${c}\``).join(", ")}`, "");
    }
  }
  if (run.roadmap?.length) {
    out.push(`## ${t.roadmap}`, "");
    for (const r of run.roadmap) out.push(`- **${t.horizons[r.horizon] ?? r.horizon}:** ${r.finding_ids.join(", ")}${r.note ? ` — ${r.note}` : ""}`);
    out.push("");
  }
  if (run.coverage) {
    out.push(`## ${t.coverage}`, "");
    if (run.coverage.static_only !== undefined) out.push(`- static-only: ${run.coverage.static_only}`);
    if (run.coverage.sampled) out.push(`- ${run.coverage.sampled}`);
    if (run.coverage.limits) out.push(`- ${run.coverage.limits}`);
    out.push("");
  }
  const sorted = [...run.findings].sort((a, b) => severityRank(a.severity) - severityRank(b.severity) || a.id.localeCompare(b.id));
  out.push(`## ${t.appendix}`, "", mdTable([t.cols.id, t.cols.sev, t.cols.title, t.cols.effort, t.cols.controls], sorted.map((f) => [f.id, f.severity, f.title, f.effort, f.controls.join(", ")])), "");
  return out.join("\n");
}

/**
 * evidence-manifest.json — for every artifact a finding cites, the sha256 of
 * the file as it exists in the audited checkout, so an auditor can verify the
 * evidence later. Hashes only; no file content is copied (secrets stay put).
 */
export function toEvidenceManifest(run, repoRoot) {
  const entries = new Map();
  for (const f of run.findings) {
    for (const l of findingLocations(f)) {
      const e = entries.get(l.path) ?? { path: l.path, finding_ids: [], controls: new Set(), lines: new Set() };
      e.finding_ids.push(f.id);
      for (const c of f.controls ?? []) e.controls.add(c);
      if (l.line) e.lines.add(l.line);
      entries.set(l.path, e);
    }
  }
  let commit = run.target.commit ?? null;
  if (repoRoot && !commit) {
    try { commit = execFileSync("git", ["-C", repoRoot, "rev-parse", "HEAD"], { encoding: "utf8" }).trim(); } catch { /* not a git checkout */ }
  }
  const artifacts = [...entries.values()].sort((a, b) => a.path.localeCompare(b.path)).map((e) => {
    const abs = repoRoot ? join(repoRoot, e.path) : null;
    const present = abs ? existsSync(abs) : false;
    let sha256 = null;
    let bytes = null;
    if (present && statSync(abs).isFile()) {
      const buf = readFileSync(abs);
      sha256 = createHash("sha256").update(buf).digest("hex");
      bytes = buf.length;
    }
    return {
      path: e.path,
      lines: [...e.lines].sort((a, b) => a - b),
      finding_ids: [...new Set(e.finding_ids)],
      controls: [...e.controls].sort(),
      present,
      sha256,
      bytes,
    };
  });
  return {
    schema_version: "1.0",
    generated_at: new Date().toISOString(),
    target: { name: run.target.name, url: run.target.url ?? null, commit },
    tool: run.tool,
    hash_algorithm: "sha256",
    artifacts,
    unresolved: artifacts.filter((a) => !a.present).map((a) => a.path),
    note: "Hashes are taken over the artifact as found in the audited checkout; the manifest never copies file content. Re-hash at review time to prove the evidence is unchanged.",
  };
}

// --- CLI ----------------------------------------------------------------------

function parseArgs(argv) {
  const opts = { format: "all", out: "auditor-out", repo: null, docx: false, validateOnly: false, input: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--out") opts.out = argv[++i];
    else if (a === "--format") opts.format = argv[++i];
    else if (a === "--repo") opts.repo = argv[++i];
    else if (a === "--docx") opts.docx = true;
    else if (a === "--validate") opts.validateOnly = true;
    else if (a.startsWith("--")) throw new Error(`unknown option ${a}`);
    else opts.input = a;
  }
  return opts;
}

function main() {
  let opts;
  try {
    opts = parseArgs(process.argv.slice(2));
  } catch (err) {
    console.error(`✗ ${err.message}`);
    process.exit(2);
  }
  if (!opts.input) {
    console.error("Usage: node scripts/export-findings.mjs <audit-run.json> [--out <dir>] [--format all|sarif|oscal|csv|report|evidence] [--repo <path>] [--docx] [--validate]");
    process.exit(2);
  }
  const run = JSON.parse(readFileSync(resolve(opts.input), "utf8"));
  const problems = validateRun(run);
  if (problems.length) {
    console.error(`✗ ${basename(opts.input)} does not satisfy schemas/audit-run.schema.json:`);
    for (const p of problems) console.error(`    ${p}`);
    process.exit(1);
  }
  console.log(`✓ ${basename(opts.input)} valid — ${run.findings.length} finding(s), audits: ${run.audits.join(", ")}`);
  if (opts.validateOnly) return;

  const out = resolve(opts.out);
  mkdirSync(out, { recursive: true });
  const want = (k) => opts.format === "all" || opts.format === k;
  const written = [];
  const write = (name, content) => {
    writeFileSync(join(out, name), typeof content === "string" ? content : JSON.stringify(content, null, 2) + "\n");
    written.push(name);
  };
  if (want("sarif")) write("findings.sarif", toSarif(run));
  if (want("oscal")) write("assessment-results.oscal.json", toOscal(run));
  if (want("csv")) {
    write("gap-matrix.csv", toGapMatrixCsv(run));
    write("findings.csv", toFindingsCsv(run));
  }
  if (want("report")) {
    write("EXECUTIVE-REPORT.md", toExecutiveReport(run));
    if (opts.docx) {
      const r = spawnSync("pandoc", [join(out, "EXECUTIVE-REPORT.md"), "-o", join(out, "EXECUTIVE-REPORT.docx")], { stdio: "inherit" });
      if (r.error || r.status !== 0) console.error("  ! pandoc not available or failed — convert EXECUTIVE-REPORT.md manually (see REPORT-OUTPUT-STANDARD.md)");
      else written.push("EXECUTIVE-REPORT.docx");
    }
  }
  if (want("evidence")) write("evidence-manifest.json", toEvidenceManifest(run, opts.repo ? resolve(opts.repo) : null));
  for (const w of written) console.log(`  wrote ${join(opts.out, w)}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}

export { ROOT };
