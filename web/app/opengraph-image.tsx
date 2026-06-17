import { AUDIT_COUNT } from "@/lib/content";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "auditor — multi-agent audit master prompts";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpengraphImage() {
  return renderOgImage({
    title: "Turn any AI agent into a swarm of specialist auditors",
    subtitle: `${AUDIT_COUNT} audits · evidence-bound · adversarially verified`,
  });
}
