# Framework versions

The edition of every external standard, regulation, and reference the audits and the
[`CONTROL-CROSSWALK.md`](CONTROL-CROSSWALK.md) cite, with the date it was last checked. Frameworks
change yearly; a mapping that is not dated silently rots.

> [!NOTE]
> **Management summary.** This is the register that keeps the library's standards references
> current. Each row names the edition in use, the date it was last verified, and the trigger for
> the next review. A quarterly review is scheduled; a row whose `Next review` date is in the past
> is a documentation finding.

Review cadence: **quarterly**, plus immediately when a listed regulation reaches an application
date. Owner: repository maintainer. Last full review: 2026-09-15.

---

## Certification and regulatory frameworks (crosswalk columns)

| Framework | Edition in use | Key dates | Verified | Next review |
|---|---|---|---|---|
| ISO/IEC 27001 | 2022 (Annex A: 93 controls, 4 themes) | Transition from the 2013 edition ended 31 Oct 2025 | 2026-09-15 | 2026-12-15 |
| ISO/IEC 27002 | 2022 | Companion guidance for the Annex A controls | 2026-09-15 | 2026-12-15 |
| SOC 2 Trust Services Criteria | TSC 2017, with the 2022 revised points of focus | — | 2026-09-15 | 2026-12-15 |
| ISO/IEC 42001 | 2023 | ISO/IEC 42006:2025 enables accredited certification of AI management systems | 2026-09-15 | 2026-12-15 |
| EU AI Act | Regulation (EU) 2024/1689 | Prohibited practices apply since 2 Feb 2025; GPAI obligations since 2 Aug 2025; high-risk obligations phase in from 2 Aug 2026 (timeline subject to the Digital Omnibus amendments — verify before citing a date) | 2026-09-15 | 2026-12-15 |
| NIS2 | Directive (EU) 2022/2555 | Transposition deadline 17 Oct 2024; national laws apply (check the member state of the target) | 2026-09-15 | 2026-12-15 |
| Cyber Resilience Act | Regulation (EU) 2024/2847 | In force 10 Dec 2024; reporting obligations (Art. 14) apply since 11 Sept 2026; full application 11 Dec 2027 | 2026-09-15 | 2026-12-15 |
| revDSG (Swiss FADP) | SR 235.1, in force 1 Sept 2023, with VDSG SR 235.11 | — | 2026-09-15 | 2026-12-15 |
| GDPR | Regulation (EU) 2016/679 | — | 2026-09-15 | 2026-12-15 |

## Technical references cited by the audits

| Reference | Edition in use | Note | Verified |
|---|---|---|---|
| OWASP Top 10 | 2025 | Replaces the 2021 list; category IDs are `A0x:2025` | 2026-09-15 |
| OWASP API Security Top 10 | 2023 | | 2026-09-15 |
| OWASP ASVS | 5.0 (2025) | | 2026-09-15 |
| OWASP Top 10 for LLM Applications | 2025 | | 2026-09-15 |
| OWASP MASVS | 2.1 | Not yet used by an audit | 2026-09-15 |
| CWE Top 25 | 2024 | | 2026-09-15 |
| MITRE ATT&CK | current matrix (versioned twice a year) | | 2026-09-15 |
| MITRE ATLAS | current | AI-specific adversary tactics | 2026-09-15 |
| CVSS | v3.1 (v4.0 accepted where a scorer provides it) | | 2026-09-15 |
| CIS Benchmarks | per platform, current | | 2026-09-15 |
| CIS Controls | v8.1 | | 2026-09-15 |
| NIST CSF | 2.0 (2024) | | 2026-09-15 |
| NIST AI RMF | 1.0 (2023) plus NIST AI 600-1 (GenAI profile, 2024) | | 2026-09-15 |
| NIST SSDF | SP 800-218 v1.1 | | 2026-09-15 |
| SLSA | v1.0 | | 2026-09-15 |
| WCAG | 2.2 (W3C Recommendation, Oct 2023) | | 2026-09-15 |
| EN 301 549 | v3.2.1 | Harmonised with the European Accessibility Act, applicable since 28 June 2025 | 2026-09-15 |
| ADA Title II web rule | 2024 final rule | Compliance dates 24 Apr 2026 (large entities) and 26 Apr 2027 (small entities) | 2026-09-15 |
| RFC 9110 / RFC 9457 | 2022 / 2023 | RFC 9457 obsoletes RFC 7807 | 2026-09-15 |
| OpenAPI | 3.1 | | 2026-09-15 |
| TDDDG (Germany) | Renamed from TTDSG on 14 May 2024 | Section 25 governs cookies and terminal-equipment access | 2026-09-15 |
| SARIF | 2.1.0 (OASIS Standard, 2020; errata 01 2023) | `scripts/export-findings.mjs` emits it; GitHub Code Scanning ingests 2.1.0 | 2026-09-16 |
| CSA CCM / CAIQ | v4 (CCM v4.0.x, CAIQ v4) | 17 control domains; the questionnaire pre-fill answers per domain | 2026-09-16 |
| VPAT / ACR | VPAT 2.5 (ITI, 2023) | `acr-wcag22.csv` uses its conformance-level vocabulary | 2026-09-16 |
| PCI DSS | 4.0.1 (June 2024) | Future-dated requirements mandatory since 31 Mar 2025 — `finance` overlay | 2026-09-16 |
| EU-DORA | Regulation (EU) 2022/2554 | Applies since 17 Jan 2025 — `finance` overlay | 2026-09-16 |
| FINMA-RS 2023/1 | Operational risks and resilience — banks, in force 1 Jan 2024 | Cited by chapter (ICT, Cyber, CritData, BCM) — `finance` overlay | 2026-09-16 |
| HIPAA Security Rule | 45 CFR Part 164 Subpart C (a 2025 NPRM proposes tightening) | `health` overlay | 2026-09-16 |
| ISG (Switzerland) | SR 128, in force 1 Jan 2024; cyber-attack reporting duty Art. 74a–74h since 1 Apr 2025 | `swiss` overlay | 2026-09-16 |
| BWL ICT minimum standard | 2023 edition (NIST-CSF-shaped) | `swiss` overlay | 2026-09-16 |
| eCH-0059 | v3.0 (references WCAG 2.1 AA) | `swiss` overlay; satisfied by a WCAG 2.2 A/AA ACR | 2026-09-16 |
| OSCAL | 1.1.2 (NIST, 2024) | assessment-results model, minimal profile emitted by the exporter | 2026-09-16 |
| DORA (DevOps Research and Assessment) | 2024 State of DevOps report | Not the EU Digital Operational Resilience Act — the audits say "DORA metrics" to keep the two apart | 2026-09-15 |

## Review procedure

1. For each row, open the publisher's page and confirm the edition is still current.
2. If an edition changed, update the row, then search the prompts and the crosswalk for the old
   identifier (`grep -rn "<old id>" audit-prompts CONTROL-CROSSWALK.md`) and update each cite.
3. Record the review date in this file's header and add a `CHANGELOG.md` entry.
4. Prompt or crosswalk edits change the checksummed set — run `node scripts/checksums.mjs`.
