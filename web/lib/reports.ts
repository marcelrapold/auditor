import { REPO } from "./content";

/** A single scorecard row from a real audit run. */
type ScoreRow = {
  /** Audit name — matches AUDITS[].name in content.ts. */
  audit: string;
  grade: string;
  score: number;
};

/** An audit that Phase 0 declared not applicable, with its reason.
 *  The reason is a stable key localized via i18n (reportReasons), never prose here. */
type NotApplicable = {
  audit: string;
  /** i18n key into `reportReasons` — keeps the reason translatable. */
  reasonKey: string;
};

/** One headline finding the run filed, linking its real GitHub issue. */
type Finding = {
  /** The real GitHub issue number (github.com/marcelrapold/auditor/issues/<issue>). */
  issue: number;
  severity: "P0" | "P1" | "P2" | "P3";
  /** Audit lenses that surfaced it (display tags). */
  lenses: string[];
  /** i18n key into `reportFindings` for {title, evidence, before, after}. */
  key: string;
};

/** The cross-audit dedup exhibit — the orchestrator's payoff. */
type DedupExhibit = {
  /** The merged backlog item's real issue number. */
  issue: number;
  /** Lenses that independently reported it before the merge. */
  lenses: string[];
  /** i18n key into `reportDedup` for {title, body}. */
  key: string;
};

export type Report = {
  /** URL slug: /reports/<slug> and /de/reports/<slug>. */
  slug: string;
  /** The audited target (this repo). */
  target: string;
  targetUrl: string;
  /** ISO date the run completed. */
  date: string;
  /** The master tracking issue number (#97 here). */
  tracker: number;
  /** Headline verdict — i18n key into `reportVerdicts`. */
  verdictKey: string;
  /** Phase-0 selected audits — full scorecard, in report order. */
  scorecard: ScoreRow[];
  /** P0 / P1 tallies as reported by the run. */
  p0: number;
  p1: number;
  /** Phase-0 declared not-applicable, with reasons. */
  notApplicable: NotApplicable[];
  /** Headline findings to render natively (subset of the full backlog). */
  findings: Finding[];
  /** The cross-audit dedup exhibit. */
  dedup: DedupExhibit;
};

const issueUrl = (n: number) => `${REPO}/issues/${n}`;

/** Resolve a finding/dedup/tracker issue to its canonical GitHub URL. */
export function reportIssueUrl(n: number): string {
  return issueUrl(n);
}

/**
 * The seeded reports. Exactly ONE real run: the #97 self-audit, whose data is
 * single-sourced from the run's master tracker (github.com/marcelrapold/auditor/issues/97)
 * and the README "Worked example". Add more REAL runs by appending here — every
 * field maps to a verifiable GitHub artifact; no field is invented.
 */
export const REPORTS: Report[] = [
  {
    slug: "self-audit",
    target: "marcelrapold/auditor",
    targetUrl: REPO,
    date: "2026-06-17",
    tracker: 97,
    verdictKey: "selfAudit",
    scorecard: [
      { audit: "documentation", grade: "A", score: 94 },
      { audit: "accessibility", grade: "A", score: 93 },
      { audit: "performance", grade: "A", score: 92 },
      { audit: "security", grade: "A", score: 91 },
      { audit: "repo", grade: "A−", score: 90 },
      { audit: "frontend", grade: "A−", score: 90 },
      { audit: "infrastructure", grade: "A−", score: 90 },
    ],
    p0: 0,
    p1: 1,
    notApplicable: [
      { audit: "api", reasonKey: "api" },
      { audit: "data", reasonKey: "data" },
      { audit: "ai-llm", reasonKey: "aiLlm" },
      { audit: "compliance-privacy", reasonKey: "compliancePrivacy" },
    ],
    findings: [
      { issue: 81, severity: "P1", lenses: ["frontend"], key: "lang" },
      { issue: 82, severity: "P2", lenses: ["security", "infrastructure", "repo"], key: "checksums" },
      { issue: 83, severity: "P2", lenses: ["repo"], key: "pins" },
      { issue: 84, severity: "P2", lenses: ["frontend"], key: "enMeta" },
    ],
    dedup: {
      issue: 82,
      lenses: ["repo", "infrastructure", "security"],
      key: "checksums",
    },
  },
];

export function getReport(slug: string): Report | undefined {
  return REPORTS.find((r) => r.slug === slug);
}
