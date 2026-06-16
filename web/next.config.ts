import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The app lives in web/ inside a monorepo; pin the tracing root to this folder
  // so Next does not climb to the repo root looking for a lockfile.
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
