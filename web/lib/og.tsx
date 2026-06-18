import { ImageResponse } from "next/og";
import { SHIELD_CHECK_PATH, SHIELD_PATH } from "@/lib/brand";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

// Shared 1200×630 social card, single-sourced from the brand SVG paths so the
// English (/) and German (/de) Open Graph images stay visually identical.
export function renderOgImage({
  title,
  subtitle,
  footer,
}: {
  title: string;
  subtitle: string;
  /** Optional mono footer line, e.g. the standards an audit maps to. */
  footer?: string;
}) {
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
          {title}
        </div>
        <div style={{ fontSize: 28, marginTop: 28, color: "#a3a3a3", maxWidth: 1000 }}>
          {subtitle}
        </div>
        {footer ? (
          <div
            style={{
              fontSize: 22,
              marginTop: 40,
              color: "#10b981",
              fontFamily: "monospace",
            }}
          >
            {footer}
          </div>
        ) : null}
      </div>
    ),
    { ...ogSize },
  );
}
