# ULTIMATE REPOSITORY AUDIT — DEFAULT ANALYSIS PROMPT

> **Usage:** Paste this entire prompt into your AI coding agent (Claude Code, Cursor, etc.)
> while the working directory is the root of the repository you want to audit.
> No arguments are required. The audit is strictly **read-only**.

---

## MISSION

You are a **Principal Engineer conducting a formal engineering audit** of this repository, operating at the standard of a Google-grade engineering review board (Google Engineering Practices, Google SRE, OWASP, SLSA). Your mandate: assess the repository for **full consistency and engineering excellence** across architecture, tech stack, documentation, code quality, testing, security, dependencies, CI/CD, observability, and release hygiene — then benchmark it against current industry best practices and produce a board-ready audit report.

This audit is expected to be **exhaustive**. Invest as much runtime, tool calls, and parallelism as your environment allows. Depth and correctness take absolute priority over speed and brevity.

### Non-negotiable principles

1. **Evidence or it didn't happen.** Every finding MUST cite concrete evidence: `path/to/file.ext:line` (or a file path plus quoted snippet). Findings without evidence are discarded. Never report from assumption, file names alone, or general knowledge of "how projects like this usually look."
2. **Read-only.** You change nothing: no file edits, no formatting, no dependency installs that mutate lockfiles, no git writes. Commands you run must be inspection-only (`git log`, linters in check mode, dependency listing, etc.).
3. **No silent caps.** If you sample, truncate, time-box, or skip anything (large vendored dirs, generated code, a language you didn't deep-dive), you MUST declare it in the report's "Audit Coverage & Limitations" section. An unaudited area reported as "fine" is an audit failure.
4. **Consistency is the lens.** You are not only judging whether each part is good in isolation — you are judging whether the repository is *internally coherent*: one way of doing things, docs matching code, declared standards matching actual practice.
5. **Severity discipline.** Use the P0–P3 scale defined below. Do not inflate severities to seem thorough; do not bury real risks as "minor."
6. **Judge the repo it is, not the repo you'd write.** Stylistic preference is not a finding. A finding requires a concrete cost: defect risk, security exposure, onboarding friction, maintenance burden, or a documented-standard violation.

---

## EXECUTION MODEL

If your harness supports **parallel sub-agents / multi-agent workflows**, you MUST use them: run Phase 0 inline, fan out Phase 1's audit dimensions as parallel specialist agents, run Phase 2 market research in parallel with late Phase 1 agents, then run Phase 3 adversarial verification as independent skeptic agents per finding. If the harness is single-threaded, execute the same phases sequentially without skipping any.

Scale to repo size:
- **Small repo** (< ~20k LOC): every dimension still runs, agents may read most files.
- **Medium repo** (~20k–200k LOC): agents read all configuration/entry-point/public-API files fully and sample module internals systematically (not randomly — cover every top-level module).
- **Large repo / monorepo** (> ~200k LOC): audit per workspace/package; produce per-package scores plus a cross-package consistency analysis (shared tooling, version alignment, duplicated utilities across packages). Declare any package not deep-dived.

---

## PHASE 0 — RECONNAISSANCE (run first, before any judgment)

Build a factual inventory. No opinions in this phase.

1. **Layout:** top-level tree (2–3 levels), monorepo vs. single package, workspace definitions, generated/vendored directories (identify and mark them excluded from style judgments).
2. **Languages & size:** languages present, approximate LOC per language, file counts.
3. **Tech stack:** frameworks, runtimes and their versions (from manifests: `package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `*.csproj`, `pom.xml`/`build.gradle`, `Gemfile`, `composer.json`, Dockerfiles, infra-as-code, etc.).
4. **Tooling surface:** build system, package manager(s), linters/formatters configured, test frameworks, CI provider(s) and workflow files, containerization, IaC.
5. **Git signals (if a git repo):** age, commit cadence, number of authors, branch model evidence, last 30 commit subjects (quality sample), tags/releases.
6. **Declared intent:** read README, CONTRIBUTING, CLAUDE.md/AGENTS.md, ADRs, style guides — record what the repo *claims* its standards are. Phase 1 will test reality against these claims.

Output of Phase 0: a **Repository Fact Sheet** that all subsequent agents receive as context.

---

## PHASE 1 — PARALLEL DEEP-DIVE: TEN AUDIT DIMENSIONS

Spawn one specialist agent per dimension (parallel where possible). Each agent receives the Fact Sheet, its charter below, and must return findings in the standard schema:

```
{ id, dimension, title, severity (P0|P1|P2|P3), evidence: [file:line + snippet],
  impact (one sentence: who is hurt, how), recommendation (concrete, actionable),
  effort (S|M|L), confidence (high|medium|low) }
```

…plus a **dimension grade (A–F)** with a two-sentence justification, and a list of **positive observations** (what is genuinely well done — an honest audit names strengths, not just gaps).

### 1. Architecture & Module Boundaries
- Identify the intended architecture (layers, hexagonal, feature-modules, MVC, microservices, …) from structure and docs; verify the code actually follows it.
- Layering violations (e.g., domain importing infrastructure, UI importing persistence), circular dependencies, god modules/classes, dead code, copy-paste duplication of non-trivial logic.
- Public API surface: is what's exported intentional? Are internal modules leaking?
- Boundaries of side effects: where do I/O, network, and global state live? Is it contained or smeared everywhere?

### 2. Tech-Stack Consistency
- **Version drift:** same dependency at different versions across workspaces; runtime version pinned inconsistently (e.g., `.nvmrc` vs. `engines` vs. CI vs. Dockerfile); language version in config vs. syntax actually used.
- **Competing libraries for the same job** (two HTTP clients, two date libraries, two state managers, two test runners, fetch + axios, lodash + ramda…): list each duplicate with usage counts and a consolidation recommendation.
- **Idiom consistency:** does the code use the framework the way one team would (one data-fetching pattern, one error-handling pattern, one DI approach), or does it read like five eras of five teams?
- Mixed paradigms without rationale (callbacks vs. promises vs. async/await; classes vs. hooks; ORM vs. raw SQL side by side).
- Configuration sprawl: overlapping/contradicting config files, dead config for tools no longer present.

### 3. Documentation
- **Existence & quality:** README (purpose, setup, run, test, deploy?), CONTRIBUTING, architecture docs/ADRs, API documentation, inline doc-comments on public APIs, CHANGELOG, LICENSE.
- **Doc–code drift (critical):** actively verify claims — do documented commands exist in scripts/Makefile and run conceptually? Do documented env vars match what code reads? Do described directories/modules still exist? Are code samples in docs using current APIs? Every drift instance is a finding with both locations cited.
- **Onboarding path:** could a competent new engineer go from clone to running app + passing tests using only the docs? Identify the exact step where they'd get stuck.
- Comment quality in code: explaining *why* (good) vs. narrating the obvious or lying about behavior (findings).

### 4. Code Quality & Conventions
- **Declared vs. enforced vs. actual:** compare style-guide/lint config against real code. Lint config that's ignored, disabled rules with no rationale, inline `eslint-disable`/`# noqa`/`@ts-ignore`/`any` density.
- Naming consistency (casing conventions per language, file naming, one term per concept across the codebase — not `user`/`account`/`member` for the same entity).
- **Error handling as a system:** one coherent strategy (error types, propagation, logging at the boundary) or ad-hoc (swallowed exceptions, `catch {}`, error strings, inconsistent retry logic)? Cite swallowed/ignored errors individually — they hide production incidents.
- Function/file size outliers, deeply nested logic, magic numbers/strings where constants exist elsewhere, TODO/FIXME/HACK census (count + the oldest/scariest ones).
- Type discipline (in typed languages): escape hatches, untyped boundaries, strictness settings vs. actual strictness.

### 5. Testing & Quality Gates
- Test inventory: frameworks, counts per type (unit/integration/e2e), and whether the shape resembles a sane test pyramid for this kind of product.
- **Critical-path coverage:** identify the 5–10 most business-critical code paths from Phase 0; verify each has meaningful tests. Untested critical paths are P1 by default.
- Test quality: assertions that actually assert (vs. snapshot-everything or assert-not-null theatre), mocking depth (mocking your own internals is a smell), test data realism, determinism risks (real time, real network, sleeps, order dependence → flakiness indicators).
- Gates: are tests/lint/type-check/coverage enforced in CI, or merely available? Skipped/disabled tests (`.skip`, `xfail`, commented-out) with no linked reason.

### 6. Security & Secrets
- **Secret scan:** hardcoded credentials, API keys, tokens, private keys, connection strings — in code, configs, scripts, CI files, and (if feasible) `git log -p` history samples. Any hit is P0.
- Input handling at trust boundaries: injection risks (SQL/command/template/path traversal), deserialization of untrusted data, file-upload handling, SSRF-prone fetches.
- AuthN/AuthZ patterns: where enforced (every entry point or scattered?), session/token handling, password storage, missing authorization checks on mutating endpoints.
- Known-vulnerable dependencies (run the ecosystem's audit tool in read-only mode if available: `npm audit`, `pip-audit`, `cargo audit`, `govulncheck`, …).
- Security hygiene: HTTPS/TLS settings, CORS configuration, security headers, secrets management approach (env vars vs. secret manager vs. plaintext), Dockerfile running as root, overly permissive IAM in IaC.
- Map relevant findings to OWASP Top 10 categories.

### 7. Dependencies & Supply Chain
- Outdated dependencies: how far behind latest stable (major versions behind = higher severity), deprecated or unmaintained/archived packages (check repo activity for the most critical ones).
- Lockfile hygiene: lockfile present, committed, single (not npm+yarn+pnpm lockfiles side by side), in sync with the manifest.
- Dependency weight: trivially-replaceable micro-deps, duplicate transitive majors, anything famous for supply-chain incidents.
- License consistency: repo license vs. dependency licenses (flag copyleft in a proprietary repo), license file present and matching manifest metadata.
- Pinning strategy coherence: exact pins vs. ranges vs. `latest` — is there *one* policy?

### 8. CI/CD & Developer Experience
- Pipeline completeness: build, lint, type-check, test, security scan, artifact/deploy stages — what's missing? Do pipelines gate merges or just decorate them?
- Reproducibility: pinned tool versions in CI, hermetic builds, cache correctness, "works on my machine" risk (setup steps that exist only in a README and not in code).
- Local DX: one-command setup? one-command test run? Sane defaults, devcontainer/docker-compose for dependencies, time-to-first-green-test for a newcomer.
- CI hygiene: flaky-job workarounds (retries-as-policy), `continue-on-error` abuse, secrets handling in CI, long-dead workflows.
- Deployment story: documented and automated, or tribal knowledge? Rollback path?

### 9. Observability & Operations
- Logging: structured vs. printf-debugging remnants, consistent levels, no secrets/PII in logs, correlation/request IDs for services.
- Metrics & tracing: instrumentation for service-shaped code; health/readiness endpoints; alerting hooks or dashboards referenced.
- Error tracking: crash/exception reporting wired up (Sentry et al.) or errors vanish?
- **Configuration management:** every config/env var inventoried? `.env.example` complete and current vs. what code actually reads (this is a classic drift spot — verify)? Sane behavior on missing config (fail fast with a clear message vs. mysterious crash later)?
- Graceful shutdown, timeout/retry/circuit-breaker posture for anything calling over a network.

### 10. Git & Release Hygiene
- Commit quality (sample ≥ 50): conventional/informative messages vs. "fix", "wip", "asdf"; commit size sanity.
- Branch/merge discipline evident from history; force-push or history-rewrite scars on main.
- Versioning: SemVer (or alternative) applied consistently? Tags match manifest versions? CHANGELOG maintained and matching tags?
- Repo hygiene: `.gitignore` correctness (build artifacts, IDE files, or — worse — `.env` files tracked?), large binaries in history, generated files committed without need.
- Ownership signals: CODEOWNERS, bus-factor concentration (one author wrote 95%?), PR templates.

---

## PHASE 2 — MARKET COMPARE & BEST-PRACTICE BENCHMARK

Run in parallel with late Phase 1. Requires web research; if web access is unavailable, benchmark against your knowledge and **flag the cutoff date as a limitation**.

1. For each major stack component identified in Phase 0 (framework, language version, build tool, test stack, CI approach), research the **current (this year's) industry-standard way** to use it: official current recommendations, widely adopted community standards, and what top-tier reference repositories do (pick 2–3 respected open-source projects with a comparable stack as comparators and name them in the report).
2. Classify every notable pattern in this repo as:
   - **Industry Standard** — current best practice,
   - **Acceptable** — fine, slightly behind the curve, no action needed,
   - **Outdated** — superseded approach with a known migration path (name it),
   - **Anti-Pattern** — actively harmful by current consensus (cite why).
3. Check stack lifecycle: EOL or near-EOL runtimes/frameworks (e.g., language versions past end of support), deprecated major APIs in use, ecosystem direction (is this stack gaining or losing support?).
4. Output a **Benchmark Table**: `Component | This repo | Industry standard 2026 | Classification | Migration note`.

---

## PHASE 3 — ADVERSARIAL VERIFICATION

No finding reaches the report unverified.

1. Pool all Phase 1 + Phase 2 findings; **deduplicate** across dimensions (same root cause reported by two agents = one finding, strongest evidence kept).
2. For every finding of severity P0–P2, dispatch an **independent skeptic** (separate agent if possible) whose explicit job is to **refute** it: re-open the cited files, check whether the evidence is real, current, in non-generated code, not a false positive (e.g., a "hardcoded secret" that is a documented test fixture; a "missing test" that exists under another name). Skeptics default to *refuted* when evidence is weak.
3. Findings survive only if the skeptic confirms the evidence. Refuted findings are dropped; partially confirmed ones are downgraded with a note. P3 findings get a lighter pass: spot-check at least a third of them; extrapolate honestly.
4. After verification, run one **completeness critic**: "Given the Fact Sheet, what would a top-tier auditor expect to see flagged that isn't here? Which dimension looks suspiciously clean?" Feed anything credible back through a quick verification round.

### Severity definitions (apply strictly)

- **P0 — Critical:** active security exposure (leaked secret, exploitable injection, vulnerable dependency with known exploit on a reachable path), data-loss risk, legal/license violation. *Fix immediately.*
- **P1 — High:** materially raises defect or incident probability, or blocks team scaling: untested critical paths, broken/missing CI gates, EOL runtime, systematic error-swallowing, doc drift that will misdirect engineers on critical setup/deploy steps.
- **P2 — Medium:** consistency and maintainability debt with real ongoing cost: competing libraries, version drift, architecture erosion, incomplete docs, lint-reality gaps.
- **P3 — Low:** polish: naming inconsistencies, stale TODOs, minor doc gaps, nice-to-have tooling.

---

## PHASE 4 — SYNTHESIS & REPORT

Produce the final report as a single Markdown document titled `REPO-AUDIT-REPORT.md` content (output it in chat; only write a file if the user asks). Structure — exactly these sections:

1. **Executive Summary** (max ~1 page): overall verdict in plain language, overall grade, the 3–5 findings leadership must know, and the single biggest consistency risk. Written for a CTO, no jargon walls.
2. **Scorecard:** table of all 10 dimensions × grade (A–F) × one-line justification × finding counts by severity. Plus an **Overall Engineering Grade** (weighted: Security, Testing, Architecture count double).
3. **Repository Fact Sheet** (from Phase 0).
4. **Consistency Matrix:** the cross-cutting view — declared standard vs. actual practice per area (docs say / config enforces / code does), with drift highlighted.
5. **Benchmark Table** (from Phase 2) + named reference repositories used as comparators.
6. **Verified Findings Register:** every surviving finding in the standard schema, ordered by severity then effort; include the skeptic's confirmation note on P0/P1 items.
7. **Strengths:** what this repo does well — be specific and evidence-based here too.
8. **Remediation Roadmap:**
   - **Quick Wins** (≤ 1 day each, do this week),
   - **30 days** (P0s + highest-leverage P1s),
   - **60 days** (consistency consolidation: library dedup, doc-drift repair, gate enforcement),
   - **90 days** (strategic: architecture corrections, migrations off outdated patterns).
   Each roadmap item references finding IDs.
9. **Audit Coverage & Limitations:** what was sampled vs. fully read, what was skipped and why, tool/web access constraints, confidence statement.

---

## ISSUE OUTPUT — mandatory (see [`ISSUE-OUTPUT-STANDARD.md`](../ISSUE-OUTPUT-STANDARD.md))

Beyond the report, turn verified findings into GitHub issues — **German by default**; preview/
dry-run first, created only on explicit authorization + repo access. Two-part contract:

1. **Tracking issue first** — `[AUDIT] Repo Engineering — Befund-Tracker & Roadmap`. Body: a
   management summary (overall grade, biggest consistency risk), the scorecard, a
   **priority-sorted checklist** (P0→P3, then effort) where each line links its child issue, and
   the Quick-Wins/30/60/90 roadmap. Labels: `audit`, `tracking`, `repo`.
2. **One issue per verified finding** — top-notch, German, each opening with its own
   **management summary** (2–3 sentences: what, impact, one-line recommendation), then the full
   finding (severity, dimension, evidence `file:line`, impact, concrete before/after fix, effort,
   confidence). Labels: `audit`, `sev:p0…p3`, `dimension:<x>`, `effort:S|M|L`; back-link to the
   tracking issue.

Create child issues first, collect their numbers, then create/update the tracking issue so its
checklist links resolve. Detect existing audit issues by label and update rather than duplicate.
Never include real secrets — cite location and redact.

---

## DEFINITION OF DONE (self-check before delivering)

- [ ] All 10 dimensions were audited and graded; none skipped silently.
- [ ] Every finding in the register has `file:line` evidence and survived (or was downgraded by) adversarial verification.
- [ ] Doc–code drift, `.env.example`-vs-code, and lint-config-vs-reality were *actively tested*, not assumed.
- [ ] The Benchmark Table names concrete reference repos / standards and classifies every major pattern.
- [ ] Severity definitions were applied as written; no unevidenced P0s, no buried security issues.
- [ ] Coverage & Limitations section honestly lists everything not examined.
- [ ] The repository was left byte-for-byte unmodified.

If any box is unchecked, the audit is not done — go back and finish it.
