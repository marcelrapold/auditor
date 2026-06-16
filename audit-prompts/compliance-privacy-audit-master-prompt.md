# Compliance & Privacy Audit — Master Orchestration Prompt

> **Mission:** Subject the target's handling of personal and regulated data to a rigorous
> compliance and privacy audit at the standard of a top-tier DPO + privacy-engineering team.
> Deploy a swarm of specialist agents to find where the product collects, processes, stores,
> shares, or fails to protect data in ways that create legal, regulatory, or trust exposure.
> Every finding evidence-backed, mapped to a specific legal article/control, adversarially
> verified, severity-scored, and turned into a prioritized remediation roadmap.
>
> **Universality:** Regime- and stack-agnostic. Primary lens is **GDPR/DSGVO**, extended to
> ePrivacy, the **EU AI Act**, CCPA/CPRA, and sector rules (HIPAA, PCI-DSS) where applicable.
> Applies to web/mobile apps, APIs, data pipelines, and AI features. This is a
> **privacy-engineering audit, not legal advice** — it surfaces risks and cites the relevant
> articles so counsel can rule. Phase 0 decides which regimes apply; non-applicable mandates
> are logged "not applicable", never skipped silently.

---

## How to use this prompt

```
TARGET:        <repo path and/or running app + privacy policy URL>
JURISDICTIONS: <EU/DE | UK | US-CA | global | ...>  →  which regimes apply
DATA:          <what personal/sensitive data is processed? special categories? minors?>
ROLE:          <controller | processor | both> + named sub-processors if known
AI_IN_SCOPE:   <does it use automated decision-making / profiling / LLMs?>
OUTPUT_LANG:   <Deutsch | English (default) | ...>
```

If unknown, Phase 0 infers the data map from code/policy and states assumptions. **Never copy
real personal data into the report — cite location and redact.**

---

## Operating principles (binding for every agent)

1. **Evidence or it didn't happen.** Cite the concrete artifact: the field/table holding the
   data, the code `file:line` that collects/shares it, the policy clause, the cookie, the
   third-party request. No evidence → discarded.
2. **Cite the article/control.** Every finding names what it violates: GDPR Art. 5/6/7/9/13/
   15–22/25/28/30/32/33/35/44, ePrivacy/TTDSG cookie rules, EU AI Act risk tier, CCPA §, PCI/
   HIPAA control. "Feels non-compliant" is rejected.
3. **Follow the data.** The spine of the audit is a verified **data-flow / RoPA map**: every
   category of personal data, its purpose, legal basis, recipients, location, and retention.
4. **Severity is earned.** P0–P3; a P0 names a concrete legal/financial/individual harm
   (unlawful processing, breach exposure, special-category data unprotected, illegal transfer).
5. **Adversarial humility.** Every finding is attacked in Phase 3; pre-empt the refutation.
6. **Praise what is solid.** Each specialist returns its top 3 "protect this" items.
7. **Fix-forward.** Every confirmed finding ships a concrete remediation: a consent-flow
   change, a retention job, a DPA clause, a data-minimization edit, or a policy correction.

### Severity scale

| Level | Definition |
|---|---|
| **P0 — Critical** | Unlawful processing (no valid legal basis), special-category/minors' data unprotected, illegal third-country transfer, plaintext sensitive data, no breach-notification capability, or a tracker firing before consent. |
| **P1 — High** | Missing/broken data-subject rights (access/erasure/portability), non-compliant consent (pre-ticked, no reject-all, bundled), no RoPA/DPA where required, undisclosed processing, no retention enforcement, high-risk AI without a DPIA. |
| **P2 — Medium** | Policy–practice drift, weak data minimization, incomplete disclosures, missing privacy-by-default settings, vague purposes. |
| **P3 — Low** | Polish: policy wording, minor transparency gaps, documentation. |

Each finding gets **effort (S/M/L/XL)** and **priority = impact × confidence ÷ effort**.

---

## Phase 0 — Reconnaissance (run first, feeds every agent)

- **Data map / RoPA skeleton:** every category of personal data the system touches, where it
  enters, where it's stored, where it flows (internal + third parties), and where it lives
  (region). Mark **special categories** (Art. 9), **minors' data**, and **payment/health data**
  for double coverage.
- **Processing inventory:** each purpose, its claimed legal basis (Art. 6), and the
  controller/processor role for it.
- **Third parties:** every external recipient — analytics, ads, CDNs, AI providers,
  sub-processors — and whether a DPA + transfer mechanism exists.
- **Surfaces:** privacy policy, cookie banner, consent records, account/settings, data-export
  and deletion flows, marketing/email consent.
- **Applicable regimes:** confirm which of GDPR/ePrivacy/AI Act/CCPA/HIPAA/PCI apply.

Output: a structured brief distributed to all Phase 1 agents.

---

## Phase 1 — Specialist swarm (parallel agents)

### C1 — Lawful basis & purpose limitation (Art. 5, 6, 9)
Every processing purpose has a valid, documented legal basis; special-category data has an
Art. 9 condition; purposes are specific and not exceeded (no silent repurposing); no
"legitimate interest" used where consent is legally required. Processing with no identifiable
basis = P0.

### C2 — Consent & cookies (Art. 7, ePrivacy/TTDSG)
Consent is freely given, specific, informed, unambiguous, and as easy to withdraw as to give:
no pre-ticked boxes, **reject-all equal in prominence to accept-all**, no bundling, granular
purposes, and — critically — **no non-essential trackers/cookies fire before consent** (verify
network requests, not just the banner UI). Consent records stored. Cookie-wall legality.

### C3 — Transparency & notice (Art. 12–14)
Privacy policy completeness and accuracy vs actual practice (every category, purpose,
recipient, retention, transfer, and right disclosed), readability, layered notice, just-in-
time disclosures at collection points, and **policy–code drift** (the policy claims X; the
code does Y) — every drift is a finding with both citations.

### C4 — Data-subject rights (Art. 15–22)
Can a user actually exercise each right end-to-end: access/export (portability in a
machine-readable format), rectification, **erasure** (does deletion propagate to all stores,
backups, logs, third parties?), restriction, objection, and opt-out of automated decisions?
A right promised in policy but not implementable in code = P1.

### C5 — Data minimization & retention (Art. 5(1)(c),(e), 25)
Is only necessary data collected (over-collection, unused fields, excessive logging of PII)?
Retention periods defined per category and **actually enforced** (a deletion/anonymization
job that runs), not "kept forever by default". Privacy-by-default settings.

### C6 — International transfers (Art. 44–49)
Any personal data leaving the EEA (cloud regions, third-party processors, AI providers, CDNs)
has a valid transfer mechanism (adequacy, SCCs, supplementary measures). Trace where data
physically goes — provider default regions are a classic silent transfer. Unlawful transfer = P0.

### C7 — Processors, contracts & sub-processors (Art. 28)
Every processor has a DPA with the required Art. 28 clauses; sub-processors are authorized and
listed; controller/processor roles are correct per flow; and data sharing with third parties
is contractually and legally covered.

### C8 — Security of processing & breach readiness (Art. 32, 33, 34)
Appropriate technical/organizational measures for the risk (encryption at rest/in transit,
access control, pseudonymization), and a working **breach-notification capability** — can the
org detect, assess, and notify within 72h? Cross-reference the security & infrastructure
audits. Plaintext sensitive data or no breach process = P0/P1.

### C9 — Accountability & governance (Art. 5(2), 30, 35, 37)
RoPA (Art. 30 records) exists and matches reality, DPIAs for high-risk processing (Art. 35),
DPO appointed where required, privacy-by-design evidence, and audit trails for consent and
data access.

### C10 — Automated decisions, profiling & EU AI Act
Profiling/automated decision-making with legal/significant effect (Art. 22) has safeguards
(human review, explanation, contest). For AI features: EU AI Act **risk classification**
(prohibited/high/limited/minimal), transparency obligations (users told it's AI), and the
duties that attach to the tier. Cross-reference the AI/LLM audit. Training data lawfulness.

### C11 — Special contexts: minors, marketing, sensitive sectors
Age verification and parental consent where minors are involved (Art. 8), marketing/email
consent and easy unsubscribe, and sector overlays (HIPAA for health, PCI-DSS scope for card
data, financial rules) where the data demands it.

Each agent returns a **dimension grade (A–F)** + justification and a **top-3 "protect this"**.

---

## Phase 2 — Cross-pollination barrier

Synthesis agent merges, **dedupes**, and flags **compound findings** (e.g., trackers before
consent × undisclosed third party × US transfer = one chain of three violations on one event).

## Phase 3 — Adversarial verification

Every P0/P1 (and compound/uncertain P2) is attacked by skeptics: **The Refuter** (is the data
actually personal/special-category? is the basis really absent, or documented elsewhere?),
**The Context Defender** (is there a valid exemption or a documented legitimate interest? would
the fix break a lawful purpose?), **The Impact Auditor** (re-derive the legal/individual harm
and re-score against the cited article). Survives with ≥ 2/3 confirmations; severity = median.
Then a **completeness critic**: "which data category has no traced flow? which third-party
request wasn't checked for consent/transfer?"

## Phase 4 — Benchmark

Compare against current regulatory guidance (EDPB guidelines, DPA decisions, recognized
privacy-pattern libraries) and well-run comparable products. Cite concrete obligations, not
"be more compliant."

---

## Phase 5 — Synthesis & deliverables

In `OUTPUT_LANG` (default to the data subjects' language for user-facing fixes):

1. **Executive summary** (≤ 1 page): compliance verdict, the single biggest legal exposure,
   estimated risk (incl. fine-tier context: up to €20M / 4% turnover), ceiling after remediation.
2. **Scorecard:** grade per dimension (C1–C11) + finding counts; overall weighted grade
   (Lawful basis, Consent, Transfers, Security count double).
3. **Verified RoPA / data-flow map:** every personal-data category × purpose × basis ×
   recipient × location × retention, with gaps highlighted.
4. **Verified findings register:** standard schema, each mapped to its article; sorted by
   priority; skeptic note on P0/P1.
5. **Strengths / "do not touch" list.**
6. **Remediation roadmap:** Quick Wins (≤ 1 day, e.g., "block trackers pre-consent") →
   30/60/90 days, dependency-aware, referencing IDs. Mark **legal-review-required** items.
7. **Re-audit criteria:** measurable exit conditions per P0/P1.
8. **GitHub issues (mandatory):** per the *Issue output* section below and
   [`ISSUE-OUTPUT-STANDARD.md`](../ISSUE-OUTPUT-STANDARD.md) — tracking issue first, then one
   issue per finding (German by default); preview-first, created only on explicit approval.

### Appendices
A: killed findings + refutations. B: coverage map (data category × agent). C: assumptions &
which regimes were applied. D: article-to-finding index.

> ⚠️ This audit identifies risks and cites the relevant law; it is **not legal advice**. Route
> P0/P1 findings to qualified counsel/DPO before acting.

---

## Issue output — mandatory (see [`ISSUE-OUTPUT-STANDARD.md`](../ISSUE-OUTPUT-STANDARD.md))

After Phase 3 verification, turn confirmed findings into GitHub issues — **German by default**
(`OUTPUT_LANG`); preview/dry-run first, created only on explicit authorization + repo access.
Two-part contract:

1. **Tracking issue first** — `[AUDIT] Compliance/Privacy — Befund-Tracker & Roadmap`. Body: a
   management summary (verdict, grade, biggest legal exposure), the scorecard, a
   **priority-sorted checklist** (P0→P3, then effort/priority) where each line links its child
   issue, and the 30/60/90 roadmap (legal-review-required marked). Labels: `audit`, `tracking`,
   `compliance`.
2. **One issue per confirmed finding** — top-notch, German, each opening with its own
   **management summary** (2–3 sentences: what, impact, one-line recommendation), then the full
   finding (severity + score, article mapping, location, evidence, impact, concrete before/after
   fix, effort, re-audit criterion). Labels: `audit`, `sev:p0…p3`, `domain:<x>`, `effort:S|M|L`;
   back-link to the tracking issue.

Create child issues first, collect their numbers, then create/update the tracking issue so its
checklist links resolve. Detect existing audit issues by label and update rather than duplicate.
Never include real personal data — cite location and redact.

---

## Shared finding schema (all agents)

```json
{
  "id": "C2-001",
  "agent": "consent-cookies",
  "title": "Google Analytics & Meta Pixel fire before consent",
  "severity": "P0",
  "confidence": 0.95,
  "effort": "S",
  "data_categories": ["online identifiers", "behavioral data"],
  "evidence": "Network trace on first load (no interaction): GET to google-analytics.com/g/collect and facebook.com/tr fire from app/layout.tsx:18 before the CMP records consent.",
  "article": "ePrivacy/TTDSG §25; GDPR Art. 6(1)(a) — consent required prior to non-essential tracking",
  "harm_chain": "Unlawful tracking of every visitor → DPA complaint risk, fines, and invalidation of all collected analytics consent",
  "fix": "Gate all non-essential tags behind the CMP; load tracking only after opt-in (Consent Mode v2 / conditional script injection). Make reject-all a one-click equal to accept.",
  "expected_impact": "Stops pre-consent tracking on 100% of sessions; restores lawful basis",
  "anticipated_refutation": "'The banner appears' — a banner that shows while tags already fired is non-compliant; the network trace proves pre-consent execution."
}
```

---

## Definition of done (self-check before delivering)

- [ ] Every personal-data category from Phase 0 has a traced flow; none skipped silently.
- [ ] Consent/tracking was verified by **network trace**, not banner UI alone.
- [ ] Erasure and access rights were checked end-to-end in code, not assumed from policy.
- [ ] Every third-party recipient was checked for a DPA and a transfer mechanism.
- [ ] Policy–practice drift was actively tested with both locations cited.
- [ ] No real personal data appears in the report; locations cited and redacted.
- [ ] Findings are mapped to specific articles; P0/P1 flagged for legal review.
- [ ] The target was left unmodified; all access read-only and authorized.
```
