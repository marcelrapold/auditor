import { AUDIT_COUNT } from "@/lib/content";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "auditor — Multi-Agenten-Audit-Master-Prompts";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpengraphImageDe() {
  return renderOgImage({
    title: "Mach aus jedem KI-Agenten einen Schwarm spezialisierter Auditoren",
    subtitle: `${AUDIT_COUNT} Audits · belegbasiert · adversariell verifiziert`,
  });
}
