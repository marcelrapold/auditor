# Report-output standard (business deliverables)

The contract for everything an audit hands to people who do not read GitHub issues: the board,
the external auditor, the compliance tool, the engineering tracker. It complements
[`ISSUE-OUTPUT-STANDARD.md`](ISSUE-OUTPUT-STANDARD.md) (the issue contract) and
[`CONTROL-CROSSWALK.md`](CONTROL-CROSSWALK.md) (the control mapping).

> [!NOTE]
> **Management summary.** Every audit run ends in **one canonical machine-readable file**,
> `audit-run.json`, validated against [`schemas/audit-run.schema.json`](schemas/audit-run.schema.json).
> Everything a buyer or auditor asks for is **derived from it by a script**, never re-typed by the
> agent: an executive report (Markdown → DOCX/PDF), SARIF for GitHub Code Scanning, OSCAL for GRC
> tools, CSV for Vanta/Drata/Secureframe and Jira, and an evidence manifest with hashes. Issues can
> go to GitHub, Jira, Linear or ServiceNow. The output language is chosen per run — English and
> German are first-class, neither is assumed.

> [!NOTE]
> **Kurzfassung (DE).** Jeder Audit-Lauf endet in einer kanonischen Datei `audit-run.json`.
> Daraus erzeugt `scripts/export-findings.mjs` deterministisch den Executive-Bericht (Markdown,
> daraus DOCX/PDF), SARIF für GitHub Code Scanning, OSCAL für GRC-Tools, CSV für Vanta/Drata/
> Secureframe und Jira sowie ein Evidenz-Manifest mit Hashes. Issues gehen nach GitHub, Jira,
> Linear oder ServiceNow. Die Sprache wird pro Lauf gewählt; Deutsch folgt den de-CH-Regeln des
> Issue-Standards.

Version 1.0.0

---

## Contents

- [Deliverables](#deliverables)
- [The canonical run file](#the-canonical-run-file)
- [Executive report](#executive-report)
- [Machine-readable exports](#machine-readable-exports)
- [Issue targets](#issue-targets)
- [Language](#language)
- [Evidence pack](#evidence-pack)
- [Limits](#limits)

---

## Deliverables

| File | Audience | Format | Produced by |
|---|---|---|---|
| `auditor-out/audit-run.json` | every other deliverable | JSON, [`schemas/audit-run.schema.json`](schemas/audit-run.schema.json) | the agent, after Phase 3 + synthesis |
| `auditor-out/EXECUTIVE-REPORT.md` (→ `.docx` / `.pdf`) | management, board, external auditor | Markdown; DOCX/PDF via pandoc or the harness's document skill | `scripts/export-findings.mjs` |
| `auditor-out/findings.sarif` | engineering; GitHub Code Scanning; IDEs | SARIF 2.1.0 | `scripts/export-findings.mjs` |
| `auditor-out/assessment-results.oscal.json` | GRC / compliance platforms | OSCAL 1.1.2 assessment results (minimal profile) | `scripts/export-findings.mjs` |
| `auditor-out/gap-matrix.csv` | compliance tools (custom-control import), readiness reviews | CSV, one row per control | `scripts/export-findings.mjs` |
| `auditor-out/findings.csv` | Jira / spreadsheet import, vendor questionnaires | CSV, one row per finding | `scripts/export-findings.mjs` |
| `auditor-out/evidence-manifest.json` | external auditor | JSON, sha256 per cited artifact | `scripts/export-findings.mjs --repo <checkout>` |
| Tracker issues | engineering, project management | per [`ISSUE-OUTPUT-STANDARD.md`](ISSUE-OUTPUT-STANDARD.md), target per [Issue targets](#issue-targets) | the agent, preview-first, on approval |

The agent writes the run file and the prose it contains. The script does the rest:

```bash
node scripts/export-findings.mjs auditor-out/audit-run.json --out auditor-out --repo . [--docx]
```

`--validate` checks the run without exporting; `--format sarif|oscal|csv|report|evidence` limits the
output. The script is dependency-free and ships with every release, so an agent that has the repo
(or the MCP server) has the exporter.

---

## The canonical run file

- **When.** After Phase 3 (adversarial verification) and Phase 5 (synthesis), before issues are
  created. Only **confirmed** findings go in; killed findings stay in the report appendix.
- **Shape.** [`schemas/audit-run.schema.json`](schemas/audit-run.schema.json); each finding follows
  [`schemas/finding.schema.json`](schemas/finding.schema.json) — the same eleven required fields
  every audit prompt's *Shared finding schema* carries, plus the audit's own extras.
- **Merging.** The orchestrator merges the specialist runs into one file: `audits` lists every
  audit that ran, each finding carries `audit`, duplicates are merged per Step 4 (all lenses kept
  in `evidence`), `not_applicable` lists what Phase 0 declared out of scope with the reason.
- **Locations.** Set `locations[]` explicitly whenever the finding is code-anchored; the exporter
  falls back to parsing `path:line` tokens out of `evidence`, but explicit is better.
- **Prose.** `summary.<lang>` is the executive summary (5–8 sentences, board-readable); `roadmap[]`
  notes and `coverage` are honest limits, not marketing.
- **Readiness.** The `readiness` block is present only when `READINESS_TARGET` was set and follows
  the status and scoring rules of `CONTROL-CROSSWALK.md`.
- **Validate before handing over:** `node scripts/export-findings.mjs auditor-out/audit-run.json --validate`.
  A run that fails validation is not delivered.
- **Redaction.** As everywhere in the library: no real secrets or PII; cite the location, redact the value.

---

## Executive report

The generated `EXECUTIVE-REPORT.md` has this fixed structure; the agent's contribution is the
prose in `summary` and the roadmap notes, never numbers that are not in the run file.

1. **Title line** — target, commit, date, audits run, tool version.
2. **Management summary** — from `summary.<lang>`: verdict, the single biggest exposure, what
   changes after remediation. Readable by a board member in one minute.
3. **Key numbers** — findings by severity, deal-blockers, readiness score when in readiness mode.
4. **Scorecard** and the audits declared not applicable, with reasons.
5. **Deal-blockers** — the findings that would fail a SOC 2 / ISO 27001 audit, block enterprise
   procurement, or breach a statutory duty.
6. **Fine exposure** — the highest statutory tier per regime with the findings behind it.
7. **Certification readiness** (readiness mode only) — score, status counts, the gap list with
   nonconformity classes, time-to-audit-ready, and the controls that need organisational evidence.
   Always with the sentence *technical control readiness, not a certificate*.
8. **Roadmap** — immediate / 30 / 60 / 90 with finding IDs.
9. **Coverage and limitations** — static vs active, sampling, what was not examined.
10. **Appendix — all findings.**

Length: at most four pages before the appendix. Conversion:

```bash
pandoc auditor-out/EXECUTIVE-REPORT.md -o auditor-out/EXECUTIVE-REPORT.docx
pandoc auditor-out/EXECUTIVE-REPORT.md -o auditor-out/EXECUTIVE-REPORT.pdf --pdf-engine=xelatex
```

or `--docx` on the exporter (uses pandoc when present). Where the harness offers a document
skill (Claude's `docx` skill, for example), the agent may use it instead — from the generated
Markdown, not from memory.

---

## Machine-readable exports

### SARIF 2.1.0 → GitHub Code Scanning, IDEs

- One rule and one result per finding; `ruleId` = finding ID; `partialFingerprints["auditor/findingId"]`
  keeps alerts stable across runs.
- Levels: P0/P1 → `error`, P2 → `warning`, P3 → `note`; `security-severity` 9.5 / 8.0 / 5.0 / 2.0 so
  GitHub badges the alert.
- Locations come from `locations[]` or the parsed `evidence`; a finding without a code location
  has no `locations` (nothing is fabricated).
- Upload: `gh api --method POST /repos/<owner>/<repo>/code-scanning/sarifs` with the file
  gzip+base64-encoded and the commit SHA, or the `github/codeql-action/upload-sarif` action with
  `sarif_file: auditor-out/findings.sarif` and `category: auditor`.

### OSCAL 1.1.2 assessment results → GRC platforms

- Minimal profile: `metadata`, `import-ap` (placeholder pointing at the pinned prompt set),
  one `result` with `reviewed-controls` (every control cited by a finding or the readiness block),
  one `observation` per finding, one OSCAL `finding` per finding × control with
  `target.status.state = not-satisfied` and the nonconformity class as `reason`.
- Control IDs are the crosswalk IDs (`ISO27001:A.8.3`). Map them to the catalog IDs your GRC
  tool uses on import.
- UUIDs are deterministic (derived from target, commit and finding ID), so a re-export of the
  same run is byte-identical and imports idempotently.
- Validate with `oscal-cli` when the receiving tool is strict; the exporter guarantees structure,
  not every optional constraint of the schema.

### CSV → Vanta, Drata, Secureframe, Jira, spreadsheets

- `gap-matrix.csv`: `framework, control_id, status, nc_class, finding_ids, severity_max,
  effort_days, deal_blocker, evidence, owner` — one row per control, `not-assessable` rows included.
  Import as custom controls / test results; the platforms map columns on import.
- `findings.csv`: `id, audit, severity, title, effort, confidence, deal_blocker, fine_exposure,
  controls, standard, locations, evidence, fix, expected_impact, issue_url`. For Jira's CSV importer
  map `title → Summary`, `severity → Priority` (see below), `controls → Labels`, `fix → Description`.

---

## Issue targets

`ISSUE_TARGET` accepts one of:

| Value | Mechanism | Idempotency |
|---|---|---|
| `github:owner/repo` (or bare `owner/repo`) | `gh issue create`, per `ISSUE-OUTPUT-STANDARD.md` | search by label `audit` + finding ID in the title before creating |
| `jira:PROJECTKEY[@https://site.atlassian.net]` | Jira REST API v3 (`POST /rest/api/3/issue`) or the Atlassian MCP connector | JQL `project = KEY AND labels = auditor AND summary ~ "<ID>"` before creating |
| `linear:TEAMKEY` | Linear GraphQL (`issueCreate`) or the Linear MCP connector | search `title` for `[<ID>]` in the team before creating |
| `servicenow:https://instance.service-now.com` | Table API on the table the customer uses for findings (`problem`, `sn_grc_issue`, or an `x_*` table) | query `short_description LIKE <ID>` before creating |

Field mapping, identical in intent across targets:

| Run field | GitHub | Jira | Linear | ServiceNow |
|---|---|---|---|---|
| `severity` P0 / P1 / P2 / P3 | label `sev:p0…p3` | Priority Highest / High / Medium / Low | priority 1 Urgent / 2 High / 3 Medium / 4 Low | priority 1 / 2 / 3 / 4 |
| `id` | title prefix `[SEC-001]`, label `audit` | summary prefix `[SEC-001]`, label `auditor` | title prefix `[SEC-001]`, label `auditor` | `short_description` prefix `[SEC-001]`, tag `auditor` |
| `controls` | labels `control:<F>-<ID>` | labels `control-<F>-<ID>` | labels | `u_controls` or work notes |
| `deal_blocker` | label `deal-blocker` | label `deal-blocker` | label `deal-blocker` | tag `deal-blocker` |
| tracking issue | parent issue with checklist | Epic, findings as children | Project or parent issue | Problem with related records |
| body | per `ISSUE-OUTPUT-STANDARD.md` | same body in the description (Markdown → Jira wiki or ADF) | same body | same body in `description` |

Rules that do not change with the target: **preview first**, create only on explicit approval,
update existing items instead of duplicating, never copy secrets or PII.

---

## Language

- `OUTPUT_LANG` is `en` or `de`, **chosen per run**. The orchestrator asks; a specialist run with
  an unset value asks too. Neither language is assumed — English for international teams, de-CH
  German for the DACH market are equally first-class.
- German output follows the de-CH rules of `ISSUE-OUTPUT-STANDARD.md` (ss, never ß; German
  quotation marks; terminology per `TERMINOLOGY.md`).
- The run file carries the chosen language in `output_lang`; `summary` should carry at least that
  language. The exporter renders report labels in it.

---

## Evidence pack

- `evidence-manifest.json` lists every artifact a finding cites (`path`, `lines`, `finding_ids`,
  `controls`), with the **sha256 and size of the file as found in the audited checkout**
  (`--repo <path>`), the commit, and a generation timestamp.
- **Hashes only.** The manifest never copies file content, so secrets and PII stay where they are;
  an auditor re-hashes the checkout at review time to prove the evidence is unchanged.
- Artifacts that cannot be resolved in the checkout (live URLs, headers, configuration values) are
  listed under `unresolved`; the finding's `evidence` text remains the citation for them.
- Keep the whole `auditor-out/` directory together as the evidence pack; it is what an external
  auditor receives alongside the report.

---

## Limits

- The exporters **map**, they do not judge: every number and status comes from the run file the
  agent produced and validated.
- SARIF and OSCAL are minimal, structurally valid profiles; receiving tools with stricter
  expectations may need a mapping step (control catalog IDs, custom fields).
- Certification readiness is a technical assessment, never a certificate — the report and the
  OSCAL metadata say so in the generated text; do not remove that sentence.
