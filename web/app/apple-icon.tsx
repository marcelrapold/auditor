import { ImageResponse } from "next/og";
import { SHIELD_CHECK_PATH, SHIELD_PATH } from "@/lib/brand";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#10b981",
        }}
      >
        <svg
          width="118"
          height="118"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffffff"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={SHIELD_PATH} />
          <path d={SHIELD_CHECK_PATH} />
        </svg>
      </div>
    ),
    { ...size },
  );
}
