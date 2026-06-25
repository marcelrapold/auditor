# Contributing

Thanks for your contribution. This repo is a collection of audit master prompts plus the standards
they enforce. Please follow both conventions.

## Documentation

Every Markdown file follows the [`DOCUMENTATION-STANDARD.md`](DOCUMENTATION-STANDARD.md)
(English: [`DOCUMENTATION-STANDARD.en.md`](DOCUMENTATION-STANDARD.en.md)). In short:

- Headings in sentence case, **no emojis in headings or titles**.
- Second person, present tense, active voice; short sentences; parallel lists.
- Notes as GitHub alerts (`> [!NOTE]`, `> [!TIP]`, `> [!WARNING]`) instead of emoji.
- No dead links; no doc–code drift.

## Contributing a new audit template

New templates follow the house structure so they compose with the rest. Use the canonical heading
order — a CI gate enforces it (see below):

1. **Title + mission blockquote** (what is audited; why it is stack-agnostic).
2. **How to use this prompt** (the `TARGET`/`SCOPE`/… parameter block).
3. **Operating principles** (evidence-bound, cite-the-standard, severity-earned, adversarial,
   praise-the-good, no-silent-truncation, fix-forward) plus the **P0–P3 severity scale** and the
   effort + priority/ICE score.
4. **Phases 0–5**: 0 Recon → 1 parallel swarm → 2 dedupe → 3 adversarial verification →
   4 benchmark → 5 synthesis.
5. **Issue output** per [`ISSUE-OUTPUT-STANDARD.md`](ISSUE-OUTPUT-STANDARD.md) — mandatory: a
   tracking issue first (prioritized index + management summary + roadmap), then one issue per
   finding with its own management summary. Default issue language: German.
6. **Shared finding schema** (JSON) and **Definition of done**.

Keep templates provider-agnostic, map findings to recognized standards, and make every
recommendation immediately actionable.

> [!NOTE]
> **Structure gate.** `node scripts/check-prompts.mjs` (the `prompts` workflow) enforces the house
> structure across all prompts so their findings compose: every canonical heading must be present,
> in the canonical order, with the P0–P3 severity scale and no legacy German severities, and the
> `Shared finding schema` block must carry the shared field keys (`id`, `title`, `severity`,
> `confidence`, `effort`, `evidence`, `fix`, `expected_impact`). `full-audit-master-prompt.md` is
> the orchestrator and is exempt. Run it before opening a PR.

## Pull requests

- One PR per topical change; meaningful commit messages.
- Update [`CHANGELOG.md`](CHANGELOG.md) under `[Unreleased]`.
- Versioning per [SemVer](https://semver.org/).

## Release surface (prompts and checksums)

- When editing an `audit-prompts/*.md` file or a standard, regenerate `CHECKSUMS.txt`
  (`sha256sum audit-prompts/*.md ISSUE-OUTPUT-STANDARD.md DOCUMENTATION-STANDARD*.md > CHECKSUMS.txt`).
  The `prompts` CI verifies it with `sha256sum -c` and fails otherwise.
- The release version pinned in URLs is bumped **only at release time** — via
  `node scripts/bump-version.mjs vX.Y.Z`, never by hand. See [`RELEASING.md`](RELEASING.md).

## Conduct and security

- The [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) (Contributor Covenant) applies.
- Please report vulnerabilities **confidentially** — see [`SECURITY.md`](SECURITY.md), not as a
  public issue.
