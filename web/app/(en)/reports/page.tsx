import type { Metadata } from "next";
import { ReportsIndexPage } from "@/components/reports-page";
import { reportProseFor, t } from "@/lib/i18n";
import { REPORTS } from "@/lib/reports";
import { SITE_URL } from "@/lib/site";

const LANG = "en" as const;
const PATH = "/reports";

export function generateMetadata(): Metadata {
  const tt = t(LANG);
  return {
    title: `${tt.repIndexKicker} — auditor`,
    description: tt.repIndexLead,
    alternates: {
      canonical: PATH,
      languages: { en: PATH, de: `/de${PATH}`, "x-default": PATH },
    },
    openGraph: {
      type: "website",
      url: PATH,
      title: tt.repIndexTitle,
      description: tt.repIndexLead,
      images: [`${SITE_URL}/opengraph-image`],
    },
  };
}

export default function Page() {
  const tt = t(LANG);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}${PATH}`,
    url: `${SITE_URL}${PATH}`,
    name: tt.repIndexTitle,
    description: tt.repIndexLead,
    inLanguage: LANG,
    hasPart: REPORTS.map((r) => ({
      "@type": "Report",
      name: reportProseFor(LANG, r.slug)?.title ?? r.slug,
      url: `${SITE_URL}${PATH}/${r.slug}`,
      datePublished: r.date,
      about: r.target,
    })),
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "auditor", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: tt.repIndexKicker, item: `${SITE_URL}${PATH}` },
      ],
    },
  };
  return (
    <>
      <ReportsIndexPage lang={LANG} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
