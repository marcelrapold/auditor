# Changelog

Alle nennenswerten Änderungen an diesem Projekt werden hier dokumentiert.

Das Format folgt [Keep a Changelog](https://keepachangelog.com/), die Versionierung
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- `web/`: ZVV-Atlas-conformant Next.js 16 landing page (Tailwind v4, shadcn/ui, next-themes,
  framer-motion) with auditor's own brand and no ZVV assets. Deployed to `auditor.rapold.io`.

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

[Unreleased]: https://github.com/marcelrapold/auditor/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/marcelrapold/auditor/releases/tag/v0.3.0
[0.2.0]: https://github.com/marcelrapold/auditor/releases/tag/v0.2.0
[0.1.0]: https://github.com/marcelrapold/auditor/releases/tag/v0.1.0
