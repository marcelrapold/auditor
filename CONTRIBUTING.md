# Contributing

Danke für deinen Beitrag. Dieses Repo ist eine Sammlung von Audit-Master-Prompts plus den
Standards, die sie durchsetzen. Bitte halte beide Konventionen ein.

## Dokumentation

Jede Markdown-Datei folgt dem [`DOCUMENTATION-STANDARD.md`](DOCUMENTATION-STANDARD.md)
(englisch: [`DOCUMENTATION-STANDARD.en.md`](DOCUMENTATION-STANDARD.en.md)). Kurz:

- Überschriften in Satz-Schreibweise, **keine Emojis in Überschriften/Titeln**.
- Zweite Person, Präsens, Aktiv; kurze Sätze; parallele Listen.
- Hinweise als GitHub-Alerts (`> [!NOTE]`, `> [!TIP]`, `> [!WARNING]`) statt Emoji.
- Keine toten Links; keine Doku-Code-Drift.

## Eine neue Audit-Vorlage beitragen

Neue Vorlagen folgen dem Hausschema, damit sie mit den übrigen zusammenpassen:

1. **Mission + Universality** (was geprüft wird; warum stack-agnostisch).
2. **Operating principles** (evidence-bound, cite-the-standard, severity-earned, adversarial,
   praise-the-good, no-silent-truncation, fix-forward).
3. **Severity-Skala** (P0–P3) + Aufwand + Priority/ICE-Score.
4. **Phasen** 0 Recon → 1 paralleler Schwarm → 2 Dedupe → 3 adversarielle Verifikation →
   4 Benchmark → 5 Synthese.
5. **Shared finding schema** (JSON) und **Definition of Done**.
6. **Issue-Ausgabe** nach [`ISSUE-OUTPUT-STANDARD.md`](ISSUE-OUTPUT-STANDARD.md) — verbindlich:
   zuerst ein Tracking-Issue (priorisierter Index + Management-Summary + Roadmap), dann pro
   Befund ein Issue mit eigener Management-Summary. Standardsprache der Issues: Deutsch.

Halte Vorlagen provider-agnostisch, mappe Befunde auf anerkannte Standards und mache jede
Empfehlung sofort umsetzbar.

## Pull-Requests

- Ein PR pro thematischer Änderung; aussagekräftige Commit-Nachrichten.
- Aktualisiere [`CHANGELOG.md`](CHANGELOG.md) unter `[Unreleased]`.
- Versionierung nach [SemVer](https://semver.org/).

## Release-Surface (Prompts und Checksummen)

- Beim Editieren eines `audit-prompts/*.md` oder eines Standards die `CHECKSUMS.txt` regenerieren
  (`sha256sum audit-prompts/*.md ISSUE-OUTPUT-STANDARD.md DOCUMENTATION-STANDARD*.md > CHECKSUMS.txt`).
  Die `prompts`-CI prüft das mit `sha256sum -c` und schlägt sonst fehl.
- Die in URLs gepinnte Release-Version wird **nur beim Release** gebumpt — über
  `node scripts/bump-version.mjs vX.Y.Z`, nie von Hand. Siehe [`RELEASING.md`](RELEASING.md).

## Verhalten und Sicherheit

- Es gilt der [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) (Contributor Covenant).
- Schwachstellen bitte **vertraulich** melden — siehe [`SECURITY.md`](SECURITY.md), nicht als öffentliches Issue.
