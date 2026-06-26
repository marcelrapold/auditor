import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * de-CH locale guard. These files carry the German product copy. Two invariants
 * that a future edit must not silently break:
 *   1. No `ß` — Swiss orthography uses `ss`. English strings have no `ß`, so a
 *      whole-file scan is safe; tagged immutable exceptions go in SS_ALLOW.
 *   2. No German-inflected Denglish / translationese the content audit removed.
 *      The denylist is morphology-aware (German inflections only), so it never
 *      fires on the English source strings (e.g. EN "steelman" vs DE "steelmant").
 */
const HERE = dirname(fileURLToPath(import.meta.url));
const FILES = ["i18n.ts", "audit-details.ts"];

// Immutable proper names / code / legal titles / verbatim quotes that may keep a ß. (None today.)
const SS_ALLOW: RegExp[] = [];

// German „…" must close with the U+201C closer, never an ASCII straight quote.
const BAD_QUOTE = /„[^“”\n]*"/; // „ opener directly closed by ASCII "

const DENGLISH: { label: string; re: RegExp }[] = [
  { label: 'mappen → use kartieren/zuordnen', re: /\bge?mapp(t|en|te|st)\b/i },
  { label: 'laufen lassen → use einsetzen/ausführen/prüfen', re: /\blauf(en|t)\s+(zu\s+)?(lassen|lässt|gelassen)\b/i },
  { label: 'deduplizieren → use Doppelungen entfernen', re: /\bdedupliz/i },
  { label: 'gemergt → use zusammengeführt', re: /\bgemergt\b/i },
  { label: 'gebumpt → use hochgezählt', re: /\bgebumpt\b/i },
  { label: 'Linse (lens calque) → use Prüfbereich', re: /\bLinsen?\b/ },
  { label: '"der Audit" (genus) → "das Audit"', re: /\b[Dd]er Audit\b/ },
  { label: 'steelmann-inflected → "den stärksten Gegenpunkt bilden"', re: /\bsteelman(nt?|en)\b/i },
];

describe("de-CH locale guard", () => {
  for (const file of FILES) {
    const text = readFileSync(join(HERE, file), "utf8");

    it(`[${file}] uses Swiss orthography (no ß)`, () => {
      const offenders = text
        .split("\n")
        .map((line, i) => ({ line, n: i + 1 }))
        .filter(({ line }) => line.includes("ß") && !SS_ALLOW.some((re) => re.test(line)))
        .map((o) => `${file}:${o.n}`);
      expect(offenders).toEqual([]);
    });

    it(`[${file}] closes German „…" with the correct curly quote`, () => {
      expect(BAD_QUOTE.test(text), `straight-quote closer after a „ opener in ${file}`).toBe(false);
    });

    for (const { label, re } of DENGLISH) {
      it(`[${file}] no Denglish: ${label}`, () => {
        const m = text.match(re);
        expect(m, m ? `found "${m[0]}" in ${file}` : "").toBeNull();
      });
    }
  }
});
