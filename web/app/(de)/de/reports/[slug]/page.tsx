import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReportDetailPage } from "@/components/reports-page";
import { reportProseFor, reportVerdict, t } from "@/lib/i18n";
import { getReport, REPORTS, reportIssueUrl } from "@/lib/reports";
import { SITE_URL } from "@/lib/site";

const LANG = "de" as const;

export const dynamicParams = false;

export function generateStaticParams() {
  return REPORTS.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const report = getReport(slug);
  const prose = reportProseFor(LANG, slug);
  if (!report || !prose) return {};
  const path = `/de/reports/${slug}`;
  const enPath = `/reports/${slug}`;
  return {
    title: `${prose.title} — auditor-Bericht`,
    description: prose.summary,
    alternates: {
      canonical: path,
      languages: { en: enPath, de: path, "x-default": enPath },
    },
    openGraph: {
      type: "article",
      url: path,
      title: prose.title,
      description: prose.summary,
      publishedTime: report.date,
      images: [`${SITE_URL}/de/opengraph-image`],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const report = getReport(slug);
  const prose = reportProseFor(LANG, slug);
  if (!report || !prose) notFound();

  const path = `/de/reports/${slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Report",
    "@id": `${SITE_URL}${path}`,
    url: `${SITE_URL}${path}`,
    headline: prose.title,
    name: prose.title,
    description: reportVerdict(LANG, report.verdictKey) || prose.summary,
    inLanguage: LANG,
    datePublished: report.date,
    about: { "@type": "SoftwareSourceCode", name: report.target, codeRepository: report.targetUrl },
    author: { "@type": "Organization", name: "auditor", url: SITE_URL },
    publisher: { "@type": "Organization", name: "auditor", url: SITE_URL },
    isBasedOn: reportIssueUrl(report.tracker),
    mainEntityOfPage: `${SITE_URL}${path}`,
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "auditor", item: `${SITE_URL}/de` },
      { "@type": "ListItem", position: 2, name: t(LANG).repIndexKicker, item: `${SITE_URL}/de/reports` },
      { "@type": "ListItem", position: 3, name: prose.title, item: `${SITE_URL}${path}` },
    ],
  };
  return (
    <>
      <ReportDetailPage report={report} lang={LANG} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  );
}
