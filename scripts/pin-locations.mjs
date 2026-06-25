// Single source of truth for WHERE the release version is pinned.
//
// Both the writer (bump-version.mjs) and the verifier (verify-pins.mjs) import
// this list so the set of pinned locations — and the regex that matches each
// pin — can never drift apart. Adding a new pinned file means editing this one
// place; the bumper and the tag-time verifier pick it up automatically.
//
// Each entry describes one file and a single capturing regex whose group 1 is
// the literal `vX.Y.Z` token to be rewritten/verified. The regex is built with
// the global flag so a file may contain many pins (e.g. many raw URLs).

/**
 * @typedef {Object} PinLocation
 * @property {string} file        Repo-relative path.
 * @property {() => RegExp} re     Fresh global regex; group 1 is the version token.
 * @property {string} description Human-readable purpose (used in messages).
 */

/** @type {PinLocation[]} */
export const PIN_LOCATIONS = [
  {
    file: "audit-prompts/full-audit-master-prompt.md",
    // Every pinned fetch URL looks like .../marcelrapold/auditor/vX.Y.Z/...
    re: () => /marcelrapold\/auditor\/(v\d+\.\d+\.\d+)\//g,
    description: "orchestrator prompt raw-fetch URLs",
  },
  {
    file: "web/public/llms.txt",
    re: () => /marcelrapold\/auditor\/(v\d+\.\d+\.\d+)\//g,
    description: "llms.txt raw-fetch URLs",
  },
  {
    file: "web/lib/content.ts",
    // The landing-page badge surfaces the release tag from a single constant.
    re: () => /export const VERSION = "(v\d+\.\d+\.\d+)"/g,
    description: "landing-page VERSION constant",
  },
];

/** Strict `vX.Y.Z` shape shared by the bumper and verifier. */
export const VERSION_RE = /^v\d+\.\d+\.\d+$/;
