import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { GitHubMark } from "@/components/icons";
import { MobileNav } from "@/components/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { REPO } from "@/lib/content";
import { type Lang, t } from "@/lib/i18n";

export type NavItem = { href: string; label: string };

/** In-page anchor nav for the landing page. */
export function homeNav(lang: Lang): NavItem[] {
  const tt = t(lang);
  return [
    { href: "#use", label: tt.nav.use },
    { href: "#audits", label: tt.nav.audits },
    { href: "#how", label: tt.nav.how },
    { href: "#standards", label: tt.nav.standards },
  ];
}

function LangToggle({ lang, href }: { lang: Lang; href: string }) {
  const tt = t(lang);
  return (
    <Link
      href={href}
      aria-label={tt.langToggle}
      className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background/60 px-3 text-xs font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:h-9"
    >
      {lang === "en" ? "DE" : "EN"}
    </Link>
  );
}

/** Sticky site header. `nav` empty → logo + controls only (used on subpages).
 *  `langHref` is the same page in the other locale. */
export function SiteHeader({
  lang,
  nav,
  langHref,
}: {
  lang: Lang;
  nav: NavItem[];
  langHref: string;
}) {
  const tt = t(lang);
  const home = lang === "de" ? "/de" : "/";
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
        {nav.length > 0 ? (
          <nav
            aria-label="Primary"
            className="hidden items-center gap-7 text-sm text-muted-foreground md:flex"
          >
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-md transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>
        ) : null}
        <div className="flex items-center gap-2">
          <a
            href={REPO}
            target="_blank"
            rel="noreferrer"
            aria-label={`${tt.ghRepo} ${tt.newTab}`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-10 sm:h-9")}
          >
            <GitHubMark className="size-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
          <LangToggle lang={lang} href={langHref} />
          <ThemeToggle
            lightLabel={tt.themeLight}
            darkLabel={tt.themeDark}
            toggleLabel={tt.themeToggle}
          />
          {nav.length > 0 ? (
            <MobileNav
              items={nav}
              openLabel={tt.menuOpen}
              closeLabel={tt.menuClose}
              navLabel={tt.navMobile}
            />
          ) : null}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter({ lang }: { lang: Lang }) {
  const tt = t(lang);
  const reports = lang === "de" ? "/de/reports" : "/reports";
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 text-sm text-muted-foreground sm:flex-row">
        <p className="flex items-center gap-2 font-mono">
          <ShieldCheck aria-hidden className="size-4 text-primary" />
          {tt.footerLicense}
        </p>
        <nav aria-label="Footer" className="flex items-center gap-6">
          <Link href={reports} className="rounded-md hover:text-foreground">
            {tt.footerReports}
          </Link>
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
