import {
  Accessibility,
  Bot,
  BookText,
  Cloud,
  Database,
  FileSearch,
  GitBranch,
  Gauge,
  LayoutDashboard,
  type LucideIcon,
  PenLine,
  Plug,
  Scale,
  Scissors,
  ShieldCheck,
} from "lucide-react";

export const REPO = "https://github.com/marcelrapold/auditor";
export const PROMPTS = `${REPO}/blob/main/audit-prompts`;

/** Latest release tag — single-sourced via scripts/bump-version.mjs. */
export const VERSION = "v0.8.0";

/** The generic activation, copied verbatim (the leading "$" is visual only). It names
 *  no audit, so the orchestrator runs its "which audit(s)?" menu. Lives on the home page. */
export const AUDIT_COMMAND = "Audit github.com/your/repo using auditor.rapold.io";

/** The lean, audit-specific activation for a `/audits/<name>` detail page. It names the
 *  single audit (so the orchestrator skips the menu and runs only that one, then offers the
 *  rest) and omits the repo placeholder — it's pasted into a session where the target is
 *  already in context. See `cmd` on each audit for the natural-language name used. */
export function auditCommand(audit: Audit): string {
  return `Run the ${audit.cmd} using auditor.rapold.io`;
}

/** Top of the scorecard from this repo's own #97 self-audit run. */
export const SCORECARD = [
  { audit: "documentation", grade: "A", score: 94 },
  { audit: "performance", grade: "A", score: 92 },
  { audit: "security", grade: "A", score: 91 },
] as const;

/** One real finding the #97 run filed against this repo (since fixed). */
export const SAMPLE_FINDING = {
  severity: "P1",
  title: '/de served <html lang="en">',
  evidence: "web/app/layout.tsx:71",
  before: '/ and /de → <html lang="en">',
  after: '/de → <html lang="de">',
  issue: 81,
} as const;

/** Six real findings from this page's own content audit (#123) — backlog exhibit.
 *  Titles are localized in i18n (proofRowsByIssue), keyed by the issue number `n` —
 *  reordering this list re-orders the localized titles to match (no index drift). */
export const BACKLOG_SAMPLE = [
  { n: 100, sev: "P1" },
  { n: 103, sev: "P1" },
  { n: 104, sev: "P1" },
  { n: 107, sev: "P1" },
  { n: 113, sev: "P2" },
  { n: 122, sev: "P3" },
] as const;

export type Audit = {
  name: string;
  /** Natural-language audit name used in the per-audit activation command
   *  (`Run the <cmd> using auditor.rapold.io`). The orchestrator maps it back to a menu key. */
  cmd: string;
  file: string;
  blurb: string;
  mapsTo: string;
  icon: LucideIcon;
};

export const AUDITS: Audit[] = [
  {
    name: "security",
    cmd: "security audit",
    file: "security-audit-master-prompt.md",
    blurb:
      "14 domains: injection, authN/Z, secrets, supply chain, IaC, CI/CD, business logic, privacy, LLM.",
    mapsTo: "OWASP · CWE · MITRE · CIS",
    icon: ShieldCheck,
  },
  {
    name: "repo",
    cmd: "repo audit",
    file: "repo-audit-master-prompt.md",
    blurb:
      "Whole-repo engineering: architecture, stack consistency, docs, tests, deps, CI/CD, git hygiene.",
    mapsTo: "Google Eng · SRE · SLSA",
    icon: GitBranch,
  },
  {
    name: "frontend",
    cmd: "frontend audit",
    file: "frontend-audit-master-prompt.md",
    blurb:
      "16-agent sweep: usability, psychology, visual design, a11y, performance, SEO, copy, CRO.",
    mapsTo: "Nielsen · WCAG · CWV",
    icon: LayoutDashboard,
  },
  {
    name: "api",
    cmd: "API audit",
    file: "api-audit-master-prompt.md",
    blurb:
      "Resource modeling, HTTP semantics, error model, versioning, idempotency, rate limits, DX.",
    mapsTo: "RFC 9110/9457 · OpenAPI",
    icon: Plug,
  },
  {
    name: "performance",
    cmd: "performance audit",
    file: "performance-audit-master-prompt.md",
    blurb:
      "Hotspots, N+1, caching, concurrency, leaks, load behavior, resilience, FinOps.",
    mapsTo: "SRE · DORA · SLOs",
    icon: Gauge,
  },
  {
    name: "data",
    cmd: "data audit",
    file: "data-audit-master-prompt.md",
    blurb:
      "Schema and modeling, constraints, migration safety, transactions, integrity, backup/DR.",
    mapsTo: "ACID/CAP · RLS",
    icon: Database,
  },
  {
    name: "infrastructure",
    cmd: "infrastructure audit",
    file: "infrastructure-audit-master-prompt.md",
    blurb:
      "IaC, cloud security, IAM, secrets, containers, k8s, CI/CD, HA, DR, observability, cost.",
    mapsTo: "CIS · Well-Architected · DORA",
    icon: Cloud,
  },
  {
    name: "ai-llm",
    cmd: "AI/LLM audit",
    file: "ai-llm-audit-master-prompt.md",
    blurb:
      "Prompt injection, jailbreaks, output handling, agent/tool safety, RAG, hallucination, evals.",
    mapsTo: "OWASP LLM Top 10 · NIST AI RMF",
    icon: Bot,
  },
  {
    name: "compliance-privacy",
    cmd: "compliance & privacy audit",
    file: "compliance-privacy-audit-master-prompt.md",
    blurb:
      "Lawful basis, consent/cookies, data-subject rights, retention, transfers, breach readiness.",
    mapsTo: "GDPR · ePrivacy · EU AI Act",
    icon: Scale,
  },
  {
    name: "accessibility",
    cmd: "accessibility audit",
    file: "accessibility-audit-master-prompt.md",
    blurb:
      "Semantics, keyboard, focus, screen reader, contrast, forms, zoom, motor, motion, cognitive.",
    mapsTo: "WCAG 2.2 · EAA · ADA/508",
    icon: Accessibility,
  },
  {
    name: "documentation",
    cmd: "documentation audit",
    file: "documentation-audit-master-prompt.md",
    blurb:
      "Docs quality vs the standard: head-matter, onboarding, doc–code drift, writing, Diátaxis.",
    mapsTo: "DOCUMENTATION-STANDARD · Diátaxis",
    icon: BookText,
  },
  {
    name: "content",
    cmd: "content audit",
    file: "content-audit-master-prompt.md",
    blurb:
      "Content & messaging: thesis challenge, audience fit, evidence & originality, structure, voice, concrete rewrites.",
    mapsTo: "E-E-A-T · BLUF · rhetoric",
    icon: PenLine,
  },
  {
    name: "lean",
    cmd: "lean audit",
    file: "lean-audit-master-prompt.md",
    blurb:
      "Bloat, redundancy & dependency transparency: dead code, unused/phantom deps, duplication, AI slop — a safe strip-down that never over-deletes.",
    mapsTo: "Google Eng · OWASP · YAGNI",
    icon: Scissors,
  },
];

/** Number of audits — derive UI copy from this, never hardcode. */
export const AUDIT_COUNT = AUDITS.length;

/** Capitalized display title for SEO/OG (`<title>`, og:title), derived from the command
 *  phrase: "security audit" → "Security audit", "AI/LLM audit" stays as-is. The page h1
 *  keeps the lowercase-slug brand style on purpose; this only affects search/share metadata. */
export function auditTitle(audit: Audit): string {
  return audit.cmd.charAt(0).toUpperCase() + audit.cmd.slice(1);
}

/** Human aliases people actually type or share, on top of the predictable `<name>-audit`. */
const AUDIT_ALIASES: Record<string, string[]> = {
  "ai-llm": ["ai-audit", "llm-audit"],
  "compliance-privacy": ["privacy-audit", "compliance-audit"],
  accessibility: ["a11y-audit"],
  documentation: ["docs-audit"],
  infrastructure: ["infra-audit"],
};

/** Short, shareable vanity paths that 308-redirect to the canonical `/audits/<name>`.
 *  Every audit gets `<name>-audit`; some add a human alias. Single-sourced for next.config —
 *  keep it dependency-light (no icon access) so the config can import it cheaply. */
export const AUDIT_SHORT_SLUGS: { slug: string; name: string }[] = AUDITS.flatMap((a) => [
  { slug: `${a.name}-audit`, name: a.name },
  ...(AUDIT_ALIASES[a.name] ?? []).map((slug) => ({ slug, name: a.name })),
]);

export type Principle = { title: string; body: string; icon: LucideIcon };

export const PRINCIPLES: Principle[] = [
  {
    title: "Evidence or it didn't happen",
    body: "Every finding cites a concrete artifact — file:line, a query plan, a request, a config value. No evidence means it is discarded.",
    icon: FileSearch,
  },
  {
    title: "Adversarial self-challenge",
    body: "No finding survives until independent skeptic agents have tried to refute it — it must clear at least two of three, or it is dropped. If it cannot survive a hostile reading, it is not a finding.",
    icon: ShieldCheck,
  },
  {
    title: "Blind-spot hunting",
    body: "A completeness critic asks each round which surface, use-case, or assumption went unexamined. Gaps are declared, never hidden.",
    icon: FileSearch,
  },
  {
    title: "Actionable issue tracker",
    body: "Output is GitHub issues — German or English — led by a single priority-sorted tracking issue, each with a management summary and a before/after fix. A finding you cannot act on is just an opinion.",
    icon: GitBranch,
  },
];

export type Phase = { n: string; title: string; body: string };

export const PHASES: Phase[] = [
  {
    n: "0",
    title: "Reconnaissance",
    body: "Factual inventory and a surface map. No opinions yet.",
  },
  {
    n: "1",
    title: "Specialist swarm",
    body: "Many domain experts run in parallel, each evidence-bound.",
  },
  {
    n: "2",
    title: "Cross-pollination",
    body: "Merge, dedupe, and surface compound findings.",
  },
  {
    n: "3",
    title: "Adversarial verify",
    body: "Independent skeptics try to refute each P0/P1; ≥2 of 3 to survive.",
  },
  {
    n: "4",
    title: "Benchmark",
    body: "Compare against named best-in-class references and standards.",
  },
  {
    n: "5",
    title: "Synthesis",
    body: "Report, scorecard, issues, and a 30/60/90 roadmap.",
  },
];

export type Standard = {
  name: string;
  file: string;
  blurb: string;
  icon: LucideIcon;
};

export const STANDARDS: Standard[] = [
  {
    name: "Documentation standard",
    file: "DOCUMENTATION-STANDARD.md",
    blurb:
      "A documentation standard with five repo profiles and a 0–100 scoring rubric — the same yardstick the documentation audit scores against.",
    icon: BookText,
  },
  {
    name: "Issue-output standard",
    file: "ISSUE-OUTPUT-STANDARD.md",
    blurb:
      "The mandatory contract every audit follows: a priority-sorted tracking issue first, then one issue per finding, each with its own management summary.",
    icon: GitBranch,
  },
];
