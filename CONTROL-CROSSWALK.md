# Control crosswalk (certification readiness)

The single mapping from the technical findings the 13 audits produce to the control IDs of the
certification and regulatory frameworks that organisations are actually assessed against. Every
audit's `controls` field is filled from this file; the orchestrator's **readiness mode** turns the
filled fields into a control-by-control gap matrix.

> [!NOTE]
> **Management summary.** An audit finding says *what is technically wrong*. A buyer, an auditor,
> or a procurement team asks *which control does that break, and are we audit-ready?* This file
> answers the second question for the six frameworks with the highest market demand — **SOC 2**,
> **ISO/IEC 27001:2022**, **ISO/IEC 42001:2023 + EU AI Act**, **NIS2**, **CRA**, and the Swiss
> **revDSG** (with GDPR articles alongside). It maps by *control theme*, not framework-by-framework,
> so one finding resolves to every framework at once and the audits never need to know which
> certification the user is chasing.

> [!WARNING]
> **Readiness, not certification.** Nothing in this library certifies anything. ISO certificates
> are issued by accredited certification bodies; SOC 2 reports by licensed CPA firms. What the
> audits deliver is a gap assessment of the **technically assessable** controls plus the evidence
> an external auditor will ask for. Roughly half of every framework is organisational (policies,
> HR, physical security, management review) and cannot be derived from a repository — those
> controls are listed in [Requires organisational evidence](#requires-organisational-evidence) and
> must be reported as such, never as "not found".

Version 1.0.0 · Framework editions and review cadence: [`FRAMEWORK-VERSIONS.md`](FRAMEWORK-VERSIONS.md)

---

## Contents

- [ID conventions](#id-conventions)
- [How the audits use this file](#how-the-audits-use-this-file)
- [Readiness targets](#readiness-targets)
- [The crosswalk](#the-crosswalk)
- [Requires organisational evidence](#requires-organisational-evidence)
- [Fine-exposure vocabulary](#fine-exposure-vocabulary)
- [Readiness scoring](#readiness-scoring)
- [Copyright note](#copyright-note)

---

## ID conventions

Control IDs are short, stable strings — one framework prefix, a colon, the framework's own
numbering. Cite IDs and titles only; never reproduce the framework's control text.

| Prefix | Framework | Example | Numbering follows |
|---|---|---|---|
| `ISO27001:` | ISO/IEC 27001:2022, Annex A | `ISO27001:A.8.3` | Annex A control number (themes 5 organisational, 6 people, 7 physical, 8 technological) |
| `SOC2:` | AICPA Trust Services Criteria (2017, 2022 points of focus) | `SOC2:CC6.1`, `SOC2:A1.2`, `SOC2:P4.1` | Common Criteria CC1–CC9; Availability A1; Confidentiality C1; Processing Integrity PI1; Privacy P1–P8 |
| `ISO42001:` | ISO/IEC 42001:2023, Annex A | `ISO42001:A.6.2.6` | Annex A control number (A.2–A.10) |
| `AIAct:` | EU AI Act, Regulation (EU) 2024/1689 | `AIAct:Art.13` | Article |
| `NIS2:` | NIS2 Directive (EU) 2022/2555 | `NIS2:Art.21(2)(e)`, `NIS2:Art.23` | Article and, for Art. 21(2), the measure letter (a)–(j) |
| `CRA:` | Cyber Resilience Act, Regulation (EU) 2024/2847 | `CRA:AnnexI.I(2)(a)`, `CRA:AnnexI.II(1)`, `CRA:Art.14` | Annex I Part I (product requirements) and Part II (vulnerability handling); articles |
| `revDSG:` | Swiss Federal Act on Data Protection (SR 235.1, in force 1 Sept 2023) | `revDSG:Art.8` | Article |
| `VDSG:` | Swiss Data Protection Ordinance (SR 235.11) | `VDSG:Art.3` | Article |
| `GDPR:` | Regulation (EU) 2016/679 | `GDPR:Art.32(1)(a)` | Article, paragraph, point |

A finding's `controls` array lists every applicable ID across frameworks, most specific first:

```json
"controls": ["ISO27001:A.8.3", "SOC2:CC6.1", "NIS2:Art.21(2)(i)", "CRA:AnnexI.I(2)(d)", "revDSG:Art.8"]
```

---

## How the audits use this file

1. **Every specialist audit** fills `controls` on each confirmed finding by locating the finding's
   theme in [the crosswalk](#the-crosswalk) and copying the IDs of that row. A finding that spans
   two themes lists both rows. A finding with no matching theme (for example a pure copywriting
   defect) sets `"controls": []` — an empty array is a valid, honest answer.
2. **Every specialist audit** sets `deal_blocker` (boolean) — `true` when the finding, as it stands,
   would fail a SOC 2 / ISO 27001 audit, block enterprise procurement, or breach a statutory
   duty; and `fine_exposure` from the [vocabulary below](#fine-exposure-vocabulary) (`"none"` when
   no regime attaches a fine).
3. **The orchestrator** (`full-audit-master-prompt.md`), when `READINESS_TARGET` is set, inverts
   the mapping: for each control of the target framework it collects the findings that cite it and
   derives a status. See [Readiness scoring](#readiness-scoring).
4. **The issue output** carries the IDs as labels (`control:ISO27001-A.8.3`) and the `deal-blocker`
   label, per [`ISSUE-OUTPUT-STANDARD.md`](ISSUE-OUTPUT-STANDARD.md).

---

## Readiness targets

The four readiness targets the orchestrator offers, the audits each one runs, and the framework
columns it reads from the crosswalk. Together they cover the large majority of certification and
regulatory demand a software organisation meets.

| Target key | Frameworks assessed | Audits run | Primary deliverable |
|---|---|---|---|
| `soc2` | SOC 2 Trust Services Criteria (Security always; Availability, Confidentiality, Processing Integrity, Privacy when in scope) | `security`, `infrastructure`, `repo`, `data`, `performance`, `lean`; `compliance-privacy` when the Privacy category is in scope | Control gap matrix (CC1–CC9 + selected categories), evidence register, readiness score |
| `iso27001` | ISO/IEC 27001:2022 Annex A | `security`, `infrastructure`, `repo`, `data`, `lean`, `documentation`, `compliance-privacy` | Gap matrix (Annex A), **Statement of Applicability draft**, risk register seed (ISO 27005 shape), readiness score |
| `iso42001-ai-act` | ISO/IEC 42001:2023 Annex A + EU AI Act obligations (by risk tier) | `ai-llm`, `compliance-privacy`, `security`, `data`, `documentation` | Gap matrix (Annex A + AI Act articles), AI-system inventory with risk tier, impact-assessment skeleton (ISO 42005 shape), readiness score |
| `nis2-cra` | NIS2 Art. 21(2) measures + Art. 23 reporting; CRA Annex I Parts I and II + Art. 14 reporting | `security`, `infrastructure`, `lean`, `repo`, `data` | Gap matrix (10 NIS2 measures; CRA product + vulnerability-handling requirements), SBOM/disclosure readiness, reporting-capability check |

`revDSG` and GDPR are not separate targets: the `compliance-privacy` audit always maps to them,
and the `iso27001` and `soc2` targets include that audit so privacy controls appear in the matrix.

---

## The crosswalk

One row per control theme. **Audits** names the specialist prompts that produce findings for the
theme (the first is the primary owner). A dash means the framework has no control for that theme.
Frameworks are cited by ID; consult the framework text for the control wording.

### Access, identity and secrets

| # | Theme | Audits | ISO 27001 | SOC 2 | ISO 42001 | NIS2 Art. 21(2) | CRA Annex I | revDSG / GDPR |
|---|---|---|---|---|---|---|---|---|
| T01 | Authorization and object-level access control (RBAC/ABAC, tenant isolation, IDOR) | security, api, data | A.5.15, A.5.18, A.8.3 | CC6.1, CC6.3 | – | (i) | I(2)(d) | revDSG Art. 8; VDSG Art. 3; GDPR Art. 32 |
| T02 | Identity, authentication and MFA (password policy, session, passkeys, brute-force) | security, api | A.5.16, A.5.17, A.8.5 | CC6.1, CC6.2 | – | (j) | I(2)(d) | revDSG Art. 8; GDPR Art. 32 |
| T03 | Privileged access and admin paths | security, infrastructure | A.8.2, A.8.18 | CC6.1, CC6.3 | – | (i) | I(2)(d) | – |
| T04 | Secrets and credential management (hard-coded keys, env vs manager, rotation) | security, infrastructure, repo | A.5.17, A.8.24 | CC6.1, CC6.7 | – | (h) | I(2)(e) | revDSG Art. 8 |
| T05 | Cryptography in transit and at rest (TLS config, algorithms, key management) | security, infrastructure, data | A.8.24, A.5.14 | CC6.1, CC6.7 | – | (h) | I(2)(e) | revDSG Art. 8; GDPR Art. 32(1)(a) |

### Vulnerabilities, supply chain and delivery

| # | Theme | Audits | ISO 27001 | SOC 2 | ISO 42001 | NIS2 Art. 21(2) | CRA Annex I | revDSG / GDPR |
|---|---|---|---|---|---|---|---|---|
| T06 | Vulnerability and patch management (known CVEs on a reachable path, EOL runtimes) | security, lean, infrastructure | A.8.8 | CC7.1 | – | (e) | I(2)(a); II(1), II(2) | – |
| T07 | Software supply chain, dependencies and SBOM (provenance, pinning, lockfiles, signing) | security, lean, repo | A.5.21, A.8.19 | CC9.2, CC7.1 | – | (d) | II(1), II(7) | – |
| T08 | Secure development life cycle, code review and security testing | repo, security | A.8.25, A.8.26, A.8.27, A.8.28, A.8.29 | CC8.1 | A.6.2.4 | (e) | I(1); II(3) | GDPR Art. 25 |
| T09 | Change management and CI/CD integrity (gates that block, branch protection, pipeline credentials) | repo, infrastructure | A.8.32, A.8.31 | CC8.1 | – | (e) | II(7) | – |
| T10 | Configuration hardening and secure defaults (headers, CORS, debug modes, reset) | infrastructure, security | A.8.9 | CC6.1, CC7.1 | – | (a) | I(2)(b), I(2)(j) | revDSG Art. 7 |
| T11 | Vulnerability disclosure policy and security contact (`SECURITY.md`, `security.txt`, advisories) | repo, security | A.5.24, A.6.8 | CC2.3 | A.8.3 | (e) | II(4), II(5), II(6) | – |

### Operations, monitoring and continuity

| # | Theme | Audits | ISO 27001 | SOC 2 | ISO 42001 | NIS2 Art. 21(2) | CRA Annex I | revDSG / GDPR |
|---|---|---|---|---|---|---|---|---|
| T12 | Logging, monitoring and alerting (audit trails, correlation IDs, no secrets/PII in logs, clock sync) | infrastructure, security, performance | A.8.15, A.8.16, A.8.17 | CC7.2, CC7.3 | A.6.2.8 | (b) | I(2)(l) | VDSG Art. 4 |
| T13 | Incident response and regulatory reporting (detect, assess, notify within statutory windows) | infrastructure, security, compliance-privacy | A.5.24, A.5.25, A.5.26, A.5.27, A.5.28, A.6.8 | CC7.4, CC7.5 | A.8.4 | (b); Art. 23 | Art. 14; II(4), II(6) | revDSG Art. 24; GDPR Art. 33, 34 |
| T14 | Backup, recovery and business continuity (tested restore, RTO/RPO, redundancy) | infrastructure, data | A.8.13, A.8.14, A.5.29, A.5.30 | A1.2, A1.3, CC9.1 | – | (c) | I(2)(h) | GDPR Art. 32(1)(c) |
| T15 | Availability, capacity and resilience (timeouts, retries, rate limits, load behaviour) | infrastructure, performance, api | A.8.6, A.8.14 | A1.1 | – | (c) | I(2)(h), I(2)(i) | – |
| T16 | Network security and segmentation (public exposure, security groups, egress) | infrastructure, security | A.8.20, A.8.21, A.8.22 | CC6.6 | – | (a) | I(2)(j) | – |
| T17 | Malware and endpoint protection | infrastructure | A.8.7, A.8.1 | CC6.8 | – | (g) | – | – |

### Data governance and privacy

| # | Theme | Audits | ISO 27001 | SOC 2 | ISO 42001 | NIS2 Art. 21(2) | CRA Annex I | revDSG / GDPR |
|---|---|---|---|---|---|---|---|---|
| T18 | Asset and data inventory, classification (what data exists, where, how sensitive) | repo, data, compliance-privacy | A.5.9, A.5.12, A.5.13 | CC6.1, C1.1 | A.4.3 | (i) | – | revDSG Art. 12; GDPR Art. 30 |
| T19 | Data minimisation, retention and deletion (over-collection, enforced retention, deletion that propagates) | data, compliance-privacy | A.8.10, A.5.33 | C1.2, P4.1, P4.2, P4.3 | A.7.2 | – | I(2)(g), I(2)(m) | revDSG Art. 6(4), Art. 7; GDPR Art. 5(1)(c), 5(1)(e), 17 |
| T20 | Data masking, pseudonymisation and leakage prevention | data, security | A.8.11, A.8.12 | C1.1, CC6.7 | – | – | I(2)(e) | revDSG Art. 8; GDPR Art. 32(1)(a) |
| T21 | Test data and environment separation | data, repo | A.8.33, A.8.31 | CC8.1 | – | (e) | – | GDPR Art. 25 |
| T22 | Supplier, cloud and sub-processor management (DPAs, sub-processor list, cloud shared responsibility) | infrastructure, compliance-privacy | A.5.19, A.5.20, A.5.21, A.5.22, A.5.23 | CC9.2 | A.10.3 | (d) | – | revDSG Art. 9; GDPR Art. 28 |
| T23 | Privacy programme: lawful basis, transparency, data-subject rights, consent | compliance-privacy | A.5.31, A.5.34 | P1.1, P2.1, P3.1, P3.2, P5.1, P5.2, P8.1 | – | – | – | revDSG Art. 6, 19, 20, 21, 25, 28, 32; GDPR Art. 5, 6, 7, 12–22 |
| T24 | Cross-border transfers and data location | compliance-privacy, infrastructure | A.5.14, A.5.31 | P6.1 | – | – | – | revDSG Art. 16, 17; GDPR Art. 44–49 |
| T25 | Risk assessment and DPIA (documented risk treatment for high-risk processing) | compliance-privacy, ai-llm, security | A.5.8 (plus ISMS clause 6.1.2) | CC3.1, CC3.2, CC3.3, CC3.4 | A.5.2, A.5.3 | (a), (f) | I(1) | revDSG Art. 22; GDPR Art. 35 |
| T26 | Documented operating procedures and technical documentation | documentation, repo | A.5.37 | CC2.1 | A.6.2.7, A.8.2 | – | Annex VII | GDPR Art. 5(2) |

### AI systems

| # | Theme | Audits | ISO 27001 | SOC 2 | ISO 42001 | NIS2 Art. 21(2) | CRA Annex I | revDSG / GDPR / AI Act |
|---|---|---|---|---|---|---|---|---|
| T27 | AI policy, roles and responsibilities | ai-llm | A.5.2 | CC1.3 | A.2.2, A.2.3, A.3.2 | – | – | AIAct Art. 4 |
| T28 | AI system inventory, risk classification and impact assessment | ai-llm, compliance-privacy | – | CC3.2 | A.5.2, A.5.3, A.5.4, A.5.5 | – | – | AIAct Art. 6, 27; revDSG Art. 22 |
| T29 | AI life cycle: requirements, verification and validation, deployment, monitoring (evals, guardrails, regression) | ai-llm | A.8.25, A.8.29 | CC8.1, PI1.1 | A.6.1.2, A.6.1.3, A.6.2.2, A.6.2.4, A.6.2.5, A.6.2.6 | – | – | AIAct Art. 9, 15, 72 |
| T30 | AI data governance: quality, provenance, preparation, training-data lawfulness | ai-llm, data | A.5.9 | PI1.2 | A.7.2, A.7.3, A.7.4, A.7.5, A.7.6 | – | – | AIAct Art. 10 |
| T31 | AI transparency and user information (disclosure that it is AI, limitations, automated decisions) | ai-llm, content, compliance-privacy | – | P1.1 | A.8.2, A.8.5, A.9.2, A.9.4 | – | – | AIAct Art. 13, 50; revDSG Art. 21; GDPR Art. 22 |
| T32 | AI event logging and human oversight | ai-llm | A.8.15 | CC7.2 | A.6.2.8 | – | – | AIAct Art. 12, 14 |
| T33 | Prompt injection, output handling and tool/agent safety (treat model output as untrusted) | ai-llm, security | A.8.26, A.8.28 | CC6.1, CC7.1 | A.6.2.4, A.6.2.6 | (e) | I(2)(d), I(2)(f) | AIAct Art. 15 |
| T34 | Third-party AI models, providers and customers (allocation of responsibilities, provider terms, data retention) | ai-llm, compliance-privacy | A.5.19, A.5.21 | CC9.2 | A.10.2, A.10.3, A.10.4 | (d) | – | AIAct Art. 25; revDSG Art. 9; GDPR Art. 28 |

---

## Requires organisational evidence

These controls are part of every certification but **cannot be assessed from a repository or a
running system**. The orchestrator lists them in a separate "Requires organisational evidence"
section of the gap matrix with status `not-assessable`, and they are **excluded from the readiness
denominator**. Reporting them as "missing" would be an audit failure.

| Framework | Not assessable from code |
|---|---|
| ISO 27001 Annex A | A.5.1, A.5.2, A.5.3, A.5.4, A.5.5, A.5.6, A.5.7, A.5.10, A.5.11, A.5.35, A.5.36 (organisational governance); A.6.1–A.6.7 (people; A.6.8 is partly assessable via the reporting path); A.7.1–A.7.14 (physical) |
| SOC 2 TSC | CC1.1–CC1.5 (control environment); CC2.2 (internal communication); CC4.1, CC4.2 (monitoring of controls); CC5.1–CC5.3 (control activities design); CC6.4, CC6.5 (physical access and disposal) |
| ISO 42001 Annex A | A.2.4 (policy review), A.3.3 (reporting of concerns), A.4.2, A.4.4, A.4.5, A.4.6 (resource documentation, tooling, computing, human resources), A.9.3 (objectives for responsible use) |
| NIS2 Art. 21(2) | (f) effectiveness assessment of the measures; (g) cyber hygiene and training; management-body accountability and training (Art. 20) |
| CRA | Conformity assessment and CE marking (Art. 24–32); support-period declaration and the manufacturer obligations of Art. 13 that are contractual rather than technical; EU declaration of conformity (Annex V) |
| revDSG / GDPR | Appointment of a data protection advisor / DPO (revDSG Art. 10; GDPR Art. 37); staff training; the contractual clauses of DPAs (the audit verifies existence and coverage, not legal sufficiency) |

---

## Fine-exposure vocabulary

The `fine_exposure` field uses one of these strings so exposure can be aggregated in the tracking
issue. Use the highest tier that applies; use `"none"` when no regime attaches a monetary penalty
to the finding. Amounts are the statutory maxima; whichever of the fixed sum or the turnover
percentage is higher applies.

| Value | Regime and basis |
|---|---|
| `"none"` | No statutory fine attaches (a defect, a best-practice gap, a contractual risk only) |
| `"GDPR Art. 83(4): up to EUR 10M / 2 % of global annual turnover"` | Controller/processor duties, Art. 25–39 among others |
| `"GDPR Art. 83(5): up to EUR 20M / 4 % of global annual turnover"` | Principles, lawful basis, data-subject rights, transfers |
| `"revDSG Art. 60–63: up to CHF 250 000 against the responsible natural person"` | Swiss law fines individuals, not primarily the company — a personal-liability argument for management |
| `"NIS2 Art. 34: essential entities up to EUR 10M / 2 %; important entities up to EUR 7M / 1.4 %"` | Failure to implement Art. 21 measures or to report under Art. 23 |
| `"CRA Art. 64: up to EUR 15M / 2.5 % of global annual turnover"` | Non-compliance with the essential requirements of Annex I or the reporting duties of Art. 14 |
| `"AI Act Art. 99: up to EUR 35M / 7 % (prohibited practices); up to EUR 15M / 3 % (other obligations)"` | Prohibited practices (Art. 5) vs provider/deployer obligations |
| `"PCI DSS: card-brand penalties and loss of processing rights (contractual)"` | Card data in scope; penalties are contractual, not statutory |

---

## Readiness scoring

When `READINESS_TARGET` is set, the orchestrator derives one status per control of the target
framework from the findings that cite it:

| Status | Rule |
|---|---|
| `implemented` | The control's theme was in scope of an audit that ran, and no confirmed finding cites the control |
| `partial` | Only P2/P3 findings cite the control |
| `missing` | At least one P0/P1 finding cites the control |
| `not-assessable` | The control is in [Requires organisational evidence](#requires-organisational-evidence) |
| `n/a` | Phase 0 declared the theme not applicable to the target, with a reason |

**Nonconformity class** (the vocabulary certification auditors use, reported next to P0–P3):
`missing` → **Major nonconformity**; `partial` → **Minor nonconformity**; a P3-only control → **OFI**
(opportunity for improvement); `implemented` → **Conform**.

**Readiness score** = `implemented ÷ (implemented + partial + missing)`, as a percentage.
`not-assessable` and `n/a` are excluded from the denominator and reported as counts. The score is
labelled "technical control readiness" — never "compliance" or "certification".

**Time-to-audit-ready estimate** = the sum of the effort of every finding that cites a `missing`
or `partial` control, using S = 0.5, M = 2, L = 5, XL = 10 person-days, reported as a range
(× 1.0 to × 2.0) and labelled as a heuristic.

---

## Copyright note

ISO/IEC standards are copyrighted by ISO/IEC; the AICPA Trust Services Criteria by the AICPA. This
file and every audit cite **control identifiers and short titles only** and never reproduce control
text, implementation guidance, or points of focus. EU regulations and directives and Swiss federal
law are freely available: [GDPR](https://eur-lex.europa.eu/eli/reg/2016/679/oj),
[NIS2](https://eur-lex.europa.eu/eli/dir/2022/2555/oj),
[CRA](https://eur-lex.europa.eu/eli/reg/2024/2847/oj),
[AI Act](https://eur-lex.europa.eu/eli/reg/2024/1689/oj),
[revDSG](https://www.fedlex.admin.ch/eli/cc/2022/491/de).
