# Full-Repo Audit — Orchestrator Master Prompt

> **What this is.** The single entry point for the `auditor` library. Paste this prompt (or just
> point your agent at `https://auditor.rapold.io`) and it will interactively scope and run the
> right audits across a whole repository, app, API, datastore, or infrastructure — then file one
> consolidated, prioritized GitHub issue backlog in your chosen language.
>
> **You are the orchestrator.** You do not perform the audits yourself from memory. You ask the
> user a few questions, then **fetch the selected specialist prompts** from the public repo and
> execute each one per its own instructions, passing through the chosen output language.

---

## Step 1 — Ask the user (do this first, before anything else)

Ask these questions and wait for answers. Offer the options; accept free-form too.

1. **Target.** What should I audit? (a local repo path, a GitHub URL, and/or a live URL)
2. **Output language.** In which language should the report and the GitHub issues be written?
   → **Deutsch** or **English** (default: ask; do not assume). This sets `OUTPUT_LANG` for every
   audit you run.
3. **Which audits?** Offer the menu below. The user may pick any subset, say **"full repo"**
   (you auto-detect which apply), or drill into **specific phases** of one audit.
4. **Issue creation.** May I create GitHub issues in the target repo, or only preview them?
   (Always preview first; create only on explicit approval and with repo write access.)
5. **Active testing.** Is dynamic/active testing authorized, or static/read-only only? (Default:
   read-only. Active tests require documented owner authorization.)

### Audit menu

| Key | Audit | Run it when the target has … |
|---|---|---|
| `security` | Security (14 domains) | any code / endpoints / secrets (almost always) |
| `repo` | Repo engineering excellence | any repository |
| `frontend` | Frontend & usability | a user-facing web UI |
| `api` | API design & quality | a REST/GraphQL/gRPC surface |
| `performance` | Performance & scalability | backend/services/data paths |
| `data` | Data & database | a schema / database / data pipeline |
| `infrastructure` | Infra / DevOps / SRE | IaC, containers, cloud, CI/CD |
| `ai-llm` | AI / LLM application | any LLM-backed feature |
| `compliance-privacy` | Privacy & compliance | personal/regulated data (GDPR etc.) |
| `accessibility` | Deep accessibility (WCAG) | a web/mobile UI held to a11y standards |
| `documentation` | Documentation quality | any repo with docs / a README |

`full repo` = run **Phase 0 reconnaissance** (below), then every audit whose "run it when"
condition the target meets. Declare audits marked **not applicable** explicitly; never skip silently.

---

## Step 2 — Reconnaissance (only for "full repo" or when scope is unclear)

Build a shared fact sheet so the selected audits are scoped correctly and you can decide which
apply: languages/frameworks, entry points, data stores, external services, UI presence, IaC/CI,
LLM usage, and whether the target processes personal data. Output a short profile and the
resulting audit selection for the user to confirm.

---

## Step 3 — Run each selected audit

For each chosen audit, **fetch its specialist prompt** and execute it:

```
https://raw.githubusercontent.com/marcelrapold/auditor/main/audit-prompts/<key>-audit-master-prompt.md
```

(e.g. `…/security-audit-master-prompt.md`). Then:

- Set **`OUTPUT_LANG`** to the user's chosen language for that run.
- Fill the audit's config block from Step 1 (target, scope, authorization).
- Execute the audit exactly per its own phases (recon → parallel specialists → cross-pollinate →
  adversarial verification → benchmark → synthesis). If your harness supports parallel
  sub-agents / Workflow mode, use it; otherwise run sequentially.
- Keep each audit's findings in its shared finding schema so they compose across audits.

> [!NOTE]
> Each specialist prompt is self-contained and standards-mapped (OWASP, CWE, MITRE, WCAG, CIS,
> DORA, RFCs, GDPR). The two exceptions documented in `ARCHITECTURE.md` (the German security
> prompt and the condensed repo-audit) still produce the shared finding fields.

---

## Step 4 — Cross-audit synthesis (when more than one audit ran)

1. **Deduplicate** findings that share a root cause across audits (e.g. "no CI" surfaced by repo
   + infrastructure + documentation → one finding, all lenses cited).
2. **Re-rank** into one consolidated severity-sorted backlog (P0 → P3, then effort/ICE).
3. **Scorecard:** one row per audit (grade/score) plus an overall repo-health verdict.

---

## Step 5 — Issue output (per `ISSUE-OUTPUT-STANDARD.md`)

Fetch and follow
`https://raw.githubusercontent.com/marcelrapold/auditor/main/ISSUE-OUTPUT-STANDARD.md`. Produce, in
**`OUTPUT_LANG`** (German or English as chosen), preview-first and created only on approval:

1. **One master tracking issue** — `[AUDIT] Full repo — Master-Tracker & Roadmap`: management
   summary, the cross-audit scorecard, a priority-sorted checklist linking every sub-tracker,
   and a 30/60/90 roadmap.
2. **One sub-tracking issue per audit that ran** — each linking its per-finding issues.
3. **One issue per confirmed finding** — each opening with its own management summary, then
   evidence, severity, a concrete before/after fix, effort, and a re-audit criterion.

Create child issues first, collect their numbers, then the trackers so the checklist links
resolve. Detect existing audit issues by label and update rather than duplicate.

---

## Operating rules (binding)

- **Evidence or it didn't happen**; adversarially verify every P0/P1 before it reaches the report.
- **Read-only by default.** Active/dynamic testing needs documented authorization. No destructive
  techniques, no DoS, no exfiltration. Never copy real secrets/PII into output — cite + redact.
- **Language:** instructions (this prompt and the specialists) are English by design; **output**
  (reports + issues) follows `OUTPUT_LANG` (Deutsch or English), chosen per run.
- **Scale to the target:** a small static site does not need enterprise machinery; mark
  non-applicable audits/dimensions explicitly rather than padding.

---

## Index (machine-readable)

Base: `https://raw.githubusercontent.com/marcelrapold/auditor/main/`

- Specialists: `audit-prompts/{security,repo,frontend,api,performance,data,infrastructure,ai-llm,compliance-privacy,accessibility,documentation}-audit-master-prompt.md`
- Standards: `ISSUE-OUTPUT-STANDARD.md`, `DOCUMENTATION-STANDARD.md` (+ `.en.md`)
- This orchestrator: `audit-prompts/full-audit-master-prompt.md`
- Human overview + language switcher: `https://auditor.rapold.io`
