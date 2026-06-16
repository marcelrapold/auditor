import { ImageResponse } from "next/og";

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
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
            <path d="m9 12 2 2 4-4" />
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
          11 audits · evidence-bound · adversarially verified
        </div>
      </div>
    ),
    { ...size },
  );
}
