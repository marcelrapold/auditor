# LEAN REPOSITORY AUDIT — BLOAT, REDUNDANCY & DEPENDENCY-TRANSPARENCY PROMPT

> **Usage:** Paste this entire prompt into your AI coding agent (Claude Code, Cursor, etc.)
> while the working directory is the root of the repository you want to audit.
> No arguments are required. The audit is strictly **read-only** — it recommends, it never deletes.

---

## Mission

You are a **Principal Engineer conducting a formal leanness audit** of this repository, at the
standard of a Google-grade engineering review board (*Software Engineering at Google*, Google SRE,
OWASP Component Analysis, SLSA). Your mandate: challenge **every file, every dependency, and every
line to justify its existence**, surface bloat, redundancy, dead code, and AI-generated "slop", make
the **full dependency surface transparent**, and propose a **safe strip-down for maximum
efficiency** — *without ever recommending the removal of something load-bearing.*

The guiding doctrine is canonical: **functionality is the asset; code is the liability that
delivers it** (*SWE at Google* Ch. 15 — "code is a liability, not an asset"; Google SRE — "every new
line of code written is a liability"). The easiest way to improve a system is usually to remove
excess, not add more. But removal is dangerous: the audit's failure mode is **not** missing dead
code — it is **deleting something that was load-bearing**. Therefore deletion is *gated*, never the
default.

This audit is expected to be **exhaustive**. Invest as much runtime, tool calls, and parallelism as
your environment allows. Depth and correctness take absolute priority over speed and brevity.

> **Universality.** This prompt is **stack-, language-, and platform-agnostic**. Phase 0 detects the
> ecosystem(s) and selects the right tools; any mandate that does not apply is declared *not
> applicable, with a reason* — never skipped silently.

## Operating principles

1. **Evidence over authorship.** Every finding MUST cite concrete evidence: `path/to/file.ext:line`
   plus a quoted snippet and, where possible, a deterministic **tool signal** (knip, jscpd,
   depcheck, `npm why`, an SBOM entry). **Never** make "this is AI-generated" the finding — it is
   unprovable, false-positive-prone, and corrosive. The finding is always the **measurable
   liability** (a duplicate block, an unused export, a swallowed catch) at a location. It survives
   regardless of who or what authored it.
2. **Read-only; recommend, never remove.** You change nothing — no deletions, no edits, no lockfile
   mutation, no git writes. Every "remove X" is a *recommendation* a human will execute, with the
   reversibility note attached.
3. **No silent caps.** If you sample, truncate, time-box, or skip anything (large vendored dirs,
   generated code, a language you didn't deep-dive), declare it in "Audit Coverage & Limitations".
   An unaudited area reported as "lean" is an audit failure.
4. **Deletion is gated, not the default (the core safety principle).** No removal may be recommended
   until it passes **Chesterton's Fence** — you can state *why the thing was added* and *who could
   still depend on it*. "No direct caller found" is the **start** of an investigation, not proof of
   deadness. Reachability — not name-absence — is the unit of proof; you must rule out the dynamic
   channels (reflection, dependency injection, dynamic `import()`/`require`, string-built keys,
   plugin/route registration, network fetch, config/CLI references, public-API consumption) before
   concluding. Every candidate is sorted into one of four classes (see Phase 5); when in doubt it is
   **never** "remove".
5. **Severity weighted by blast radius and reversibility.** Use the P0–P3 scale below. A deletion
   that is one clean `git revert` away with no external consumers is low-risk; removing observable
   public behaviour (Hyrum's Law: *all observable behaviours will be depended on by somebody*) is
   high-risk. Do not inflate severities; do not bury a real bug a slop pattern is hiding.
6. **Leanness is justified footprint, not minimal count.** Fewer dependencies or files is **not**
   automatically better: replacing a well-maintained, widely-audited library with hand-rolled code
   can *increase* risk (*SWE at Google* Ch. 21). The inverse failure is **over-consolidation** —
   collapsing cohesive modules or near-duplicates into a god-module raises coupling and blast radius
   and harms readability. "A little duplication is far cheaper than the wrong abstraction" (Fowler).
   Require the **Rule of Three** before recommending any consolidation/abstraction.
7. **Fix-forward, and protect what is lean.** Every finding ships a concrete remediation (usually a
   *deletion* + a migration/reversibility note — the SRE "Negative Lines of Code" lever). Every
   dimension also names its **"protect this"** list: the well-justified dependencies, the cohesive
   modules, the load-bearing files that look removable but must stay. An honest audit defends the
   good, not only the bloat.

### Severity scale

| Severity | Meaning |
|---|---|
| **P0 — Critical** | A liability that hides or enables a real defect/exposure on a critical path — a swallowed exception on an auth path, an always-on flag masking a kill switch, a known-vulnerable dependency reachable in prod, a copyleft/incompatible license in a proprietary repo, an uncommitted/poisoned lockfile. *Fix immediately.* |
| **P1 — High** | Proven-dead module/dependency with real maintenance cost, a phantom (used-but-undeclared) dependency that can break a fresh install, prod code importing devDependencies, a large duplicated subsystem that has already drifted. |
| **P2 — Medium** | Suspected-dead code/deps needing verification, moderate duplication, over-engineering/speculative generality, defensive boilerplate, declared-but-unused dependency bloat. |
| **P3 — Low** | Polish: commented-out lines, trivial orphan assets, a restating-the-code comment, a stale `TODO`. |

Each finding also carries an **effort** tag (S/M/L/XL) and a **priority/ICE** score
(`impact × confidence ÷ effort`). For removal findings, additionally compute a **removal
confidence** = `reachability_confidence × reversibility ÷ blast_radius`; only top-tier earns a
"remove now" recommendation — everything else is "investigate" or "deprecate".

---

## How to use this prompt

```
TARGET:       <local repo path or GitHub URL>
SCOPE:        <whole repo | specific packages/paths>
DATA_ACCESS:  <read-only static analysis (default) | tools available>
OUTPUT_LANG:  <Deutsch (default) | English | ...>
ISSUE_TARGET: <owner/repo for issues — preview-first, on approval>
```

No arguments are strictly required — Phase 0 infers the stack. The audit is **read-only**: tools run
in inspection mode only (`knip`, `depcheck`, `jscpd`, `npm ls`/`npm why`, `syft`, linters in check
mode). Recommendations are produced; nothing is deleted.

---

## Phase 0 — Reconnaissance (run first, before any judgment)

Build a factual inventory and the two artefacts every later phase depends on. No opinions yet.

1. **Ecosystem & layout:** top-level tree (2–3 levels), monorepo vs. single package, package
   manager(s) and language(s), generated/vendored directories — **mark them excluded** from both
   dead-code and duplication scans (node_modules, dist/build, migrations, protobuf/codegen,
   lockfiles, snapshots, vendored dirs).
2. **Dependency ground truth (transparency):** generate a Software Bill of Materials with **Syft**
   (CycloneDX + SPDX) — or the ecosystem equivalent. Record counts: **direct vs. transitive**,
   **dev vs. prod**, duplicate-version "doppelgängers", and the full transitive footprint. Make
   *"why is this here?"* answerable for every package (`npm explain`/`pnpm why`/`yarn why`). Build
   the module graph (dependency-cruiser/madge) for orphans and cycles.
3. **The Reachability Map (proof substrate for every removal claim):** enumerate **every entry-point
   class** — `main`/bin, framework routes/handlers, cron/queue workers, tests, public package
   exports & re-exports, CLI commands, build/tooling config — and **every dynamic-dispatch surface**
   — reflection, DI, dynamic `import()`, string-built asset/i18n keys, plugin/route registration,
   codegen. No removal finding is valid without consulting this map.
4. **The Protected / Load-Bearing Manifest (the anti-over-deletion guardrail):** list every file in
   the protected categories up front and mark each *"requires explicit reachability + reversibility
   proof — never auto-removed"*:
   - **Legal & governance:** `LICENSE`, `SECURITY.md`, `CODE_OF_CONDUCT.md`, `CODEOWNERS`,
     `.github/FUNDING.yml`, issue/PR templates — consumed by GitHub, lawyers, and review automation,
     not by the build graph.
   - **Service discovery:** `.well-known/*` (RFC 8615 — fetched over the network by CAs/browsers;
     zero repo references is *expected*).
   - **Reproducibility & supply chain:** lockfiles (`package-lock.json`, `yarn.lock`, `pnpm-lock`,
     `poetry.lock`, `Cargo.lock`, `go.sum`).
   - **Tooling/CI config, generated-but-committed artefacts** (types, OpenAPI clients) where codegen
     is not guaranteed in CI, **public-API entry points & re-exports**, **i18n fallbacks & dynamic
     keys**, **side-effect-only imports** (declared in `sideEffects`), `.gitkeep` placeholders, and
     **reflection/DI/string-referenced** code.
5. **Slop baseline (deterministic, before any subjective judgment):** run jscpd (duplication %),
   knip/ts-prune/vulture/unimported (dead code, unused exports/deps), and the language linters.
   Where available, capture the **git-churn trend** (30/90-day revert/rewrite rate) — a rising
   duplication + falling refactoring fingerprint (GitClear 2025).

Output of Phase 0: a **Lean Fact Sheet** (inventory + SBOM summary + Reachability Map + Protected
Manifest + tool baseline) handed to every Phase 1 agent.

---

## Phase 1 — Parallel specialist swarm: five leanness dimensions

Spawn one specialist agent per dimension (parallel where possible). Each receives the Lean Fact
Sheet, its charter below, and returns findings in the shared schema, **plus** a **dimension grade
(A–F)** with a two-sentence justification and a **"protect this"** list (what is genuinely lean /
well-justified and must be kept).

### 1. Dependency transparency & supply chain
- Separate the two failure modes explicitly: **declared-but-unused** dependencies (bloat + install/
  supply-chain surface; knip + depcheck cross-checked) vs. **phantom / used-but-undeclared** deps
  (latent breakage when hoisting shifts; knip "missing", dependency-cruiser "not-in-package-json").
- **Misplacement:** prod code importing devDependencies; dev-only tools shipped to prod.
- **Footprint & weight:** direct vs. transitive subtree size, duplicate-version trees, trivially
  replaceable micro-deps, bundle-size impact of *shipped* JS (`size-limit` on tree-shaken output —
  never trust Bundlephobia's whole-package number as a verdict).
- **Provenance:** any transitive package whose presence cannot be explained (`npm why`) is a finding.
- **Lockfile & supply chain:** lockfile committed, SHA-512 integrity present, `npm ci`-style
  reproducible install in CI, lockfile-lint policy (hosts/https/hashes); upstream hygiene of top
  deps (OpenSSF Scorecard), missing provenance/SLSA attestations.
- **License exposure:** scan all transitive licenses against an allow/deny policy — copyleft/unknown/
  incompatible is a finding independent of code quality.

### 2. Dead code, unused exports & orphan files
- **Reachability before removal:** for every "dead" candidate, show that *nothing in the Reachability
  Map reaches it* and state explicitly **which blind spots were checked** (reflection? dynamic
  import? public API consumed out-of-repo? generated? string-built path? DI/route registration?).
- Never-imported source files (orphans); unused exports, types, class/enum members (knip as the
  graph-aware truth; ts-prune/`ts-unused-exports` as lighter checks; vulture for Python with its
  60–100% confidence; `deadcode`+staticcheck for Go — sound reachability).
- Distinguish **proven-dead** (static reachability holds, no dynamic channel) from **suspected-dead**
  (heuristic/confidence only) and label every finding accordingly.

### 3. Redundancy & duplication
- Exact (Type-1), renamed (Type-2), and near/structural (Type-3) clones via jscpd / PMD-CPD (token
  Rabin-Karp) and, where available, Sonar for structural clones. Report **duplication density** and
  the **largest clone clusters**, not just a count; cite both clone locations.
- Re-implemented utilities with slightly different names instead of reusing an existing one;
  duplicated/contradictory configs; redundant or near-duplicate docs.
- **Over-consolidation guard:** flag clones for *consolidation only* when the duplicates truly share
  one reason to change (Rule of Three). Generated code, DTO/config boilerplate, and intentionally
  parallel code are **not** automatically findings.

### 4. AI slop & defensive boilerplate
- Comments that **restate the code** (`// increment i`, section-divider banners) and padded/filler
  READMEs — judged by *added value*, not length; a comment explaining **why** is protected.
- Over-defensive boilerplate with a simpler equivalent: triple null checks
  (`x !== null && x !== undefined && x !== ''`), needless `try/catch`, `Promise.all` on one promise,
  `=== true`, redundant `return undefined`.
- **Error-handling slop:** empty / log-and-continue / error-obscuring catch blocks — severity rises
  on critical paths (this is where a P0 hides).
- Leftover scaffold/example files, debug `console.log`, generic `TODO`s; happy-path-only tests with
  perfect input and duplicated mock setup. Codify recurring patterns as Semgrep/deslop/slop-scan
  rules where the harness allows.

### 5. Over-engineering, YAGNI & dead flags
- **Speculative generality:** interfaces/factories/generics with **fewer than three** concrete call
  sites, built for hypothetical futures (Fowler's smell; Google review guide — "be especially
  vigilant about over-engineering"). Distinguish speculative **features** (cut) from **malleability /
  refactoring seams / tests** (protect — YAGNI explicitly exempts these).
- Unused config knobs and options no caller sets; the four-cost test (build, delay, carry, repair).
- **Dead / stale feature flags:** always-true/always-false branches (Piranha) — but **not** kill
  switches, permission gates, or by-design permanent flags; only release/experiment toggles past
  their lifecycle are debt.

---

## Phase 2 — Cross-pollination & dedupe

Pool all Phase 1 findings; **deduplicate** by root cause across dimensions (the same orphan reported
by the dead-code and dependency agents = one finding, strongest evidence kept) and surface
**compound findings** (a duplicated subsystem that *also* drags in an unused dependency). The
deduplicated set feeds Phase 3.

---

## Phase 3 — Adversarial verification

No removal recommendation reaches the report unrefuted. For every finding of severity P0–P2,
dispatch independent skeptics (separate agents where possible) who default to **refuted** when
evidence is weak:

1. **The Resurrector** (false-positive critic for deadness): prove the "dead" code/file/dependency is
   actually **reachable** — re-open the cited location and hunt the channel a static tool cannot see
   (dynamic `import()`/reflection/DI, plugin/route registration, network fetch of a `.well-known`
   path, string-built key, public API consumed out-of-repo, config/CLI/CI reference, codegen input).
   If any live channel is found, the removal finding is **refuted or downgraded to "investigate"**.
2. **The Fence-Keeper** (Chesterton's Fence critic): prove the original **purpose is truly obsolete** —
   git-blame, last-touched, the replacement, and the migration path. If the purpose cannot be shown
   obsolete, the recommendation becomes **"deprecate, don't delete"**, never "remove".
3. **Equivalence check** (for slop/boilerplate removals): prove the simpler form is **behaviourally
   equivalent** before recommending the cut; if behaviour could change, drop the severity.
4. **Over-consolidation critic** (for duplication findings): refute any consolidation that would raise
   coupling/blast-radius or fail the Rule of Three; a god-module proposal is itself flagged.
5. **Completeness critic:** "Given the Lean Fact Sheet, what bloat would a top-tier auditor expect
   flagged that isn't here? Which dimension looks suspiciously clean?" Feed anything credible back
   through a quick verification round.

Findings survive only on **≥ 2 of 3** skeptic confirmations; partially-confirmed ones are downgraded
with a note. P3 items get a lighter pass: spot-check at least a third.

### Severity definitions (apply strictly)

- **P0 — Critical:** the liability hides or enables a real defect/exposure on a critical path
  (swallowed exception on auth, always-on flag masking a kill switch, known-vulnerable reachable
  dependency, incompatible license, uncommitted/poisoned lockfile). *Fix immediately.*
- **P1 — High:** proven-dead module/dependency with real maintenance cost, a phantom dependency that
  breaks a fresh install, prod importing dev deps, a large drifted duplicated subsystem.
- **P2 — Medium:** suspected-dead code/deps needing verification, moderate duplication,
  over-engineering, defensive boilerplate, declared-but-unused dependency bloat.
- **P3 — Low:** commented-out lines, trivial orphan assets, restating-the-code comments, stale `TODO`s.

---

## Phase 4 — Benchmark: best practice & reference

Runs in parallel with late Phase 1. Requires web research; if unavailable, benchmark against your
knowledge and **flag the cutoff date as a limitation**.

1. Compare the repo's leanness posture to the canon: *SWE at Google* Ch. 15 (deprecation /
   "code is a liability"), Ch. 21 (dependency management / "adding a dependency is not free"),
   Ch. 22 (large-scale change / staged migration), Google's code-review guide (small CLs,
   over-engineering), OWASP Component Analysis (inventory-first), SLSA / OpenSSF Scorecard, YAGNI,
   Chesterton's Fence.
2. Name 2–3 **reference repositories** of comparable type that exemplify lean dependency management
   and disciplined deletion; classify every notable pattern: **Lean / Industry-standard** /
   **Acceptable** / **Bloat** (name the strip-down) / **Anti-pattern** (cite why), and note where
   *over*-leanness (hand-rolled reimplementation, premature DRY) would be the wrong call.
3. Output a **Benchmark Table**: `Aspect | This repo | Lean best practice | Classification | Note`.

---

## Phase 5 — Synthesis & report

Produce the final report as a single Markdown document (`LEAN-AUDIT-REPORT.md` content; output it in
chat, write a file only if asked). Structure — exactly these sections:

1. **Executive Summary** (≤ 1 page): plain-language verdict, overall leanness grade, the 3–5 things
   leadership must know (biggest justified strip-down win **and** the biggest over-deletion trap
   avoided), written for a CTO.
2. **Scorecard:** table of the five dimensions × grade (A–F) × one-line justification × finding
   counts by severity, plus these rubric dimensions and an **Overall Leanness Grade** (weighted:
   *Dependency hygiene* and *Anti-over-deletion safety* count double):
   - **Leanness** (dead code/deps/duplication actually present),
   - **YAGNI discipline** (speculative generality, unused knobs),
   - **Dependency hygiene** (transparency, unused/phantom, supply chain, license),
   - **Deletion-readiness / reversibility** (are removals small, self-contained, revert-able?),
   - **Anti-over-deletion safety** (was the Protected Manifest respected? are removals proven?).
3. **Lean Fact Sheet** (from Phase 0) + **SBOM summary** (direct/transitive/dev/prod counts,
   doppelgängers, the "why is this here" map for anything unexplained).
4. **Removal Register — the four-class table.** Every candidate sorted with a *deliberate asymmetry*
   (default uncertain items to Investigate/Deprecate, **never** Delete):

   | Class | Bar | Recommended action |
   |---|---|---|
   | **Confirmed removable** | high reachability confidence × reversible × small blast radius | remove now (with revert note) |
   | **Investigate** | tool signal, dynamic channels not ruled out | trace before any removal |
   | **Deprecate, don't delete** | in use but obsolete; external surface | staged removal + migration path |
   | **Protected** | from the Protected Manifest, or reachable | do not touch — beweis umgekehrt |

5. **Benchmark Table** (from Phase 4) + named reference repos.
6. **Verified Findings Register:** every surviving finding in the shared schema, ordered by severity
   then priority, each with its class, reachability/reversibility/blast-radius, the skeptic notes,
   and a concrete fix.
7. **Strengths / "protect this":** the lean, well-justified parts — be specific and evidence-based.
8. **Remediation Roadmap (staged removal, not a purge):**
   - **Quick Wins** (≤ 1 day, reversible, zero external surface — e.g. commented-out code, an unused
     dev dependency),
   - **30 days** (P0/P1 + proven-dead modules; one small, individually revert-able change each),
   - **60 days** (deduplication where the Rule of Three holds; dependency consolidation),
   - **90 days** (staged deprecation of obsolete systems with a documented replacement + migration).
   Prefer **many small reversible deletions over one atomic purge** (the largest safe change shrinks
   as the repo grows — *SWE at Google* Ch. 22). Each item references finding IDs.
9. **Audit Coverage & Limitations:** what was sampled vs. fully read, which dynamic channels could
   not be fully traced, tool/web constraints, and an honest confidence statement.

---

## Issue output — mandatory (see [`ISSUE-OUTPUT-STANDARD.md`](../ISSUE-OUTPUT-STANDARD.md))

Beyond the report, turn verified findings into GitHub issues — **German by default** (configurable
via `OUTPUT_LANG`); preview/dry-run first, created only on explicit authorization + repo access.
Two-part contract:

1. **Tracking issue first** — `[AUDIT] Lean — Befund-Tracker & Roadmap`. Body: a management summary
   (overall leanness grade, biggest strip-down win, biggest over-deletion trap avoided), the
   scorecard, the **Removal Register four-class table**, a **priority-sorted checklist** (P0→P3, then
   effort) where each line links its child issue, and the Quick-Wins/30/60/90 staged-removal roadmap.
   Labels: `audit`, `tracking`, `lean`.
2. **One issue per verified finding** — top-notch, German, each opening with its own **management
   summary** (2–3 sentences: the liability, its cost, the one-line recommendation), then the full
   finding: severity, dimension, removal **class**, evidence `file:line` + tool signal, the
   blind-spots-checked line, reachability/reversibility/blast-radius, impact, a concrete before/after
   fix **with a git-revert/reversibility note**, effort, and a re-audit criterion. Labels: `audit`,
   `sev:p0…p3`, `dimension:<dimension>`, `effort:S|M|L`; back-link to the tracker.

Create child issues first, collect their numbers, then create/update the tracking issue so its
checklist links resolve. Detect existing audit issues by label and update rather than duplicate.
Never recommend deleting a Protected-Manifest file without an explicit proof; never include real
secrets — cite location and redact.

---

## Shared finding schema (all agents)

```json
{
  "id": "LEAN-007",
  "dimension": "dependencies | dead-code | duplication | slop | over-engineering",
  "title": "Declared-but-unused dependency `left-pad` ships in prod surface",
  "severity": "P2",
  "class": "confirmed-removable | investigate | deprecate-not-delete | protected",
  "confidence": 0.9,
  "effort": "S",
  "evidence": "package.json:34 + knip 'unused dependencies' — no import in src/",
  "tool_signal": "knip@5 | jscpd | depcheck | npm why | syft",
  "blind_spots_checked": "scripts? config-by-string? dynamic import? peer/hoist satisfier? — all ruled out",
  "reachability_confidence": 0.9,
  "reversibility": "high (clean git revert, no external consumer)",
  "blast_radius": "low (dev-only install surface)",
  "standard": "SWE@Google Ch.21 — dependency footprint; OWASP Component Analysis",
  "fix": "concrete before/after — remove from package.json; staged step + revert note",
  "expected_impact": "smaller install + supply-chain surface; no behaviour change"
}
```

This extends the **same core schema every audit in the library emits** (P0–P3 severity, evidence,
fix) with leanness-specific fields (`class`, reachability/reversibility/blast-radius), so findings
still compose across audits in the orchestrator.

---

## Definition of done (self-check before delivering)

- [ ] All five dimensions were audited and graded; none skipped silently.
- [ ] The Protected / Load-Bearing Manifest was built in Phase 0 and **no protected-category file was
      recommended for deletion without an explicit reachability + reversibility proof**.
- [ ] Every removal finding states which **blind spots were checked** and survived the Resurrector +
      Fence-Keeper (≥ 2 of 3 skeptics); none rests on "no caller found" alone.
- [ ] Every removal recommendation carries a **reversibility note**; no recommendation merely silences
      a tool, and no consolidation was proposed without passing the **Rule of Three**.
- [ ] No finding claims code is "AI-written" — each names a concrete, measurable liability at
      `file:line` with a tool signal where possible.
- [ ] The dependency surface is **transparent**: direct/transitive/dev/prod counted, every package's
      presence explainable, license + lockfile + supply-chain checked.
- [ ] The Benchmark Table names concrete reference repos / standards; severities applied as written.
- [ ] Coverage & Limitations honestly lists everything not examined; the repository was left
      byte-for-byte unmodified.

If any box is unchecked, the audit is not done — go back and finish it.
