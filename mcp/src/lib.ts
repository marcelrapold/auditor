/**
 * Core, transport-independent logic for the auditor MCP server.
 *
 * Every tool handler here is a plain async function that returns a string of
 * content (or throws an {@link AuditorError}). The stdio server in `index.ts`
 * is a thin adapter over these; the unit tests in `test/` call them directly,
 * so the behaviour is verified without spinning up a live transport.
 */

import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  AUDITS,
  AUDIT_KEYS,
  ORCHESTRATOR_FILE,
  STANDARDS,
  type StandardKey,
} from "./catalogue.js";

/** A user-facing error with a clear, actionable message (mapped to an MCP error). */
export class AuditorError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuditorError";
  }
}

/**
 * Resolve the repository root that ships the prompt files.
 *
 * Compiled, this file lives at `mcp/dist/lib.js`, so the prompts are two levels
 * up (`mcp/dist/lib.js` → `mcp/` → repo root) at `../../audit-prompts`. We don't
 * hardcode that depth blindly: from the module's own directory we walk upward
 * until we find a directory that contains both `audit-prompts/` and
 * `CHECKSUMS.txt` (the trust anchor). This keeps it correct whether the file is
 * run from `dist/`, executed via the `bin` symlink, or imported from `src/`
 * during tests. `AUDITOR_REPO_ROOT` overrides the search when set.
 */
export function findRepoRoot(startDir?: string): string {
  const override = process.env.AUDITOR_REPO_ROOT;
  if (override) {
    const abs = resolve(override);
    if (isRepoRoot(abs)) return abs;
    throw new AuditorError(
      `AUDITOR_REPO_ROOT is set to "${override}" but it does not contain audit-prompts/ and CHECKSUMS.txt.`,
    );
  }

  const here = startDir ?? dirname(fileURLToPath(import.meta.url));
  let dir = here;
  // Walk up to the filesystem root.
  for (;;) {
    if (isRepoRoot(dir)) return dir;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new AuditorError(
    `Could not locate the auditor repo root (a directory with audit-prompts/ and CHECKSUMS.txt) above "${here}". ` +
      `Set AUDITOR_REPO_ROOT to point at it.`,
  );
}

function isRepoRoot(dir: string): boolean {
  return (
    existsSync(join(dir, "audit-prompts")) && existsSync(join(dir, "CHECKSUMS.txt"))
  );
}

/** Read a UTF-8 file under the repo root, with a clear error if it is missing. */
async function readRepoFile(repoRoot: string, relPath: string): Promise<string> {
  const full = join(repoRoot, relPath);
  try {
    const text = await readFile(full, "utf8");
    if (text.trim().length === 0) {
      throw new AuditorError(`File "${relPath}" is unexpectedly empty.`);
    }
    return text;
  } catch (err) {
    if (err instanceof AuditorError) throw err;
    throw new AuditorError(
      `Could not read "${relPath}" under ${repoRoot}: ${(err as Error).message}`,
    );
  }
}

// --- Tool handlers ---------------------------------------------------------

export type AuditListing = {
  key: string;
  description: string;
  mapsTo: string;
  file: string;
};

/**
 * `list_audits` — return the catalogue of specialist audits with key,
 * one-line description, and standards mapping.
 */
export function listAudits(): { count: number; audits: AuditListing[] } {
  const audits = AUDITS.map((a) => ({
    key: a.key,
    description: a.description,
    mapsTo: a.mapsTo,
    file: a.file,
  }));
  return { count: audits.length, audits };
}

/**
 * `get_audit_prompt` — return the full prompt text of one specialist audit,
 * read live from `audit-prompts/<key>-audit-master-prompt.md`.
 *
 * @throws {AuditorError} when the key is not in the catalogue.
 */
export async function getAuditPrompt(repoRoot: string, key: string): Promise<string> {
  const entry = AUDITS.find((a) => a.key === key);
  if (!entry) {
    throw new AuditorError(
      `Unknown audit key "${key}". Valid keys: ${AUDIT_KEYS.join(", ")}. ` +
        `Call list_audits to see all audits with descriptions.`,
    );
  }
  return readRepoFile(repoRoot, join("audit-prompts", entry.file));
}

/**
 * `get_orchestrator` — return the full-repo orchestrator prompt (the
 * interactive scoping protocol that selects and runs the right specialists).
 */
export async function getOrchestrator(repoRoot: string): Promise<string> {
  return readRepoFile(repoRoot, join("audit-prompts", ORCHESTRATOR_FILE));
}

/**
 * `get_standard` — return the issue-output or documentation standard file.
 *
 * @throws {AuditorError} when the standard key is unknown.
 */
export async function getStandard(repoRoot: string, key: string): Promise<string> {
  const std = STANDARDS[key as StandardKey];
  if (!std) {
    throw new AuditorError(
      `Unknown standard "${key}". Valid values: ${Object.keys(STANDARDS).join(", ")}.`,
    );
  }
  return readRepoFile(repoRoot, std.file);
}

// --- Control crosswalk (readiness tools) -------------------------------------

export const READINESS_TARGET_KEYS = ["soc2", "iso27001", "iso42001-ai-act", "nis2-cra"] as const;
export type ReadinessTargetKey = (typeof READINESS_TARGET_KEYS)[number];

/** Which crosswalk columns (by header text) each readiness target reads. */
const TARGET_COLUMNS: Record<ReadinessTargetKey, string[]> = {
  soc2: ["SOC 2"],
  iso27001: ["ISO 27001"],
  "iso42001-ai-act": ["ISO 42001", "AI Act"],
  "nis2-cra": ["NIS2", "CRA"],
};

export type ControlTheme = {
  /** Theme id, e.g. "T01". */
  id: string;
  theme: string;
  /** Specialist audits that produce findings for the theme (first = primary owner). */
  audits: string[];
  /** Control IDs per crosswalk column header, already prefixed (e.g. "ISO27001:A.8.3"). */
  controls: Record<string, string[]>;
};

const NONE = /^[\s–—-]*$/;

/** Turn one crosswalk cell into prefixed control IDs, given its column header. */
function cellToControls(header: string, cell: string): string[] {
  const text = cell.replace(/\([^)]*ISMS[^)]*\)/g, "").trim();
  if (NONE.test(text)) return [];
  const parts = text.split(/[;,]/).map((s) => s.trim()).filter(Boolean);
  const out: string[] = [];
  for (const p of parts) {
    if (header.startsWith("ISO 27001")) out.push(`ISO27001:${p}`);
    else if (header.startsWith("SOC 2")) out.push(`SOC2:${p}`);
    else if (header.startsWith("ISO 42001")) out.push(`ISO42001:${p}`);
    else if (header.startsWith("NIS2")) {
      if (/^\([a-j]\)$/.test(p)) out.push(`NIS2:Art.21(2)${p}`);
      else out.push(`NIS2:${p.replace(/\s+/g, "")}`);
    } else if (header.startsWith("CRA")) {
      if (/^(I|II)\(/.test(p)) out.push(`CRA:AnnexI.${p}`);
      else if (/^Annex/.test(p)) out.push(`CRA:${p.replace(/\s+/g, "")}`);
      else out.push(`CRA:${p.replace(/\s+/g, "")}`);
    } else {
      // "revDSG Art. 8", "VDSG Art. 3", "GDPR Art. 32(1)(a)", "AIAct Art. 13" → PREFIX:Art.N
      const m = /^([A-Za-z]+)\s+(.+)$/.exec(p);
      if (m) out.push(`${m[1] ?? ""}:${(m[2] ?? "").replace(/\s+/g, "")}`);
      else if (out.length) {
        // A bare "Art. 33, 34" continuation inherits the previous prefix.
        const prev = (out[out.length - 1] ?? "").split(":")[0] ?? "";
        out.push(`${prev}:${/^\d/.test(p) ? "Art." : ""}${p.replace(/\s+/g, "")}`);
      }
    }
  }
  return out;
}

/** Parse the theme tables (rows starting with "| T") of CONTROL-CROSSWALK.md. */
export function parseCrosswalkThemes(markdown: string): ControlTheme[] {
  const coreEnd = markdown.indexOf("## Requires organisational evidence");
  const core = coreEnd === -1 ? markdown : markdown.slice(0, coreEnd);
  const themes: ControlTheme[] = [];
  let headers: string[] = [];
  for (const line of core.split("\n")) {
    if (!line.startsWith("|")) continue;
    const cells = line.split("|").slice(1, -1).map((c) => c.trim());
    const id = cells[0] ?? "";
    if (id === "#") {
      headers = cells;
      continue;
    }
    if (!/^T\d+$/.test(id) || headers.length === 0) continue;
    const controls: Record<string, string[]> = {};
    for (let i = 3; i < cells.length; i++) {
      const header = headers[i] ?? `col${i}`;
      const ids = cellToControls(header, cells[i] ?? "");
      if (ids.length) controls[header] = ids;
    }
    themes.push({
      id,
      theme: cells[1] ?? "",
      audits: (cells[2] ?? "").split(",").map((s) => s.trim()).filter(Boolean),
      controls,
    });
  }
  return themes;
}

/** The "Requires organisational evidence" cell for a framework, as written (ranges kept). */
function parseNotAssessable(markdown: string, frameworkLabel: string): string[] {
  const start = markdown.indexOf("## Requires organisational evidence");
  if (start === -1) return [];
  const section = markdown.slice(start, markdown.indexOf("\n## ", start + 10));
  for (const line of section.split("\n")) {
    const cells = line.split("|").slice(1, -1).map((c) => c.trim());
    const label = cells[0] ?? "";
    const body = cells[1] ?? "";
    if (cells.length >= 2 && label.startsWith(frameworkLabel)) {
      return body
        .replace(/\([^)]*\)/g, "")
        .split(/[;,]/)
        .map((s) => s.trim())
        .filter((s) => s && !/^and$/i.test(s));
    }
  }
  return [];
}

/** Audits the readiness-targets table lists for a target (the row "| `soc2` | ... |"). */
function parseTargetAudits(markdown: string, target: string): string[] {
  const line = markdown.split("\n").find((l) => l.startsWith(`| \`${target}\` |`));
  if (!line) return [];
  const cells = line.split("|").slice(1, -1).map((c) => c.trim());
  const auditsCell = cells[2] ?? "";
  return [...auditsCell.matchAll(/`([a-z-]+)`/g)].map((m) => m[1] ?? "").filter(Boolean);
}

const NOT_ASSESSABLE_LABEL: Record<ReadinessTargetKey, string[]> = {
  soc2: ["SOC 2"],
  iso27001: ["ISO 27001"],
  "iso42001-ai-act": ["ISO 42001"],
  "nis2-cra": ["NIS2", "CRA"],
};

export type ReadinessChecklist = {
  target: ReadinessTargetKey;
  frameworks: string[];
  audits_to_run: string[];
  themes: { id: string; theme: string; audits: string[]; controls: string[] }[];
  controls: string[];
  not_assessable: string[];
  note: string;
};

/**
 * `get_readiness_checklist` — every technically assessable control of a
 * readiness target, grouped by crosswalk theme, plus the audits to run and the
 * controls that need organisational evidence. Parsed live from the crosswalk so
 * it can never drift from the file the prompts cite.
 */
export async function getReadinessChecklist(repoRoot: string, target: string): Promise<ReadinessChecklist> {
  if (!READINESS_TARGET_KEYS.includes(target as ReadinessTargetKey)) {
    throw new AuditorError(
      `Unknown readiness target "${target}". Valid values: ${READINESS_TARGET_KEYS.join(", ")}.`,
    );
  }
  const key = target as ReadinessTargetKey;
  const md = await readRepoFile(repoRoot, "CONTROL-CROSSWALK.md");
  const wanted = TARGET_COLUMNS[key];
  const themes = parseCrosswalkThemes(md)
    .map((t) => {
      const controls = Object.entries(t.controls)
        .filter(([header]) => wanted.some((w) => header.includes(w)))
        .flatMap(([header, ids]) =>
          // The AI table's last column mixes revDSG/GDPR/AIAct; keep only AIAct for the AI target.
          header.includes("AI Act") ? ids.filter((id) => id.startsWith("AIAct:")) : ids,
        );
      return { id: t.id, theme: t.theme, audits: t.audits, controls: [...new Set(controls)] };
    })
    .filter((t) => t.controls.length);
  const controls = [...new Set(themes.flatMap((t) => t.controls))].sort();
  const not_assessable = NOT_ASSESSABLE_LABEL[key].flatMap((label) => parseNotAssessable(md, label));
  return {
    target: key,
    frameworks: wanted,
    audits_to_run: parseTargetAudits(md, key),
    themes,
    controls,
    not_assessable,
    note:
      "Readiness assessment, not certification: these are the technically assessable controls. " +
      "Status rules and scoring: CONTROL-CROSSWALK.md § Readiness scoring.",
  };
}

/** `list_control_themes` — all crosswalk themes with every framework's IDs, optionally filtered by audit. */
export async function listControlThemes(repoRoot: string, audit?: string): Promise<ControlTheme[]> {
  const md = await readRepoFile(repoRoot, "CONTROL-CROSSWALK.md");
  const themes = parseCrosswalkThemes(md);
  if (!audit) return themes;
  if (!AUDIT_KEYS.includes(audit)) {
    throw new AuditorError(`Unknown audit key "${audit}". Valid keys: ${AUDIT_KEYS.join(", ")}.`);
  }
  return themes.filter((t) => t.audits.includes(audit));
}
