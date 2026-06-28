import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import type { LegalDoc } from "@/lib/legal";

/** Static legal page (privacy / imprint): site chrome + readable prose. */
export function LegalPage({
  lang,
  doc,
  langHref,
}: {
  lang: Lang;
  doc: LegalDoc;
  langHref: string;
}) {
  const tt = t(lang);
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
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{doc.title}</h1>
            <p className="mt-4 max-w-prose text-pretty text-lg text-muted-foreground">{doc.intro}</p>
            <p className="mt-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {doc.updatedLabel}
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-3xl px-5">
            <div className="flex flex-col gap-10">
              {doc.sections.map((s) => (
                <div key={s.heading}>
                  <h2 className="text-xl font-semibold tracking-tight">{s.heading}</h2>
                  <div className="mt-3 flex flex-col gap-3">
                    {s.body.map((p, i) => (
                      <p key={i} className="text-pretty text-muted-foreground">
                        {p}
                      </p>
                    ))}
                    {s.links?.map((l) => (
                      <a
                        key={l.href}
                        href={l.href}
                        target="_blank"
                        rel="noreferrer"
                        className="w-fit rounded-md text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {l.label}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter lang={lang} />
    </div>
  );
}
