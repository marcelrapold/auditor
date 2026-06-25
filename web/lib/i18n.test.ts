import { describe, it, expect } from "vitest";
import { ui, principles, t, type Lang } from "./i18n";
import { AUDITS, BACKLOG_SAMPLE, PRINCIPLES } from "./content";
import { AUDIT_DETAILS } from "./audit-details";

const LANGS: Lang[] = ["en", "de"];

/** Recursive, order-independent key map of a translation tree. Objects contribute their
 *  key names (recursing into values); arrays recurse into a single representative element
 *  so [{q,a},{q,a}] and [{q,a}] share a shape — we lock the *shape*, not the length. */
function keyShape(value: unknown): unknown {
  if (Array.isArray(value)) {
    return { "[]": value.length ? keyShape(value[0]) : null };
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(value as object).sort()) {
      out[k] = keyShape((value as Record<string, unknown>)[k]);
    }
    return out;
  }
  return null; // leaf (string/number/etc.) — only the key path matters, not the prose
}

describe("i18n locale parity", () => {
  it("en and de expose the exact same key set (deep, order-independent)", () => {
    // Catches a key added/renamed/removed in one locale but not the other.
    expect(keyShape(ui.en)).toEqual(keyShape(ui.de));
  });

  it("t() returns the same shape for every locale", () => {
    expect(keyShape(t("en"))).toEqual(keyShape(t("de")));
  });
});

describe("audit-details coverage", () => {
  it("every audit has an en + de detail entry", () => {
    for (const a of AUDITS) {
      const detail = AUDIT_DETAILS[a.name];
      expect(detail, `missing audit-details entry for "${a.name}"`).toBeDefined();
      expect(detail.en, `missing en detail for "${a.name}"`).toBeDefined();
      expect(detail.de, `missing de detail for "${a.name}"`).toBeDefined();
    }
  });

  it("en and de details share the same shape per audit", () => {
    for (const a of AUDITS) {
      const d = AUDIT_DETAILS[a.name];
      expect(keyShape(d.en), `detail shape drift for "${a.name}"`).toEqual(keyShape(d.de));
    }
  });

  it("has no orphan audit-details entry without a matching audit", () => {
    const names = new Set(AUDITS.map((a) => a.name));
    for (const key of Object.keys(AUDIT_DETAILS)) {
      expect(names.has(key), `audit-details entry "${key}" has no matching audit`).toBe(true);
    }
  });
});

describe("principles translation coverage", () => {
  it("every English principle has a German translation (title + body)", () => {
    const de = principles("de");
    const en = principles("en");
    expect(de.length).toBe(en.length);
    for (let i = 0; i < en.length; i++) {
      // German must differ from English (i.e. a translation was actually applied)…
      expect(de[i].title, `principle "${en[i].title}" not translated`).not.toBe(en[i].title);
      expect(de[i].body).toBeTruthy();
      // …and the shared, non-localized field (icon) must be preserved.
      expect(de[i].icon).toBe(en[i].icon);
    }
  });

  it("counts match between PRINCIPLES and both locale outputs", () => {
    expect(principles("en").length).toBe(PRINCIPLES.length);
    expect(principles("de").length).toBe(PRINCIPLES.length);
  });
});

describe("proofRows / BACKLOG_SAMPLE coverage", () => {
  const issues = BACKLOG_SAMPLE.map((b) => b.n);

  for (const lang of LANGS) {
    it(`[${lang}] covers exactly the BACKLOG_SAMPLE issue numbers, in order`, () => {
      const rows = t(lang).proofRows;
      expect(rows.length).toBe(issues.length);
      // Every backlog row has a non-empty localized title (no silent "" fallback).
      for (let i = 0; i < issues.length; i++) {
        expect(rows[i], `proofRows[${i}] (issue #${issues[i]}) missing in "${lang}"`).toBeTruthy();
      }
    });
  }
});
