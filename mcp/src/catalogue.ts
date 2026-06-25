/**
 * The audit catalogue — the single source of truth for which audits exist,
 * which prompt file each maps to, and the one-line description / standards
 * mapping the MCP server advertises.
 *
 * This mirrors the canonical `AUDITS` list in `web/lib/content.ts`. It is kept
 * as a standalone, dependency-free copy on purpose: the MCP package must build
 * and run on its own without importing the Next.js `web/` workspace (which pulls
 * in React, lucide-react, etc.). The `prompts` CI gate plus `CHECKSUMS.txt`
 * keep the two lists honest — and `npm test` asserts every `file` here resolves
 * to a real prompt on disk, so drift fails loudly.
 */

export type AuditEntry = {
  /** Stable key the agent passes to `get_audit_prompt` (e.g. "security"). */
  key: string;
  /** Filename under `audit-prompts/`. */
  file: string;
  /** One-line description of what the specialist covers. */
  description: string;
  /** The recognized standards / references this audit maps to. */
  mapsTo: string;
};

/**
 * The 13 specialist audits, in catalogue order. Mirrors `AUDITS` in
 * `web/lib/content.ts`.
 */
export const AUDITS: readonly AuditEntry[] = [
  {
    key: "security",
    file: "security-audit-master-prompt.md",
    description:
      "14 domains: injection, authN/Z, secrets, supply chain, IaC, CI/CD, business logic, privacy, LLM.",
    mapsTo: "OWASP · CWE · MITRE · CIS",
  },
  {
    key: "repo",
    file: "repo-audit-master-prompt.md",
    description:
      "Whole-repo engineering: architecture, stack consistency, docs, tests, deps, CI/CD, git hygiene.",
    mapsTo: "Google Eng · SRE · SLSA",
  },
  {
    key: "frontend",
    file: "frontend-audit-master-prompt.md",
    description:
      "16-agent sweep: usability, psychology, visual design, a11y, performance, SEO, copy, CRO.",
    mapsTo: "Nielsen · WCAG · CWV",
  },
  {
    key: "api",
    file: "api-audit-master-prompt.md",
    description:
      "Resource modeling, HTTP semantics, error model, versioning, idempotency, rate limits, DX.",
    mapsTo: "RFC 9110/9457 · OpenAPI",
  },
  {
    key: "performance",
    file: "performance-audit-master-prompt.md",
    description:
      "Hotspots, N+1, caching, concurrency, leaks, load behavior, resilience, FinOps.",
    mapsTo: "SRE · DORA · SLOs",
  },
  {
    key: "data",
    file: "data-audit-master-prompt.md",
    description:
      "Schema and modeling, constraints, migration safety, transactions, integrity, backup/DR.",
    mapsTo: "ACID/CAP · RLS",
  },
  {
    key: "infrastructure",
    file: "infrastructure-audit-master-prompt.md",
    description:
      "IaC, cloud security, IAM, secrets, containers, k8s, CI/CD, HA, DR, observability, cost.",
    mapsTo: "CIS · Well-Architected · DORA",
  },
  {
    key: "ai-llm",
    file: "ai-llm-audit-master-prompt.md",
    description:
      "Prompt injection, jailbreaks, output handling, agent/tool safety, RAG, hallucination, evals.",
    mapsTo: "OWASP LLM Top 10 · NIST AI RMF",
  },
  {
    key: "compliance-privacy",
    file: "compliance-privacy-audit-master-prompt.md",
    description:
      "Lawful basis, consent/cookies, data-subject rights, retention, transfers, breach readiness.",
    mapsTo: "GDPR · ePrivacy · EU AI Act",
  },
  {
    key: "accessibility",
    file: "accessibility-audit-master-prompt.md",
    description:
      "Semantics, keyboard, focus, screen reader, contrast, forms, zoom, motor, motion, cognitive.",
    mapsTo: "WCAG 2.2 · EAA · ADA/508",
  },
  {
    key: "documentation",
    file: "documentation-audit-master-prompt.md",
    description:
      "Docs quality vs the standard: head-matter, onboarding, doc–code drift, writing, Diátaxis.",
    mapsTo: "DOCUMENTATION-STANDARD · Diátaxis",
  },
  {
    key: "content",
    file: "content-audit-master-prompt.md",
    description:
      "Content & messaging: thesis challenge, audience fit, evidence & originality, structure, voice, concrete rewrites.",
    mapsTo: "E-E-A-T · BLUF · rhetoric",
  },
  {
    key: "lean",
    file: "lean-audit-master-prompt.md",
    description:
      "Bloat, redundancy & dependency transparency: dead code, unused/phantom deps, duplication, AI slop — a safe strip-down that never over-deletes.",
    mapsTo: "Google Eng · OWASP · YAGNI",
  },
] as const;

/** Valid audit keys, derived from the catalogue. */
export const AUDIT_KEYS = AUDITS.map((a) => a.key) as readonly string[];

/** The orchestrator prompt (the interactive scoping protocol). */
export const ORCHESTRATOR_FILE = "full-audit-master-prompt.md";

/** The standards the `get_standard` tool can return. */
export type StandardKey = "issue-output" | "documentation";

export const STANDARDS: Record<StandardKey, { file: string; description: string }> = {
  "issue-output": {
    file: "ISSUE-OUTPUT-STANDARD.md",
    description:
      "The mandatory issue-output contract every audit follows: a priority-sorted tracking issue first, then one issue per finding, each with its own management summary and before/after fix.",
  },
  documentation: {
    file: "DOCUMENTATION-STANDARD.en.md",
    description:
      "The Google-grade documentation standard with five repo profiles and a 0–100 scoring rubric — the same yardstick the documentation audit scores against. (English; the German source is DOCUMENTATION-STANDARD.md.)",
  },
};
