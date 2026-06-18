import { ArrowLeft, ArrowRight } from "lucide-react";
import { AuditDiagram, auditLenses } from "@/components/audit-diagram";
import { CopyCommandButton } from "@/components/copy-command";
import { GitHubMark } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AUDIT_COMMAND, PROMPTS } from "@/lib/content";
import { auditDetail } from "@/lib/audit-details";
import { glossify } from "@/lib/glossary";
import { audits, type Lang, t } from "@/lib/i18n";

/** A per-audit detail page: approach + concrete use cases, for deep-linking. */
export function AuditDetailPage({ name, lang }: { name: string; lang: Lang }) {
  const tt = t(lang);
  const audit = audits(lang).find((a) => a.name === name);
  const detail = auditDetail(name, lang);
  if (!audit || !detail) return null;

  const Icon = audit.icon;
  const lenses = auditLenses(audit.blurb);
  const home = lang === "de" ? "/de" : "/";
  const langHref = lang === "de" ? `/audits/${name}` : `/de/audits/${name}`;

  const copy = (
    <CopyCommandButton
      command={AUDIT_COMMAND}
      label={tt.heroCtaCopy}
      copiedLabel={tt.agentCopied}
      copiedAnnounce={tt.agentCopiedAnnounce}
      failedAnnounce={tt.agentCopyFailed}
    />
  );

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
              href={`${home}#audits`}
              className="inline-flex items-center gap-1 rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft aria-hidden className="size-4" />
              {tt.apAllAudits}
            </a>
            <div className="mt-6 flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-xl border border-border bg-card">
                <Icon aria-hidden className="size-5 text-primary" />
              </span>
              <p className="font-mono text-xs uppercase tracking-widest text-primary">
                {tt.apKicker}
              </p>
            </div>
            <h1 className="mt-5 font-mono text-4xl font-semibold tracking-tight sm:text-5xl">
              {audit.name}
            </h1>
            <p className="mt-4 max-w-prose text-pretty text-lg text-muted-foreground">
              {glossify(detail.tagline, lang)}
            </p>
            <p className="mt-6 font-mono text-xs text-muted-foreground">
              {tt.apMaps}: {glossify(audit.mapsTo, lang)}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              {copy}
              <a
                href={`${PROMPTS}/${audit.file}`}
                target="_blank"
                rel="noreferrer"
                aria-label={`${tt.apViewPrompt} ${tt.newTab}`}
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                <GitHubMark className="size-4" />
                {tt.apViewPrompt}
              </a>
            </div>
          </div>
        </section>

        <section className="border-b border-border/60 py-12">
          <div className="mx-auto max-w-3xl px-5">
            <AuditDiagram lenses={lenses} lang={lang} />
          </div>
        </section>

        <section className="border-b border-border/60 py-16">
          <div className="mx-auto max-w-3xl px-5">
            <h2 className="font-mono text-xs uppercase tracking-widest text-primary">
              {tt.apApproach}
            </h2>
            <p className="mt-4 max-w-prose text-pretty text-muted-foreground">
              {glossify(detail.approach, lang)}
            </p>
          </div>
        </section>

        <section className="border-b border-border/60 py-16">
          <div className="mx-auto max-w-3xl px-5">
            <h2 className="font-mono text-xs uppercase tracking-widest text-primary">
              {tt.apUseCases}
            </h2>
            <div className="mt-6 grid gap-4">
              {detail.useCases.map((uc) => (
                <Reveal key={uc.title}>
                  <div className="flex gap-4 rounded-xl border border-border bg-card p-6">
                    <ArrowRight aria-hidden className="mt-1 size-4 shrink-0 text-primary" />
                    <div>
                      <h3 className="font-medium">{uc.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{glossify(uc.body, lang)}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-3xl px-5">
            <h2 className="font-mono text-xs uppercase tracking-widest text-primary">
              {tt.apOutput}
            </h2>
            <p className="mt-4 max-w-prose text-pretty text-muted-foreground">
              {glossify(detail.output, lang)}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              {copy}
              <a
                href={`${home}#audits`}
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                {tt.apOthers}
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
