import { t } from "@/lib/i18n";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "auditor — real audit reports";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpengraphImage() {
  const tt = t("en");
  return renderOgImage({ title: tt.repIndexKicker, subtitle: tt.repIndexTitle });
}
