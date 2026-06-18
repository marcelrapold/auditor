# Changelog

Alle nennenswerten Änderungen an diesem Projekt werden hier dokumentiert.

Das Format folgt [Keep a Changelog](https://keepachangelog.com/), die Versionierung
[Semantic Versioning](https://semver.org/).

## [Unreleased]

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

[Unreleased]: https://github.com/marcelrapold/auditor/compare/v0.8.0...HEAD
[0.8.0]: https://github.com/marcelrapold/auditor/releases/tag/v0.8.0
[0.7.0]: https://github.com/marcelrapold/auditor/releases/tag/v0.7.0
[0.6.0]: https://github.com/marcelrapold/auditor/releases/tag/v0.6.0
[0.5.0]: https://github.com/marcelrapold/auditor/releases/tag/v0.5.0
[0.4.0]: https://github.com/marcelrapold/auditor/releases/tag/v0.4.0
[0.3.0]: https://github.com/marcelrapold/auditor/releases/tag/v0.3.0
[0.2.0]: https://github.com/marcelrapold/auditor/releases/tag/v0.2.0
[0.1.0]: https://github.com/marcelrapold/auditor/releases/tag/v0.1.0
