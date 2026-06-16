# Documentation standard (Google-grade)

A normative standard for repository documentation: measurable, profile-aware, and aligned with
current Google documentation patterns. This is the yardstick the
[`documentation-audit`](audit-prompts/documentation-audit-master-prompt.md) holds any repo to
before filing concrete improvement issues.

> [!NOTE]
> **Management summary.** This standard defines what a first-class README and the surrounding
> repo documentation look like: a strong repo head (value proposition, badges, management
> summary, architecture diagram), a Diátaxis-aware body, complete repo-health files, and
> consistently Google-conformant writing. It is tiered into five **profiles** (library,
> application, service, CLI, monorepo) and provides a **0–100 scoring rubric** with grade bands.
> German canonical version: [`DOCUMENTATION-STANDARD.md`](DOCUMENTATION-STANDARD.md).

Version 1.0.0 · Language: English (mirror of the German canonical) · License: MIT

---

## Contents

- [0. Scope and profiles](#0-scope-and-profiles)
- [1. The repo head (head-matter)](#1-the-repo-head-head-matter)
- [2. The body (Diátaxis-aware)](#2-the-body-diátaxis-aware)
- [3. Repo health](#3-repo-health)
- [4. Writing rules (Google)](#4-writing-rules-google)
- [5. Accessibility and emoji policy](#5-accessibility-and-emoji-policy)
- [6. Scoring rubric (0–100)](#6-scoring-rubric-0100)
- [7. Conformance checklist](#7-conformance-checklist)
- [8. Sources](#8-sources)

---

## Design principle: "Google-grade" is a deliberate synthesis

This standard adopts **Google's writing and accessibility discipline** and its **design-doc
rigor** (context, goals, non-goals, trade-offs), then adds the **repo head** that Google's own
minimalist READMEs deliberately omit: badges, a management summary, and an architecture diagram.
The blend is intentional.

- **From Google:** voice, second person, present tense, active voice, sentence-case headings,
  parallel lists, state scope + audience first, strict accessibility.
- **From best-in-class OSS:** badge row (shields.io), management summary/TL;DR, Mermaid
  architecture diagram, Diátaxis coverage, GitHub community standards, SemVer, Keep a Changelog,
  docs-as-code.

> [!IMPORTANT]
> Where this standard goes beyond Google's minimalism (badges, head-of-repo diagrams) the choice
> is intentional. "Google-grade" means the **quality of language and structure**, not copying
> Google's sparse README style.

---

## 0. Scope and profiles

**Audience-first.** Every README states first *who* it is for and *what* the project does. A
stranger learns in under 30 seconds: what is this, for whom, why useful?

**Profiles.** The core applies always. Profiles adjust which sections are **required**,
**recommended**, or **not applicable**, and re-weight the rubric.

| Profile | Examples | Profile emphasis (additionally required) |
|---|---|---|
| Library / SDK | npm/PyPI package, client SDK | API reference, install matrix, semantic versioning |
| Application | Web app, desktop app | Screenshots/demo, setup path, configuration, deployment |
| Service / API | Microservice, REST/GraphQL backend | Architecture diagram, runbooks, operations/SLO docs, endpoint reference |
| CLI tool | Command-line tool | Command reference, per-command examples, exit codes, install |
| Monorepo | Multi-package workspace | Package overview table, per-package READMEs, cross-links, toolchain |

**Not-applicable is declared, not hidden.** If a section is missing because the profile does not
need it, say so. A missing required section without justification is a finding.

---

## 1. The repo head (head-matter)

The head decides whether a reader stays. Required order:

1. **Title + one-line value proposition.** Project name as `# H1`, **no emoji**. One sentence
   below: what it does and for whom.
2. **Badge row.** 5–10 badges, logically grouped, directly under the title. Standard taxonomy:
   CI/status → coverage → version/release → license → language/runtime → docs → last-commit.
   shields.io pattern: `https://img.shields.io/badge/<label>-<message>-<color>` (static) or the
   service-specific dynamic badges. Cap at ~10 — over-badging is an anti-pattern.
3. **Management summary.** 3–5 sentences in a `> [!NOTE]` box: what is it, what problem it solves,
   for whom, why better/relevant. Readable by non-specialists.
4. **Architecture/overview diagram (Mermaid).** Caption-first: write the takeaway, then build the
   diagram that shows it. GitHub renders Mermaid natively. Limit density (~5 blocks / one concept
   cluster); for complex systems show the big picture first, then subsystem diagrams. Suitable
   types: `flowchart`, `C4Context`/`C4Container`, `sequenceDiagram`, `erDiagram`.
5. **Table of contents.** From ~100 lines of README. Descriptive link text, working anchors.

> [!TIP]
> The C4 model helps layer architecture: **Context** (system + outside world) → **Container**
> (apps, DBs, APIs) → **Component** (inside one container). The head usually wants a Context or a
> lean Container diagram.

---

## 2. The body (Diátaxis-aware)

The **Diátaxis** model separates four documentation types by reader need. Mature docs cover all
four (where the profile needs them) and **do not blend them**:

| Type | Reader wants to … | Form |
|---|---|---|
| Tutorial | learn | guided, guaranteed-to-work lesson |
| How-to guide | accomplish a task | goal-directed steps |
| Reference | look up | precise, complete fact tables |
| Explanation | understand | background, trade-offs, why |

Recommended body sections (profile decides required/optional):

- **Overview / background.** Goals and **non-goals** (from the Google design-doc template).
- **Quickstart.** Code-first, copy-paste, optimized for shortest **time-to-first-success**.
- **Usage / examples.** The most common use cases with runnable examples.
- **Configuration / reference.** All options, env vars, flags, API/CLI reference.
- **Architecture & design.** Depth + trade-offs; link `ARCHITECTURE.md` and ADRs.
- **Development / testing / contributing.** Local setup, tests, contribution path.
- **Deployment / operations / runbooks.** For service profiles: operations, rollback, SLOs.
- **Roadmap / changelog / versioning.** Link `CHANGELOG.md`, SemVer policy.
- **Security / license / maintainers.** Security contact, license, owners.

---

## 3. Repo health

Beyond the README, this standard expects the GitHub community-standard files. They are scored
because they carry contribution, operations, and trust.

- **`LICENSE`** — an unambiguous license (e.g. MIT, Apache-2.0).
- **`CONTRIBUTING.md`** — setup, branch/PR/commit conventions, test/lint commands.
- **`CODE_OF_CONDUCT.md`** — behavior standard (for public projects).
- **`SECURITY.md`** — vulnerability reporting path.
- **`CHANGELOG.md`** — Keep a Changelog format; one entry per release.
- **Issue/PR templates** under `.github/` — structured contributions.
- **`ARCHITECTURE.md` / ADRs** — design decisions with trade-offs.
- **Repo description + topics** in repo settings.

**SemVer.** Versions follow `MAJOR.MINOR.PATCH`; each bump pairs with a changelog entry and an
annotated git tag.

**Docs-as-code.** Docs live in git beside the code, go through PR review, and are checked in CI:
link-check (zero tolerated dead links), markdown-lint, and — where possible — running the code
samples. The build fails on doc errors.

---

## 4. Writing rules (Google)

These come straight from the Google developer documentation style guide and tech-writing courses.
They apply to every Markdown file in the repo.

- **Second person.** Address the reader as "you", not "we". Use "we" only for the authoring org.
- **Present tense.** Describe behavior in present tense, not future/conditional.
- **Active voice.** Active over passive; name who acts. Passive only when the actor is irrelevant.
- **Sentence-case headings.** No title case, no all caps. Task headings as bare infinitives
  ("Create an instance"); conceptual headings as noun phrases. Exactly **one H1** per document; no
  skipped levels.
- **Parallel lists.** All items in the same structure. Numbered for sequence, bulleted for
  options. No single-item lists.
- **State scope + audience first.** Each document names its goal and readership up front; key
  points come first (bottom line up front).
- **Consistent terminology.** One term per concept; no synonyms for the same element.
- **Abbreviations** spelled out on first use (except widely known ones: API, HTML, URL, AI). No
  periods in acronyms.
- **Short sentences, one idea per paragraph.** Avoid the curse of knowledge.
- **Code blocks.** Tag the language; 2-space indent; ~80-char lines; mark omitted code with a
  language-specific comment, not "…".
- **Caption-first illustrations.** Caption/takeaway first, then the image; callouts over prose.

---

## 5. Accessibility and emoji policy

Accessibility is not optional. Docs must work with a screen reader and keyboard.

- **Alt text** for every informative image; empty alt only for purely decorative images.
- **Never convey information through images alone.**
- **No directional language.** Use "preceding/following/earlier" instead of "above/below/right" —
  layout varies by device and screen reader.
- **Contrast** at least 4.5:1 for text.
- **Never encode information through color or emoji alone**; always a text label as the primary
  carrier.

### Emoji policy (binding)

> [!IMPORTANT]
> **No emojis in titles or headings.** No decorative emoji rows (e.g. a colored icon per table
> row). Emojis are allowed only where they serve a **real function** and are never the sole
> information carrier.

Rationale: screen readers announce emojis as words ("sparkles", "rocket") and information must
never depend on a symbol alone (the 4.5:1 and "not color/symbol only" rules). Decorative emoji
adds noise and reduces scannability.

**Use GitHub alerts instead** for callouts — text-based, accessible, consistent:

```markdown
> [!NOTE] General note.
> [!TIP] Optional, helpful tip.
> [!IMPORTANT] Important for success.
> [!WARNING] Caution, possible problem.
> [!CAUTION] Risky/destructive consequence.
```

If a small, **consistent functional** symbol set is genuinely needed, document it, use it
sparingly, and always pair it with text.

---

## 6. Scoring rubric (0–100)

The audit awards points per dimension and forms an overall grade. Profiles re-weight (see note
under the table).

| Dimension | Points | What is checked |
|---|---|---|
| Repo head | 20 | Title + value line, grouped badge row (5–10), management summary, architecture diagram (Mermaid), table of contents |
| Getting started | 15 | Prerequisites, quickstart, copy-paste examples, time-to-first-success, troubleshooting |
| Usage and reference | 15 | Feature usage, config/API/CLI reference, real examples |
| Writing quality (Google) | 15 | Sentence case, second person, present/active, parallel lists, scope+audience first, terminology |
| Diátaxis coverage | 10 | Tutorial / how-to / reference / explanation — present as the profile requires |
| Repo health | 10 | LICENSE, CONTRIBUTING, CoC, SECURITY, issue/PR templates, repo description |
| Maintainability | 10 | SemVer + CHANGELOG, docs-as-code CI (link-check/lint/sample-test), recency, no dead links |
| Accessibility and style | 5 | Alt text, no directional language, 4.5:1, **emoji policy** honored |

**Grade bands:** Gold 90–100 · Silver 75–89 · Bronze 60–74 · Needs-work 40–59 · Inadequate < 40.

**Profile weighting (examples):** service/API shifts points toward runbooks/operations under
"Usage and reference"; a library emphasizes API reference; a CLI emphasizes command reference. The
sum stays 100; not-applicable sub-criteria are redistributed proportionally and reported.

**Severity mapping for issues:** P0 the head actively misleads / no working entry / missing
license · P1 no management summary / no architecture diagram where the profile requires it /
undocumented core feature / missing required health file · P2 drift, weak navigation, inconsistent
terminology, thin reference · P3 style, typos, emoji-policy violations without information loss.

Findings are emitted per [`ISSUE-OUTPUT-STANDARD.md`](ISSUE-OUTPUT-STANDARD.md): a tracking issue
first (priority-sorted index + management summary + roadmap), then one issue per finding with its
own management summary.

---

## 7. Conformance checklist

A README/repo conforms when:

- [ ] Title without emoji, with a one-line value proposition.
- [ ] Badge row (5–10, grouped) directly under the title.
- [ ] Management summary as a `> [!NOTE]` box in the head.
- [ ] Architecture/overview diagram (Mermaid), caption-first, renders on GitHub.
- [ ] Table of contents (from ~100 lines) with working anchors.
- [ ] Quickstart demonstrably takes a reader from zero to first success.
- [ ] Diátaxis types covered per profile and not blended.
- [ ] Repo-health files present (LICENSE, CONTRIBUTING, CoC, SECURITY, CHANGELOG, templates).
- [ ] SemVer + changelog maintained; docs-as-code checks in CI.
- [ ] Writing rules honored (second person, present, active, sentence-case headings, parallel lists).
- [ ] Accessibility + emoji policy honored (no emojis in headings, alerts instead of emoji).
- [ ] No dead links; no doc–code drift.

---

## 8. Sources

**Google**

- Google developer documentation style guide — https://developers.google.com/style
- Google Technical Writing One/Two — https://developers.google.com/tech-writing
- Google styleguide, docguide/READMEs.md — https://github.com/google/styleguide
- Design Docs at Google — https://www.industrialempathy.com/posts/design-docs-at-google/

**Best-in-class OSS**

- Standard-Readme — https://github.com/RichardLitt/standard-readme
- Make a README — https://makeareadme.com
- shields.io — https://shields.io/docs/
- Mermaid C4 — https://mermaid.js.org/syntax/c4.html
- Diátaxis — https://diataxis.fr/
- GitHub Community Standards — https://docs.github.com/communities
- Semantic Versioning — https://semver.org/
- Keep a Changelog — https://keepachangelog.com/
- OpenSSF Best Practices Badge — https://best.openssf.org/
