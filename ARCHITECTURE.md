# Architecture

This document records how the repository is structured and the design decisions behind it.

> [!NOTE]
> **Summary.** `auditor` is a monorepo with three parts: a library of audit *master prompts*
> (`audit-prompts/`), a Next.js landing page (`web/`), and a stdio MCP server (`mcp/`) that exposes
> the prompts as native agent tools. Two normative standards govern how the prompts behave and what
> they output. Everything is provider-agnostic Markdown plus one small static site and one small
> server.

## Layout

```
auditor/
├── audit-prompts/   the 13 audit master prompts (the product)
├── web/             the landing page (Next.js 16) → auditor.rapold.io
├── mcp/             a stdio MCP server exposing the prompts as native agent tools
├── templates/       a canonical README skeleton implementing the doc standard
├── DOCUMENTATION-STANDARD.md (+ .en.md)   the doc-quality yardstick
├── ISSUE-OUTPUT-STANDARD.md   the mandatory GitHub-issue output contract
├── CONTROL-CROSSWALK.md       findings → certification control IDs (SOC 2, ISO 27001, ISO 42001, NIS2, CRA, revDSG)
└── FRAMEWORK-VERSIONS.md      dated register of the framework editions the prompts cite
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

> [!NOTE]
> **Enforced consistency (interoperability).** All 13 audit prompts share the canonical structure —
> `How to use this prompt`, `Operating principles`, Phase 0–5, `Issue output — mandatory`,
> `Shared finding schema`, `Definition of done` — plus the P0–P3 severity scale, so their findings
> compose in the orchestrator. A CI gate (`scripts/check-prompts.mjs`, the `prompts` workflow)
> fails the build if any prompt drifts. `full-audit-master-prompt.md` is the orchestrator and is
> exempt from the per-audit structure.

## Standards vs templates

- A **standard** is a yardstick (`DOCUMENTATION-STANDARD.md`, `ISSUE-OUTPUT-STANDARD.md`,
  `CONTROL-CROSSWALK.md`).
- A **template** is an audit master prompt (`audit-prompts/*.md`) that an AI agent executes.
- The `documentation` audit measures a repo against `DOCUMENTATION-STANDARD.md`; every audit emits
  issues per `ISSUE-OUTPUT-STANDARD.md` (a tracking issue first, then one German issue per finding).
- Every finding carries `controls`, `deal_blocker`, and `fine_exposure` (enforced by the `prompts`
  gate). `CONTROL-CROSSWALK.md` is the only source of control IDs; the orchestrator's readiness
  mode (`READINESS_TARGET`) inverts it into a per-control gap matrix. The mapping is by **theme**,
  not by framework, so adding a framework is one new column, not thirteen prompt edits.

## Key trade-offs

- **Provider-agnostic prompts over a bundled tool.** The product is prompts you paste into any
  capable agent, not a CLI — maximizing reach at the cost of no turnkey runner.
- **German issue output by default.** The maintainer's primary audience is German-speaking;
  output language is configurable per run.
- **Multi-agent orchestration is opt-in.** The prompts describe a parallel swarm, but running one
  is an explicit, potentially expensive choice left to the operator.
- **The web app uses the ZVV-Atlas stack conventions with its own brand**, deliberately avoiding a
  private dependency so the public repo builds anywhere.
- **Readiness, never certification.** The crosswalk maps only technically assessable controls and
  lists the organisational rest as `not-assessable`; the prompts must say so in every report. That
  honesty is the product's credibility with the certification bodies whose work it prepares.

## Web app

See [`web/README.md`](web/README.md) for the `web/` stack, local development, and deployment.

## MCP server

See [`mcp/README.md`](mcp/README.md) for the `mcp/` stdio server, its tools, and installation.
