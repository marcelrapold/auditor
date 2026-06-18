import Link from "next/link";
import { ArrowDown, ArrowRight, CircleDot, Search, ShieldCheck, Terminal } from "lucide-react";
import { CommandBlock, CopyCommandButton } from "@/components/copy-command";
import { GitHubMark } from "@/components/icons";
import { MobileNav } from "@/components/mobile-nav";
import { Reveal } from "@/components/reveal";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AUDIT_COMMAND,
  AUDIT_COUNT,
  BACKLOG_SAMPLE,
  PROMPTS,
  REPO,
  SAMPLE_FINDING,
  SCORECARD,
  VERSION,
} from "@/lib/content";
import { glossify } from "@/lib/glossary";
import { DESCRIPTION, SITE_URL } from "@/lib/site";
import {
  type Lang,
  audits as auditsFor,
  phases as phasesFor,
  principles as principlesFor,
  standards as standardsFor,
  t,
} from "@/lib/i18n";

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${SITE_URL}#software`,
  name: "auditor",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  description: DESCRIPTION,
  url: SITE_URL,
  image: `${SITE_URL}/opengraph-image`,
  author: { "@type": "Person", name: "Marcel Rapold" },
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  license: "https://opensource.org/licenses/MIT",
  codeRepository: REPO,
  sameAs: [REPO],
};

function navItems(lang: Lang) {
  const tt = t(lang);
  return [
    { href: "#use", label: tt.nav.use },
    { href: "#audits", label: tt.nav.audits },
    { href: "#how", label: tt.nav.how },
    { href: "#standards", label: tt.nav.standards },
  ];
}

export function Landing({ lang }: { lang: Lang }) {
  const tt = t(lang);
  return (
    <div className="relative" lang={lang === "de" ? "de" : undefined}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {tt.skip}
      </a>
      <Header lang={lang} />
      <main id="main">
        <Hero lang={lang} />
        <AgentEntry lang={lang} />
        <Principles lang={lang} />
        <Proof lang={lang} />
        <Audits lang={lang} />
        <HowItWorks lang={lang} />
        <Standards lang={lang} />
        <CallToAction lang={lang} />
      </main>
      <Footer lang={lang} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
    </div>
  );
}

function LangToggle({ lang }: { lang: Lang }) {
  const tt = t(lang);
  const other = lang === "en" ? { href: "/de", label: "DE" } : { href: "/", label: "EN" };
  return (
    <Link
      href={other.href}
      aria-label={tt.langToggle}
      className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background/60 px-3 text-xs font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:h-9"
    >
      {other.label}
    </Link>
  );
}

function Header({ lang }: { lang: Lang }) {
  const tt = t(lang);
  const home = lang === "de" ? "/de" : "/";
  const items = navItems(lang);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link
          href={home}
          className="flex items-center gap-2 rounded-md font-mono text-sm font-semibold tracking-tight"
        >
          <ShieldCheck aria-hidden className="size-5 text-primary" />
          auditor
        </Link>
        <nav
          aria-label="Primary"
          className="hidden items-center gap-7 text-sm text-muted-foreground md:flex"
        >
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={REPO}
            target="_blank"
            rel="noreferrer"
            aria-label={`${tt.ghRepo} ${tt.newTab}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "h-10 sm:h-9",
            )}
          >
            <GitHubMark className="size-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
          <LangToggle lang={lang} />
          <ThemeToggle
            lightLabel={tt.themeLight}
            darkLabel={tt.themeDark}
            toggleLabel={tt.themeToggle}
          />
          <MobileNav
            items={items}
            openLabel={tt.menuOpen}
            closeLabel={tt.menuClose}
            navLabel={tt.navMobile}
          />
        </div>
      </div>
    </header>
  );
}

function Hero({ lang }: { lang: Lang }) {
  const tt = t(lang);
  return (
    <section id="top" className="relative overflow-hidden border-b border-border/60">
      <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 size-[min(40rem,90vw)] -translate-x-1/2"
      >
        <div className="size-full rounded-full bg-primary/10 blur-3xl animate-aurora-1" />
      </div>
      <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-12 text-center md:py-32">
        <Reveal immediate>
          <Badge className="mx-auto">
            <span className="size-1.5 rounded-full bg-primary animate-badge-pulse" />
            {AUDIT_COUNT} {tt.heroBadge} · {VERSION}
          </Badge>
        </Reveal>
        <Reveal immediate>
          <h1 className="mx-auto mt-6 max-w-4xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            {tt.heroTitle}
          </h1>
        </Reveal>
        <Reveal immediate delay={0.1}>
          <p className="mx-auto mt-6 max-w-prose text-pretty text-lg text-muted-foreground">
            {tt.heroSub}
          </p>
        </Reveal>
        <Reveal immediate delay={0.14}>
          <p className="mx-auto mt-5 max-w-prose text-pretty text-base font-medium text-foreground/90">
            {tt.heroContrast}
          </p>
        </Reveal>
        <Reveal immediate delay={0.18}>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 [&>*]:w-full sm:flex-row sm:[&>*]:w-auto">
            <CopyCommandButton
              command={AUDIT_COMMAND}
              label={tt.heroCtaCopy}
              copiedLabel={tt.agentCopied}
              copiedAnnounce={tt.agentCopiedAnnounce}
              failedAnnounce={tt.agentCopyFailed}
            />
            <a href="#proof" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
              {tt.heroCtaProof}
              <ArrowRight aria-hidden className="size-4" />
            </a>
          </div>
        </Reveal>
        <Reveal immediate delay={0.2}>
          <p className="mt-3 text-xs text-muted-foreground">{tt.heroCtaHint}</p>
        </Reveal>
        <Reveal immediate delay={0.22}>
          <p className="mt-8 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {tt.heroMeta}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Section({
  id,
  eyebrow,
  title,
  lead,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="border-b border-border/60 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-widest text-primary">{eyebrow}</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h2>
          {lead ? (
            <p className="mt-4 max-w-prose text-pretty text-muted-foreground">{lead}</p>
          ) : null}
        </Reveal>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

function AgentEntry({ lang }: { lang: Lang }) {
  const tt = t(lang);
  return (
    <Section id="use" eyebrow={tt.agentEyebrow} title={tt.agentTitle} lead={tt.agentLead}>
      <div className="rounded-xl border border-border bg-card p-6">
        <CommandBlock
          command={AUDIT_COMMAND}
          verb={tt.agentCmdVerb}
          using={tt.agentCmdUsing}
          copyLabel={tt.agentCopy}
          copiedLabel={tt.agentCopied}
          copiedAnnounce={tt.agentCopiedAnnounce}
          failedAnnounce={tt.agentCopyFailed}
          hint={tt.agentCopyHint}
        />
        <p className="mt-4 border-t border-border/60 pt-4 text-sm text-muted-foreground">
          {tt.agentExplain.replace("{count}", String(AUDIT_COUNT))}
        </p>
        <p className="mt-4 font-mono text-xs text-muted-foreground/80">
          {tt.agentNotePre}{" "}
          <a href="/llms.txt" className="text-primary underline-offset-2 hover:underline">
            auditor.rapold.io/llms.txt
          </a>{" "}
          {tt.agentNotePost}
        </p>
      </div>
      <div className="mt-6">
        <h3 className="font-medium">{tt.trustTitle}</h3>
        <dl className="mt-4 grid gap-4 sm:grid-cols-3">
          {tt.trust.map((item) => (
            <div key={item.q} className="rounded-xl border border-border bg-card p-6">
              <dt className="text-sm font-medium">{item.q}</dt>
              <dd className="mt-2 text-sm text-muted-foreground">{item.a}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="mt-8">
        <a href="#audits" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
          {tt.agentCtaSeeAudits.replace("{count}", String(AUDIT_COUNT))}
          <ArrowRight aria-hidden className="size-4" />
        </a>
      </div>
    </Section>
  );
}

function Principles({ lang }: { lang: Lang }) {
  const tt = t(lang);
  return (
    <Section eyebrow={tt.prinEyebrow} title={tt.prinTitle}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {principlesFor(lang).map((p, i) => (
          <Reveal key={p.title} delay={i * 0.05}>
            <div className="h-full rounded-xl border border-border bg-card p-6">
              <p.icon aria-hidden className="size-5 text-primary" />
              <h3 className="mt-4 font-medium">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{glossify(p.body, lang)}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

const SEV_CLASS: Record<string, string> = {
  P1: "bg-red-500/10 text-red-700 dark:bg-red-500/15 dark:text-red-400",
  P2: "bg-amber-500/10 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  P3: "bg-muted text-muted-foreground",
};

function Proof({ lang }: { lang: Lang }) {
  const tt = t(lang);
  const rows = BACKLOG_SAMPLE.map((b, i) => ({ ...b, title: tt.proofRows[i] }));
  return (
    <Section id="proof" eyebrow={tt.proofEyebrow} title={tt.proofTitle} lead={tt.proofLead}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:items-center">
        {/* The real backlog from this page's own content audit — a framed GitHub issues view. */}
        <Reveal className="lg:col-span-3">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 border-b border-border/60 bg-muted/40 px-4 py-2.5">
              <span className="size-2.5 rounded-full bg-border" />
              <span className="size-2.5 rounded-full bg-border" />
              <span className="size-2.5 rounded-full bg-primary/40" />
              <span className="ml-2 min-w-0 truncate font-mono text-xs text-muted-foreground">
                github.com/marcelrapold/auditor/issues
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-2.5">
              <span className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-2.5 py-1 font-mono text-xs text-muted-foreground">
                <Search aria-hidden className="size-3.5" />
                is:issue label:content
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                23 {tt.proofFindings}
              </span>
            </div>
            <ul>
              {rows.map((b) => (
                <li key={b.n} className="border-b border-border/60 last:border-0">
                  <a
                    href={`${REPO}/issues/${b.n}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-start gap-2.5 px-4 py-3 transition-colors hover:bg-accent/40 focus-visible:bg-accent/40"
                  >
                    <CircleDot aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <span
                      className={cn(
                        "shrink-0 rounded-md px-1.5 py-0.5 font-mono text-[11px] font-medium",
                        SEV_CLASS[b.sev],
                      )}
                    >
                      {b.sev}
                    </span>
                    <span className="min-w-0 text-sm text-foreground">
                      {b.title}{" "}
                      <span className="font-mono text-xs text-muted-foreground">#{b.n}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Explanation + the real cross-audit grades, alongside the exhibit. */}
        <Reveal className="lg:col-span-2">
          <p className="text-pretty text-lg font-medium text-foreground">{tt.proofAnnotation}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {SCORECARD.map((s) => (
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
              0 P0 · 1 P1
            </span>
          </div>
          <p className="mt-5 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <ArrowDown aria-hidden className="size-4" />
            {tt.proofVerifyHint}
          </p>
        </Reveal>
      </div>

      {/* One finding, in full — real evidence + before/after from the same run. */}
      <Reveal>
        <div className="mt-6 rounded-xl border border-border bg-card p-6">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={cn(
                "shrink-0 rounded-md px-1.5 py-0.5 font-mono text-[11px] font-medium",
                SEV_CLASS[SAMPLE_FINDING.severity],
              )}
            >
              {SAMPLE_FINDING.severity}
            </span>
            <h3 className="font-mono text-sm font-semibold">{SAMPLE_FINDING.title}</h3>
          </div>
          <dl className="mt-4 space-y-1.5 font-mono text-xs">
            <div className="flex flex-wrap gap-x-2">
              <dt className="w-16 shrink-0 text-muted-foreground">{tt.proofEvidence}</dt>
              <dd className="min-w-0 break-words text-foreground">{SAMPLE_FINDING.evidence}</dd>
            </div>
            <div className="flex flex-wrap gap-x-2">
              <dt className="w-16 shrink-0 text-muted-foreground">{tt.proofBefore}</dt>
              <dd className="min-w-0 break-words text-muted-foreground line-through">
                {SAMPLE_FINDING.before}
              </dd>
            </div>
            <div className="flex flex-wrap gap-x-2">
              <dt className="w-16 shrink-0 text-muted-foreground">{tt.proofAfter}</dt>
              <dd className="min-w-0 break-words text-primary">{SAMPLE_FINDING.after}</dd>
            </div>
          </dl>
          <a
            href={`${REPO}/issues/${SAMPLE_FINDING.issue}`}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-1 font-mono text-xs text-primary underline-offset-2 hover:underline"
          >
            Issue #{SAMPLE_FINDING.issue}
            <ArrowRight aria-hidden className="size-3" />
          </a>
        </div>
      </Reveal>

      <Reveal>
        <div className="mt-8">
          <a
            href={`${REPO}/issues/97`}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            {tt.proofCta}
            <ArrowRight aria-hidden className="size-4" />
          </a>
        </div>
      </Reveal>
    </Section>
  );
}

function Audits({ lang }: { lang: Lang }) {
  const tt = t(lang);
  return (
    <Section
      id="audits"
      eyebrow={tt.audEyebrow}
      title={tt.audTitle.replace("{count}", String(AUDIT_COUNT))}
      lead={tt.audLead}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {auditsFor(lang).map((a, i) => (
          <Reveal key={a.name} delay={(i % 3) * 0.05}>
            <a
              href={`${PROMPTS}/${a.file}`}
              target="_blank"
              rel="noreferrer"
              className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50 hover:bg-accent/40 focus-visible:border-primary/50 focus-visible:bg-accent/40"
            >
              <a.icon aria-hidden className="size-5 text-primary" />
              <h3 className="mt-4 font-mono text-sm font-semibold">{a.name}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{glossify(a.blurb, lang)}</p>
              <p className="mt-4 font-mono text-xs text-muted-foreground">{glossify(a.mapsTo, lang)}</p>
            </a>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function HowItWorks({ lang }: { lang: Lang }) {
  const tt = t(lang);
  const phases = phasesFor(lang);
  const specialists = ["security", "accessibility", "performance", "data"];
  return (
    <Section id="how" eyebrow={tt.howEyebrow} title={tt.howTitle} lead={tt.howLead}>
      <Reveal>
        <div className="relative mx-auto max-w-2xl pl-12">
          {/* The spine, with a single pulse flowing down it (data through the pipeline). */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-2 left-[18px] top-2 w-px overflow-hidden bg-border"
          >
            <div className="wf-comet absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-primary to-transparent" />
          </div>

          {/* Input — one line into any capable agent (framing, not a numbered step). */}
          <div className="relative mb-7">
            <span className="absolute -left-12 top-0 flex size-9 items-center justify-center rounded-full border border-primary/40 bg-card text-primary">
              <Terminal aria-hidden className="size-4" />
            </span>
            <p className="font-mono text-sm">
              <span aria-hidden className="text-primary">$</span>{" "}
              <span className="text-foreground">{tt.agentCmdVerb}</span> {tt.agentCmdUsing}{" "}
              <span className="text-foreground">auditor.rapold.io</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{tt.howInput}</p>
          </div>

          {/* The six phases — the ordered list is exactly the six numbered steps. */}
          <ol className="space-y-7">
            {phases.map((phase) => (
              <li key={phase.n} className="relative">
                <span className="absolute -left-12 top-0 flex size-9 items-center justify-center rounded-full border border-border bg-card font-mono text-sm font-semibold text-primary">
                  {phase.n}
                </span>
                <h3 className="font-medium">{phase.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{glossify(phase.body, lang)}</p>
                {phase.n === "1" ? (
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    {specialists.map((s) => (
                      <span
                        key={s}
                        className="rounded-md border border-border bg-card px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                      >
                        {s}
                      </span>
                    ))}
                    <span className="font-mono text-[11px] text-muted-foreground">
                      … · {tt.howParallel}
                    </span>
                  </div>
                ) : null}
                {phase.n === "3" ? (
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-primary/40 bg-primary/5 px-2 py-1 font-mono text-[11px] font-medium text-primary">
                    <ShieldCheck aria-hidden className="size-3.5" />
                    {tt.howGate}
                  </div>
                ) : null}
              </li>
            ))}

          </ol>

          {/* Output — priority-sorted GitHub issues (framing, not a numbered step). */}
          <div className="relative mt-7">
            <span className="absolute -left-12 top-0 flex size-9 items-center justify-center rounded-full border border-primary/40 bg-card text-primary">
              <GitHubMark className="size-4" />
            </span>
            <p className="text-sm font-medium text-foreground">{tt.howOutput}</p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

function Standards({ lang }: { lang: Lang }) {
  const tt = t(lang);
  return (
    <Section id="standards" eyebrow={tt.stdEyebrow} title={tt.stdTitle} lead={tt.stdLead}>
      <div className="grid gap-4 md:grid-cols-2">
        {standardsFor(lang).map((s, i) => (
          <Reveal key={s.name} delay={i * 0.05}>
            <a
              href={`${REPO}/blob/main/${s.file}`}
              target="_blank"
              rel="noreferrer"
              className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50 hover:bg-accent/40 focus-visible:border-primary/50 focus-visible:bg-accent/40"
            >
              <s.icon aria-hidden className="size-5 text-primary" />
              <h3 className="mt-4 text-lg font-medium">{s.name}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{glossify(s.blurb, lang)}</p>
              <span className="mt-4 inline-flex items-center gap-1 font-mono text-xs text-primary">
                {s.file}
                <ArrowRight
                  aria-hidden
                  className="size-3 transition-transform group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5"
                />
              </span>
            </a>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function CallToAction({ lang }: { lang: Lang }) {
  const tt = t(lang);
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <div className="relative overflow-hidden rounded-xl border border-border bg-card px-6 py-16 text-center">
            <div className="pointer-events-none absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                {tt.ctaTitle}
              </h2>
              <p className="mx-auto mt-4 max-w-prose text-muted-foreground">{tt.ctaLead}</p>
              <p className="mx-auto mt-5 max-w-prose font-mono text-xs text-muted-foreground/80">
                <a
                  href={`${REPO}/issues/97`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline-offset-2 hover:underline"
                >
                  {tt.proofStrip}
                </a>
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a href={PROMPTS} target="_blank" rel="noreferrer" className={cn(buttonVariants({ size: "lg" }))}>
                  <GitHubMark className="size-4" />
                  {tt.ctaBtnGet}
                </a>
                <a
                  href={`${REPO}#quickstart`}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
                >
                  {tt.ctaBtnQuick}
                  <ArrowRight aria-hidden className="size-4" />
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer({ lang }: { lang: Lang }) {
  const tt = t(lang);
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 text-sm text-muted-foreground sm:flex-row">
        <p className="flex items-center gap-2 font-mono">
          <ShieldCheck aria-hidden className="size-4 text-primary" />
          {tt.footerLicense}
        </p>
        <nav aria-label="Footer" className="flex items-center gap-6">
          <a
            href={REPO}
            target="_blank"
            rel="noreferrer"
            aria-label={`${tt.footerGithub} ${tt.newTab}`}
            className="rounded-md hover:text-foreground"
          >
            {tt.footerGithub}
          </a>
          <a
            href={`${REPO}/blob/main/DOCUMENTATION-STANDARD.md`}
            target="_blank"
            rel="noreferrer"
            aria-label={`${tt.footerStandard} ${tt.newTab}`}
            className="rounded-md hover:text-foreground"
          >
            {tt.footerStandard}
          </a>
          <a
            href={`${REPO}/blob/main/CHANGELOG.md`}
            target="_blank"
            rel="noreferrer"
            aria-label={`${tt.footerChangelog} ${tt.newTab}`}
            className="rounded-md hover:text-foreground"
          >
            {tt.footerChangelog}
          </a>
        </nav>
      </div>
    </footer>
  );
}
