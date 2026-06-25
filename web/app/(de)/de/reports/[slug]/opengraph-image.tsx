import { reportProseFor } from "@/lib/i18n";
import { REPORTS } from "@/lib/reports";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "auditor — Audit-Bericht";
export const size = ogSize;
export const contentType = ogContentType;

// Pre-render one card per report slug; mirror the page's `dynamicParams = false`.
export function generateStaticParams() {
  return REPORTS.map((r) => ({ slug: r.slug }));
}

export const dynamicParams = false;

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const prose = reportProseFor("de", slug);
  return renderOgImage({ title: prose?.title ?? "auditor", subtitle: prose?.summary ?? "" });
}
