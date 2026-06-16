# Documentation & Developer Experience Audit — Master Orchestration Prompt

> **Mission:** Challenge any repository's documentation against the project's normative
> [`DOCUMENTATION-STANDARD.md`](../DOCUMENTATION-STANDARD.md) (Google-grade) and turn every gap
> into a concrete, German GitHub issue. Deploy a swarm of specialist agents to find where docs
> are missing, wrong, drifted from the code, hard to navigate, weakly written, inaccessible, or
> fail their reader's actual job. Every finding is evidence-backed, adversarially verified,
> **scored against the standard's 0–100 rubric**, and filed per
> [`ISSUE-OUTPUT-STANDARD.md`](../ISSUE-OUTPUT-STANDARD.md).
>
> **Universality:** Stack- and audience-agnostic. Works on a **local path or a GitHub URL**
> (fetch via `gh repo clone` / `gh api` when a URL is given). Applies to product/API docs, SDK
> references, open-source READMEs, internal engineering docs, runbooks, and onboarding material.
> The central tests are **conformance to the standard**, **doc–reality fidelity**, and
> **time-to-success**. Phase 0 detects the repo **profile** (library / application / service /
> CLI / monorepo) and scopes accordingly; non-applicable mandates are logged, never skipped
> silently.

---

## How to use this prompt

```
TARGET:       <local repo path OR GitHub URL — fetch via gh repo clone / gh api when a URL>
PROFILE:      <auto-detect (default) | library | application | service | cli | monorepo>
DOC_TYPES:    <README | API ref | SDK | guides/tutorials | runbooks | internal eng docs>
AUDIENCE:     <external devs | internal engineers | end users | mixed>
DATA_ACCESS:  <can run the documented commands / call the API to verify? or read-only>
OUTPUT_LANG:  <Deutsch (default) | English | ...>
STANDARD:     <DOCUMENTATION-STANDARD.md (default) | path to a custom standard>
ISSUE_TARGET: <owner/repo for gh issue creation — preview-first, create only on approval>
```

If unknown, Phase 0 infers the profile, audience, and intent from the repo itself and states its
assumptions. The standard is the yardstick; the rubric in it produces the score.

---

## Operating principles (binding for every agent)

1. **Evidence or it didn't happen.** Cite the concrete artifact: the doc file `:line`, the
   command that fails, the code `file:line` that contradicts the doc, the broken link, the
   missing page. No evidence → discarded.
2. **Verify, don't trust.** Documentation is audited against **reality**: run documented
   commands (where authorized), check env vars against what code reads, confirm code samples
   compile/use current APIs, click links. Every drift is a finding with both locations cited.
3. **Cite the reader's job.** Use the **Diátaxis** lens — tutorials (learning), how-to guides
   (tasks), reference (information), explanation (understanding) — and judge each doc against
   the job it's for. A reference written as a tutorial (or vice-versa) is a finding.
4. **Severity is earned.** P0–P3; a P0 actively misleads the reader on a critical path
   (wrong setup/deploy/security step) or blocks them from succeeding at all.
5. **Adversarial humility.** Every finding is attacked in Phase 3; pre-empt the refutation.
6. **Praise what is excellent.** Each specialist returns its top 3 "protect this" items.
7. **Fix-forward.** Every confirmed finding ships a concrete remediation: the corrected
   command, the missing section outlined, the rewritten passage, the link fixed.
8. **Score against the standard.** Grade every rubric dimension of
   [`DOCUMENTATION-STANDARD.md`](../DOCUMENTATION-STANDARD.md) (0–100) with per-dimension
   evidence, and apply the standard's own style rules to your *own* output: no emojis in
   headings, GitHub alerts instead of emoji, sentence-case, second person, present/active.

### Severity scale

| Level | Definition |
|---|---|
| **P0 — Critical** | Actively wrong on a critical path: a setup/deploy/security/data step that fails or misleads, or a documented command that breaks the reader's environment. |
| **P1 — High** | Blocks success: missing quickstart, broken onboarding step, undocumented required config/env var, code samples that don't run, no docs for a core feature. |
| **P2 — Medium** | Real friction: drift on non-critical steps, poor navigation/findability, inconsistent terminology, thin reference, stale screenshots. |
| **P3 — Low** | Polish: typos, formatting, tone, nice-to-have examples. |

Each finding gets **effort (S/M/L/XL)** and **priority = impact × confidence ÷ effort**.

---

## Phase 0 — Reconnaissance (run first, feeds every agent)

- **Fetch (if URL):** `gh repo clone <owner/repo>` or read via `gh api` to obtain the README,
  docs, and community-health files. Record the default branch and last-commit date.
- **Profile detection:** classify the repo as library / application / service / CLI / monorepo
  (from manifests, entry points, structure). The profile sets which standard sections are
  required vs not-applicable and re-weights the rubric.
- **Head-matter inventory:** does the README have a one-line value proposition, a badge row, a
  management summary, an architecture diagram (Mermaid), and a table of contents? Record what is
  present, missing, or weak — this is the highest-leverage area of the standard.
- **Community-health inventory:** LICENSE, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY.md,
  CHANGELOG.md, issue/PR templates, ARCHITECTURE.md/ADRs, repo description + topics.
- **Doc inventory:** every doc artifact (README, CONTRIBUTING, docs site pages, ADRs, API
  reference, inline doc-comments, CHANGELOG, runbooks) and the **doc type** of each (Diátaxis).
- **Reader & job map:** who reads this and what they're trying to accomplish — the 3–5
  **critical reader journeys** (e.g., "clone → run locally → pass tests", "first API call",
  "deploy to prod", "resolve incident X"). These get double coverage.
- **Reality sources:** the code, scripts, config, and API the docs describe — the ground truth
  every claim is checked against.
- **Reference bar:** 2–3 best-in-class docs for this profile to benchmark against.

Output: a structured brief distributed to all Phase 1 agents.

---

## Phase 1 — Specialist swarm (parallel agents)

### W1 — Onboarding & time-to-first-success
Walk the critical reader journeys literally as a new reader with only the docs. For
"clone → running": does every step exist, in order, and work? Identify the **exact step where a
competent newcomer gets stuck**. Measure (or estimate) time-to-first-success and time-to-first-
green-test / first-successful-API-call. A blocked happy path is P0/P1.

### W2 — Doc–code drift (the core verification pass)
Actively test claims against reality: documented commands exist in scripts/Makefile and run;
documented env vars match what the code reads (and `.env.example` is complete and current);
described directories/modules/endpoints still exist; config keys are accurate; version numbers
match. Every drift = a finding citing both the doc and the code location.

### W3 — Code samples & examples
Every code sample: does it compile/run, use current (non-deprecated) APIs, include necessary
imports/setup, and produce the stated result? Copy-pasteability, correctness of expected
output, and example coverage of the common use cases. Run them where authorized; otherwise
trace against the API. Broken samples on a getting-started page = P1.

### W4 — Completeness & coverage
What's undocumented that must be: setup, configuration, every public API/CLI flag/env var,
error/troubleshooting, security/permissions, deployment, and the "day-2" operational topics.
Map documented surface vs actual surface and list the gaps. Undocumented core feature = P1.

### W5 — Structure, navigation & findability
Information architecture: can a reader find the answer to their top 10 questions in ≤ 2 hops?
Diátaxis separation (tutorials vs how-to vs reference vs explanation not blended into mush),
table of contents, search, cross-linking, logical ordering, and progressive disclosure.
Orphan pages and dead-end navigation are findings.

### W6 — Clarity, correctness & writing quality
Reading level appropriate to the audience, unexplained jargon and undefined acronyms,
ambiguous instructions, passive/vague phrasing where a command is needed, accuracy of
explanations (not just clarity — is it *true*?), and "lying comments"/docs that describe
intended-but-not-actual behavior.

### W7 — Consistency & terminology
One term per concept across all docs and matching the product UI/API (not user/account/member
for the same thing), consistent formatting, heading style, code-block language tags, callout
conventions, and a shared voice. Inconsistency that causes reader confusion is graded here.

### W8 — API / reference documentation quality
For reference docs: every endpoint/function/parameter documented with types, defaults,
required/optional, return shapes, errors, and a runnable example; auth and rate-limit docs;
generated-from-source vs hand-written drift; OpenAPI/SDL/docstring completeness; and
versioning/changelog of the API surface.

### W9 — Maintainability & docs infrastructure
Are docs versioned with the code, reviewed in PRs, and tested (link-checkers, sample-runners,
lint)? Docs-as-code setup, ownership (who keeps them current?), staleness signals
(last-updated, "this page is X months old"), and the process that prevents future drift.
Docs with no maintenance mechanism are a recurring-drift finding.

### W10 — Contribution & community docs (OSS/internal)
CONTRIBUTING completeness (dev setup, branch/PR/commit conventions, test/lint commands, CLA),
issue/PR templates, code of conduct, architecture/ADR docs for contributors, decision records,
and the path from "I want to help" to "my PR is mergeable".

### W11 — Operational docs & runbooks (if present)
Runbooks for incidents, on-call guides, deployment/rollback procedures, and architecture/
dependency docs that an engineer needs at 3am. Accuracy here is checked against the actual
infra/CI. A wrong rollback step is P0.

### W12 — Repo head-matter (the standard's highest-leverage area)
Against `DOCUMENTATION-STANDARD.md` §1: is there a title with a one-line value proposition (and
**no emoji**)? A grouped badge row (5–10: CI, coverage, version, license, language, docs,
last-commit — and not over-badged)? A **management summary** a non-specialist can read? An
**architecture/overview diagram (Mermaid)** that renders and is caption-first? A table of
contents (for long READMEs)? Each missing head element is a finding; missing management summary
or required architecture diagram is P1.

### W13 — Writing quality vs the Google rules
Against `DOCUMENTATION-STANDARD.md` §4: sentence-case headings (not title case), second person
("you", not "we"), present tense, active voice, parallel list structure, scope + audience stated
up front, consistent terminology (one term per concept), abbreviations spelled out on first use,
code blocks language-tagged. Flag each systematic violation with a representative example.

### W14 — Accessibility & emoji policy
Against `DOCUMENTATION-STANDARD.md` §5: alt text on informative images, no information conveyed
by image/color/emoji alone, no directional language ("above/below"), sufficient contrast, and the
**emoji policy** — no emojis in titles/headings, no decorative emoji rows, GitHub alerts
(`> [!NOTE]`) instead of emoji callouts. Emoji-policy violations without information loss are P3;
information-only-via-emoji is P2.

Each agent returns a **dimension grade (A–F)** + justification and a **top-3 "protect this"**.

---

## Phase 2 — Cross-pollination barrier

Synthesis agent merges, **dedupes**, and flags **compound findings** (e.g., missing env var in
docs × a sample that needs it × no troubleshooting entry = guaranteed onboarding failure).

## Phase 3 — Adversarial verification

Every P0/P1 (and compound/uncertain P2) is attacked by skeptics: **The Refuter** (does the
command actually fail? is the doc really wrong, or is the reader expected to know X documented
elsewhere?), **The Context Defender** (is this intentionally out of scope for this doc's job/
audience? would the addition bloat it?), **The Impact Auditor** (re-derive which reader is
blocked and re-score). Survives with ≥ 2/3 confirmations; severity = median. Then a
**completeness critic**: "which reader journey wasn't walked end-to-end? which claim wasn't
verified against code?"

## Phase 4 — Benchmark

Compare structure, completeness, and time-to-success against the named best-in-class docs from
Phase 0 and the Diátaxis model. Transferable patterns, not "write better docs."

---

## Phase 5 — Synthesis & deliverables

In `OUTPUT_LANG`:

1. **Executive summary** (≤ 1 page): docs-health verdict, the single biggest reader-blocker,
   onboarding time today vs achievable, ceiling after remediation.
2. **Rubric scorecard (0–100):** score each dimension of `DOCUMENTATION-STANDARD.md` §6
   (Head-matter 20, Getting started 15, Usage & reference 15, Writing quality 15, Diátaxis 10,
   Repo-health 10, Maintainability 10, Accessibility & style 5), re-weighted for the detected
   profile, with per-dimension evidence. Report the total and the **grade band**
   (Gold 90–100 / Silver 75–89 / Bronze 60–74 / Needs-work 40–59 / Inadequate <40). Map the
   W1–W14 specialist findings onto these dimensions.
3. **Reader-journey map:** each critical journey annotated with where it currently breaks.
4. **Drift register:** every doc–code mismatch with both citations (the highest-value table).
5. **Verified findings register:** standard schema, sorted by priority; skeptic note on P0/P1.
6. **Strengths / "do not touch" list.**
7. **Remediation roadmap:** Quick Wins (≤ 1 day, e.g., "fix the broken setup command") →
   30/60/90 days, dependency-aware (fix drift before expanding), referencing IDs.
8. **Re-audit criteria:** measurable exit conditions per P0/P1 (e.g., "newcomer reaches green
   test in < 15 min using only docs").
9. **GitHub issues (mandatory)** per [`ISSUE-OUTPUT-STANDARD.md`](../ISSUE-OUTPUT-STANDARD.md) —
   see the dedicated section below.

### Appendices
A: killed findings + refutations. B: coverage map (doc × reader journey × agent). C: assumptions
registry. D: list of commands/samples actually executed vs reasoned.

---

## Issue output — mandatory (see [`ISSUE-OUTPUT-STANDARD.md`](../ISSUE-OUTPUT-STANDARD.md))

This audit's primary deliverable is GitHub issues — **German by default** (`OUTPUT_LANG`);
preview/dry-run first, created only on explicit authorization + repo access. Two-part contract:

1. **Tracking issue first** — `[AUDIT] Docs — Befund-Tracker & Roadmap`. Body: a management
   summary (rubric score + grade band, biggest reader-blocker), the rubric scorecard, a
   **priority-sorted checklist** (P0→P3, then effort) where each line links its child issue, and
   the Quick-Wins/30/60/90 roadmap. Labels: `audit`, `tracking`, `docs`.
2. **One issue per confirmed finding** — top-notch, German, each opening with its own
   **management summary** (2–3 sentences: what, impact, one-line recommendation), then the full
   finding (severity, standard section / Diátaxis job, doc + code locations, evidence, concrete
   **before/after** fix, effort, re-audit criterion). Labels: `audit`, `sev:p0…p3`,
   `dimension:<x>`, `effort:S|M|L`; back-link to the tracking issue.

For a low-scoring README, optionally attach a **ready-to-merge improved README draft** (built
from `templates/README.template.md`) to the tracking issue or open it as a PR. Create child
issues first, collect their numbers, then create/update the tracking issue so its checklist links
resolve. Detect existing audit issues by label and update rather than duplicate.

---

## Shared finding schema (all agents)

```json
{
  "id": "W2-003",
  "agent": "doc-code-drift",
  "title": "README setup uses a script that no longer exists",
  "severity": "P0",
  "confidence": 0.97,
  "effort": "S",
  "docs": ["README.md:42"],
  "evidence": "README says `npm run setup`, but package.json:scripts (package.json:18) has no `setup` entry; the script was renamed to `bootstrap` in a refactor. The documented command errors out.",
  "reader_job": "First-run onboarding — the very first command a newcomer types fails",
  "fix": "Update README to `npm run bootstrap` (or re-add a `setup` alias). Add a link-and-sample check to CI so this drift can't recur.",
  "expected_impact": "Unblocks step 1 of onboarding for every new developer; closes a recurring-drift class with the CI check",
  "anticipated_refutation": "'Experienced devs will figure it out' — the docs exist precisely for those who can't; a failing first command erodes trust in every later step."
}
```

---

## Definition of done (self-check before delivering)

- [ ] The repo profile was detected and the rubric was scored 0–100 with per-dimension evidence.
- [ ] Head-matter was checked against the standard (value line, badges, management summary,
      architecture diagram, ToC); each gap is a finding.
- [ ] Writing-quality (Google rules) and accessibility/emoji policy were checked, with examples.
- [ ] Every critical reader journey was walked end-to-end with docs only; none skipped silently.
- [ ] Documented commands, env vars, and code samples were *actually verified* against reality.
- [ ] `.env.example`-vs-code and command-vs-script drift were actively tested, not assumed.
- [ ] Each doc was judged against its Diátaxis job and audience.
- [ ] The drift register cites both doc and code locations for every mismatch.
- [ ] Issues follow `ISSUE-OUTPUT-STANDARD.md`: tracking issue first (priority-sorted, with
      management summary), then one German issue per finding, each with its own management
      summary; preview-first.
- [ ] My own output honors the standard's style: no emojis in headings, GitHub alerts, sentence
      case, second person.
- [ ] Coverage and "executed vs reasoned" appendices are complete and honest.
- [ ] The target was left unmodified; any executed commands were read-only/safe and authorized.
```
