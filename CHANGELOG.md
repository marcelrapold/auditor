# Changelog

Alle nennenswerten Änderungen an diesem Projekt werden hier dokumentiert.

Das Format folgt [Keep a Changelog](https://keepachangelog.com/), die Versionierung
[Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.11.0] - 2026-09-16

### Added
- **Business output.** [`REPORT-OUTPUT-STANDARD.md`](REPORT-OUTPUT-STANDARD.md) — the contract for
  everything that leaves the audit besides issues: one canonical `auditor-out/audit-run.json`
  ([`schemas/audit-run.schema.json`](schemas/audit-run.schema.json),
  [`schemas/finding.schema.json`](schemas/finding.schema.json)) from which
  `scripts/export-findings.mjs` derives, dependency-free and deterministically, the **executive
  report** (Markdown → DOCX/PDF via pandoc), **SARIF 2.1.0** for GitHub Code Scanning, **OSCAL 1.1.2**
  assessment results for GRC tools, **`gap-matrix.csv` / `findings.csv`** for Vanta, Drata,
  Secureframe and Jira, and an **evidence manifest** with sha256 per cited artifact (hashes only, no
  content). The script validates the run file (`--validate`), ships with `node:test` coverage, and
  runs in the `prompts` CI workflow.
- **Issue targets beyond GitHub.** `ISSUE_TARGET` accepts `github:owner/repo`, `jira:KEY`,
  `linear:TEAM` and `servicenow:<url>`, with a field mapping (severity → priority, finding ID in the
  title, `auditor` label, tracker as Epic / Project / Problem) in the report-output standard.
- Orchestrator **Step 5b — Business exports** (write, validate, export, hand over `auditor-out/`);
  MCP `get_standard("report-output")`; a fourth yardstick card on the landing page.

### Changed
- **Output language is chosen per run.** `OUTPUT_LANG` no longer defaults to German (or English —
  the 13 prompts disagreed); every prompt now asks when unset and treats English and de-CH German as
  equally first-class. `ISSUE-OUTPUT-STANDARD.md` 1.3.0 records the rule, the issue targets and the
  canonical-source requirement.
- `CONTROL-CROSSWALK.md` and `REPORT-OUTPUT-STANDARD.md` are part of the checksummed trust anchor.

## [0.10.0] - 2026-09-15

### Added
- **Certification readiness.** The orchestrator gains `READINESS_TARGET` with four targets —
  `soc2`, `iso27001`, `iso42001-ai-act`, `nis2-cra` — and a Step 4b that inverts the findings into
  a control-by-control gap matrix (status `implemented` / `partial` / `missing` / `not-assessable`
  / `n/a`), classifies nonconformities as Major / Minor / OFI, computes a technical control
  readiness score with a time-to-audit-ready estimate, and produces the target's deliverables
  (Statement of Applicability draft, risk-register seed, AI-system inventory with risk tier,
  reporting-capability check, evidence register).
- **`CONTROL-CROSSWALK.md`** — one theme-based mapping (34 themes) from findings to the control
  IDs of SOC 2 TSC, ISO/IEC 27001:2022 Annex A, ISO/IEC 42001:2023 Annex A + EU AI Act, NIS2
  Art. 21/23, CRA Annex I / Art. 14, and the Swiss revDSG (GDPR alongside), with the organisational
  controls listed as not assessable from code, a fine-exposure vocabulary, and the scoring rules.
  It is part of the checksummed trust anchor and exposed by the MCP server as
  `get_standard("control-crosswalk")`.
- **`FRAMEWORK-VERSIONS.md`** — a dated register of every framework edition the prompts cite, with
  a quarterly review procedure.
- **Three business fields in every finding schema** — `controls`, `deal_blocker`, `fine_exposure` —
  enforced across all 13 audits by the `prompts` CI gate; `ISSUE-OUTPUT-STANDARD.md` 1.2.0 adds
  the matching `control:<Framework>-<ID>` and `deal-blocker` labels, the business view and the
  readiness section of the tracking issue.
- **Swiss revDSG** in the `compliance-privacy` audit (jurisdiction `CH`, Art. 6–9, 12, 16–17,
  19–25, 28, 32, personal fines under Art. 60–63, FDPIC breach notification) alongside GDPR;
  **ISO 42001 / EU AI Act** control view in the `ai-llm` audit; **ISO 27001 / SOC 2** control view
  in the `security` and `infrastructure` audits.
- **Landing page:** a "Certification readiness" section with the four targets and a third yardstick
  card for the crosswalk; `llms.txt` documents the readiness protocol.
- Legal pages (`/privacy`, `/imprint` and the German mirrors) and the analytics consent gate
  (audit findings #168–#170); the "Audit Orchestrator" hero artwork with the emerald particle field.

### Changed
- Dependabot no longer groups major version bumps into the weekly groups.
- `.gitattributes` normalises every text file to LF so the byte-for-byte checksums verify on
  Windows checkouts too.

### Fixed
- Stale references: `TTDSG` → `TDDDG` (renamed May 2024), OWASP `A01:2021` → `A01:2025`, OWASP LLM
  `LLM02` → `LLM05:2025`, and "DORA" disambiguated as DevOps Research and Assessment metrics, not
  the EU Digital Operational Resilience Act.
- `CONTRIBUTING.md` named a hand-run `sha256sum` command whose output format differs from what CI
  verifies (#174); it now points at `node scripts/checksums.mjs`.

## [0.9.1] - 2026-06-26

### Changed
- **`content` audit — formalized the localisation control inputs.** `LOCALISATION_MODE` gains a
  third value `translate-and-rewrite` (produce target copy from the source when no usable target
  draft exists, held to the same native-first bar), and both `LOCALISATION_MODE` and
  `TERMINOLOGY_POLICY` now have an explicit "control effect" spec defining what each value does — so
  a run's localisation behaviour is unambiguous rather than inferred. No structural change; the gate
  stays green (13/13).

## [0.9.0] - 2026-06-26

### Added
- **MCP server (`mcp/`)** — a dependency-light stdio Model Context Protocol server that exposes the
  verified, version-pinned audit prompts as native agent tools (`list_audits`, `get_audit_prompt`,
  `get_orchestrator`, `get_standard`) for Claude Desktop, Claude Code, Cursor, and any MCP-capable
  agent. Mirrors the canonical `AUDITS` catalogue and reads prompts live from `audit-prompts/`.
- **Per-audit detail pages** — `/audits/<key>` (German mirror `/de/audits/<key>`) with long-form
  copy, an audit-specific activation prompt, and per-audit Open Graph images, for deep-linking and
  SEO. Short vanity slugs (e.g. `/security-audit`, `/a11y-audit`) 308-redirect to the canonical path.
- **Sample-report gallery** — `/reports` and `/reports/<slug>` rendering the real #97 self-audit run
  (scorecard, not-applicable reasons, headline findings, and the cross-audit dedup exhibit), every
  field mapped to a verifiable GitHub artifact and localized EN/DE.
- **Per-audit photographic hero images** ("Verified Systems Lab") shown on the audit detail pages and
  the homepage audit cards, auto-detected via the `public/<key>.webp` convention.
- **Native-language & locale integrity (`C15`)** in the `content` audit — a localization lens with a
  locale input contract (`LOCALE`/`SOURCE_LANGUAGE`/`LOCALISATION_MODE`/`TERMINOLOGY_POLICY`), a
  Phase-0 language brief + terminology matrix, a "Native Reader" blind-back-translation skeptic
  (Phase 3), a mode-dependent scorecard dimension, and de-CH definition-of-done checks, so an audit
  yields original-sounding copy in the target locale rather than translated source. de-CH (Swiss)
  defaults to `ss`, never `ß`.
- **`TERMINOLOGY.md`** — a bilingual EN/de-CH glossary (Binding + Advisory tiers) that serves as the
  content audit's `STYLE_REFERENCE`; linked from `CONTRIBUTING.md`.

### Changed
- The landing page is now a multi-route site (home, per-audit details, reports) sharing a common
  header/footer/nav chrome, rather than a single page.
- Vercel deploys are git-connected and automatic (production on push to `main`, previews per branch),
  with the monorepo build unblocked (Root Directory = `web`).
- **Cross-cutting de-CH locale rule** in `ISSUE-OUTPUT-STANDARD.md` (Swiss orthography, German
  quotation marks, terminology consistency) inherited by all 13 audits, and the issue-label axis
  canonicalized to `dimension:`/`effort:` (with `locale:de-CH`); `DOCUMENTATION-STANDARD.md`
  orthography aligned to Swiss `ss`.
- **Native Swiss-German site copy** — the entire German site (`web/lib/i18n.ts` and all 13 audit
  detail pages) re-modeled into original de-CH by dogfooding the new `C15` lens on this repo:
  English sentence architecture and Denglish removed, terminology unified, every protected technical
  term preserved. Locked in by a `web/lib/locale-de-ch.test.ts` regression guard (no `ß`, a
  morphology-aware Denglish denylist) and a corrected principle-translation assertion.

### Fixed
- **CI/release hardening** — automated `CHECKSUMS.txt` regeneration and verification, a version-pin
  verification gate so release pins can't silently drift, an ESLint / jsx-a11y gate for `web/`, and a
  CI workflow for the `mcp/` package.
- Dropped dead exports in `reports.ts` flagged by the lean audit.

## [0.8.0] - 2026-06-18

### Added
- **`lean` audit** — the 13th template: a repo-leanness / anti-AI-slop / dependency-transparency
  audit that challenges dead code, redundancy, unused/phantom dependencies, and bloat, and proposes
  a safe strip-down **gated against over-deletion** (a Phase-0 Protected/Load-Bearing Manifest,
  Chesterton's Fence, a four-class removal register, and a "Resurrector"/"Fence-Keeper" adversarial
  pass). Maps to Software Engineering at Google (deprecation/dependency management), OWASP Component
  Analysis, SLSA, and YAGNI. Wired into the orchestrator menu + index, `llms.txt`, the README table/
  badge, ARCHITECTURE, the landing page, and the derived audit count (now 13).

### Changed
- Landing-page overhaul (from a dogfooded `content` audit and follow-up non-design reviews): a Proof
  section with the real #97 self-audit backlog exhibit, scorecard, and a filed finding; copy-to-
  clipboard activation CTAs; grounded claims and a Trust/FAQ block; a visual "input → six-phase
  pipeline → GitHub issues" process diagram in "How it works"; inline jargon tooltips; plus
  accessibility, performance (EN `og:image`, hreflang), SEO and German-copy fixes. All 23
  content-audit findings (#100–#122) closed.

## [0.7.0] - 2026-06-17

### Added
- **`content` audit** — the 12th template: a content & messaging audit that challenges the thesis
  (steelmans the strongest counter-argument), measures information gain against best-in-class
  references, and ships concrete before/after rewrites, filed as GitHub issues. Wired into the
  orchestrator menu, `llms.txt`, the landing page, the audit count, and a content scorecard rubric.

## [0.6.0] - 2026-06-17

### Added
- Per-locale root layouts (route groups `(en)`/`(de)`) so `/de` serves `<html lang="de">`; a German
  Open Graph image and per-route Twitter/OG metadata.
- `scripts/bump-version.mjs` + `RELEASING.md`: single-source the release tag pinned in the
  orchestrator and `llms.txt`; a `CHECKSUMS.txt` verification gate (`sha256sum -c`) in the
  `prompts` workflow.
- Escape-to-close + focus-return on the mobile menu; reduced-motion handling for smooth scrolling.

### Changed
- English copy/metadata now say "GitHub issues in German or English" (was "German"); audit count
  is derived from `AUDIT_COUNT` instead of a hardcoded literal.
- CI hardening: GitHub Actions pinned to commit SHAs, `concurrency` + `timeout-minutes` on every
  workflow, `prompts` Node version sourced from `.nvmrc`; Dependabot grouping/labels; `engines.node`
  aligned to `>=22`; `esbuild` override for the dev toolchain; HSTS response header.
- Fixed the `check-prompts.mjs` legacy-severity guard (escaped alternation) and added a self-test.

## [0.5.0] - 2026-06-17

### Added
- **Orchestrator entry point:** `audit-prompts/full-audit-master-prompt.md` + `/llms.txt` — point
  an AI agent at `auditor.rapold.io` and it asks output language + which audits, then runs them.
- **DE/EN language switcher** on the landing page (`/` and `/de`, hreflang, i18n dictionary).
- **Prompt-structure CI gate** (`scripts/check-prompts.mjs` + `prompts` workflow) enforcing the
  canonical skeleton across all 11 audits, and a `CHECKSUMS.txt` for fetched prompts.
- Vercel Analytics; a `web/` CI workflow (typecheck, Vitest smoke test, build); Dependabot.

### Changed
- All 11 prompt instructions standardized to **English**; output language is runtime via
  `OUTPUT_LANG`. The security prompt was rewritten to the shared 6-phase skeleton.
- Security hardening (from the dogfooded security audit): response security headers (CSP,
  X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy) in `web/vercel.json`; the
  orchestrator and `llms.txt` pin fetches to a release tag and treat fetched content as untrusted;
  `persist-credentials: false` in CI; secret scanning + push protection + Dependabot security
  updates enabled.
- `next` 16.2.9 / React 19.2.7 + a postcss override (`npm audit` = 0).

## [0.4.0] - 2026-06-17

### Added
- `web/`: ZVV-Atlas-conformant Next.js 16 landing page (Tailwind v4, shadcn/ui, next-themes)
  with auditor's own brand and no ZVV assets, deployed to `auditor.rapold.io`.
- Repo-health & docs hardening (from the dogfooded documentation audit): `SECURITY.md`,
  `CODE_OF_CONDUCT.md`, `ARCHITECTURE.md`, a pull-request template, an issue-template chooser,
  and a docs CI (`markdownlint`, `lychee` link-check, emoji-in-heading guard).

### Changed
- README: added an example config block, a version badge, a web/ cross-reference, caption-first
  diagrams, and resolved acronyms. De-emojified the headings of the security template.

## [0.3.0] - 2026-06-16

### Added
- `DOCUMENTATION-STANDARD.md` (deutsch, kanonisch) und `DOCUMENTATION-STANDARD.en.md` (englischer
  Spiegel): normativer Google-Grade-Dokumentationsstandard mit 5 Profilen und 0–100-Rubrik.
- `ISSUE-OUTPUT-STANDARD.md`: verbindlicher Issue-Ausgabe-Standard für alle Audits — zuerst ein
  Tracking-Issue (priorisierter Index), dann pro Befund ein Issue, jeweils mit Management-Summary.
- `templates/README.template.md`: kanonische README-Vorlage gemäß Standard.
- Repo-Health-Dateien: `CONTRIBUTING.md`, `CHANGELOG.md`, Issue-Template `doc-quality-finding`.

### Changed
- Alle 11 Audit-Vorlagen referenzieren jetzt den Issue-Ausgabe-Standard (Tracking-Issue + Issues
  pro Befund, deutsch, Management-Summary je Ticket).
- `documentation-audit`-Vorlage zum standardgetriebenen „Doc-Quality Challenger" ausgebaut
  (GitHub-URL-Ziel, Profil-Erkennung, Rubrik-Scoring, deutsche Issue-Ausgabe).
- README an den neuen Standard angepasst (Kopf mit Badges, Management-Summary, Architektur-
  Diagramm, Inhaltsverzeichnis; Emojis aus Überschriften entfernt).

## [0.2.0] - 2026-06-15

### Added
- Drei Audit-Vorlagen: `compliance-privacy`, `accessibility`, `documentation`.
- Mermaid-Diagramm der Phasen-Pipeline im README.

## [0.1.0] - 2026-06-13

### Added
- Erste Veröffentlichung der Audit-Vorlagen-Sammlung: `security` (deutsch), `repo`, `frontend`,
  `api`, `performance`, `data`, `infrastructure`, `ai-llm`.
- README, MIT-Lizenz, `.gitignore`.

[Unreleased]: https://github.com/marcelrapold/auditor/compare/v0.9.1...HEAD
[0.9.1]: https://github.com/marcelrapold/auditor/releases/tag/v0.9.1
[0.9.0]: https://github.com/marcelrapold/auditor/releases/tag/v0.9.0
[0.8.0]: https://github.com/marcelrapold/auditor/releases/tag/v0.8.0
[0.7.0]: https://github.com/marcelrapold/auditor/releases/tag/v0.7.0
[0.6.0]: https://github.com/marcelrapold/auditor/releases/tag/v0.6.0
[0.5.0]: https://github.com/marcelrapold/auditor/releases/tag/v0.5.0
[0.4.0]: https://github.com/marcelrapold/auditor/releases/tag/v0.4.0
[0.3.0]: https://github.com/marcelrapold/auditor/releases/tag/v0.3.0
[0.2.0]: https://github.com/marcelrapold/auditor/releases/tag/v0.2.0
[0.1.0]: https://github.com/marcelrapold/auditor/releases/tag/v0.1.0
