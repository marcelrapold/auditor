import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it, expect } from "vitest";
import { AUDITS, AUDIT_COUNT, CROSSWALK_FILE, READINESS_TARGETS } from "./content";
import { SITE_URL, TITLE, DESCRIPTION } from "./site";

// This file lives at web/lib/content.test.ts, so the repo root (which ships
// audit-prompts/) is two levels up from the directory.
const here = dirname(fileURLToPath(import.meta.url));
const promptsDir = resolve(here, "..", "..", "audit-prompts");

/** Audit keys derived from the prompt files — the single source of truth.
 *  `<key>-audit-master-prompt.md` contributes `<key>`; the orchestrator is excluded. */
function promptFileKeys(): Set<string> {
  const SUFFIX = "-audit-master-prompt.md";
  return new Set(
    readdirSync(promptsDir)
      .filter((f) => f.endsWith(SUFFIX) && f !== "full-audit-master-prompt.md")
      .map((f) => f.slice(0, -SUFFIX.length)),
  );
}

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

  it("every AUDITS[].file exists in audit-prompts/", () => {
    for (const a of AUDITS) {
      expect(existsSync(join(promptsDir, a.file)), `missing prompt file for "${a.name}": ${a.file}`).toBe(true);
    }
  });

  it("the AUDITS key set exactly equals the audit-prompts/ file key set (single source of truth)", () => {
    // Pins web's catalogue to the prompt files just like mcp/test/lib.test.js pins the MCP
    // server's — so web and mcp can't silently diverge from the prompts or each other.
    const auditKeys = [...new Set(AUDITS.map((a) => a.name))].sort();
    const fileKeys = [...promptFileKeys()].sort();
    expect(auditKeys).toEqual(fileKeys);
  });
});

describe("readiness targets", () => {
  const auditNames = new Set(AUDITS.map((a) => a.name));
  const crosswalk = readFileSync(resolve(here, "..", "..", CROSSWALK_FILE), "utf8");

  it("has four unique targets", () => {
    const keys = READINESS_TARGETS.map((r) => r.key);
    expect(keys).toHaveLength(4);
    expect(new Set(keys).size).toBe(4);
  });

  it("every target runs only audits that exist in the catalogue", () => {
    for (const target of READINESS_TARGETS) {
      expect(target.audits.length).toBeGreaterThan(0);
      for (const name of target.audits) {
        expect(auditNames.has(name), `${target.key} runs unknown audit "${name}"`).toBe(true);
      }
    }
  });

  it("every target key and its audit list match CONTROL-CROSSWALK.md (single source of truth)", () => {
    // The crosswalk's "Readiness targets" table is what the orchestrator reads; the landing page
    // must not advertise a target or an audit selection the prompts don't implement.
    for (const target of READINESS_TARGETS) {
      const row = crosswalk.split("\n").find((line) => line.startsWith(`| \`${target.key}\` |`));
      expect(row, `crosswalk documents target ${target.key}`).toBeDefined();
      for (const name of target.audits) {
        expect(row, `${target.key} row lists \`${name}\``).toContain(`\`${name}\``);
      }
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
