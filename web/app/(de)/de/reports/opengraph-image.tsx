import { t } from "@/lib/i18n";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "auditor — echte Audit-Berichte";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpengraphImage() {
  const tt = t("de");
  return renderOgImage({ title: tt.repIndexKicker, subtitle: tt.repIndexTitle });
}
