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
