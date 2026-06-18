import { describe, it, expect } from "vitest";
import { AUDITS, AUDIT_COUNT } from "./content";
import { SITE_URL, TITLE, DESCRIPTION } from "./site";

describe("content", () => {
  it("exposes a non-empty audit list with a matching count", () => {
    expect(AUDITS.length).toBeGreaterThan(0);
    expect(AUDIT_COUNT).toBe(AUDITS.length);
  });

  it("every audit has a name, a .md file, and a blurb", () => {
    for (const a of AUDITS) {
      expect(a.name).toBeTruthy();
      expect(a.file).toMatch(/\.md$/);
      expect(a.blurb).toBeTruthy();
    }
  });

});

describe("site", () => {
  it("has an absolute URL and SERP-safe metadata", () => {
    expect(SITE_URL).toMatch(/^https?:\/\//);
    expect(TITLE).toBeTruthy();
    expect(DESCRIPTION.length).toBeLessThanOrEqual(170);
  });
});
