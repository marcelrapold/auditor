import { ChevronRight, Terminal } from "lucide-react";
import { GitHubMark } from "@/components/icons";
import { glossify } from "@/lib/glossary";
import { type Lang, t } from "@/lib/i18n";

/** Pull the audit's focus areas from its (localized) blurb — single source, no
 *  duplicated data. Drops the "14 domains:" style prefix, splits on separators,
 *  and keeps the short, chip-sized labels. */
export function auditLenses(blurb: string): string[] {
  const after = blurb.includes(":") ? blurb.slice(blurb.indexOf(":") + 1) : blurb;
  return after
    .split(/[,;·]|\s[—–]\s/)
    .map((s) => s.replace(/\.$/, "").trim())
    .filter((s) => s.length > 0 && s.length <= 22)
    .slice(0, 6);
}

/** A skill-specific flow graphic: target → this audit's specialist lenses →
 *  priority-sorted issues. Pure HTML/CSS (theme-aware, no JS). */
export function AuditDiagram({ lenses, lang }: { lenses: string[]; lang: Lang }) {
  const tt = t(lang);
  const chevron = (
    <ChevronRight
      aria-hidden
      className="mx-auto size-4 shrink-0 rotate-90 text-muted-foreground lg:rotate-0"
    />
  );
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex flex-col items-stretch gap-3 lg:flex-row lg:items-center">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3">
          <Terminal aria-hidden className="size-4 shrink-0 text-primary" />
          <span className="text-sm font-medium">{tt.apFlowTarget}</span>
        </div>
        {chevron}
        <div className="flex-1 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
          <p className="font-mono text-[11px] uppercase tracking-widest text-primary">
            {tt.apFlowLenses}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {lenses.map((l) => (
              <span
                key={l}
                className="rounded-md border border-border bg-card px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
              >
                {glossify(l, lang)}
              </span>
            ))}
          </div>
        </div>
        {chevron}
        <div className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3">
          <GitHubMark className="size-4 shrink-0" />
          <span className="text-sm font-medium">{tt.apFlowIssues}</span>
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">{tt.apFlowVerify}</p>
    </div>
  );
}
