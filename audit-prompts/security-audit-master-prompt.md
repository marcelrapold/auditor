# Security Audit — Master Orchestration Prompt

> **Mission:** Subject the target — repository, app, website, API, or infrastructure — to the most
> rigorous, multi-perspective security review achievable. Deploy a swarm of specialist agents,
> each a world-class security domain expert, that challenge their own findings adversarially,
> hunt blind spots, and map every issue to recognized standards. Output: a German (or English)
> GitHub issue backlog led by a priority-sorted tracker, every finding evidence-backed and
> exploitability-rated.
>
> **Universality:** Stack- and target-agnostic. Applies to source repos, web/mobile apps, APIs,
> datastores, IaC, CI/CD, and cloud accounts. Maps to OWASP Top 10 / API / ASVS / LLM, CWE Top 25,
> MITRE ATT&CK, CIS Benchmarks, NIST, and GDPR. Phase 0 decides which of the 14 domains apply;
> non-applicable domains are logged "not applicable", never skipped silently.

---

## How to use this prompt

```
TARGET:        <repo path and/or URL — repo, app, API, IaC, cloud>
SCOPE:         <in-scope / out-of-scope>
STACK:         <languages, frameworks, cloud — or let Phase 0 infer>
AUTHORIZATION: <owner authorization on file? active testing allowed?>
DATA_ACCESS:   <static/read-only | authorized active testing (DAST, probes)>
OUTPUT_LANG:   <Deutsch (default) | English | ...>
ISSUE_TARGET:  <owner/repo for issues — preview-first, on approval>
```

> [!WARNING]
> **Authorization gate (binding):** Active/dynamic testing (DAST, exploitation, network scans
> against live systems) requires **documented authorization from the owner**. Without it, perform
> **static, read-only** analysis only. No destructive techniques, no DoS, no exfiltration. When in
> doubt, stay static and flag the limitation in the report.

---

## Operating principles (binding for every agent)

1. **Evidence or it didn't happen.** Every finding cites a concrete artifact: `file:line`, a
   request/response, a config value, a redacted secret location. No evidence → discarded.
2. **Cite the standard.** Each finding names what it violates: OWASP (Top 10 / API / ASVS / LLM),
   CWE, MITRE ATT&CK technique, CIS control, NIST, or a GDPR article.
3. **Severity is earned.** Use the P0–P3 scale below plus a CVSS v3.1 estimate; a P0 names the
   concrete exploitation/data-loss/exposure path.
4. **Adversarial humility.** Every P0/P1 is attacked by independent skeptics in Phase 3. Write
   findings that survive: include the refutation you anticipated and why it fails.
5. **Hunt blind spots.** A completeness critic asks each round which surface, use-case, or trust
   boundary was not examined. Unchecked areas are declared, never hidden.
6. **No secrets in output.** Never copy real secrets or PII into the report — cite the location and
   redact the value.
7. **Fix-forward.** Every confirmed finding ships a concrete remediation: a code/config diff, a
   control, or a hardening step — not just a diagnosis.

### Severity scale

| Level | Definition |
|---|---|
| **P0 — Critical** | Active exposure: leaked secret, exploitable injection, auth bypass, vulnerable dependency on a reachable path, public sensitive data, unauthenticated mutating endpoint. Fix immediately. |
| **P1 — High** | Materially raises breach/incident probability: missing authorization on a sensitive path, no idempotency on money endpoints, weak crypto, over-broad IAM, EOL runtime. |
| **P2 — Medium** | Hardening/consistency debt with real exposure: weak headers/CORS, secrets in env vs a manager, missing rate limits, verbose errors. |
| **P3 — Low** | Polish and defense-in-depth: minor header tuning, documentation, low-risk hygiene. |

Each finding gets **effort (S/M/L)**, a **CVSS v3.1** estimate, and an **exploitability** rating
(confirmed-exploitable / theoretical / context-dependent).

---

## Phase 0 — Reconnaissance & attack-surface mapping (run first)

Build a factual inventory before any judgment: languages, frameworks, entry points (routes, APIs,
jobs, webhooks, CLI), data stores, external services, auth mechanisms, **trust boundaries**, build/
CI pipelines, IaC, containers, and secrets handling. Produce an **attack-surface map** (entry
points as nodes, trust boundaries as edges) and the **critical use-cases** to test (e.g. "guest
checks out", "admin refunds", "payment webhook", "password reset"). Run a lightweight **STRIDE**
pass per use-case and trust boundary to seed the specialists. Output a fact sheet for all agents.

---

## Phase 1 — Parallel specialist swarm (the 14 domains)

Spawn at least one agent per applicable domain, all in parallel. Each receives the attack-surface
map, its STRIDE hypotheses, and its charter, and returns findings in the shared schema.

- **D01 Injection & input validation** — SQL/NoSQL/OS/LDAP/template/XXE/SSRF, path traversal,
  deserialization, mass assignment.
- **D02 Authentication** — session management, password/MFA flows, token lifecycle, JWT
  validation, OAuth/OIDC misconfig, account recovery.
- **D03 Authorization** — IDOR/BOLA, missing function/object-level checks, RBAC/ABAC gaps,
  privilege escalation, tenant isolation.
- **D04 Secrets & cryptography** — hardcoded secrets, weak/home-grown crypto, key management, TLS
  config, randomness, password hashing.
- **D05 Supply chain & dependencies** — known CVEs (SCA), abandoned packages, typosquatting,
  lockfile integrity, SBOM, transitive risk.
- **D06 Configuration & hardening** — security headers, CORS, cookie flags, CSP, default
  credentials, debug/verbose errors, exposed endpoints.
- **D07 Infrastructure & IaC** — Docker/K8s/Terraform/cloud misconfig, over-broad IAM, public
  buckets, missing encryption at rest, network segmentation.
- **D08 CI/CD & build** — pipeline injection, secrets in CI, artifact integrity, branch
  protection, GitHub-Actions risks (`pull_request_target`).
- **D09 API security** — REST/GraphQL/gRPC: rate limiting, introspection, over-fetching, batching
  abuse, missing pagination limits.
- **D10 Business logic** — race conditions, TOCTOU, workflow bypass, price/quantity manipulation,
  idempotency, replay.
- **D11 Client / frontend** — DOM XSS, insecure storage, postMessage, clickjacking, dependency
  confusion, source maps.
- **D12 Privacy & GDPR** — PII data flows, secrets/PII in logs, retention, third-country transfer,
  consent, right to erasure.
- **D13 Logging, monitoring & IR** — missing audit trails, tamperable logs, alerting gaps,
  attack detectability.
- **D14 AI / LLM (if present)** — prompt injection, context leakage, tool/agent abuse, output
  handling; OWASP LLM Top 10.

Scale by depth: for `exhaustive`, run multiple agents per domain from different attacker lenses
(anonymous user, normal user, compromised neighboring tenant).

Each agent returns a **domain grade (A–F)** + justification and a **top-3 "protect this"** list.

---

## Phase 2 — Cross-pollination barrier

A synthesis agent merges the pool, **dedupes** overlapping findings (same root cause across domains
→ merge, keep strongest evidence), and flags **compound findings** (e.g. no pagination limit × no
rate limit = trivial DoS; indirect injection × a tool that can email × no output validation = an
exfiltration chain).

## Phase 3 — Adversarial verification

Every P0/P1 (and compound/uncertain P2) is attacked by independent skeptics with distinct lenses:
**The Refuter** (is the evidence real and the exploit reachable, or blocked by a control
elsewhere?), **The Context Defender** (is this an accepted, compensated trade-off? would the fix
break a legitimate workflow?), **The Impact Auditor** (re-derive the exploitation/data-loss path
and re-score CVSS). Survives with ≥ 2/3 confirmations; severity = median. Killed findings go to an
appendix with the refutation. Then a **completeness critic**: "which trust boundary, use-case, or
domain is under-covered?" — credible gaps go back through a quick round.

## Phase 4 — Benchmark & exploitability triage

Compare posture against the relevant standards (OWASP ASVS as a verification grid, CIS for infra)
and re-confirm CVSS + exploitability per surviving finding. Output the migration/control reference
for each, not just "be more secure".

---

## Phase 5 — Synthesis & deliverables

In `OUTPUT_LANG` (default Deutsch):

1. **Executive summary** (≤ 1 page): security verdict, the single biggest exposure, exploitability
   honest-assessment, realistic ceiling after remediation.
2. **Scorecard:** grade per domain (D01–D14) + finding counts; overall weighted grade (AuthZ,
   Secrets, Supply chain, IaC count double). Note OWASP Top 10 coverage.
3. **Attack-surface map** annotated with the confirmed exposures and trust-boundary gaps.
4. **Verified findings register:** shared schema, sorted by severity then effort; skeptic note on
   P0/P1.
5. **Strengths / "do not touch" list.**
6. **Remediation roadmap:** Immediate (≤ 7 days, P0) → 30 / 60 / 90 days, dependency-aware,
   referencing finding IDs.
7. **Re-audit criteria:** measurable exit conditions per P0/P1.
8. **Coverage & limitations:** what was static vs actively tested, what was skipped and why.

### Appendices
A: killed findings + refutations. B: coverage map (domain × use-case × status, incl. blind spots).
C: assumptions registry.

---

## Issue output — mandatory (see [`ISSUE-OUTPUT-STANDARD.md`](../ISSUE-OUTPUT-STANDARD.md))

After Phase 3 verification, turn confirmed findings into GitHub issues — **German by default**
(`OUTPUT_LANG`); preview/dry-run first, created only on explicit authorization + repo access.
Two-part contract:

1. **Tracking issue first** — `[AUDIT] Security — Befund-Tracker & Roadmap`. Body: a management
   summary (verdict, grade, biggest exposure), the scorecard, a **priority-sorted checklist**
   (P0→P3, then effort) where each line links its child issue, and the Immediate/30/60/90 roadmap.
   Labels: `audit`, `tracking`, `security`.
2. **One issue per confirmed finding** — top-notch, German, each opening with its own **management
   summary** (2–3 sentences: what, impact, one-line recommendation), then the full finding
   (severity + CVSS, OWASP/CWE/MITRE mapping, location, evidence (redacted), impact, concrete
   before/after fix, effort, re-audit criterion). Labels: `audit`, `sev:p0…p3`, `domain:D0x`,
   `effort:S|M|L`; back-link to the tracking issue.

Create child issues first, collect their numbers, then create/update the tracking issue so its
checklist links resolve. Detect existing audit issues by label and update rather than duplicate.
Never include real secrets or PII — cite location and redact.

---

## Shared finding schema (all agents)

```json
{
  "id": "SEC-001",
  "agent": "authorization",
  "title": "IDOR on GET /api/orders/{id} — any user reads any order",
  "severity": "P0",
  "confidence": 0.95,
  "effort": "M",
  "cvss": "8.1 (AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N)",
  "standard": "OWASP A01:2021 / API1:2023 BOLA; CWE-639; MITRE T1190",
  "evidence": "handlers/orders.ts:42 runs db.orders.find({ id: req.params.id }) with no owner check; repro: user A retrieves user B's order by id.",
  "impact": "Horizontal privilege escalation; full read of every customer's orders.",
  "exploitability": "confirmed",
  "fix": "Scope the query to the caller: find({ id, ownerId: req.user.id }); return 404 on miss. ~5 LOC.",
  "expected_impact": "Closes cross-tenant order access on this endpoint.",
  "anticipated_refutation": "'Requires auth' — an authenticated user is exactly the attacker here; auth ≠ authorization."
}
```

---

## Definition of done (self-check before delivering)

- [ ] Every applicable domain (D01–D14) was assigned and graded; none skipped silently.
- [ ] Every register finding has artifact evidence and survived (or was downgraded by) Phase 3.
- [ ] Secret scan, authorization on every mutating/sensitive path, and supply-chain CVEs were
      actively checked.
- [ ] Severity + CVSS + exploitability applied per finding; no unevidenced P0s.
- [ ] No real secrets or PII appear in the report; locations cited and redacted.
- [ ] Issues follow `ISSUE-OUTPUT-STANDARD.md` (tracking issue first, then one issue per finding).
- [ ] Coverage & limitations honestly lists static vs active and anything skipped.
- [ ] The target was left unmodified; any active testing was authorized and isolated.
