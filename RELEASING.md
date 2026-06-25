# Releasing

The library ships its prompts to external agents through pinned, immutable fetch URLs
(`raw.githubusercontent.com/marcelrapold/auditor/vX.Y.Z/...`) plus a `CHECKSUMS.txt` manifest.
A release is only correct if the pinned tag and the checksums both match the tagged tree, so the
version pin and the checksums are treated as part of the release surface — never edited ad hoc.

## Checklist

1. Land all feature/fix PRs on `main`; move the `[Unreleased]` notes in
   [`CHANGELOG.md`](CHANGELOG.md) under a new `## [X.Y.Z]` heading with today's date.
2. **Bump the pins from one place:**

   ```bash
   node scripts/bump-version.mjs vX.Y.Z
   ```

   This rewrites every pinned URL in `audit-prompts/full-audit-master-prompt.md`,
   `web/public/llms.txt`, and the `VERSION` constant in `web/lib/content.ts` atomically — the
   pin locations are single-sourced in [`scripts/pin-locations.mjs`](scripts/pin-locations.mjs).
   The same script then **regenerates `CHECKSUMS.txt`** automatically, so the trust anchor always
   matches the bumped tree. (To regenerate the checksums on their own, run
   `node scripts/checksums.mjs`.)

   The `prompts` CI workflow runs `node scripts/checksums.mjs --check` (and `sha256sum -c
   CHECKSUMS.txt`) on every PR, so a forgotten or drifted regen fails the build rather than
   shipping a broken trust anchor.
3. Commit (`release: vX.Y.Z`), then tag and push:

   ```bash
   git tag -a vX.Y.Z -m "vX.Y.Z"
   git push origin main --tags
   ```

   The `release-verify` workflow runs on the tag and asserts that every pin and the checksums
   equal `vX.Y.Z` — a mismatch fails the release. To check locally before tagging:

   ```bash
   node scripts/verify-pins.mjs vX.Y.Z
   ```

4. Cut the GitHub release from the tag, pasting the changelog section.

## Why the pins live in several files

`full-audit-master-prompt.md` is the orchestrator an agent reads; `llms.txt` is the machine entry
point served at `auditor.rapold.io/llms.txt`; `web/lib/content.ts` surfaces the tag on the landing
page. All must point at the same immutable tag. [`scripts/pin-locations.mjs`](scripts/pin-locations.mjs)
is the single list of where the pin lives — both `bump-version.mjs` (the writer) and
`verify-pins.mjs` (the tag-time checker) import it, so the check can never drift from the writer.
