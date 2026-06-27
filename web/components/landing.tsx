import Image from "next/image";
import { ArrowDown, ArrowRight, CircleDot, Search, ShieldCheck, Terminal } from "lucide-react";
import { CommandBlock, CopyCommandButton } from "@/components/copy-command";
import { HeroArtworkStack } from "@/components/hero-artwork";
import { GitHubMark } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { SiteFooter, SiteHeader, homeNav } from "@/components/site-chrome";
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
} from "@/lib/content";
import { glossify } from "@/lib/glossary";
import { heroSrc } from "@/lib/heroes";
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
  author: { "@type": "Person", name: "Marcel Rapold" },
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  license: "https://opensource.org/licenses/MIT",
  codeRepository: REPO,
  sameAs: [REPO],
};

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
      <SiteHeader lang={lang} nav={homeNav(lang)} langHref={lang === "de" ? "/" : "/de"} />
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
      <SiteFooter lang={lang} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
    </div>
  );
}

function Hero({ lang }: { lang: Lang }) {
  const tt = t(lang);
  const count = String(AUDIT_COUNT);
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden border-b border-border/60 lg:flex lg:min-h-[88vh] lg:items-center"
    >
      {/* faint grid backdrop (mostly covered by the full-bleed artwork on desktop) */}
      <div className="pointer-events-none absolute inset-0 -z-30 bg-grid [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />

      {/* Desktop artwork — full-bleed across the whole hero; only the top and bottom
          fade into the section so the bleed has no hard seams. */}
      <HeroArtworkStack
        className={cn(
          "hidden lg:absolute lg:inset-0 lg:-z-20 lg:block",
          "[mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]",
        )}
      />

      {/* Soft legibility wash — light enough that the artwork still reads behind
          the copy (text sits ON the artwork, not beside a dark panel). The text
          itself carries a shadow for safety on the brighter areas. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 hidden bg-gradient-to-r from-background/75 via-background/25 to-transparent lg:block"
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 py-16 md:py-24 lg:py-0">
        <div className="max-w-[560px] text-center lg:text-left lg:[text-shadow:0_1px_14px_rgba(0,0,0,0.6)]">
          <Reveal immediate>
            <Badge className="mx-auto lg:mx-0">
              <span className="size-1.5 rounded-full bg-primary animate-badge-pulse" />
              {tt.heroBadge}
            </Badge>
          </Reveal>
          <Reveal immediate>
            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[3.3rem] lg:leading-[1.05]">
              {tt.heroTitle}
            </h1>
          </Reveal>
          <Reveal immediate delay={0.1}>
            <p className="mx-auto mt-6 max-w-prose text-pretty text-lg text-muted-foreground lg:mx-0">
              {tt.heroSub.replace("{count}", count)}
            </p>
          </Reveal>
          <Reveal immediate delay={0.14}>
            <p className="mt-6 font-mono text-xs uppercase tracking-widest text-primary/90">
              {tt.heroMeta.replace("{count}", count)}
            </p>
          </Reveal>
          <Reveal immediate delay={0.18}>
            <div className="mt-9 flex flex-col items-center gap-3 [&>*]:w-full sm:flex-row sm:[&>*]:w-auto lg:items-start lg:justify-start">
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
        </div>

        {/* Mobile / tablet: a full-bleed artwork band below the CTA — edge to edge
            (not a boxed thumbnail), no parallax, fading into the page top and bottom. */}
        <div className="-mx-5 mt-14 lg:hidden">
          <HeroArtworkStack
            parallax={false}
            className="aspect-[16/10] w-full [mask-image:linear-gradient(to_bottom,transparent_0%,black_16%,black_88%,transparent_100%)]"
          />
        </div>
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
  const base = lang === "de" ? "/de/audits" : "/audits";
  return (
    <Section
      id="audits"
      eyebrow={tt.audEyebrow}
      title={tt.audTitle.replace("{count}", String(AUDIT_COUNT))}
      lead={tt.audLead}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {auditsFor(lang).map((a, i) => {
          const hero = heroSrc(a.name);
          return (
            <Reveal key={a.name} delay={(i % 3) * 0.05}>
              <a
                href={`${base}/${a.name}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/50 focus-visible:border-primary/50"
              >
                {hero ? (
                  <div className="relative aspect-video w-full overflow-hidden">
                    <Image
                      src={hero}
                      alt=""
                      aria-hidden
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    {/* Fade only the bottom so the overlaid title stays legible; hover lifts it
                        to reveal more of the photo. */}
                    <div
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 top-1/3 bg-gradient-to-t from-card via-card/70 to-transparent transition-colors duration-500 group-hover:via-card/40"
                    />
                    {/* Icon + title sit directly on the image, over the fade. */}
                    <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 px-6 pb-8">
                      <a.icon
                        aria-hidden
                        className="size-7 shrink-0 text-primary transition-[filter] duration-300 group-hover:[filter:drop-shadow(0_0_10px_currentColor)]"
                      />
                      <h3 className="flex items-center gap-1.5 font-mono text-base font-semibold">
                        {a.name}
                        <ArrowRight
                          aria-hidden
                          className="size-4 -translate-x-1 text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                        />
                      </h3>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5 px-6 pt-6">
                    <a.icon aria-hidden className="size-6 text-primary" />
                    <h3 className="font-mono text-base font-semibold">{a.name}</h3>
                  </div>
                )}
                <div className="flex flex-1 flex-col px-6 pb-6 pt-2">
                  <p className="flex-1 text-sm text-muted-foreground">{glossify(a.blurb, lang)}</p>
                  <p className="mt-4 font-mono text-xs text-muted-foreground">{glossify(a.mapsTo, lang)}</p>
                </div>
              </a>
            </Reveal>
          );
        })}
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

