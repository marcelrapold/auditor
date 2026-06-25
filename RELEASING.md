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

   This rewrites every pinned URL in `audit-prompts/full-audit-master-prompt.md` and
   `web/public/llms.txt` atomically.
3. **Regenerate the checksums** so the trust anchor matches the tagged content:

   ```bash
   sha256sum -b audit-prompts/*.md ISSUE-OUTPUT-STANDARD.md DOCUMENTATION-STANDARD*.md > CHECKSUMS.txt
   ```

   The `-b` (binary) flag matches the committed format (`<hash> *<path>`); omitting it rewrites
   every line to text mode and produces a spurious full-file diff.

   The `prompts` CI workflow runs `sha256sum -c CHECKSUMS.txt`, so a forgotten regen fails the
   build rather than shipping a broken trust anchor.
4. Commit (`release: vX.Y.Z`), then tag and push:

   ```bash
   git tag -a vX.Y.Z -m "vX.Y.Z"
   git push origin main --tags
   ```

5. Cut the GitHub release from the tag, pasting the changelog section.

## Why the pins live in two files

`full-audit-master-prompt.md` is the orchestrator an agent reads; `llms.txt` is the machine entry
point served at `auditor.rapold.io/llms.txt`. Both must point at the same immutable tag. The bump
script is the single source that keeps them in lockstep.
