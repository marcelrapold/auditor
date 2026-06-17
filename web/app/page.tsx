import { ArrowRight, ShieldCheck } from "lucide-react";
import { GitHubMark } from "@/components/icons";
import { MobileNav } from "@/components/mobile-nav";
import { Reveal } from "@/components/reveal";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DESCRIPTION, SITE_URL } from "@/lib/site";
import {
  AUDITS,
  AUDIT_COUNT,
  NAV,
  PHASES,
  PRINCIPLES,
  PROMPTS,
  REPO,
  STANDARDS,
} from "@/lib/content";

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "auditor",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  description: DESCRIPTION,
  url: SITE_URL,
  author: { "@type": "Person", name: "Marcel Rapold" },
  offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
  license: "https://opensource.org/licenses/MIT",
  codeRepository: REPO,
};

export default function Home() {
  return (
    <div className="relative">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <AgentEntry />
        <Principles />
        <Audits />
        <HowItWorks />
        <Standards />
        <CallToAction />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a
          href="#top"
          className="flex items-center gap-2 rounded-md font-mono text-sm font-semibold tracking-tight"
        >
          <ShieldCheck aria-hidden className="size-5 text-primary" />
          auditor
        </a>
        <nav
          aria-label="Primary"
          className="hidden items-center gap-7 text-sm text-muted-foreground md:flex"
        >
          {NAV.map((item) => (
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
            aria-label="GitHub repository (opens in a new tab)"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "h-10 sm:h-9",
            )}
          >
            <GitHubMark className="size-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-border/60"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 size-[min(40rem,90vw)] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-5 py-24 text-center md:py-32">
        <Reveal>
          <Badge className="mx-auto">
            <span className="size-1.5 rounded-full bg-primary" />
            {AUDIT_COUNT} audits · MIT · copy &amp; paste
          </Badge>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mx-auto mt-6 max-w-4xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            Turn any AI agent into a swarm of specialist auditors
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-prose text-pretty text-lg text-muted-foreground">
            An open-source library of master prompts — copy one into your AI coding
            agent and get back an evidence-bound, adversarially verified audit backlog,
            filed as German GitHub issues led by a priority-sorted tracker.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={REPO}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ size: "lg" }))}
            >
              <GitHubMark className="size-4" />
              View on GitHub
            </a>
            <a
              href={`${REPO}/blob/main/DOCUMENTATION-STANDARD.md`}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Read the standard
              <ArrowRight aria-hidden className="size-4" />
            </a>
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-8 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            evidence-bound · adversarially verified · 30/60/90 roadmap
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function AgentEntry() {
  return (
    <Section
      id="use"
      eyebrow="Run it"
      title="Point your AI agent at auditor.rapold.io"
      lead="No install. Tell your AI coding agent to audit a repo using auditor.rapold.io — it fetches the orchestrator, asks your language and which audits to run, then files the issues."
    >
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="font-mono text-sm text-muted-foreground">
          <span className="text-primary">$</span> Audit{" "}
          <span className="text-foreground">github.com/your/repo</span> using{" "}
          <span className="text-foreground">auditor.rapold.io</span>
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          The orchestrator then asks: output language (Deutsch / English), which of the 11 audits
          (or the full repo), and whether to create issues — then runs them and opens a
          priority-sorted tracker.
        </p>
        <p className="mt-4 border-t border-border/60 pt-4 font-mono text-xs text-muted-foreground/80">
          AI agents: fetch{" "}
          <a
            href="/llms.txt"
            className="text-primary underline-offset-2 hover:underline"
          >
            auditor.rapold.io/llms.txt
          </a>{" "}
          and act as the audit orchestrator (ask language + scope, then run).
        </p>
      </div>
    </Section>
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
          <p className="font-mono text-xs uppercase tracking-widest text-primary">
            {eyebrow}
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h2>
          {lead ? (
            <p className="mt-4 max-w-prose text-pretty text-muted-foreground">
              {lead}
            </p>
          ) : null}
        </Reveal>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

function Principles() {
  return (
    <Section
      eyebrow="Why it is different"
      title="Most audit prompts return unverified opinions. These enforce discipline."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PRINCIPLES.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.05}>
            <div className="h-full rounded-xl border border-border bg-card p-6">
              <p.icon aria-hidden className="size-5 text-primary" />
              <h3 className="mt-4 font-medium">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function Audits() {
  return (
    <Section
      id="audits"
      eyebrow="The library"
      title="Eleven stack-agnostic audits, one shared methodology"
      lead="Each is a self-contained master prompt. Run several against the same target and the findings compose cleanly."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {AUDITS.map((a, i) => (
          <Reveal key={a.name} delay={(i % 3) * 0.05}>
            <a
              href={`${PROMPTS}/${a.file}`}
              target="_blank"
              rel="noreferrer"
              className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50 hover:bg-accent/40 focus-visible:border-primary/50 focus-visible:bg-accent/40"
            >
              <a.icon aria-hidden className="size-5 text-primary" />
              <h3 className="mt-4 font-mono text-sm font-semibold">{a.name}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{a.blurb}</p>
              <p className="mt-4 font-mono text-xs text-muted-foreground">{a.mapsTo}</p>
            </a>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function HowItWorks() {
  return (
    <Section
      id="how"
      eyebrow="The method"
      title="Six phases, every time"
      lead="Recon, a parallel specialist swarm, then adversarial verification before anything reaches the report."
    >
      <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {PHASES.map((phase, i) => (
          <Reveal key={phase.n} delay={(i % 3) * 0.05}>
            <li className="flex h-full gap-4 rounded-xl border border-border bg-card p-6">
              <span className="font-mono text-2xl font-semibold text-primary/60">
                {phase.n}
              </span>
              <div>
                <h3 className="font-medium">{phase.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{phase.body}</p>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

function Standards() {
  return (
    <Section
      id="standards"
      eyebrow="The yardsticks"
      title="Two normative standards govern the output"
      lead="Reusable on their own. They keep every audit's report and issues consistent and measurable."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {STANDARDS.map((s, i) => (
          <Reveal key={s.name} delay={i * 0.05}>
            <a
              href={`${REPO}/blob/main/${s.file}`}
              target="_blank"
              rel="noreferrer"
              className="group flex h-full flex-col rounded-xl border border-border bg-card p-7 transition-colors hover:border-primary/50 hover:bg-accent/40 focus-visible:border-primary/50 focus-visible:bg-accent/40"
            >
              <s.icon aria-hidden className="size-5 text-primary" />
              <h3 className="mt-4 text-lg font-medium">{s.name}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{s.blurb}</p>
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

function CallToAction() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <div className="relative overflow-hidden rounded-xl border border-border bg-card px-6 py-16 text-center">
            <div className="pointer-events-none absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                Point one at your repo and read the issues
              </h2>
              <p className="mx-auto mt-4 max-w-prose text-muted-foreground">
                Paste a master prompt into your AI coding agent, fill the small config
                block, and review a priority-sorted backlog of fixes.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href={REPO}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(buttonVariants({ size: "lg" }))}
                >
                  <GitHubMark className="size-4" />
                  Get the prompts
                </a>
                <a
                  href={`${REPO}#quickstart`}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
                >
                  Quickstart
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

function Footer() {
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 text-sm text-muted-foreground sm:flex-row">
        <p className="flex items-center gap-2 font-mono">
          <ShieldCheck aria-hidden className="size-4 text-primary" />
          auditor — MIT licensed
        </p>
        <nav aria-label="Footer" className="flex items-center gap-6">
          <a
            href={REPO}
            target="_blank"
            rel="noreferrer"
            className="rounded-md hover:text-foreground"
          >
            GitHub
          </a>
          <a
            href={`${REPO}/blob/main/DOCUMENTATION-STANDARD.md`}
            target="_blank"
            rel="noreferrer"
            className="rounded-md hover:text-foreground"
          >
            Standard
          </a>
          <a
            href={`${REPO}/blob/main/CHANGELOG.md`}
            target="_blank"
            rel="noreferrer"
            className="rounded-md hover:text-foreground"
          >
            Changelog
          </a>
        </nav>
      </div>
    </footer>
  );
}
