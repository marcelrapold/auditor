import { auditDetail } from "@/lib/audit-details";
import { AUDITS } from "@/lib/content";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "auditor — Audit-Vorlage";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return AUDITS.map((a) => ({ slug: a.name }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const audit = AUDITS.find((a) => a.name === slug);
  const detail = auditDetail(slug, "de");
  return renderOgImage({
    title: `${audit?.name ?? slug}-Audit`,
    subtitle: detail?.tagline ?? "Ein Multi-Agenten-Audit-Master-Prompt.",
    footer: audit ? `Mappt auf ${audit.mapsTo}` : undefined,
  });
}
