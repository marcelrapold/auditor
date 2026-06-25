import { auditDetail } from "@/lib/audit-details";
import { AUDITS, auditTitle } from "@/lib/content";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "auditor — multi-agent audit master prompts";
export const size = ogSize;
export const contentType = ogContentType;

// Pre-render one card per audit slug; mirror the page's `dynamicParams = false`.
export function generateStaticParams() {
  return AUDITS.map((a) => ({ slug: a.name }));
}

export const dynamicParams = false;

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const audit = AUDITS.find((a) => a.name === slug);
  const detail = auditDetail(slug, "en");
  return renderOgImage({
    title: audit ? auditTitle(audit) : "auditor",
    subtitle: detail?.tagline ?? "",
  });
}
