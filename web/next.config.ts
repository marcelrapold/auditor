import type { NextConfig } from "next";
import { AUDIT_SHORT_SLUGS } from "./lib/content";

const nextConfig: NextConfig = {
  // The app lives in web/ inside a monorepo; pin the tracing root to this folder
  // so Next does not climb to the repo root looking for a lockfile.
  outputFileTracingRoot: __dirname,

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
