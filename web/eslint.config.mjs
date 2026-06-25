import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

/**
 * Flat-config ESLint setup for the Next.js 16 (App Router) web app.
 *
 * `eslint-config-next/core-web-vitals` bundles the official Next.js rules plus
 * React, React Hooks, and jsx-a11y (accessibility) — exactly the correctness /
 * hooks / a11y coverage CI was previously missing. `eslint-config-next/typescript`
 * layers in the TypeScript-aware rules. Both ship as flat-config arrays, so we
 * simply spread them; there is no `.extends`/legacy compat shim and nothing
 * double-runs.
 *
 * @type {import("eslint").Linter.Config[]}
 */
const config = [
  {
    // Build artefacts and generated types are never authored by hand.
    ignores: [".next/**", "next-env.d.ts"],
  },
  ...nextCoreWebVitals,
  ...nextTypeScript,
];

export default config;
