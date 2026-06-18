import { describe, it, expect } from "vitest";
import { isValidElement, type ReactElement } from "react";
import { glossify } from "./glossary";
import { Term } from "../components/term";

const termsIn = (node: unknown): ReactElement[] => {
  const arr = Array.isArray(node) ? node : [node];
  return arr.filter((n) => isValidElement(n) && n.type === Term) as ReactElement[];
};
const childOf = (el: ReactElement) => (el.props as { children: string }).children;

describe("glossify", () => {
  it("wraps known acronyms in a Term", () => {
    const ts = termsIn(glossify("Maps to OWASP and CWE", "en"));
    expect(ts.length).toBe(2);
    expect(ts.map(childOf)).toEqual(["OWASP", "CWE"]);
  });

  it("never matches an acronym inside a longer word", () => {
    // "CIS" in "precise", "RAG" in "storage" must NOT wrap.
    const out = glossify("precise cloud storage", "en");
    expect(out).toBe("precise cloud storage");
  });

  it("wraps only the first occurrence of a term", () => {
    expect(termsIn(glossify("OWASP then OWASP again", "en")).length).toBe(1);
  });

  it("matches the German surface form", () => {
    const ts = termsIn(glossify("Mehr zu Idempotenz hier", "de"));
    expect(ts.length).toBe(1);
    expect(childOf(ts[0])).toBe("Idempotenz");
  });

  it("returns the original string when nothing matches", () => {
    expect(glossify("nothing technical here", "en")).toBe("nothing technical here");
  });
});
