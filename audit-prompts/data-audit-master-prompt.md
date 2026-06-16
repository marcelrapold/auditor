# Data & Database Audit — Master Orchestration Prompt

> **Mission:** Subject the target's data layer — schema, data model, migrations, queries,
> integrity, and pipelines — to a rigorous audit at the standard of a top-tier data-platform
> team. Deploy a swarm of specialist agents to find correctness risks, integrity gaps,
> modeling debt, and operational landmines in how data is stored, evolved, and moved. Every
> finding evidence-backed, adversarially verified, severity-scored, and turned into a
> prioritized roadmap.
>
> **Universality:** Engine-agnostic. Applies to relational (Postgres/MySQL/SQL Server),
> document (MongoDB/DynamoDB), key-value, wide-column, graph, and analytical/warehouse
> stores (BigQuery/Snowflake/Redshift), plus the migration and ETL/ELT code around them.
> Query *performance* is shared with the performance audit; this audit owns **correctness,
> integrity, modeling, and data lifecycle**. Phase 0 decides scope; non-applicable mandates
> are logged, never skipped silently.

---

## How to use this prompt

```
TARGET:      <repo path and/or DB connection / schema dump / migration dir / dbt project>
ENGINE(S):   <Postgres | MySQL | MongoDB | DynamoDB | BigQuery | mixed | ...>
DATA_SHAPE:  <OLTP transactional | OLAP/warehouse | event store | mixed>
SENSITIVITY: <contains PII / payments / health data? regulatory regime?>
DATA_ACCESS: <live read-only DB access? or schema/code only?>
OUTPUT_LANG: <English (default) | Deutsch | ...>
```

If unknown, Phase 0 infers from schema/code and states assumptions. **Any access to live
data is strictly read-only and authorized; never read or export real PII into the report —
cite location and redact.**

---

## Operating principles (binding for every agent)

1. **Evidence or it didn't happen.** Cite the concrete artifact: DDL/migration `file:line`,
   schema object, a query, an actual (redacted) row pattern, or a constraint definition. No
   evidence → discarded.
2. **Integrity is the lens.** The central question is: *can this data become wrong, lost, or
   inconsistent?* Every "yes" with a path is a finding.
3. **Cite the principle.** Normalization forms, ACID/CAP trade-offs, referential-integrity
   rules, idempotency, the engine's documented semantics (isolation levels, eventual
   consistency) — name what's violated.
4. **Severity is earned.** P0–P3; a P0 names a concrete data-loss/corruption/leak path.
5. **Adversarial humility.** Every finding is attacked in Phase 3; pre-empt the refutation.
6. **Praise what is solid.** Each specialist returns its top 3 "protect this" items.
7. **Fix-forward.** Every confirmed finding ships a concrete remediation: corrected DDL, a
   constraint, a safe migration plan, or an access-pattern redesign.

### Severity scale

| Level | Definition |
|---|---|
| **P0 — Critical** | Active data-loss/corruption path, missing integrity allowing silent bad data, unencrypted sensitive data, a destructive/irreversible migration with no safety net, or cross-tenant data exposure. |
| **P1 — High** | Integrity gap likely to bite (missing FK/unique/NOT NULL on key data), unsafe migration pattern (locking/blocking), no backup/restore evidence, modeling flaw forcing data anomalies. |
| **P2 — Medium** | Modeling/consistency debt with real cost: denormalization without discipline, weak typing, naming chaos, missing soft-delete/audit strategy. |
| **P3 — Low** | Polish: naming nits, minor type tightening, documentation gaps. |

Each finding gets **effort (S/M/L/XL)** and **priority = impact × confidence ÷ effort**.

---

## Phase 0 — Reconnaissance (run first, feeds every agent)

- **Schema inventory:** every table/collection/dataset, its columns/fields, types, keys,
  constraints, indexes, and relationships. Build the **entity-relationship map**.
- **Migration history:** migration tool, ordering, reversibility, recent changes, and
  whether migrations are reviewed/tested.
- **Access patterns:** how the app reads/writes each entity (from the code) — this drives
  whether the model fits its usage. Mark the **critical entities** (money, identity,
  audit) for double coverage.
- **Data lifecycle:** ingestion, transformation (ETL/ELT/dbt), retention, archival,
  deletion, and PII flows.
- **Operational posture:** backups, replication, point-in-time recovery, and where
  consistency vs availability was traded.

Output: a structured brief distributed to all Phase 1 agents.

---

## Phase 1 — Specialist swarm (parallel agents)

### D1 — Schema design & normalization
Normalization level vs need (anomaly-prone under-normalization; join-heavy
over-normalization for the access pattern), repeating groups, derived/duplicated columns
that can drift, EAV anti-patterns, god tables, and correct use of denormalization (only
where deliberate and protected). For document stores: embedding-vs-referencing fit to
access pattern, unbounded array growth.

### D2 — Data types & precision
Right type for every column: money as integer minor-units or DECIMAL (never float),
timestamps as `timestamptz`/UTC (not naive local), correct integer widths, native enums/
booleans vs stringly-typed, JSON columns used with intent (not as a schema-dodge), and
charset/collation correctness. Flag every precision/overflow/truncation risk.

### D3 — Constraints & referential integrity
NOT NULL where the domain requires it, UNIQUE on natural keys, FOREIGN KEYs (with correct
ON DELETE/UPDATE), CHECK constraints encoding business rules, and validation pushed to the
DB rather than trusting app code alone. Every place the DB *allows* invalid state is a
finding. Orphan-row potential and missing cascade discipline are graded here.

### D4 — Keys, identity & indexing for correctness
Primary-key strategy (natural vs surrogate, UUID vs sequential trade-offs, exposure of
sequential IDs as an IDOR vector), composite-key correctness, uniqueness actually enforced
where dedup is assumed, and indexes required for *correctness-bearing* constraints. (Pure
performance indexing is cross-referenced to the performance audit.)

### D5 — Migration safety & schema evolution
Reversibility (down-migrations or a documented rollback), locking/blocking risk on large
tables (e.g., adding a NOT NULL column with a default, rewriting tables, non-concurrent
index builds), backfill safety, ordering and idempotency, expand/contract pattern for
zero-downtime changes, and destructive operations (DROP/TRUNCATE/irreversible UPDATE) with
no safeguard. Tested-in-staging evidence. A destructive migration with no safety net = P0.

### D6 — Transactions, concurrency & consistency
Isolation-level correctness for the operation (lost updates, phantom reads, write skew),
read-modify-write races, missing optimistic/pessimistic locking where needed, long
transactions holding locks, and transactional boundaries that span (or fail to span) the
operations that must be atomic. For distributed/eventually-consistent stores: where the app
incorrectly assumes strong consistency.

### D7 — Data integrity & validation in practice
Can bad data already exist? Reason about (and, with read-only access, spot-check for)
orphans, duplicates, nulls in should-be-required fields, out-of-range values, and broken
invariants. Dual-write inconsistencies (DB + cache/search/queue out of sync). Each
detectable integrity gap with its query.

### D8 — Security, privacy & data protection
Encryption at rest for sensitive data, column/field-level protection of PII/secrets,
tenant isolation enforced in the data layer (row-level security / scoping), least-privilege
DB roles (app not running as superuser), audit columns/trails for sensitive mutations, and
PII minimization. Map to the relevant regime (GDPR, HIPAA, PCI). Cross-reference the
security audit. Plaintext sensitive data = P0.

### D9 — Data lifecycle, retention & deletion
Soft-delete vs hard-delete strategy and its consistency, retention policy and enforcement,
GDPR right-to-erasure feasibility (can you actually delete a user everywhere?), archival,
PII propagation into logs/backups/analytics, and orphaned data after deletes.

### D10 — Pipelines, ETL/ELT & data quality
(If present) Idempotency and re-run safety of jobs, exactly-once vs duplicate-on-retry,
schema-drift handling between source and sink, late/out-of-order data, data-quality checks
(row counts, null rates, referential checks, freshness), dbt test coverage, and lineage/
documentation. Silent data-quality failures are P1.

### D11 — Backup, recovery & operational resilience
Backup existence, frequency, and **tested** restorability (untested backups don't count),
point-in-time recovery, replication and failover, RPO/RTO clarity, and the blast radius of
a bad deploy or migration. No evidence of a tested restore path = P1.

Each agent returns a **dimension grade (A–F)** + justification and a **top-3 "protect this"**.

---

## Phase 2 — Cross-pollination barrier

Synthesis agent merges, **dedupes**, and flags **compound findings** (e.g., no FK × no
app-side validation × no audit trail = silent corruption nobody can trace).

## Phase 3 — Adversarial verification

Every P0/P1 (and compound/uncertain P2) is attacked by skeptics: **The Refuter** (is the
constraint actually missing, or enforced elsewhere? is the integrity gap reachable?), **The
Context Defender** (is the denormalization/eventual-consistency deliberate and protected?
would the constraint break a legitimate workflow?), **The Impact Auditor** (re-derive the
data-loss/corruption path and re-score). Survives with ≥ 2/3 confirmations; severity =
median. Then a **completeness critic**: "which critical entity is under-checked? which
migration wasn't reviewed for locking? was restore actually verified?"

## Phase 4 — Benchmark

Compare the model and operational posture against well-understood patterns for this data
shape (e.g., proper money/temporal modeling, expand/contract migrations, RLS for
multi-tenancy). Transferable patterns, not "use a better schema."

---

## Phase 5 — Synthesis & deliverables

In `OUTPUT_LANG`:

1. **Executive summary** (≤ 1 page): integrity verdict, the single biggest data-loss/
   corruption risk, regulatory exposure if any, realistic ceiling after remediation.
2. **Scorecard:** grade per dimension (D1–D11) + finding counts; overall weighted grade
   (Integrity, Migration safety, Backup/recovery, Security count double).
3. **Entity-risk map:** the ER map annotated with integrity gaps and sensitive-data flags.
4. **Verified findings register:** standard schema, sorted by priority; skeptic note on P0/P1.
5. **Strengths / "do not touch" list.**
6. **Remediation roadmap:** Quick Wins (≤ 1 day, e.g., "add this constraint") → 30/60/90
   days, dependency-aware, referencing IDs. **Migrations are sequenced with their safety
   plan (expand/contract, backfill, rollback).**
7. **Re-audit criteria:** measurable exit conditions per P0/P1.
8. **GitHub issues (mandatory):** per the *Issue output* section below and
   [`ISSUE-OUTPUT-STANDARD.md`](../ISSUE-OUTPUT-STANDARD.md) — tracking issue first, then one
   issue per finding (German by default); preview-first, created only on explicit approval.

### Appendices
A: killed findings + refutations. B: coverage map (entity × agent). C: assumptions registry.
D: any integrity-check queries used (so the team can re-run them).

---

## Issue output — mandatory (see [`ISSUE-OUTPUT-STANDARD.md`](../ISSUE-OUTPUT-STANDARD.md))

After Phase 3 verification, turn confirmed findings into GitHub issues — **German by default**
(`OUTPUT_LANG`); preview/dry-run first, created only on explicit authorization + repo access.
Two-part contract:

1. **Tracking issue first** — `[AUDIT] Data — Befund-Tracker & Roadmap`. Body: a management
   summary (verdict, grade, biggest data-loss/corruption risk), the scorecard, a
   **priority-sorted checklist** (P0→P3, then effort/priority) where each line links its child
   issue, and the 30/60/90 roadmap (with migration safety plans). Labels: `audit`, `tracking`,
   `data`.
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
  "id": "D3-006",
  "agent": "constraints-integrity",
  "title": "orders.user_id has no FK — orphaned orders possible",
  "severity": "P1",
  "confidence": 0.9,
  "effort": "S",
  "entities": ["orders", "users"],
  "evidence": "migrations/0007_orders.sql:12 defines user_id integer with no REFERENCES users(id). Read-only check: 312 orders reference non-existent user ids.",
  "principle": "Referential integrity; the DB must reject invalid foreign references rather than trust app code",
  "harm_chain": "User deletion or bad write leaves orphan orders → broken joins, wrong reports, failed billing reconciliation",
  "fix": "Clean the 312 orphans, then add FK orders.user_id REFERENCES users(id) ON DELETE RESTRICT; add index. Expand/contract: backfill-validate, then constrain.",
  "expected_impact": "Eliminates orphan creation; makes the 312 existing defects visible and fixable",
  "anticipated_refutation": "'App always sets a valid user' — the 312 existing orphans prove it doesn't; integrity can't depend on app correctness alone."
}
```

---

## Definition of done (self-check before delivering)

- [ ] Every critical entity from Phase 0 was assigned and analyzed; none skipped silently.
- [ ] Integrity gaps were *actively reasoned* (and spot-checked where read-only access existed).
- [ ] Every migration in scope was reviewed for reversibility and locking/blocking risk.
- [ ] Backup/restore and PII handling were verified, not assumed.
- [ ] No real PII appears in the report; sensitive values are redacted with location cited.
- [ ] Coverage, assumptions, and integrity-query appendices are complete.
- [ ] The target data was never modified; all access was read-only and authorized.
```
