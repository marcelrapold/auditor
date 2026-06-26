# Issue-Ausgabe-Standard (verbindlich für alle Audits)

Jedes Audit dieser Sammlung endet mit derselben, erstklassig dokumentierten GitHub-Issue-Ausgabe.
Dieser Standard ist **verbindlich** und wird von jeder Vorlage in `audit-prompts/` referenziert.

> [!NOTE]
> **Management-Summary.** Nach der adversariellen Verifikation überführt jedes Audit seine
> bestätigten Befunde in GitHub-Issues — **standardmässig auf Deutsch**. Zuerst entsteht **ein
> Tracking-Issue** (der Index aller Sub-Aufgaben, nach Priorität sortiert, mit Management-Summary,
> Scorecard und Roadmap), danach **pro Befund ein eigenes Issue**, jedes mit eigener
> Management-Summary und konkreter Vorher/Nachher-Handlungsempfehlung. Das echte Anlegen erfolgt
> **erst nach Vorschau und ausdrücklicher Freigabe**.

Version 1.1.0 · Sprache der Issues: standardmässig Deutsch (`OUTPUT_LANG` überschreibbar)
Neu in 1.1.0: de-CH-Orthografie (durchgehend ss) und der `dimension:`/`effort:`-Label-Kanon sind verbindlich.

---

## Grundregeln

- **Auslöser:** läuft nach Phase 3 (Verifikation) und der Synthese. Nur **bestätigte** Befunde
  werden zu Issues; Hypothesen bleiben getrennt im Bericht.
- **Sprache:** Deutsch als Standard. Pro Lauf via `OUTPUT_LANG` änderbar (z. B. für englische Repos).
- **Locale & de-CH.** Die deutsche Issue-Ausgabe nutzt Schweizer Orthografie (durchgehend ss, kein
  Eszett — Ausnahme nur unveränderliche Eigennamen, Code, Rechtstitel, wörtliche Zitate), deutsche
  Anführungszeichen „…" (nie ein gerades ASCII-Schlusszeichen) und einheitliche Terminologie gemäss
  Projekt-Glossar ([`TERMINOLOGY.md`](TERMINOLOGY.md)). Das gilt für **alle** Audits und ist pro Lauf
  via `OUTPUT_LANG`/Locale überschreibbar.
- **Vorschau zuerst.** Immer ein Trockenlauf (vollständiger Issue-Text als Markdown im Bericht).
  Echtes Anlegen nur bei **ausdrücklicher Freigabe** und vorhandenem Repo-Zugriff (`gh issue create`).
- **Idempotenz.** Vor dem Anlegen bestehende Audit-Issues per Label-Suche (`audit`, `<audit-typ>`)
  erkennen und **aktualisieren statt duplizieren**.
- **Keine Geheimnisse.** Niemals echte Secrets/PII in Issues — Fundort nennen, Wert redigieren.

---

## Teil 1 — Das Tracking-Issue (zuerst)

Ein einzelnes „Epic"/Index-Issue, das alle Sub-Aufgaben bündelt.

- **Titel:** `[AUDIT] <Audit-Name> — Befund-Tracker & Roadmap`
- **Labels:** `audit`, `tracking`, `<audit-typ>` (z. B. `security`, `performance`, `docs`)
- **Body:**
  1. **Management-Summary** (3–5 Sätze): Gesamturteil, Score/Note, grösstes Risiko, realistisches
     Ziel nach Behebung. Für Leitung lesbar.
  2. **Scorecard** (Tabelle): Dimensionen × Note/Score × Befundzahl je Schweregrad.
  3. **Priorisierte Aufgabenliste** als Checkboxen, sortiert **P0 → P3**, innerhalb gleicher
     Priorität nach Aufwand/ICE. Jede Zeile verlinkt das jeweilige Sub-Issue:
     ```markdown
     ## Offene Aufgaben (nach Priorität)
     - [ ] #124 — P0 — SQL-Injection in /orders (Aufwand: M)
     - [ ] #125 — P0 — Klartext-Secret in CI (Aufwand: S)
     - [ ] #126 — P1 — Fehlende Rate-Limits an /login (Aufwand: M)
     - [ ] #127 — P2 — Inkonsistente Fehlerantworten (Aufwand: L)
     ```
  4. **Roadmap:** Sofort (≤ 7 Tage) → 30 → 60 → 90 Tage, abhängigkeitsbewusst, mit Issue-Verweisen.
  5. **Abdeckung & Grenzen:** kurzer Hinweis, was geprüft/ausgelassen wurde.

---

## Teil 2 — Ein Issue pro Befund

Jeder bestätigte Befund wird ein eigenständiges, erstklassig dokumentiertes Issue.

- **Titel:** `[<SEVERITY>][<Domäne/Dimension>] <prägnanter Befund>` — z. B.
  `[P0][AuthZ] IDOR an GET /api/orders/{id}`
- **Labels:** `audit`, `sev:p0|p1|p2|p3`, `dimension:<x>`, `effort:S|M|L`, optional `locale:de-CH`.
  Die Lokalisierungs-Dimension heisst `dimension:localisation`; `locale:de-CH` markiert Schweizer
  Orthografie (optional).
- **Body (feste Reihenfolge):**
  1. **Management-Summary** (2–3 Sätze): was, Auswirkung, Empfehlung in einem Satz.
  2. **Schweregrad & Score:** P-Stufe + auditspezifischer Score (CVSS / ICE / Rubrik-Punkte).
  3. **Standard-Bezug:** OWASP / CWE / MITRE / WCAG / RFC / CIS — je nach Audit.
  4. **Fundort:** `pfad/datei.ext:Zeile`, Endpunkt, Ressource oder Artefakt.
  5. **Nachweis:** Code-/Request-/Konfig-Ausschnitt (redigiert).
  6. **Auswirkung:** konkret — was kann ein Angreifer/Nutzer erreichen?
  7. **Handlungsempfehlung:** umsetzbar, mit **Vorher/Nachher** (Code/Config).
  8. **Aufwand & Re-Audit-Kriterium:** S/M/L + messbare Abnahmebedingung.
  9. **Rückverweis** auf das Tracking-Issue (`Teil von #<tracker-nr>`).

---

## Ablauf (robuste Reihenfolge)

Damit die Checklisten-Links im Tracker auflösen, in dieser Reihenfolge arbeiten:

1. **Vorschau** aller Issues (Tracker + Kinder) als Markdown im Bericht ausgeben.
2. Nach Freigabe: **Sub-Issues zuerst** anlegen, ihre Nummern einsammeln.
3. **Tracking-Issue** mit der nach Priorität sortierten Checkliste und den echten Nummern anlegen.
4. Optional: in jedes Sub-Issue den Rückverweis `Teil von #<tracker>` eintragen.
5. Bei Re-Audit: bestehenden Tracker und Kinder per Label finden und **aktualisieren** (geschlossene
   Aufgaben abhaken, neue Befunde ergänzen) statt neue Duplikate zu erzeugen.

> [!TIP]
> Mit der GitHub-CLI: `gh issue create --title "…" --body-file <datei> --label "audit,sev:p0,…"`.
> Nummern aus der Ausgabe von `gh issue create` einsammeln und in den Tracker-Body einsetzen.

---

## Beispiel (gekürzt)

**Tracking-Issue-Body:**

```markdown
> [!NOTE]
> **Management-Summary.** Das Security-Audit von `acme/shop` ergibt Note **Bronze (62/100)**.
> Grösstes Risiko: ein nicht authentifizierter Endpunkt, der Kundendaten preisgibt (P0).
> Nach Behebung der 2 P0- und 3 P1-Befunde ist Silver erreichbar.

## Scorecard
| Domäne | Note | P0 | P1 | P2 |
|---|---|---|---|---|
| AuthZ | D | 1 | 1 | 0 |
| Secrets | C | 1 | 0 | 1 |

## Offene Aufgaben (nach Priorität)
- [ ] #124 — P0 — IDOR an GET /api/orders/{id} (Aufwand: M)
- [ ] #125 — P0 — Klartext-Secret in CI-Workflow (Aufwand: S)
- [ ] #126 — P1 — Fehlende Rate-Limits an /login (Aufwand: M)

## Roadmap
- **Sofort (≤7 Tage):** #124, #125
- **30 Tage:** #126
```

**Sub-Issue-Body (#124):**

```markdown
> [!NOTE]
> **Management-Summary.** Jeder eingeloggte Nutzer kann fremde Bestellungen über eine
> manipulierte ID abrufen. Auswirkung: Offenlegung aller Kundendaten. Empfehlung:
> Objekt-Eigentümerschaft serverseitig prüfen.

**Schweregrad:** P0 · **CVSS:** 8.1 · **Standard:** OWASP A01 / CWE-639
**Fundort:** `handlers/orders.ts:42`
**Nachweis:** `db.orders.find({ id: req.params.id })` — kein Abgleich mit `req.user.id`.
**Auswirkung:** horizontale Rechteumgehung; vollständiger Zugriff auf fremde Bestellungen.

**Handlungsempfehlung (Vorher/Nachher):**
\`\`\`ts
// vorher
const order = await db.orders.find({ id });
// nachher
const order = await db.orders.find({ id, ownerId: req.user.id });
if (!order) return res.status(404).end();
\`\`\`
**Aufwand:** M · **Re-Audit-Kriterium:** Zugriff auf fremde ID liefert 404.

Teil von #123
```

---

## English mirror (short)

Every audit ends with the same issue output: **first a tracking issue** (the index of all
sub-tasks, priority-sorted P0→P3, with a management summary, scorecard, and 30/60/90 roadmap),
**then one issue per confirmed finding** — each opening with its own management summary, followed
by severity+score, standard mapping, location, evidence, impact, a concrete before/after fix,
effort, and a re-audit criterion. Issues are German by default (`OUTPUT_LANG`), preview-first, and
created only on explicit authorization. Create child issues first, collect their numbers, then
create the tracking issue so its checklist links resolve. Detect existing audit issues by label
and update rather than duplicate. Never include real secrets or PII.
