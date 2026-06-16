import { ImageResponse } from "next/og";
import { SHIELD_CHECK_PATH, SHIELD_PATH } from "@/lib/brand";
import { AUDIT_COUNT } from "@/lib/content";

export const alt = "auditor — multi-agent audit master prompts";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#0a0a0a",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#10b981",
            fontSize: 30,
            fontWeight: 600,
          }}
        >
          <svg
            width="44"
            height="44"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#10b981"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={SHIELD_PATH} />
            <path d={SHIELD_CHECK_PATH} />
          </svg>
          auditor
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 600,
            marginTop: 28,
            lineHeight: 1.1,
            maxWidth: 980,
          }}
        >
          Turn any AI agent into a swarm of specialist auditors
        </div>
        <div style={{ fontSize: 28, marginTop: 28, color: "#a3a3a3" }}>
          {`${AUDIT_COUNT} audits · evidence-bound · adversarially verified`}
        </div>
      </div>
    ),
    { ...size },
  );
}
