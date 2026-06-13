# Performance & Scalability Audit — Master Orchestration Prompt

> **Mission:** Subject the target system to a rigorous performance and scalability audit at
> the standard of a top-tier SRE / performance-engineering team. Deploy a swarm of
> specialist agents to find where the system is slow, where it will fall over under load,
> and where it wastes resources — every finding evidence-backed, adversarially verified,
> severity-scored, and translated into a prioritized roadmap with **estimated metric
> improvement per fix**.
>
> **Universality:** Stack- and tier-agnostic. Applies to backend services, APIs, data
> pipelines, batch jobs, serverless functions, monoliths, and full-stack apps. Frontend
> rendering performance is owned by the frontend audit; this audit owns server-side latency,
> throughput, resource efficiency, and scaling behavior. Phase 0 decides what's in scope;
> non-applicable mandates are logged, never skipped silently.

---

## How to use this prompt

```
TARGET:       <repo path and/or running endpoint / service>
WORKLOAD:     <read-heavy API | write-heavy ingest | batch/ETL | realtime | mixed>
SCALE_TARGET: <current + expected: req/s, data volume, concurrency, growth>
ENVIRONMENT:  <runtime, DB(s), cache, queue, cloud, container orchestration>
DATA_ACCESS:  <can run load tests / profilers? or static code analysis only?>
OUTPUT_LANG:  <English (default) | Deutsch | ...>
```

If unknown, Phase 0 infers from the code/infra and states assumptions. **Active load
testing against production requires explicit authorization** — without it, reason from code,
query plans, and architecture, and flag the limitation.

---

## Operating principles (binding for every agent)

1. **Evidence or it didn't happen.** Every finding cites a concrete artifact: hot-path
   `file:line`, a query + its `EXPLAIN` plan, a measured latency/throughput number, a
   profiler frame, a config value, or a complexity argument with the offending loop. No
   evidence → discarded.
2. **Quantify.** State the cost: estimated added latency, extra queries per request, memory
   growth, or the load level at which it breaks. "Slow" without a number is rejected.
3. **Severity is earned.** Use P0–P3; a P0 names the failure mode under realistic load.
4. **Measure before blaming.** Distinguish *measured* findings from *reasoned* ones; label
   each. Never assert a hotspot you didn't either measure or argue from algorithmic cost.
5. **Adversarial humility.** Every finding is attacked in Phase 3; pre-empt the refutation.
6. **Praise what scales.** Each specialist returns its top 3 "protect this" items.
7. **Fix-forward with a number.** Every confirmed finding ships a concrete remediation AND
   an estimated improvement (e.g., "adds index → 1 query 4 ms vs 800 ms seq scan").

### Severity scale

| Level | Definition |
|---|---|
| **P0 — Critical** | Will fail (timeout/OOM/saturation/cascading failure) at or near expected load; data-loss under backpressure; unbounded resource growth. |
| **P1 — High** | Severe inefficiency on a hot path (N+1, missing index on a frequent query, no caching of an expensive call) materially raising latency/cost or limiting headroom. |
| **P2 — Medium** | Meaningful waste with real ongoing cost: redundant work, oversized payloads, poor cache hit-rate, chatty I/O. |
| **P3 — Low** | Micro-optimizations and polish with marginal impact. |

Each finding gets **effort (S/M/L/XL)** and a **priority = expected impact × confidence ÷ effort**.

---

## Phase 0 — Reconnaissance (run first, feeds every agent)

- **Architecture map:** services, data stores, caches, queues, external calls, and the
  synchronous vs asynchronous boundaries. Mark the **critical request paths** (the 5–10
  highest-traffic or most latency-sensitive flows) — these get double coverage.
- **Workload model:** read/write ratio, request shape, payload sizes, concurrency, peak vs
  average, data volume and growth rate.
- **Resource & cost baseline:** instance sizes, DB tier, current latency/throughput SLOs (or
  inferred), known incidents, existing dashboards/metrics if any.
- **Tooling available:** profilers, APM, load-test harness, DB query stats, slow-query logs.
- **Reference bar:** what "good" looks like for this workload class (target p50/p95/p99,
  throughput, cost-per-request).

Output: a structured brief distributed to all Phase 1 agents.

---

## Phase 1 — Specialist swarm (parallel agents)

### P1 — Algorithmic & hot-path complexity
Find super-linear work on hot paths: nested loops over request-scaled data, O(n²)
deduplication, repeated work inside loops, unbounded recursion, regex catastrophic
backtracking, in-memory sorts/joins that belong in the DB. Tie each to the input size that
makes it hurt.

### P2 — Database query efficiency
N+1 query patterns (the #1 offender — hunt them per endpoint), missing/duplicate/unused
indexes, full table scans on frequent queries (read `EXPLAIN`/query plans), SELECT * and
over-fetching, queries inside loops, missing query result limits, inefficient joins,
implicit type casts defeating indexes, and ORM lazy-loading traps. Each finding: the query,
its plan, and the indexed/rewritten alternative.

### P3 — Caching strategy
What is recomputed that could be cached (and what is cached that shouldn't be)? Cache
layers (in-process, distributed, CDN, DB query cache), hit-rate reasoning, key design,
TTL/invalidation correctness (staleness vs thundering herd), cache stampede protection,
and missing caching of expensive idempotent calls (external APIs, heavy aggregations).

### P4 — Concurrency, parallelism & async
Blocking I/O on request threads, sync calls that should be parallel, connection-pool sizing
and exhaustion, lock contention and long-held locks, thread/event-loop starvation, missing
backpressure, sequential awaits that could be batched, and unbounded concurrency
(fan-out with no limit). For event loops: CPU-bound work blocking the loop.

### P5 — Resource management & leaks
Memory growth/leaks (retained references, unbounded caches/maps, accumulating buffers),
connection/file-handle/socket leaks, goroutine/thread leaks, large object allocation churn
and GC pressure, and unbounded queues/buffers that OOM under backpressure.

### P6 — Network & I/O efficiency
Chatty service-to-service calls (could be batched/coalesced), payload sizes (compression,
field pruning, pagination), serialization cost, missing connection reuse/keep-alive, no
timeouts on external calls, retN+1 across the network, and synchronous external calls on
the critical path that should be async/queued.

### P7 — Scalability & load behavior
Statefulness blocking horizontal scaling (in-memory session/state), single points of
contention (a hot row, a global lock, one partition), database as the scaling ceiling,
missing sharding/partitioning where data volume demands it, autoscaling responsiveness,
cold-start cost (serverless), and behavior at 2×/10× current load (reason it through).

### P8 — Resilience under stress
Timeout discipline (every external call bounded), retry storms and missing exponential
backoff + jitter, circuit breakers, bulkheads, graceful degradation vs cascading failure,
queue backpressure and load shedding, and the failure mode when a dependency is slow (not
just down). A retry-without-backoff on a hot path is P0/P1.

### P9 — Data pipeline / batch efficiency
(If present) Job runtime and resource profile, full-vs-incremental processing, partitioning
and parallelism, shuffle/skew, repeated reads of the same source, checkpoint/restart cost,
and small-file or row-by-row processing where bulk/vectorized would win.

### P10 — Cost & resource efficiency (FinOps)
Over-provisioning, idle resources, expensive queries/operations driving cloud cost,
inefficient instance/DB tier choice, egress costs, and the cost-per-request of the hot
paths. Tie inefficiencies to a rough $ or resource figure where possible.

### P11 — Measurement & observability for performance
Are p50/p95/p99 latency, throughput, error rate, and saturation actually measured per
critical path? Slow-query logging on? Profiling possible in prod? Missing instrumentation
is itself a finding — you can't manage what you can't see.

Each agent returns a **dimension grade (A–F)** + justification and a **top-3 "protect this"**.

---

## Phase 2 — Cross-pollination barrier

Synthesis agent merges, **dedupes**, and flags **compound findings** (e.g., N+1 query × no
caching × no rate limit = guaranteed melt under load).

## Phase 3 — Adversarial verification

Every P0/P1 (and compound/uncertain P2) is attacked by skeptics: **The Refuter** (is the
hotspot real and on a hot path, or cold code? is the measurement sound?), **The Context
Defender** (is this intentional and bounded? would the fix add complexity for no real gain
at actual scale?), **The Impact Auditor** (re-derive the load level / cost and re-score).
Survives with ≥ 2/3 confirmations; severity = median. A claimed hotspot that isn't actually
hot is **refuted** — premature optimization is a finding against the auditor, not the code.
Then a **completeness critic**: "which critical path is under-profiled? which scaling
ceiling wasn't reasoned through?"

## Phase 4 — Benchmark

Compare the target's key-path latency/throughput/cost against the Phase 0 reference bar and
2–3 well-understood patterns for this workload class. Output transferable mechanics, not "be
faster."

---

## Phase 5 — Synthesis & deliverables

In `OUTPUT_LANG`:

1. **Executive summary** (≤ 1 page): will-it-scale verdict, the single biggest bottleneck,
   the load level at which the system breaks today, realistic ceiling after remediation.
2. **Scorecard:** grade per dimension (P1–P11) + finding counts; overall weighted grade
   (DB efficiency, Scalability, Resilience count double).
3. **Bottleneck map:** the critical paths annotated with their dominant cost and the load
   ceiling each imposes.
4. **Verified findings register:** standard schema, sorted by priority; each with estimated
   improvement; skeptic note on P0/P1.
5. **Strengths / "do not touch" list.**
6. **Remediation roadmap:** Quick Wins (≤ 1 day, often "add this index") → 30 / 60 / 90 days,
   dependency-aware, referencing finding IDs. Mark **load-test-required** items.
7. **Re-audit criteria:** measurable exit conditions (target p95, throughput, cost) per P0/P1.
8. **Issue export (optional):** one ticket per confirmed finding on explicit authorization;
   dry-run/preview first.

### Appendices
A: killed findings + refutations (incl. "not actually hot"). B: coverage map (path × agent).
C: assumptions & measurement-method registry (what was measured vs reasoned).

---

## Shared finding schema (all agents)

```json
{
  "id": "P2-011",
  "agent": "db-query-efficiency",
  "title": "GET /orders triggers N+1: 1 + N queries for line items",
  "severity": "P1",
  "confidence": 0.92,
  "effort": "S",
  "method": "measured",
  "paths": ["GET /api/orders"],
  "evidence": "services/orders.ts:54 loops orders and lazy-loads items per row. Repro: 50-order page = 51 queries (query log). p95 480 ms; DB CPU dominant.",
  "cost": "+~50 queries/request; p95 480 ms vs ~40 ms projected",
  "fix": "Eager-load items in one query (JOIN or IN(...)) or DataLoader batch. ~15 LOC.",
  "expected_impact": "51 queries → 2; est. p95 480 ms → ~40 ms; ~90% DB load cut on this path",
  "anticipated_refutation": "'Low traffic endpoint' — it's on the post-checkout path, called every order; query log shows it in the top 5 by volume."
}
```

---

## Definition of done (self-check before delivering)

- [ ] Every critical path from Phase 0 was assigned and analyzed; none skipped silently.
- [ ] Every register finding is quantified and labeled measured vs reasoned.
- [ ] N+1 hunting, index/plan review, and timeout/retry discipline were *actively* checked.
- [ ] Scaling behavior at 2×/10× load was reasoned through for each critical path.
- [ ] Each fix carries an estimated metric/cost improvement.
- [ ] Coverage, assumptions, and measurement-method appendices are complete.
- [ ] The target was left unmodified; any load tests were authorized and isolated.
```
