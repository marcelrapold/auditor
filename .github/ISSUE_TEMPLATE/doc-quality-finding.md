---
name: Audit-Befund (Doku-Qualität)
about: Ein einzelner, durch ein Audit bestätigter Befund — gemäß ISSUE-OUTPUT-STANDARD.md
title: "[P?][Dimension] Kurzbeschreibung des Befunds"
labels: ["audit", "docs"]
---

> [!NOTE]
> **Management-Summary.** <2–3 Sätze: was ist das Problem, welche Auswirkung hat es, und die
> Empfehlung in einem Satz.>

**Schweregrad:** P0 | P1 | P2 | P3
**Dimension / Standard:** <z. B. Repo-Kopf — DOCUMENTATION-STANDARD §1 / WCAG SC … / OWASP …>
**Rubrik-Punkte (falls zutreffend):** <x/20>

## Fundort
<`pfad/datei`:Zeile, Abschnitt, URL oder Artefakt.>

## Nachweis
<Konkreter Ausschnitt oder Beobachtung. Keine echten Secrets/PII — redigieren.>

## Auswirkung
<Wen trifft es und wie?>

## Handlungsempfehlung (Vorher/Nachher)
```diff
- <vorher>
+ <nachher>
```

## Aufwand und Re-Audit-Kriterium
**Aufwand:** S | M | L · **Abnahme:** <messbare Bedingung, ab der der Befund als behoben gilt.>

---
Teil von #<tracking-issue-nummer>
