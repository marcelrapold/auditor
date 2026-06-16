# Architecture

This document records how the repository is structured and the design decisions behind it.

> [!NOTE]
> **Summary.** `auditor` is a monorepo with two parts: a library of audit *master prompts*
> (`audit-prompts/`) and a Next.js landing page (`web/`). Two normative standards govern how the
> prompts behave and what they output. Everything is provider-agnostic Markdown plus one small
> static site.

## Layout

```
auditor/
├── audit-prompts/   the 11 audit master prompts (the product)
├── web/             the landing page (Next.js 16) → auditor.rapold.io
├── templates/       a canonical README skeleton implementing the doc standard
├── DOCUMENTATION-STANDARD.md (+ .en.md)   the doc-quality yardstick
└── ISSUE-OUTPUT-STANDARD.md   the mandatory GitHub-issue output contract
```

## The shared audit method

Every prompt runs the same six phases, so findings from different audits compose cleanly:

```
Phase 0  Reconnaissance      factual inventory + surface map
Phase 1  Specialist swarm    many domain experts in parallel, each evidence-bound
Phase 2  Cross-pollination   merge + dedupe + compound findings
Phase 3  Adversarial verify  independent skeptics refute each P0/P1; ≥2/3 to survive
Phase 4  Benchmark           compare against named best-in-class references
Phase 5  Synthesis           report, scorecard, issues, 30/60/90 roadmap
```

Each prompt also shares a severity scale (P0–P3), a finding schema, and a mandatory issue output.

## Standards vs templates

- A **standard** is a yardstick (`DOCUMENTATION-STANDARD.md`, `ISSUE-OUTPUT-STANDARD.md`).
- A **template** is an audit master prompt (`audit-prompts/*.md`) that an AI agent executes.
- The `documentation` audit measures a repo against `DOCUMENTATION-STANDARD.md`; every audit emits
  issues per `ISSUE-OUTPUT-STANDARD.md` (a tracking issue first, then one German issue per finding).

## Key trade-offs

- **Provider-agnostic prompts over a bundled tool.** The product is prompts you paste into any
  capable agent, not a CLI — maximizing reach at the cost of no turnkey runner.
- **German issue output by default.** The maintainer's primary audience is German-speaking;
  output language is configurable per run.
- **Multi-agent orchestration is opt-in.** The prompts describe a parallel swarm, but running one
  is an explicit, potentially expensive choice left to the operator.
- **The web app uses the ZVV-Atlas stack conventions with its own brand**, deliberately avoiding a
  private dependency so the public repo builds anywhere.

## Web app

See [`web/README.md`](web/README.md) for the `web/` stack, local development, and deployment.
