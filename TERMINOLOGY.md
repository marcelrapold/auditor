# Terminology

This is the project glossary for German (de-CH) and English copy across the site
([`web/lib/i18n.ts`](web/lib/i18n.ts), [`web/lib/audit-details.ts`](web/lib/audit-details.ts),
[`web/lib/content.ts`](web/lib/content.ts)) and the German issue output of the 13 audit prompts in
[`audit-prompts/`](audit-prompts/). It is a reference doc, so the head-matter is English; the
canonical German forms live in the `de-CH` column. The content audit consumes this file as its
`STYLE_REFERENCE`.

Two tiers govern every entry:

- **BINDING** — a fixed decision. An audit may **not** override it. Use it verbatim (for
  keep-as-code tokens) or in its single canonical form.
- **ADVISORY** — a preferred canonical form. An audit may **extend** the advisory tier with new
  entries per run, but may never **demote** an advisory preference to a worse variant, and never
  promote translationese over the listed form.

German copy follows Swiss orthography (de-CH): always `ss`, never the Eszett, except immutable
proper names, code, legal titles, or verbatim quotes. German quotation marks are „…", never an
ASCII straight-quote closer. See [`ISSUE-OUTPUT-STANDARD.md`](ISSUE-OUTPUT-STANDARD.md) for the
governing locale rule that all audits inherit.

The `keep-as-code?` column says whether the token stays a verbatim literal (`yes`) or is rendered
as prose in the target language (`no`).

## Binding — keep as code (stay English)

These tokens are acronyms, proper names, or literal identifiers. They are never translated, never
spelled out in running text, and keep their exact casing.

| Concept | EN (canonical) | de-CH | keep-as-code? | Tier | Rationale |
|---|---|---|---|---|---|
| Continuous integration/delivery | CI/CD | CI/CD | yes | BINDING | Established pipeline acronym; recurs across the prompts. |
| Infrastructure as code | IaC | IaC | yes | BINDING | Standard acronym; do not spell out in German. |
| OWASP | OWASP | OWASP | yes | BINDING | Proper name of the standards body. |
| Common Weakness Enumeration | CWE | CWE | yes | BINDING | MITRE catalogue identifier (e.g. CWE-639). |
| CVSS | CVSS | CVSS | yes | BINDING | Scoring-system name; keep the score format too. |
| MITRE | MITRE | MITRE | yes | BINDING | Organisation / ATT&CK proper name. |
| CIS | CIS | CIS | yes | BINDING | Benchmark body name. |
| Software bill of materials | SBOM | SBOM | yes | BINDING | Supply-chain acronym; do not localise. |
| Retrieval-augmented generation | RAG | RAG | yes | BINDING | Established AI acronym. |
| SLSA | SLSA | SLSA | yes | BINDING | Supply-chain integrity framework name. |
| DORA | DORA | DORA | yes | BINDING | Delivery-metrics framework name. |
| WCAG | WCAG | WCAG | yes | BINDING | Accessibility standard; most-cited token in the corpus. |
| E-E-A-T | E-E-A-T | E-E-A-T | yes | BINDING | Google quality-rater acronym; keep the hyphenation. |
| Bottom line up front | BLUF | BLUF | yes | BINDING | Writing-discipline acronym. |
| Evidence citation | `file:line` | `file:line` | yes | BINDING | Fundort format; never translated or reformatted. |
| GitHub issue | GitHub-Issue | GitHub-Issue | yes | BINDING | Product name; German compound keeps „Issue". |
| Workflow trigger | `pull_request_target` | `pull_request_target` | yes | BINDING | Literal GitHub Actions identifier. |
| Insecure direct object reference | IDOR | IDOR | yes | BINDING | Vulnerability-class acronym. |
| Broken object-level authorization | BOLA | BOLA | yes | BINDING | OWASP API vulnerability-class acronym. |
| API | API | API | yes | BINDING | Universally known; never spelled out. |

## Binding — terms of art (keep English; one canonical German-inflected form where used as a verb)

These are established terms of art. The English noun is kept in German prose; where the corpus uses
the concept as a verb, exactly one German-inflected form is canonical.

| Concept | EN (canonical) | de-CH | keep-as-code? | Tier | Rationale |
|---|---|---|---|---|---|
| Trust boundary | Trust Boundary | Trust Boundary | no | BINDING | Threat-modelling term of art; keep English noun. |
| Blast radius | Blast-Radius | Blast-Radius | no | BINDING | Established impact-scope term; keep the compound. |
| Prompt injection | Prompt-Injection | Prompt-Injection | no | BINDING | Security term of art; do not translate. |
| Supply chain | Supply Chain | Supply Chain | no | BINDING | Kept English in the prompts; not „Lieferkette". |
| Business logic | Business Logic | Business Logic | no | BINDING | Term of art; not „Geschäftslogik". |
| Human gate | Human-Gate | Human-Gate | no | BINDING | Agent-safety term; keep the English compound. |
| Output sink | Output-Sink | Output-Sink | no | BINDING | Dataflow term of art. |
| Cost cap | Cost-Cap | Cost-Cap | no | BINDING | Agent-budget term; keep English. |
| Untrusted input | untrusted Input | untrusted Input | no | BINDING | Kept as „untrusted Input" across the prompts. |
| Merge (git) | merge | mergen | no | BINDING | German verb „mergen" is the canonical inflected form; keep it. |
| Map (a system) | map | kartieren | no | BINDING | Canonical German verb is „kartieren", never „mappen". |

## Advisory — translate (prefer the German)

Where a clean German word exists, prefer it over an English loan. An audit may extend this list but
must not revert to the English form.

| Concept | EN (canonical) | de-CH | keep-as-code? | Tier | Rationale |
|---|---|---|---|---|---|
| Finding | finding | Befund | no | ADVISORY | „Befund" is the established term in `i18n.ts` / `audit-details.ts`. |
| Output (result) | output | Ergebnis | no | ADVISORY | Prefer „Ergebnis" over „Output" in prose. |
| Run (a pass) | run | Durchlauf | no | ADVISORY | „Durchlauf" for one audit pass. |
| Lens | lens | Prüfbereich / Prüfdimension | no | ADVISORY | Translate; no English-loan need. |
| Sweep | sweep | Durchlauf | no | ADVISORY | Same German as „run". |
| Deduplicate | deduplicate | Doppelungen entfernen | no | ADVISORY | Avoid „deduplizieren"; use plain German. |
| Benchmark (verb) | benchmark | gegen Referenzen prüfen | no | ADVISORY | Avoid „benchmarken"; describe the action. |
| Remediation | remediation | Korrekturmassnahme | no | ADVISORY | de-CH spelling with ss, never the Eszett form. |
| Failure mode | failure mode | Fehlerbild | no | ADVISORY | Prefer „Fehlerbild". |
| Scope | scope | Umfang | no | ADVISORY | „Umfang" (already used in `i18n.ts`). |

## Advisory — rephrase (anchorless translationese to avoid)

These English phrasings produce calques in German. Rephrase to the listed German instead of
translating word for word.

| Concept | EN (canonical) | de-CH | keep-as-code? | Tier | Rationale |
|---|---|---|---|---|---|
| Run/operate it | "laufen lassen" | einsetzen / ausführen | no | ADVISORY | „laufen lassen" is anchorless; use „einsetzen" or „ausführen". |
| Aim the agent | "Point your agent at" | „… nutzen" | no | ADVISORY | Rephrase to „… nutzen"; avoid the literal calque. |
| Self-test | "dogfooded" | „prüft sich selbst" | no | ADVISORY | Render the meaning: „prüft sich selbst". |
| Steelman | "steelmannen" | „den stärksten Gegenpunkt bilden" | no | ADVISORY | No German loan; describe the action. |

> [!NOTE]
> This glossary is a seed. Audits extend the ADVISORY tier per run, but never demote a BINDING
> decision.
