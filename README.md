# 🛡️ auditor — Master Prompts for Ultimate, Multi-Agent Audits

**A library of battle-tested master prompts that turn any AI coding agent into a swarm of
specialist auditors.** Point one at a repository, app, website, API, datastore, or
infrastructure and get back a board-ready report: every finding evidence-backed,
adversarially verified, severity-scored, and translated into a prioritized, dependency-aware
remediation roadmap.

> 🇩🇪 **Kurz auf Deutsch:** Diese Sammlung enthält wiederverwendbare Master-Prompts für die
> maximal tiefe, parallelisierte Durchleuchtung von Repos, Apps, Webseiten, APIs, Daten und
> Infrastruktur. Viele spezialisierte Agenten arbeiten gleichzeitig, **challengen ihre
> eigenen Ergebnisse adversariell**, decken blinde Flecken auf und liefern am Ende konkrete
> Handlungsempfehlungen plus eine übersichtliche Roadmap (Sofort → 30 → 60 → 90 Tage).
> Ausgabesprache pro Lauf konfigurierbar; das **Security-Template ist auf Deutsch**.

---

## Why this exists

Most "audit my code" prompts return a vague, unverified wall of opinions. These don't. Every
prompt in this repo enforces the same engineering discipline that a top-tier review board
would demand:

- **🧪 Evidence or it didn't happen.** Every finding cites a concrete artifact —
  `file:line`, a query plan, a request/response, a config value, a measured metric. No
  evidence → discarded.
- **⚔️ Adversarial self-challenge.** No finding survives until independent *skeptic* agents
  have tried to **refute** it. This is the single biggest defense against the false positives
  that make most AI audits useless.
- **🔦 Blind-spot hunting.** A dedicated completeness critic asks, every round: *which surface,
  use-case, or assumption did we NOT examine?* Unchecked areas are declared, never hidden.
- **⚡ Maximum parallelism.** Work fans out across many specialist agents at once
  (Claude Code `ultracode` / Workflow mode), then pipelines per-finding verification.
- **📊 A standardized procedure.** Every audit runs the same phases (Recon → parallel
  deep-dive → cross-pollinate → adversarial verify → benchmark → synthesize) and maps
  findings to recognized standards (OWASP, CWE, MITRE ATT&CK, WCAG, CIS, DORA, RFCs, …).
- **🗺️ Actionable output.** Severity-scored register + a top-down timeline roadmap (Quick
  Wins → 30/60/90 days) + optional auto-generated issues with concrete fixes.

The bar is explicitly **"Google-grade"**: precise, reproducible, no panic, no hand-waving,
every recommendation immediately actionable.

---

## The audit library

| Template | Audits | Maps to | Output |
|---|---|---|---|
| 🔐 [`security-audit`](audit-prompts/security-audit-master-prompt.md) | Full security sweep across 14 domains: injection, authN/authZ, secrets, supply chain, IaC, CI/CD, API, business logic, privacy, LLM | OWASP Top 10 / API / ASVS / LLM, CWE-25, MITRE ATT&CK, CIS, DSGVO | **🇩🇪 Deutsch** — Issues + Dashboard |
| 🏗️ [`repo-audit`](audit-prompts/repo-audit-master-prompt.md) | Whole-repo engineering review: architecture, stack consistency, docs, code quality, tests, deps, CI/CD, observability, git hygiene | Google Eng Practices, SRE, SLSA, OWASP | Board-ready report |
| 🎨 [`frontend-audit`](audit-prompts/frontend-audit-master-prompt.md) | 16-agent frontend sweep: usability, psychology, visual design, a11y, performance, SEO, copy, CRO, IA, responsive, forms, trust | Nielsen, WCAG 2.2, Core Web Vitals, Hick/Fitts/Jakob | Prioritized backlog + scorecard |
| 🔌 [`api-audit`](audit-prompts/api-audit-master-prompt.md) | API design & quality: resource modeling, HTTP semantics, error model, versioning, idempotency, rate limits, schema, DX | RFC 9110/9457, OpenAPI 3.1, GraphQL spec, Google AIP, Stripe-grade | Contract-drift matrix + roadmap |
| ⚡ [`performance-audit`](audit-prompts/performance-audit-master-prompt.md) | Performance & scalability: algorithmic hotspots, N+1, caching, concurrency, leaks, load behavior, resilience, FinOps | SRE practice, DORA, load/latency SLOs | Bottleneck map + per-fix metric gains |
| 🗄️ [`data-audit`](audit-prompts/data-audit-master-prompt.md) | Data & database: schema/modeling, types, constraints, migration safety, transactions, integrity, lifecycle, backup/DR | Normalization, ACID/CAP, RLS, expand/contract | Entity-risk map + safe migration plan |
| ☁️ [`infrastructure-audit`](audit-prompts/infrastructure-audit-master-prompt.md) | Infra/DevOps/SRE: IaC, cloud security, IAM, secrets, containers, k8s, CI/CD integrity, HA, DR, observability, cost | CIS Benchmarks, Well-Architected, SLSA, DORA, 12-Factor | Blast-radius map + roadmap |
| 🤖 [`ai-llm-audit`](audit-prompts/ai-llm-audit-master-prompt.md) | AI/LLM features: prompt injection, jailbreaks, output handling, agent/tool safety, RAG quality, hallucination, evals, cost, governance | OWASP LLM Top 10, NIST AI RMF | Trust-boundary map + guardrail/eval tracks |

All templates are **stack-, framework-, and product-agnostic** and share one methodology, so
findings compose cleanly when you run several against the same target.

---

## Quick start

1. **Open your AI coding agent** in the target's working directory (or with the target URL).
   Claude Code with **`ultracode`** or **Workflow mode** is recommended — that's what unlocks
   the real multi-agent parallelism. Any capable agent works single-threaded too (it just
   runs the phases sequentially).

2. **Paste the chosen master prompt** in full, and fill in the small config block at the top
   (target, scope, stack, output language, and — for active testing — your authorization).

3. **Let it run.** It will: build a fact sheet → fan out specialist agents → cross-pollinate
   and dedupe → adversarially verify every serious finding → benchmark against best-in-class
   → synthesize the report and roadmap.

4. **(Optional) Generate issues.** Each template can emit one ticket per confirmed finding
   (concrete fix, severity label, effort) into your repo/tracker — **dry-run/preview first,
   created only on explicit approval.**

> 💡 **Tip — combine audits.** For a complete picture of a production system, run
> `repo` + `security` + `performance` + `data` + `infrastructure` (and `frontend`/`api`/`ai-llm`
> where applicable). Each produces an independent report; the security/infra/data ones
> deliberately overlap at the edges and cross-reference each other.

---

## The shared methodology (every template)

```
Phase 0  Reconnaissance      → factual inventory + attack/surface map (no opinions yet)
Phase 1  Specialist swarm    → many domain experts run IN PARALLEL, each evidence-bound
Phase 2  Cross-pollination   → merge + dedupe + surface compound findings
Phase 3  Adversarial verify  → independent skeptics try to REFUTE each P0/P1; ≥2/3 to survive
Phase 4  Benchmark           → compare against named best-in-class references & standards
Phase 5  Synthesis           → exec summary, scorecard, findings register, roadmap, appendices
```

**Severity is standardized** (P0 critical → P3 polish, or KRITISCH→NIEDRIG in the German
security template), each finding carries an **effort estimate** and an **ICE/priority score**,
and the roadmap is always **Quick Wins → 30 → 60 → 90 days**, dependency-aware, with finding
IDs traced through.

**Every report ends with an honest "Coverage & Limitations" section** — what was fully read
vs sampled vs skipped, and why. An unaudited area reported as "fine" is treated as an audit
failure.

---

## Read-only & authorization by default

These audits are designed to be **non-destructive and read-only**:

- Static analysis of code, config, schema, and IaC needs no special permission.
- **Active/dynamic testing** (DAST, load tests, injection/jailbreak probes, live cloud or DB
  access) requires **explicit, documented authorization from the owner.** Without it, the
  prompts fall back to static reasoning and flag the limitation.
- **No destructive techniques, no DoS, no data exfiltration.** Real secrets and PII are never
  copied into reports — location is cited and the value redacted.
- Auto-creating issues is always **preview-first** and gated on explicit approval.

Use these only on systems you own or are authorized to assess.

---

## Repository layout

```
auditor/
├── README.md                  ← you are here
└── audit-prompts/
    ├── security-audit-master-prompt.md        🔐 (Deutsch)
    ├── repo-audit-master-prompt.md            🏗️
    ├── frontend-audit-master-prompt.md        🎨
    ├── api-audit-master-prompt.md             🔌
    ├── performance-audit-master-prompt.md     ⚡
    ├── data-audit-master-prompt.md            🗄️
    ├── infrastructure-audit-master-prompt.md  ☁️
    └── ai-llm-audit-master-prompt.md          🤖
```

---

## Contributing a new audit template

New templates should follow the house structure so they compose with the rest:

1. **Mission + Universality** header (what it audits; why it's stack-agnostic).
2. **Operating principles** (evidence-bound, cite-the-standard, severity-earned, adversarial,
   praise-the-good, no-silent-truncation, fix-forward).
3. **Severity scale** (P0–P3) + effort + priority score.
4. **Phase 0 recon → Phase 1 parallel specialists → Phase 2 dedupe → Phase 3 adversarial
   verification → Phase 4 benchmark → Phase 5 synthesis.**
5. A **shared finding schema** (JSON) and a **Definition of Done** self-check.

Keep it provider-agnostic, map findings to recognized standards, and make every
recommendation immediately actionable. Open a PR.

---

## License

MIT — see [LICENSE](LICENSE). Use freely; attribution appreciated.
