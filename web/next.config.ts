import { join } from "node:path";
import type { NextConfig } from "next";
import { AUDIT_SHORT_SLUGS } from "./lib/content";

const nextConfig: NextConfig = {
  // Monorepo file-tracing root = the repo root (one level up from web/). Vercel's
  // monorepo builder resolves the Next.js output (`.next`) against the repo root, so
  // the tracing root must match it — pinning it to `web/` made Vercel look for
  // `<root>/.next` and fail (ENOENT .next/package.json) once a second package (mcp/) existed.
  outputFileTracingRoot: join(__dirname, ".."),

  images: {
    // Negotiate AVIF first (~20-30% smaller than WebP) before falling back to WebP.
    formats: ["image/avif", "image/webp"],
    // Optimized variants are immutable (content-hashed by the `dpl` query param), so let
    // browsers and the edge cache hold them for a year instead of revalidating every visit.
    minimumCacheTTL: 31536000,
  },

  // Short, shareable vanity URLs (e.g. /frontend-audit, /privacy-audit) that permanently
  // redirect to the canonical per-audit page in both languages. Derived from AUDITS so the
  // list never drifts from the audit catalogue.
  async redirects() {
    return AUDIT_SHORT_SLUGS.flatMap(({ slug, name }) => [
      { source: `/${slug}`, destination: `/audits/${name}`, permanent: true },
      { source: `/de/${slug}`, destination: `/de/audits/${name}`, permanent: true },
    ]);
  },
};

export default nextConfig;
