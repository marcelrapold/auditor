# API Design & Quality Audit — Master Orchestration Prompt

> **Mission:** Subject the target API (REST, GraphQL, gRPC, tRPC, or webhook surface) to a
> rigorous, multi-perspective audit at the standard of a top-tier platform team (Stripe /
> Google API Design Guide / GitHub API grade). Deploy a swarm of specialist agents, each a
> world-class API expert. Output: every finding evidence-backed, adversarially verified,
> severity-scored, and translated into a prioritized, actionable roadmap.
>
> **Universality:** Protocol- and stack-agnostic. Applies unchanged to public REST APIs,
> internal microservice contracts, GraphQL gateways, gRPC services, BFFs, and webhook
> producers/consumers. Agents adapt their mandate to what the target actually is (Phase 0
> decides); mandates referencing surfaces the target lacks are logged "not applicable",
> never skipped silently.

---

## How to use this prompt

Paste this entire document into your agent orchestrator (Claude Code with `ultracode` /
Workflow mode recommended) together with the **target**:

```
TARGET:        <repo path and/or base URL / OpenAPI / GraphQL schema / .proto files>
API_TYPE:      <REST | GraphQL | gRPC | tRPC | webhooks | mixed>
CONSUMERS:     <who calls this — public devs | internal services | mobile | partners>
SLA/CRITICALITY: <tier-0 payments | internal best-effort | ...>
OUTPUT_LANG:   <English (default) | Deutsch | ...>
```

If unknown, Phase 0 infers them from the code/schema and states assumptions explicitly.

---

## Operating principles (binding for every agent)

1. **Evidence or it didn't happen.** Every finding cites a concrete artifact: handler
   `file:line`, schema/`.proto`/OpenAPI path, an actual request/response pair, or a quoted
   contract clause. No evidence → discarded.
2. **Cite the standard, not vibes.** Each finding names the rule it violates: RFC 9110
   (HTTP semantics), RFC 7807/9457 (Problem Details), JSON:API, Google AIP, OpenAPI 3.1,
   GraphQL spec, gRPC conventions, OAuth 2.1, REST maturity (Richardson) — whichever applies.
3. **Severity is earned.** Use the P0–P3 scale below; a P0 must articulate the concrete
   harm to a consumer or to data integrity.
4. **Contract is truth.** Judge the API against its *published contract* and against what
   the code *actually does* — every drift between spec and implementation is a finding with
   both locations cited.
5. **Adversarial humility.** Every finding is attacked by skeptics in Phase 3. Write
   findings that survive: include the refutation you anticipated and why it fails.
6. **Praise what is excellent.** Each specialist returns its top 3 "protect this" items.
7. **Fix-forward.** Every confirmed finding ships a concrete remediation: corrected schema,
   handler diff, header set, or contract clause — not just a diagnosis.

### Severity scale

| Level | Definition |
|---|---|
| **P0 — Critical** | Breaks consumers in production, corrupts data, leaks data across tenants, or is an unauthenticated mutating endpoint. |
| **P1 — High** | Backward-incompatible drift, missing auth on a sensitive path, no idempotency on a money/side-effect endpoint, unbounded query enabling DoS. |
| **P2 — Medium** | Inconsistency that raises integration cost: mixed conventions, weak error model, missing pagination limits, undocumented behavior. |
| **P3 — Low** | Polish: naming nits, missing examples, minor doc gaps. |

Each finding also gets **effort (S/M/L/XL)** and **ICE = impact × confidence ÷ effort**.

---

## Phase 0 — Reconnaissance (run first, feeds every agent)

Build the shared map every specialist receives:

- **Surface inventory:** every endpoint/operation/message — method + path + handler, or
  GraphQL field/resolver, or gRPC service/method. Group by resource and by consumer flow.
- **Contract sources:** OpenAPI/Swagger, GraphQL SDL, `.proto`, JSON Schema, Postman
  collections, published docs. Note where a contract is *missing* (code-only endpoints).
- **Auth model:** how callers authenticate (API key, OAuth, JWT, mTLS, session), and where
  authorization is enforced (gateway, middleware, per-handler, or nowhere).
- **Versioning & lifecycle:** version scheme, deprecation signals, breaking-change history.
- **Critical operations (CUOs):** the 5–10 operations that carry the business (auth,
  payment, data mutation). These get double coverage.
- **Reference bar:** name 2–3 best-in-class APIs in this category to benchmark against.

Output: a structured brief distributed to all Phase 1 agents.

---

## Phase 1 — Specialist swarm (parallel agents)

Each agent receives the recon brief, its mandate, and returns findings in the shared schema.

### A1 — Resource modeling & URL/operation design
Resource naming (nouns, plurals, hierarchy), URL/field structure consistency, correct HTTP
method semantics (GET safe & idempotent, POST/PUT/PATCH/DELETE used correctly), GraphQL
query/mutation/subscription split, gRPC method naming. Flag verbs-in-paths, action
endpoints that should be resources, and inconsistent collection patterns.

### A2 — HTTP semantics & status codes
Correct status codes per outcome (201 + Location on create, 204 on empty, 207/422 for
validation, 409 conflict, 429 limit, 4xx vs 5xx discipline). Header correctness:
`Content-Type`, `Accept`, `Location`, `ETag`/`If-Match`, `Cache-Control`, `Retry-After`,
`Allow`. Caching semantics and conditional requests. (For gRPC: status-code mapping.)

### A3 — Error model & failure contract
One coherent error envelope (RFC 9457 Problem Details or documented equivalent): stable
machine-readable codes, human messages, field-level validation errors, correlation/trace
IDs. Flag stack-trace leakage, inconsistent shapes across endpoints, 200-with-error-body
anti-pattern, and errors that don't tell the consumer how to recover.

### A4 — Authentication & authorization
Every mutating/sensitive operation requires auth; authorization is enforced at the object
level (no IDOR/BOLA), scopes/roles checked, tenant isolation verified. Token validation
(JWT signature/exp/aud), key rotation, least-privilege scopes. Cross-reference the security
audit if one exists. Any unauthenticated sensitive endpoint = P0.

### A5 — Versioning, compatibility & deprecation
Version strategy coherence (URL vs header vs schema evolution), backward-compatibility of
recent changes (removed/renamed fields, narrowed types, changed defaults = breaking),
deprecation signaling (`Deprecation`/`Sunset` headers, GraphQL `@deprecated`), and a
documented migration path for every deprecation. Spec-vs-code drift is graded here.

### A6 — Pagination, filtering, sorting & bulk
Consistent pagination (cursor vs offset — and is the choice right for the data?), enforced
page-size limits, stable ordering, filter/sort grammar consistency, bulk/batch operation
design, and N+1-inducing access patterns exposed to callers. Unbounded list endpoints = P1.

### A7 — Idempotency, concurrency & consistency
Idempotency keys on money/side-effect POSTs, optimistic concurrency (ETag/version),
retry-safety, exactly-once vs at-least-once semantics for webhooks, race conditions in
read-modify-write paths, and transactional boundaries. Missing idempotency on payments = P0/P1.

### A8 — Rate limiting, quotas & abuse resistance
Rate-limit presence and correctness (per-key/per-IP/per-tenant), `429` + `Retry-After` +
limit headers, quota exhaustion behavior, expensive-query protection (GraphQL depth/
complexity limits, query cost analysis), and pagination/bulk abuse vectors.

### A9 — Payload & schema quality
Request/response schema rigor: types precise (no bare `string`/`object` where structured),
required vs optional explicit, enums vs free strings, null semantics defined, date/number/
money formats standardized (RFC 3339, minor-units for currency), field naming consistency
(one case style), and no over-fetching/under-fetching. GraphQL: nullability discipline,
schema federation hygiene.

### A10 — Documentation & developer experience
Contract completeness (every operation documented with params, bodies, errors, examples),
runnable examples, auth/quickstart guide, changelog, SDK/codegen friendliness of the spec,
OpenAPI/SDL validity (lint it), and the "time to first successful call" for a new consumer.

### A11 — Webhooks & async/event contracts
(If present) Event payload schema and versioning, delivery guarantees, signature
verification for consumers, retry/backoff + dead-letter behavior, ordering guarantees,
replay protection, and idempotency guidance for receivers.

### A12 — Observability & operational contract
Correlation/trace IDs propagated and returned, structured request logging without
secrets/PII, useful metrics per operation (latency, error rate, saturation), health/
readiness endpoints, and documented SLOs/timeouts/retry guidance for consumers.

Each agent returns a **dimension grade (A–F)** with two-sentence justification and a
**top-3 "protect this"** list.

---

## Phase 2 — Cross-pollination barrier

A synthesis agent merges the pool, **dedupes** overlapping findings (same root cause across
agents → merge, keep all citations), and flags **compound findings** (e.g., no pagination
limit × no rate limit = trivial DoS).

## Phase 3 — Adversarial verification

Every P0/P1 (and compound/uncertain P2) is attacked by independent skeptics with distinct
lenses: **The Refuter** (is the evidence real, the standard actually violated?), **The
Context Defender** (is this a deliberate, documented design choice? would the fix break a
consumer?), **The Impact Auditor** (re-derive the harm chain and re-score). Survives with
≥ 2/3 confirmations; severity = median of the three. Killed findings → appendix with
refutation. Then a **completeness critic**: "which CUO is under-covered? which spec-vs-code
drift wasn't checked?" — credible gaps go back through a quick round.

## Phase 4 — Benchmark

For the top findings and the CUOs, compare the target's pattern against the named
best-in-class APIs from Phase 0: what exactly does the category leader do here, and what
transferable mechanic explains why it works.

---

## Phase 5 — Synthesis & deliverables

A final synthesis agent (with a completeness-critic pass) produces, in `OUTPUT_LANG`:

1. **Executive summary** (≤ 1 page): contract-health verdict, biggest integration risk,
   realistic ceiling after remediation.
2. **Scorecard:** grade per dimension (A1–A12) + one-line justification + finding counts;
   overall weighted grade (Auth, Compatibility, Error-model count double).
3. **Contract Drift Matrix:** published contract vs actual implementation, per operation.
4. **Verified findings register:** standard schema, sorted by ICE; skeptic note on P0/P1.
5. **Strengths / "do not touch" list.**
6. **Remediation roadmap:** Quick Wins (≤ 1 day) → 30 / 60 / 90 days, dependency-aware,
   referencing finding IDs. Separate the **breaking-change-required** items explicitly.
7. **Re-audit criteria:** measurable exit conditions per P0/P1.
8. **GitHub issues (mandatory):** per the *Issue output* section below and
   [`ISSUE-OUTPUT-STANDARD.md`](../ISSUE-OUTPUT-STANDARD.md) — tracking issue first, then one
   issue per finding (German by default); preview-first, created only on explicit approval.

### Appendices
A: killed findings + refutations. B: coverage map (every operation × every agent).
C: assumptions registry.

---

## Issue output — mandatory (see [`ISSUE-OUTPUT-STANDARD.md`](../ISSUE-OUTPUT-STANDARD.md))

After Phase 3 verification, turn confirmed findings into GitHub issues — **German by default**
(`OUTPUT_LANG`); preview/dry-run first, created only on explicit authorization + repo access.
Two-part contract:

1. **Tracking issue first** — `[AUDIT] API — Befund-Tracker & Roadmap`. Body: a management
   summary (verdict, grade, biggest risk), the scorecard, a **priority-sorted checklist**
   (P0→P3, then effort/ICE) where each line links its child issue, and the 30/60/90 roadmap.
   Labels: `audit`, `tracking`, `api`.
2. **One issue per confirmed finding** — top-notch, German, each opening with its own
   **management summary** (2–3 sentences: what, impact, one-line recommendation), then the full
   finding (severity + score, standard mapping, location, evidence, impact, concrete
   before/after fix, effort, re-audit criterion). Labels: `audit`, `sev:p0…p3`, `domain:<x>`,
   `effort:S|M|L`; back-link to the tracking issue.

Create child issues first, collect their numbers, then create/update the tracking issue so its
checklist links resolve. Detect existing audit issues by label and update rather than duplicate.
Never include real secrets or PII — cite location and redact.

---

## Shared finding schema (all agents)

```json
{
  "id": "A07-003",
  "agent": "idempotency-concurrency",
  "title": "POST /payments has no idempotency key — retries double-charge",
  "severity": "P0",
  "confidence": 0.95,
  "effort": "M",
  "operations": ["POST /v1/payments"],
  "evidence": "handlers/payments.ts:88 inserts a charge with no dedupe; no Idempotency-Key header read. Client retry on timeout creates a second charge (repro: two identical POSTs → two rows).",
  "standard": "Stripe idempotency pattern; RFC 9110 §9.2.2 (POST not idempotent → server must provide a mechanism)",
  "harm_chain": "Network retry or client bug double-charges customers → refunds, chargebacks, trust loss",
  "fix": "Accept Idempotency-Key header; store key→result for 24h; return the original response on replay. ~40 LOC + 1 table.",
  "expected_impact": "Eliminates duplicate charges on retry",
  "anticipated_refutation": "'Clients shouldn't retry' — they will (timeouts, proxies); HTTP requires the server to make POST safe to retry."
}
```

---

## Definition of done (self-check before delivering)

- [ ] Every operation in the Phase 0 inventory was assigned to agents; none skipped silently.
- [ ] Every register finding has artifact evidence and survived (or was downgraded by) Phase 3.
- [ ] Contract-vs-code drift was *actively tested*, not assumed; OpenAPI/SDL/proto was linted.
- [ ] Auth/authorization was verified on every mutating and sensitive operation.
- [ ] Breaking-change items are flagged separately in the roadmap.
- [ ] Coverage & assumptions appendices are complete and honest.
- [ ] The target was left unmodified (read-only audit).
