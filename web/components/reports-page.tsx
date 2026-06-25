import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleDot,
  FileSearch,
  GitMerge,
  ShieldCheck,
} from "lucide-react";
import { GitHubMark } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { glossify } from "@/lib/glossary";
import {
  type Lang,
  reportDedupProse,
  reportFinding,
  reportProseFor,
  reportReason,
  reportVerdict,
  t,
} from "@/lib/i18n";
import { type Report, REPORTS, reportIssueUrl } from "@/lib/reports";

const SEV_CLASS: Record<string, string> = {
  P0: "bg-red-600/15 text-red-700 dark:bg-red-500/20 dark:text-red-400",
  P1: "bg-red-500/10 text-red-700 dark:bg-red-500/15 dark:text-red-400",
  P2: "bg-amber-500/10 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  P3: "bg-muted text-muted-foreground",
};

function reportsPath(lang: Lang, slug?: string) {
  const base = lang === "de" ? "/de/reports" : "/reports";
  return slug ? `${base}/${slug}` : base;
}

function ScorecardChips({ report, lang }: { report: Report; lang: Lang }) {
  const tt = t(lang);
  return (
    <div className="flex flex-wrap gap-2">
      {report.scorecard.map((s) => (
        <span
          key={s.audit}
          className="inline-flex items-baseline gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 font-mono text-xs"
        >
          <span className="text-muted-foreground">{s.audit}</span>
          <span className="text-sm font-semibold text-primary">{s.grade}</span>
          <span className="text-muted-foreground">{s.score}</span>
        </span>
      ))}
      <span className="inline-flex items-center rounded-lg border border-dashed border-border px-2.5 py-1.5 font-mono text-xs text-muted-foreground">
        {report.p0 === 0 ? tt.repZeroP0 : `${report.p0} P0`} · {report.p1 === 1 ? tt.repOneP1 : `${report.p1} P1`}
      </span>
    </div>
  );
}

/** The /reports gallery index — lists real runs + the "why real" framing. */
export function ReportsIndexPage({ lang }: { lang: Lang }) {
  const tt = t(lang);
  const langHref = lang === "de" ? "/reports" : "/de/reports";
  return (
    <div className="relative" lang={lang === "de" ? "de" : undefined}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {tt.skip}
      </a>
      <SiteHeader lang={lang} nav={[]} langHref={langHref} />
      <main id="main">
        <section className="relative overflow-hidden border-b border-border/60">
          <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
          <div className="relative mx-auto max-w-3xl px-5 py-16 md:py-20">
            <p className="font-mono text-xs uppercase tracking-widest text-primary">
              {tt.repIndexKicker}
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
              {tt.repIndexTitle}
            </h1>
            <p className="mt-4 max-w-prose text-pretty text-lg text-muted-foreground">
              {tt.repIndexLead}
            </p>
          </div>
        </section>

        <section className="border-b border-border/60 py-16">
          <div className="mx-auto max-w-6xl px-5">
            <div className="grid gap-4">
              {REPORTS.map((report) => {
                const prose = reportProseFor(lang, report.slug);
                return (
                  <Reveal key={report.slug}>
                    <a
                      href={reportsPath(lang, report.slug)}
                      className="group flex flex-col gap-4 rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50 hover:bg-accent/40 focus-visible:border-primary/50 focus-visible:bg-accent/40"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h2 className="text-xl font-semibold tracking-tight">{prose?.title}</h2>
                          <p className="mt-1 font-mono text-xs text-muted-foreground">
                            {report.target} · {report.date} · #{report.tracker}
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-1 font-mono text-xs text-primary">
                          {tt.repViewReport}
                          <ArrowRight
                            aria-hidden
                            className="size-3 transition-transform group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5"
                          />
                        </span>
                      </div>
                      <p className="max-w-prose text-sm text-muted-foreground">{prose?.summary}</p>
                      <ScorecardChips report={report} lang={lang} />
                    </a>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="font-mono text-xs uppercase tracking-widest text-primary">
              {tt.repIndexWhyTitle}
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {tt.repIndexWhy.map((item, i) => {
                const Icon = [FileSearch, ShieldCheck, GitHubMark][i] ?? FileSearch;
                return (
                  <Reveal key={item.t} delay={i * 0.05}>
                    <div className="h-full rounded-xl border border-border bg-card p-6">
                      <Icon aria-hidden className="size-5 text-primary" />
                      <h3 className="mt-4 font-medium">{item.t}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{glossify(item.d, lang)}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter lang={lang} />
    </div>
  );
}

/** A native per-report view: scorecard, applicable/not-applicable, findings,
 *  the cross-audit dedup exhibit, and the methodology framing. */
export function ReportDetailPage({ report, lang }: { report: Report; lang: Lang }) {
  const tt = t(lang);
  const prose = reportProseFor(lang, report.slug);
  const home = lang === "de" ? "/de" : "/";
  const langHref = lang === "de" ? `/reports/${report.slug}` : `/de/reports/${report.slug}`;
  const trackerUrl = reportIssueUrl(report.tracker);

  return (
    <div className="relative" lang={lang === "de" ? "de" : undefined}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {tt.skip}
      </a>
      <SiteHeader lang={lang} nav={[]} langHref={langHref} />
      <main id="main">
        <section className="relative overflow-hidden border-b border-border/60">
          <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
          <div className="relative mx-auto max-w-3xl px-5 py-16 md:py-20">
            <a
              href={reportsPath(lang)}
              className="inline-flex items-center gap-1 rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft aria-hidden className="size-4" />
              {tt.repBackToReports}
            </a>
            <p className="mt-6 font-mono text-xs uppercase tracking-widest text-primary">
              {tt.repIndexKicker}
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">{prose?.title}</h1>
            <p className="mt-4 max-w-prose text-pretty text-lg text-muted-foreground">
              {reportVerdict(lang, report.verdictKey)}
            </p>
            <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 font-mono text-xs text-muted-foreground">
              <div className="flex gap-2">
                <dt>{tt.repTarget}</dt>
                <dd>
                  <a
                    href={report.targetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline-offset-2 hover:underline"
                  >
                    {report.target}
                  </a>
                </dd>
              </div>
              <div className="flex gap-2">
                <dt>{tt.repDate}</dt>
                <dd className="text-foreground">{report.date}</dd>
              </div>
              <div className="flex gap-2">
                <dt>{tt.repTracker}</dt>
                <dd>
                  <a
                    href={trackerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline-offset-2 hover:underline"
                  >
                    #{report.tracker}
                  </a>
                </dd>
              </div>
            </dl>
            <div className="mt-8">
              <a
                href={trackerUrl}
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ size: "lg" }))}
              >
                <GitHubMark className="size-4" />
                {tt.repFullRun} (#{report.tracker})
              </a>
            </div>
          </div>
        </section>

        {/* Scorecard */}
        <section className="border-b border-border/60 py-16">
          <div className="mx-auto max-w-3xl px-5">
            <h2 className="font-mono text-xs uppercase tracking-widest text-primary">
              {tt.repScorecardTitle}
            </h2>
            <p className="mt-4 max-w-prose text-pretty text-muted-foreground">
              {tt.repScorecardLead.replace("{n}", String(report.scorecard.length))}
            </p>
            <div className="mt-6">
              <ScorecardChips report={report} lang={lang} />
            </div>
          </div>
        </section>

        {/* Not applicable, with reasons */}
        <section className="border-b border-border/60 py-16">
          <div className="mx-auto max-w-3xl px-5">
            <h2 className="font-mono text-xs uppercase tracking-widest text-primary">
              {tt.repNotApplicableTitle}
            </h2>
            <p className="mt-4 max-w-prose text-pretty text-muted-foreground">
              {tt.repNotApplicableLead}
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {report.notApplicable.map((na) => (
                <li
                  key={na.audit}
                  className="flex gap-3 rounded-xl border border-border bg-card p-4"
                >
                  <CircleDot aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="font-mono text-sm font-semibold">{na.audit}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {reportReason(lang, na.reasonKey)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Headline findings */}
        <section className="border-b border-border/60 py-16">
          <div className="mx-auto max-w-3xl px-5">
            <h2 className="font-mono text-xs uppercase tracking-widest text-primary">
              {tt.repFindingsTitle}
            </h2>
            <p className="mt-4 max-w-prose text-pretty text-muted-foreground">{tt.repFindingsLead}</p>
            <div className="mt-6 grid gap-4">
              {report.findings.map((f) => {
                const fp = reportFinding(lang, f.key);
                return (
                  <Reveal key={f.issue}>
                    <div className="rounded-xl border border-border bg-card p-6">
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={cn(
                            "shrink-0 rounded-md px-1.5 py-0.5 font-mono text-[11px] font-medium",
                            SEV_CLASS[f.severity],
                          )}
                        >
                          {f.severity}
                        </span>
                        <h3 className="font-mono text-sm font-semibold">{fp.title}</h3>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {f.lenses.map((l) => (
                          <span
                            key={l}
                            className="rounded-md border border-border bg-background px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                          >
                            {l}
                          </span>
                        ))}
                      </div>
                      {(fp.evidence || fp.before || fp.after) && (
                        <dl className="mt-4 space-y-1.5 font-mono text-xs">
                          {fp.evidence && (
                            <div className="flex flex-wrap gap-x-2">
                              <dt className="w-16 shrink-0 text-muted-foreground">{tt.repEvidence}</dt>
                              <dd className="min-w-0 break-words text-foreground">{fp.evidence}</dd>
                            </div>
                          )}
                          {fp.before && (
                            <div className="flex flex-wrap gap-x-2">
                              <dt className="w-16 shrink-0 text-muted-foreground">{tt.repBefore}</dt>
                              <dd className="min-w-0 break-words text-muted-foreground line-through">
                                {fp.before}
                              </dd>
                            </div>
                          )}
                          {fp.after && (
                            <div className="flex flex-wrap gap-x-2">
                              <dt className="w-16 shrink-0 text-muted-foreground">{tt.repAfter}</dt>
                              <dd className="min-w-0 break-words text-primary">{fp.after}</dd>
                            </div>
                          )}
                        </dl>
                      )}
                      <a
                        href={reportIssueUrl(f.issue)}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-5 inline-flex items-center gap-1 font-mono text-xs text-primary underline-offset-2 hover:underline"
                      >
                        {tt.repViewIssue} #{f.issue}
                        <ArrowRight aria-hidden className="size-3" />
                      </a>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Cross-audit dedup exhibit */}
        <section className="border-b border-border/60 py-16">
          <div className="mx-auto max-w-3xl px-5">
            <h2 className="font-mono text-xs uppercase tracking-widest text-primary">
              {tt.repDedupTitle}
            </h2>
            <p className="mt-4 max-w-prose text-pretty text-muted-foreground">{tt.repDedupLead}</p>
            <Reveal>
              <div className="mt-6 rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3">
                  <GitMerge aria-hidden className="size-5 shrink-0 text-primary" />
                  <h3 className="font-mono text-sm font-semibold">
                    {reportDedupProse(lang, report.dedup.key).title}
                  </h3>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">
                    {tt.repDedupFoundBy}:
                  </span>
                  {report.dedup.lenses.map((l) => (
                    <span
                      key={l}
                      className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                    >
                      <CheckCircle2 aria-hidden className="size-3 text-primary" />
                      {l}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  {reportDedupProse(lang, report.dedup.key).body}
                </p>
                <a
                  href={reportIssueUrl(report.dedup.issue)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-1 font-mono text-xs text-primary underline-offset-2 hover:underline"
                >
                  {tt.repViewIssue} #{report.dedup.issue}
                  <ArrowRight aria-hidden className="size-3" />
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Methodology framing */}
        <section className="py-16">
          <div className="mx-auto max-w-3xl px-5">
            <h2 className="font-mono text-xs uppercase tracking-widest text-primary">
              {tt.repMethodTitle}
            </h2>
            <p className="mt-4 max-w-prose text-pretty text-muted-foreground">
              {glossify(tt.repMethodLead, lang)}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={trackerUrl}
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ size: "lg" }))}
              >
                <GitHubMark className="size-4" />
                {tt.repFullRun} (#{report.tracker})
              </a>
              <a
                href={`${home}#how`}
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                {tt.howTitle}
                <ArrowRight aria-hidden className="size-4" />
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter lang={lang} />
    </div>
  );
}
