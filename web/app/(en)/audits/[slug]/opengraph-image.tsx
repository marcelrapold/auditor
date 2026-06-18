import { auditDetail } from "@/lib/audit-details";
import { AUDITS } from "@/lib/content";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "auditor — audit template";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return AUDITS.map((a) => ({ slug: a.name }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const audit = AUDITS.find((a) => a.name === slug);
  const detail = auditDetail(slug, "en");
  return renderOgImage({
    title: `${audit?.name ?? slug} audit`,
    subtitle: detail?.tagline ?? "A multi-agent audit master prompt.",
    footer: audit ? `Maps to ${audit.mapsTo}` : undefined,
  });
}
