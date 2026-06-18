import type { Lang } from "@/lib/i18n";

export type AuditDetail = {
  tagline: string;
  approach: string;
  useCases: { title: string; body: string }[];
  output: string;
};

/** Per-audit detail-page content (bilingual), generated grounded in each master
 *  prompt. Keyed by audit name (matches AUDITS[].name in content.ts). */
export const AUDIT_DETAILS: Record<string, { en: AuditDetail; de: AuditDetail }> = {
  "security": {
    "en": {
      "tagline": "A 14-domain security review where every finding is evidence-backed and exploitability-rated.",
      "approach": "A specialist swarm runs the 14 security domains in parallel — injection, authentication, authorization, secrets and crypto, supply chain, configuration, IaC, CI/CD, API, business logic, frontend, privacy, logging, and LLM. Phase 0 maps the attack surface and trust boundaries first; each finding cites a file:line or config artifact, maps to OWASP, CWE, MITRE, or CIS, and carries a P0–P3 severity with a CVSS estimate. Every P0/P1 is attacked by independent skeptics before it survives into the report.",
      "useCases": [
        {
          "title": "Before a production launch",
          "body": "You are about to ship and want to know what an attacker could reach. The audit maps entry points and trust boundaries, then surfaces unauthenticated mutating endpoints, IDOR/BOLA gaps, and exposed secrets as P0s — each with the concrete exploitation path and a before/after fix."
        },
        {
          "title": "Auditing an inherited codebase",
          "body": "You took over a service with no security history. The swarm builds an attack-surface inventory from scratch and grades all 14 domains A–F, so you learn where the real exposure sits — weak JWT validation, over-broad IAM, known-CVE dependencies — instead of guessing."
        },
        {
          "title": "Hardening a CI/CD and IaC setup",
          "body": "Your pipelines and Terraform have grown organically. The audit checks for secrets in CI, pull_request_target risks, public buckets, missing encryption at rest, and over-broad roles, mapping each gap to a CIS control with a concrete remediation."
        }
      ],
      "output": "A priority-sorted GitHub tracking issue plus one issue per confirmed finding — each with a management summary, OWASP/CWE/MITRE mapping, redacted evidence, CVSS, and a before/after fix."
    },
    "de": {
      "tagline": "Ein Security-Review über 14 Domains — jeder Befund evidenzbasiert und nach Exploitability bewertet.",
      "approach": "Ein Spezialisten-Swarm prüft die 14 Security-Domains parallel: Injection, Authentication, Authorization, Secrets und Crypto, Supply Chain, Konfiguration, IaC, CI/CD, API, Business Logic, Frontend, Privacy, Logging und LLM. Phase 0 mappt zuerst die Angriffsfläche und die Trust Boundaries; jeder Befund zitiert eine file:line oder einen Config-Artefakt, mappt auf OWASP, CWE, MITRE oder CIS und trägt eine P0–P3-Severity mit CVSS-Schätzung. Jeder P0/P1 wird von unabhängigen Skeptikern angegriffen, bevor er es in den Report schafft.",
      "useCases": [
        {
          "title": "Vor dem Production-Launch",
          "body": "Du bist kurz vor dem Release und willst wissen, was ein Angreifer erreichen kann. Der Audit mappt Entry Points und Trust Boundaries und legt unauthentifizierte mutierende Endpoints, IDOR/BOLA-Lücken und exponierte Secrets als P0 offen — je mit konkretem Exploitation-Pfad und Before/After-Fix."
        },
        {
          "title": "Übernommene Codebase prüfen",
          "body": "Du hast einen Service ohne Security-Historie übernommen. Der Swarm baut ein Attack-Surface-Inventory von Grund auf und benotet alle 14 Domains A–F, damit du die echte Exposure siehst — schwache JWT-Validierung, zu breite IAM, Dependencies mit bekannten CVEs — statt zu raten."
        },
        {
          "title": "CI/CD und IaC härten",
          "body": "Deine Pipelines und Terraform sind organisch gewachsen. Der Audit prüft auf Secrets in CI, pull_request_target-Risiken, public Buckets, fehlende Encryption at Rest und zu breite Rollen und mappt jede Lücke auf ein CIS-Control mit konkreter Remediation."
        }
      ],
      "output": "Ein priorisiertes GitHub-Tracking-Issue plus ein Issue je bestätigtem Befund — jeweils mit Management-Summary, OWASP/CWE/MITRE-Mapping, redacted Evidence, CVSS und Before/After-Fix."
    }
  },
  "repo": {
    "en": {
      "tagline": "A whole-repo engineering review, scored against Google Eng, SRE, and SLSA.",
      "approach": "A Principal-Engineer review that fans out ten specialist agents across architecture, tech-stack consistency, docs, code quality, testing, security, dependencies, CI/CD, observability, and git/release hygiene. Its lens is internal coherence: declared standards versus actual practice, with doc-code drift, .env-vs-code, and lint-config-vs-reality actively tested rather than assumed. Every finding cites file:line, is benchmarked against named reference repos, and must survive independent skeptics before it reaches the report.",
      "useCases": [
        {
          "title": "Inheriting an unfamiliar codebase",
          "body": "You just took over a repo and the README is the only map you have. The audit walks clone-to-running and flags the exact step where setup breaks, plus documented commands and env vars that no longer match what the code reads."
        },
        {
          "title": "After two teams merged a codebase",
          "body": "A merger or reorg left one repo carrying two of everything. The tech-stack dimension lists competing libraries (two HTTP clients, two date libs), version drift across workspaces, and mixed paradigms with usage counts and a consolidation path."
        },
        {
          "title": "Due diligence before a handoff",
          "body": "You are acquiring a repo or signing off ownership and need an honest baseline, not a vibe. You get a board-ready scorecard across all ten dimensions, an overall engineering grade, and the single biggest consistency risk named up front."
        }
      ],
      "output": "A graded ten-dimension scorecard plus verified findings filed as priority-sorted GitHub issues, each with file:line evidence and a before/after fix."
    },
    "de": {
      "tagline": "Ein Engineering-Review fürs ganze Repo, gemessen an Google Eng, SRE und SLSA.",
      "approach": "Ein Review auf Principal-Engineer-Niveau, das zehn Spezialisten parallel über Architektur, Stack-Konsistenz, Docs, Code-Qualität, Tests, Security, Dependencies, CI/CD, Observability und Git-/Release-Hygiene laufen lässt. Die Linse ist innere Kohärenz: deklarierter Standard gegen tatsächliche Praxis — Doc-Code-Drift, .env-vs-Code und Lint-Config-vs-Realität werden aktiv geprüft, nicht angenommen. Jeder Befund nennt file:line, wird gegen benannte Referenz-Repos benchmarkt und muss unabhängige Skeptiker überstehen, bevor er in den Bericht kommt.",
      "useCases": [
        {
          "title": "Ein fremdes Repo übernehmen",
          "body": "Du hast gerade ein Repo geerbt und das README ist deine einzige Karte. Das Audit geht clone-to-running durch und markiert genau den Schritt, an dem das Setup bricht — plus dokumentierte Befehle und Env-Vars, die nicht mehr zu dem passen, was der Code liest."
        },
        {
          "title": "Nachdem zwei Teams einen Code zusammenführten",
          "body": "Ein Merger oder Reorg hat ein Repo mit zwei von allem zurückgelassen. Die Stack-Dimension listet konkurrierende Libraries (zwei HTTP-Clients, zwei Date-Libs), Version-Drift über Workspaces und gemischte Paradigmen — mit Usage-Counts und einem Konsolidierungspfad."
        },
        {
          "title": "Due Diligence vor einer Übergabe",
          "body": "Du kaufst ein Repo oder gibst Ownership ab und brauchst eine ehrliche Baseline statt Bauchgefühl. Du bekommst eine board-taugliche Scorecard über alle zehn Dimensionen, eine Gesamtnote und das größte Konsistenz-Risiko gleich vorneweg benannt."
        }
      ],
      "output": "Eine benotete Zehn-Dimensionen-Scorecard plus verifizierte Befunde als prioritätssortierte GitHub-Issues, jeder mit file:line-Beleg und einem Vorher/Nachher-Fix."
    }
  },
  "frontend": {
    "en": {
      "tagline": "Sixteen frontend specialists audit one UI — every finding verified before it ships.",
      "approach": "Phase 0 maps the product, its surfaces, and the critical user journeys, then 16 specialist agents run in parallel across usability, behavioral psychology, visual design, WCAG 2.2 accessibility, Core Web Vitals, technical SEO, microcopy, conversion, IA, responsive behavior, interaction states, forms, code quality, trust, i18n, and first impressions. Each finding names the law or guideline it violates, cites concrete evidence — a DOM selector, file:line, measured metric, or quoted string — and only survives if at least two of three independent skeptics fail to refute it. Where both the live URL and the repo are available, agents cross-validate what the code claims against what the page actually renders.",
      "useCases": [
        {
          "title": "Pre-launch readiness review",
          "body": "You are days from shipping a redesign and need to know what is actually broken, not what looks fine in a demo. The audit walks every critical journey end to end and surfaces the WCAG A failures, dark patterns, and conversion leaks that block launch — each mapped to a severity and a concrete fix."
        },
        {
          "title": "Signup funnel that leaks",
          "body": "Traffic arrives but few people complete signup, and the analytics only tell you where they drop, not why. The CRO and forms agents count every field, click, and decision between arrival and the success event, then flag the friction, missing validation, and weak trust signals at the exact step users abandon."
        },
        {
          "title": "Accessibility and legal exposure",
          "body": "The EAA deadline is approaching and you need to know where the product fails conformance before an auditor or a complaint finds out. The accessibility agent runs a full WCAG 2.2 AA sweep — semantics, keyboard operability, focus management, contrast, target size — and maps each failure to its success-criterion number and legal context."
        }
      ],
      "output": "A 0-100 scorecard per dimension plus priority-sorted German GitHub issues, each with a management summary, the evidence, a before/after fix, and a 30/60/90 roadmap."
    },
    "de": {
      "tagline": "Sechzehn Frontend-Spezialisten prüfen ein UI — jeder Befund verifiziert, bevor er eingereicht wird.",
      "approach": "Phase 0 kartiert das Produkt, seine Surfaces und die kritischen User Journeys, dann laufen 16 Spezialisten-Agenten parallel über Usability, Verhaltenspsychologie, Visual Design, WCAG-2.2-Accessibility, Core Web Vitals, technisches SEO, Microcopy, Conversion, IA, Responsive-Verhalten, Interaction States, Formulare, Code-Qualität, Trust, i18n und den ersten Eindruck. Jeder Befund nennt die verletzte Regel oder Guideline, belegt sie konkret — mit DOM-Selektor, file:line, gemessener Metrik oder zitiertem String — und übersteht nur, wenn mindestens zwei von drei unabhängigen Skeptikern ihn nicht widerlegen. Liegen Live-URL und Repo beide vor, gleichen die Agenten ab, was der Code behauptet, gegen das, was die Seite tatsächlich rendert.",
      "useCases": [
        {
          "title": "Review vor dem Launch",
          "body": "Du bist Tage von einem Redesign entfernt und musst wissen, was wirklich kaputt ist — nicht, was in der Demo gut aussieht. Das Audit geht jede kritische Journey von Anfang bis Ende durch und legt die WCAG-A-Fehler, Dark Patterns und Conversion-Lecks offen, die den Launch blockieren — jedes mit Severity und konkretem Fix."
        },
        {
          "title": "Signup-Funnel mit Leck",
          "body": "Traffic kommt an, aber kaum jemand schließt den Signup ab, und die Analytics zeigen dir nur, wo abgesprungen wird, nicht warum. Die CRO- und Formular-Agenten zählen jedes Feld, jeden Klick und jede Entscheidung zwischen Ankunft und Erfolgsereignis und markieren die Friction, fehlende Validierung und schwachen Trust-Signale genau an dem Schritt, an dem Nutzer abbrechen."
        },
        {
          "title": "Accessibility und rechtliches Risiko",
          "body": "Die EAA-Frist rückt näher und du musst wissen, wo das Produkt die Konformität verfehlt, bevor ein Prüfer oder eine Beschwerde es findet. Der Accessibility-Agent fährt einen vollständigen WCAG-2.2-AA-Sweep — Semantik, Keyboard-Bedienbarkeit, Focus-Management, Kontrast, Target Size — und ordnet jedem Fehler seine Success-Criterion-Nummer und den rechtlichen Kontext zu."
        }
      ],
      "output": "Eine 0-100-Scorecard pro Dimension plus nach Priorität sortierte deutsche GitHub-Issues, jedes mit Management-Summary, Beleg, Before/After-Fix und einer 30/60/90-Roadmap."
    }
  },
  "api": {
    "en": {
      "tagline": "Audit your API against its published contract — and what the code actually does.",
      "approach": "Twelve specialist agents review one API surface across resource modeling, HTTP semantics and status codes, the error envelope, auth and object-level authorization, versioning, pagination, idempotency, rate limits, schema rigor, docs, webhooks, and observability. Each finding cites a handler file:line, a schema path, or a request/response pair and names the rule it breaks — RFC 9110, RFC 9457, OpenAPI 3.1, the GraphQL spec, or gRPC conventions. Every drift between the published contract and the implementation is logged as its own finding with both locations cited.",
      "useCases": [
        {
          "title": "Opening a private API to partners",
          "body": "An internal endpoint set is about to become a public contract. The audit maps every operation against its OpenAPI or SDL, flags verbs-in-paths and inconsistent collection patterns, and surfaces missing page-size limits and unauthenticated mutating endpoints before external developers depend on them."
        },
        {
          "title": "After a payments endpoint double-charged",
          "body": "A retry created a second charge in production. The audit checks idempotency keys on money and side-effect POSTs, optimistic concurrency on read-modify-write paths, and webhook delivery semantics, then ships the Idempotency-Key handling and storage as a before/after fix."
        },
        {
          "title": "Reconciling spec drift before SDK generation",
          "body": "You generate client SDKs from an OpenAPI spec that no longer matches the handlers. The audit lints the spec and produces a contract-drift matrix per operation — removed fields, narrowed types, changed defaults, wrong status codes — so the generated clients stop breaking against real responses."
        }
      ],
      "output": "A scorecard graded per dimension plus a priority-sorted tracking issue and one German GitHub issue per finding, each with a management summary and a before/after fix."
    },
    "de": {
      "tagline": "Prüfe deine API gegen ihren veröffentlichten Contract — und gegen das, was der Code tatsächlich tut.",
      "approach": "Zwölf Spezialisten-Agenten prüfen eine API-Oberfläche über Resource-Modeling, HTTP-Semantik und Status-Codes, das Error-Envelope, Auth und Authorization auf Objektebene, Versioning, Pagination, Idempotency, Rate-Limits, Schema-Rigorosität, Docs, Webhooks und Observability. Jeder Befund nennt eine Handler-file:line, einen Schema-Pfad oder ein Request/Response-Paar und die verletzte Regel — RFC 9110, RFC 9457, OpenAPI 3.1, GraphQL-Spec oder gRPC-Konventionen. Jede Abweichung zwischen veröffentlichtem Contract und Implementierung wird als eigener Befund mit beiden Fundstellen erfasst.",
      "useCases": [
        {
          "title": "Interne API für Partner öffnen",
          "body": "Ein internes Endpoint-Set wird zum öffentlichen Contract. Das Audit gleicht jede Operation mit ihrer OpenAPI oder SDL ab, markiert Verben im Pfad und inkonsistente Collection-Patterns und deckt fehlende Page-Size-Limits und unauthentifizierte mutierende Endpoints auf, bevor externe Entwickler darauf bauen."
        },
        {
          "title": "Nachdem ein Payments-Endpoint doppelt abgebucht hat",
          "body": "Ein Retry hat in Produktion eine zweite Charge erzeugt. Das Audit prüft Idempotency-Keys auf Money- und Side-Effect-POSTs, Optimistic Concurrency auf Read-Modify-Write-Pfaden und die Webhook-Delivery-Semantik und liefert das Idempotency-Key-Handling samt Storage als Vorher/Nachher-Fix."
        },
        {
          "title": "Spec-Drift vor der SDK-Generierung bereinigen",
          "body": "Du generierst Client-SDKs aus einer OpenAPI-Spec, die nicht mehr zu den Handlern passt. Das Audit lintet die Spec und erstellt eine Contract-Drift-Matrix pro Operation — entfernte Felder, verengte Typen, geänderte Defaults, falsche Status-Codes — damit die generierten Clients nicht länger an echten Responses brechen."
        }
      ],
      "output": "Eine pro Dimension benotete Scorecard plus ein nach Priorität sortiertes Tracking-Issue und pro Befund ein deutsches GitHub-Issue, jedes mit Management-Summary und Vorher/Nachher-Fix."
    }
  },
  "performance": {
    "en": {
      "tagline": "Find where the system is slow, where it falls over under load, and where it wastes resources.",
      "approach": "Eleven specialists run in parallel over server-side latency, throughput, and scaling behavior: algorithmic hot paths, database query efficiency and N+1 patterns, caching, concurrency, leaks, network I/O, resilience, and cost. Every finding cites a concrete artifact — a hot-path file:line, a query plan, a measured latency, a profiler frame — labels itself measured or reasoned, and survives adversarial verification before it lands. Each confirmed fix ships with an estimated metric improvement and the load level at which the path breaks today.",
      "useCases": [
        {
          "title": "An endpoint got slow after a release",
          "body": "A request path that used to be fast now drags, and the trace points at the database. The audit hunts N+1 patterns per endpoint, reads the query plan for full scans and missing indexes, and quantifies each: queries per request, p95 before versus after, and the index or batched query that fixes it."
        },
        {
          "title": "Sizing for a 10x traffic increase",
          "body": "Before a launch or campaign you need to know whether the system holds. The audit reasons each critical path through at 2x and 10x current load, names the first bottleneck to saturate — a hot row, a global lock, an undersized connection pool — and states the load level at which it breaks and the realistic ceiling after remediation."
        },
        {
          "title": "A dependency slowdown caused a cascade",
          "body": "One slow downstream call backed up threads and took the service with it. The audit checks timeout discipline on every external call, hunts retries without backoff and jitter, and flags missing circuit breakers, backpressure, and load shedding — pinpointing the failure mode when a dependency is slow, not just down."
        }
      ],
      "output": "A scorecard graded per dimension plus a priority-sorted backlog of GitHub issues, each with the evidence, the quantified cost, and a before/after fix with its estimated metric gain."
    },
    "de": {
      "tagline": "Finde, wo das System langsam ist, wo es unter Last umkippt und wo es Ressourcen verschwendet.",
      "approach": "Elf Spezialisten laufen parallel über serverseitige Latenz, Throughput und Skalierungsverhalten: algorithmische Hot Paths, Query-Effizienz und N+1-Muster, Caching, Concurrency, Leaks, Netzwerk-I/O, Resilienz und Kosten. Jeder Befund nennt ein konkretes Artefakt — eine Hot-Path-file:line, einen Query-Plan, eine gemessene Latenz, einen Profiler-Frame —, kennzeichnet sich als measured oder reasoned und übersteht die adversarielle Verifikation, bevor er landet. Jeder bestätigte Fix kommt mit geschätzter Metrik-Verbesserung und dem Lastniveau, ab dem der Pfad heute bricht.",
      "useCases": [
        {
          "title": "Ein Endpoint wurde nach einem Release langsam",
          "body": "Ein Request-Pfad, der früher schnell war, hängt jetzt, und der Trace zeigt auf die Datenbank. Das Audit jagt N+1-Muster pro Endpoint, liest den Query-Plan auf Full Scans und fehlende Indizes und quantifiziert jeden: Queries pro Request, p95 vorher gegen nachher und den Index oder die gebündelte Query, die es behebt."
        },
        {
          "title": "Dimensionierung für 10x mehr Traffic",
          "body": "Vor einem Launch oder einer Kampagne musst du wissen, ob das System hält. Das Audit denkt jeden kritischen Pfad bei 2x und 10x aktueller Last durch, benennt den ersten Bottleneck, der saturiert — eine Hot Row, ein globaler Lock, ein zu kleiner Connection-Pool —, und nennt das Lastniveau, ab dem es bricht, plus die realistische Decke nach der Behebung."
        },
        {
          "title": "Eine langsame Dependency löste eine Kaskade aus",
          "body": "Ein langsamer Downstream-Call staute Threads und riss den Service mit. Das Audit prüft Timeout-Disziplin bei jedem externen Call, jagt Retries ohne Backoff und Jitter und markiert fehlende Circuit Breaker, Backpressure und Load Shedding — und zeigt den Failure Mode, wenn eine Dependency langsam ist, nicht nur tot."
        }
      ],
      "output": "Eine pro Dimension benotete Scorecard plus ein nach Priorität sortierter Backlog aus GitHub-Issues, jedes mit Beleg, quantifizierten Kosten und einem Vorher/Nachher-Fix samt geschätzter Metrik-Verbesserung."
    }
  },
  "data": {
    "en": {
      "tagline": "Audits whether your data can become wrong, lost, or leaked — and proves it with queries.",
      "approach": "An engine-agnostic swarm reviews the data layer across eleven dimensions: schema and normalization, data types and precision, constraints and referential integrity, keys and identity, migration safety, transactions and concurrency, integrity in practice, data protection, lifecycle and deletion, pipelines, and backup/recovery. The lens is correctness, not query speed — every place the database allows invalid, orphaned, or inconsistent state is a finding, cited to a migration file, a constraint, or a redacted row pattern. P0/P1 findings name a concrete data-loss, corruption, or leak path and survive adversarial verification before they ship.",
      "useCases": [
        {
          "title": "Before a risky production migration",
          "body": "You're about to add a NOT NULL column, rewrite a large table, or run a destructive backfill. The audit checks each migration for locking and blocking risk, reversibility, and a rollback path, and flags any destructive operation with no safety net — sequencing the fix as an expand/contract plan with backfill and rollback."
        },
        {
          "title": "After bad rows show up in reporting",
          "body": "Billing reconciliation breaks or a join returns rows that shouldn't exist. The audit reasons about — and with read-only access spot-checks for — orphans, duplicates, and nulls in required fields, traces them to a missing FK, UNIQUE, or NOT NULL constraint, and ships the cleanup query plus the constraint that stops it recurring."
        },
        {
          "title": "Multi-tenant SaaS handling PII",
          "body": "Before a compliance push or a security review, the audit checks that tenant isolation is enforced in the data layer rather than trusted to app code, that sensitive columns aren't stored in plaintext, and that a GDPR right-to-erasure can actually delete a user everywhere — including backups, logs, and analytics."
        }
      ],
      "output": "A scorecard graded per dimension plus prioritized GitHub issues, each with evidence, severity, a before/after fix, and migrations sequenced with their safety plan."
    },
    "de": {
      "tagline": "Prüft, ob deine Daten falsch, verloren oder geleakt werden können — und belegt es mit Queries.",
      "approach": "Ein engine-agnostischer Swarm prüft den Data Layer über elf Dimensionen: Schema und Normalisierung, Datentypen und Präzision, Constraints und referenzielle Integrität, Keys und Identity, Migrationssicherheit, Transaktionen und Concurrency, Integrität in der Praxis, Datenschutz, Lifecycle und Löschung, Pipelines sowie Backup/Recovery. Der Fokus liegt auf Korrektheit, nicht auf Query-Speed — jede Stelle, an der die Datenbank ungültigen, verwaisten oder inkonsistenten State zulässt, ist ein Befund, belegt an einer Migrationsdatei, einem Constraint oder einem geschwärzten Row-Pattern. P0/P1-Befunde benennen einen konkreten Datenverlust-, Korruptions- oder Leak-Pfad und überstehen die adversariale Verifikation, bevor sie ausgeliefert werden.",
      "useCases": [
        {
          "title": "Vor einer riskanten Produktiv-Migration",
          "body": "Du willst eine NOT-NULL-Spalte hinzufügen, eine grosse Tabelle umschreiben oder einen destruktiven Backfill fahren. Der Audit prüft jede Migration auf Locking- und Blocking-Risiko, Reversibilität und einen Rollback-Pfad und markiert jede destruktive Operation ohne Sicherheitsnetz — und sequenziert den Fix als Expand/Contract-Plan mit Backfill und Rollback."
        },
        {
          "title": "Wenn falsche Rows im Reporting auftauchen",
          "body": "Die Billing-Reconciliation bricht oder ein Join liefert Rows, die es nicht geben dürfte. Der Audit reasoned über — und prüft mit Read-only-Zugriff stichprobenartig auf — Orphans, Duplikate und Nulls in Pflichtfeldern, führt sie auf einen fehlenden FK-, UNIQUE- oder NOT-NULL-Constraint zurück und liefert die Cleanup-Query plus den Constraint, der es künftig verhindert."
        },
        {
          "title": "Multi-Tenant-SaaS mit PII",
          "body": "Vor einem Compliance-Push oder Security-Review prüft der Audit, ob Tenant-Isolation im Data Layer erzwungen wird statt dem App-Code zu vertrauen, ob sensible Spalten nicht im Klartext liegen und ob ein GDPR-Recht-auf-Löschung eine Person wirklich überall löschen kann — inklusive Backups, Logs und Analytics."
        }
      ],
      "output": "Eine Scorecard mit Note pro Dimension plus priorisierte GitHub-Issues, jedes mit Evidence, Severity, einem Before/After-Fix und Migrationen, die mit ihrem Safety-Plan sequenziert sind."
    }
  },
  "infrastructure": {
    "en": {
      "tagline": "Audits how your system is built, shipped, and run — fragile, exposed, or unrecoverable, found and fixed.",
      "approach": "Twelve specialist passes cover IaC quality and drift, cloud security and network exposure, IAM, secrets, containers, Kubernetes, CI/CD, high availability, backup/DR, observability, cost, and environment parity. Every finding cites a concrete artifact — IaC file:line, a manifest or pipeline stanza, a CIS or Well-Architected control — and the central question is always: what happens when this fails, and can you recover? P0–P1 findings are then attacked by independent skeptics before they survive into the report.",
      "useCases": [
        {
          "title": "Before a production launch",
          "body": "You are about to put a service on the public internet and need to know what is actually exposed. The audit traces public-exposure paths — security groups open to 0.0.0.0/0 on sensitive ports, public buckets and databases, missing TLS or edge protection — and reports each with the exact IaC line and the CIS control it violates."
        },
        {
          "title": "After a near-miss outage",
          "body": "An incident made you ask whether you could actually rebuild from code and backups. The audit checks for single points of failure on tier-0 paths and whether backups are encrypted and restore-tested — not merely present — surfacing the unrecoverable states and missing DR runbooks before the next failure does."
        },
        {
          "title": "Hardening the deploy pipeline",
          "body": "Your team ships fast and you suspect the gates are decoration. The audit verifies whether build, test, scan, and approval steps actually block, checks branch protection and pipeline credential scope, and flags injection paths like pull_request_target — pinpointing where a broken or unscanned build can reach prod."
        }
      ],
      "output": "A dimension-graded scorecard with a DORA snapshot, a blast-radius map, and a priority-sorted backlog of verified findings — each filed as a GitHub issue with evidence, a before/after fix, and a re-audit criterion."
    },
    "de": {
      "tagline": "Prüft, wie dein System gebaut, ausgeliefert und betrieben wird — fragil, exponiert oder nicht wiederherstellbar, gefunden und behoben.",
      "approach": "Zwölf Spezialisten-Durchläufe decken IaC-Qualität und Drift, Cloud-Security und Netzwerk-Exposure, IAM, Secrets, Container, Kubernetes, CI/CD, High Availability, Backup/DR, Observability, Cost und Environment-Parität ab. Jeder Befund belegt ein konkretes Artefakt — IaC file:line, eine Manifest- oder Pipeline-Stanza, eine CIS- oder Well-Architected-Control — und die zentrale Frage lautet immer: Was passiert, wenn das ausfällt, und kannst du dich erholen? P0–P1-Befunde werden danach von unabhängigen Skeptikern angegriffen, bevor sie es in den Report schaffen.",
      "useCases": [
        {
          "title": "Vor einem Production-Launch",
          "body": "Du bringst einen Service ins öffentliche Internet und willst wissen, was tatsächlich exponiert ist. Das Audit verfolgt Public-Exposure-Pfade — Security Groups offen auf 0.0.0.0/0 an sensiblen Ports, öffentliche Buckets und Datenbanken, fehlendes TLS oder Edge-Schutz — und meldet jeden mit der exakten IaC-Zeile und der verletzten CIS-Control."
        },
        {
          "title": "Nach einem Beinahe-Ausfall",
          "body": "Ein Incident hat dich fragen lassen, ob du wirklich aus Code und Backups neu aufbauen kannst. Das Audit prüft Single Points of Failure auf Tier-0-Pfaden und ob Backups verschlüsselt und restore-getestet sind — nicht bloß vorhanden — und legt die nicht wiederherstellbaren Zustände und fehlenden DR-Runbooks offen, bevor es der nächste Ausfall tut."
        },
        {
          "title": "Deploy-Pipeline härten",
          "body": "Dein Team liefert schnell aus und du vermutest, dass die Gates nur Deko sind. Das Audit prüft, ob Build-, Test-, Scan- und Approval-Schritte wirklich blocken, kontrolliert Branch Protection und den Scope der Pipeline-Credentials und markiert Injection-Pfade wie pull_request_target — und zeigt, wo ein kaputter oder ungescannter Build in Prod landen kann."
        }
      ],
      "output": "Eine nach Dimensionen benotete Scorecard mit DORA-Snapshot, eine Blast-Radius-Map und ein nach Priorität sortiertes Backlog verifizierter Befunde — jeder als GitHub-Issue mit Beleg, Before/After-Fix und Re-Audit-Kriterium."
    }
  },
  "ai-llm": {
    "en": {
      "tagline": "Audit your LLM features the way an attacker and an honest user both would.",
      "approach": "Provider- and framework-agnostic, this audit first maps every place an LLM is called and every trust boundary where untrusted input — user text, retrieved documents, tool results — enters a prompt. Twelve specialists then probe prompt injection, jailbreaks, system-prompt and secret leakage, insecure output handling, tool/agent agency, RAG grounding, hallucination, evals, and cost, each finding mapped to the OWASP LLM Top 10 and severity-scored P0–P3. Every claim is traced to a concrete artifact and survives independent skeptics before it ships.",
      "useCases": [
        {
          "title": "Shipping a RAG support bot",
          "body": "Your assistant answers from internal docs and a shared knowledge base. The audit traces whether retrieval respects per-user permissions, whether the bot abstains or hallucinates when there is no good context, and whether instructions hidden in a retrieved document can override the system prompt (indirect injection)."
        },
        {
          "title": "Giving an agent real tools",
          "body": "Your agent can email, query the database, or call internal APIs on model say-so. The audit checks each tool's blast radius — can it take a destructive or irreversible action without a human gate? — validates the arguments the model generates, and traces every output sink for XSS, SQL, or eval injection."
        },
        {
          "title": "Before scaling a public LLM endpoint",
          "body": "You are about to open an AI feature to untrusted traffic. The audit looks for the per-user and global cost caps that stop runaway spend and abuse, the evals that guard your high-stakes paths, and the provider retention and PII handling you need before user data leaves your machine."
        }
      ],
      "output": "A per-dimension scorecard, a trust-boundary and data-flow map, and verified findings filed as priority-sorted GitHub issues — each with OWASP LLM mapping, a redacted repro, and a concrete before/after fix."
    },
    "de": {
      "tagline": "Prüfe deine LLM-Features so, wie es ein Angreifer und ein ehrlicher Nutzer tun würden.",
      "approach": "Provider- und Framework-agnostisch kartiert dieses Audit zuerst jede Stelle, an der ein LLM aufgerufen wird, und jede Trust-Boundary, an der untrusted Input — Nutzertext, abgerufene Dokumente, Tool-Ergebnisse — in einen Prompt gelangt. Zwölf Spezialisten prüfen dann Prompt-Injection, Jailbreaks, System-Prompt- und Secret-Leakage, Output-Handling, Tool-/Agent-Agency, RAG-Grounding, Halluzination, Evals und Kosten — jeder Befund auf die OWASP LLM Top 10 gemappt und P0–P3 bewertet. Jede Aussage ist auf ein konkretes Artefakt zurückgeführt und übersteht unabhängige Skeptiker, bevor sie eingereicht wird.",
      "useCases": [
        {
          "title": "RAG-Support-Bot ausliefern",
          "body": "Dein Assistent antwortet aus internen Docs und einer geteilten Knowledge-Base. Das Audit prüft, ob das Retrieval die Berechtigungen pro Nutzer respektiert, ob der Bot bei fehlendem Kontext abbricht oder halluziniert und ob in einem abgerufenen Dokument versteckte Anweisungen den System-Prompt überschreiben können (indirekte Injection)."
        },
        {
          "title": "Einem Agenten echte Tools geben",
          "body": "Dein Agent kann auf Modell-Geheiß E-Mails senden, die Datenbank abfragen oder interne APIs aufrufen. Das Audit prüft den Blast-Radius jedes Tools — kann es eine destruktive oder irreversible Aktion ohne Human-Gate auslösen? —, validiert die vom Modell erzeugten Argumente und verfolgt jeden Output-Sink auf XSS, SQL oder eval-Injection."
        },
        {
          "title": "Vor dem Skalieren eines öffentlichen LLM-Endpoints",
          "body": "Du öffnest ein KI-Feature gleich für untrusted Traffic. Das Audit sucht die Cost-Caps pro Nutzer und global, die Runaway-Spend und Missbrauch stoppen, die Evals, die deine High-Stakes-Pfade absichern, und das Provider-Retention- und PII-Handling, das du brauchst, bevor Nutzerdaten deine Maschine verlassen."
        }
      ],
      "output": "Eine Scorecard pro Dimension, eine Trust-Boundary- und Data-Flow-Map und verifizierte Befunde als nach Priorität sortierte GitHub-Issues — jedes mit OWASP-LLM-Mapping, redigiertem Repro und konkretem Vorher/Nachher-Fix."
    }
  },
  "compliance-privacy": {
    "en": {
      "tagline": "Finds where you process personal data without a lawful basis, consent, or a way to delete it.",
      "approach": "Primary lens is GDPR, extended to ePrivacy, the EU AI Act, and CCPA where they apply. A swarm of specialist agents builds a verified data-flow / RoPA map, then checks lawful basis, consent and cookies, transparency, data-subject rights, retention, international transfers, processor contracts, and breach readiness. Consent is verified by network trace, not the banner UI, and erasure and access rights are checked end-to-end in code; every finding cites a specific article and a file, table, cookie, or policy clause.",
      "useCases": [
        {
          "title": "Cookie banner that lies",
          "body": "Marketing ships a consent banner, but analytics and ad pixels still fire on first load. A network trace catches every non-essential tag that runs before opt-in, names the line that injects it, and maps it to ePrivacy and Art. 6 with a gate-before-consent fix."
        },
        {
          "title": "A user files a deletion request",
          "body": "Support promises erasure in the privacy policy, but no one has traced where the data actually lives. The audit follows each personal-data category and flags where deletion fails to propagate to backups, logs, or third-party processors, against Art. 17."
        },
        {
          "title": "Shipping an AI feature in the EU",
          "body": "A new profiling or LLM feature goes live without a DPIA or an EU AI Act risk tier. The audit classifies the feature, checks Art. 22 safeguards and AI-transparency duties, and traces whether the data leaves the EEA without a valid transfer mechanism."
        }
      ],
      "output": "A per-dimension scorecard, a verified data-flow / RoPA map, and a priority-sorted findings register where each finding cites its article and ships a concrete before/after fix, turned into German GitHub issues under one tracking issue."
    },
    "de": {
      "tagline": "Findet, wo du personenbezogene Daten ohne Rechtsgrundlage, Consent oder Loeschmoeglichkeit verarbeitest.",
      "approach": "Primaere Linse ist die DSGVO, erweitert um ePrivacy, den EU AI Act und CCPA, wo sie greifen. Ein Schwarm spezialisierter Agents baut eine verifizierte Data-Flow- / RoPA-Karte und prueft dann Rechtsgrundlage, Consent und Cookies, Transparenz, Betroffenenrechte, Aufbewahrung, Drittlandtransfers, Auftragsverarbeiter-Vertraege und Breach-Readiness. Consent wird per Network-Trace geprueft, nicht ueber das Banner-UI, und Loesch- und Auskunftsrechte werden End-to-End im Code verifiziert; jeder Befund zitiert einen konkreten Artikel und ein File, eine Tabelle, ein Cookie oder eine Policy-Klausel.",
      "useCases": [
        {
          "title": "Cookie-Banner, das luegt",
          "body": "Marketing liefert ein Consent-Banner aus, aber Analytics- und Ad-Pixel feuern trotzdem beim ersten Laden. Ein Network-Trace faengt jeden nicht-essenziellen Tag, der vor dem Opt-in laeuft, benennt die Zeile, die ihn injiziert, und mappt ihn auf ePrivacy und Art. 6 mit einem Gate-before-Consent-Fix."
        },
        {
          "title": "Ein Nutzer stellt einen Loeschantrag",
          "body": "Der Support verspricht Loeschung in der Datenschutzerklaerung, aber niemand hat verfolgt, wo die Daten wirklich liegen. Das Audit folgt jeder Kategorie personenbezogener Daten und zeigt, wo die Loeschung nicht bis in Backups, Logs oder Drittanbieter durchschlaegt, gemessen an Art. 17."
        },
        {
          "title": "AI-Feature-Launch in der EU",
          "body": "Ein neues Profiling- oder LLM-Feature geht ohne DPIA und ohne EU-AI-Act-Risikoklasse live. Das Audit klassifiziert das Feature, prueft Art.-22-Schutzmassnahmen und AI-Transparenzpflichten und verfolgt, ob die Daten ohne gueltigen Transfermechanismus den EWR verlassen."
        }
      ],
      "output": "Eine Scorecard je Dimension, eine verifizierte Data-Flow- / RoPA-Karte und ein nach Prioritaet sortiertes Befundregister, in dem jeder Befund seinen Artikel zitiert und einen konkreten Before/After-Fix liefert, ueberfuehrt in deutsche GitHub-Issues unter einem Tracking-Issue."
    }
  },
  "accessibility": {
    "en": {
      "tagline": "Audit your product against WCAG 2.2 AA with evidence and a conformance verdict.",
      "approach": "A swarm of specialists each own one slice of the disability experience — keyboard, screen reader, focus, contrast, forms, zoom and reflow, target size, motion, and cognitive load. Every finding cites a concrete artifact (a DOM selector, a computed accessible name, a contrast ratio with both hex values, a keyboard sequence) and maps to a specific WCAG Success Criterion and level. It runs automated scanners and manual checks, then produces a VPAT-ready conformance table that names what automation can't catch.",
      "useCases": [
        {
          "title": "EU Accessibility Act deadline",
          "body": "The EAA is in force and you need a conformance verdict for the Accessibility Statement, not a vague to-do list. This audit produces a WCAG 2.2 AA pass/partial/fail verdict with a VPAT-ready conformance table and names your concrete legal exposure under the EAA, ADA, and EN 301 549."
        },
        {
          "title": "Design-system component review",
          "body": "One shared button or modal that fails on accessibility breaks every page that uses it. The audit deduplicates to the root component instead of filing the same issue 40 times, and flags compound barriers — like a missing focus indicator combined with SPA route-change focus loss — that strand keyboard and screen-reader users."
        },
        {
          "title": "Keyboard-only and screen-reader paths",
          "body": "Your app looks fine with a mouse, but you've never walked it with the keyboard or a screen reader. This audit verifies tab order against visual order, catches keyboard traps and unlabeled controls, checks that focus moves and restores in modals and on route changes, and confirms async updates and errors are actually announced."
        }
      ],
      "output": "A conformance verdict and VPAT-ready WCAG 2.2 table, a per-dimension scorecard, and priority-sorted GitHub issues — each mapped to its Success Criterion with a before/after fix and re-audit criterion."
    },
    "de": {
      "tagline": "Prüfe dein Produkt gegen WCAG 2.2 AA — mit Belegen und einem Konformitätsurteil.",
      "approach": "Ein Schwarm von Spezialisten übernimmt je einen Ausschnitt der Disability-Experience — Tastatur, Screenreader, Fokus, Kontrast, Formulare, Zoom und Reflow, Target-Size, Motion und kognitive Last. Jeder Befund nennt ein konkretes Artefakt (einen DOM-Selektor, den berechneten Accessible Name, ein Kontrastverhältnis mit beiden Hex-Werten, eine Tastatur-Sequenz) und ist auf ein konkretes WCAG-Success-Criterion samt Level gemappt. Es laufen automatische Scanner und manuelle Checks, dann entsteht eine VPAT-fertige Konformitätstabelle, die benennt, was Automatisierung nicht findet.",
      "useCases": [
        {
          "title": "Deadline European Accessibility Act",
          "body": "Der EAA ist in Kraft und du brauchst ein Konformitätsurteil für die Barrierefreiheitserklärung, keine vage To-do-Liste. Dieses Audit liefert ein WCAG-2.2-AA-Urteil (pass/partial/fail) mit VPAT-fertiger Konformitätstabelle und benennt deine konkrete rechtliche Exposition unter EAA, ADA und EN 301 549."
        },
        {
          "title": "Design-System-Komponente prüfen",
          "body": "Ein geteilter Button oder Modal, der bei Barrierefreiheit durchfällt, bricht jede Seite, die ihn nutzt. Das Audit dedupliziert auf die Wurzel-Komponente, statt dasselbe Issue 40-mal einzureichen, und markiert Compound-Barrieren — etwa fehlender Fokus-Indikator kombiniert mit Fokus-Verlust beim SPA-Routenwechsel — die Tastatur- und Screenreader-User stranden lassen."
        },
        {
          "title": "Tastatur- und Screenreader-Pfade",
          "body": "Mit der Maus sieht deine App gut aus, aber du bist sie nie mit Tastatur oder Screenreader durchgegangen. Dieses Audit prüft die Tab-Reihenfolge gegen die visuelle Ordnung, findet Keyboard-Traps und unbeschriftete Controls, checkt, dass Fokus in Modals und bei Routenwechseln gesetzt und zurückgegeben wird, und bestätigt, dass async Updates und Fehler tatsächlich announced werden."
        }
      ],
      "output": "Ein Konformitätsurteil plus VPAT-fertige WCAG-2.2-Tabelle, eine Scorecard pro Dimension und nach Priorität sortierte GitHub-Issues — jedes auf sein Success Criterion gemappt, mit Vorher/Nachher-Fix und Re-Audit-Kriterium."
    }
  },
  "documentation": {
    "en": {
      "tagline": "Checks your docs against the standard and against the code that proves them right or wrong.",
      "approach": "Specialist agents walk each critical reader journey with docs only, then verify every claim against reality: documented commands run against the scripts, env vars are checked against what the code reads, and code samples are traced or executed. It scores head-matter, onboarding, doc-code drift, writing quality, and Diátaxis fit on a 0-100 rubric, judging each page against the job it is meant to do.",
      "output": "A rubric scorecard with grade band plus a drift register and prioritized German GitHub issues, each with a before/after fix.",
      "useCases": [
        {
          "title": "Before open-sourcing a repo",
          "body": "You are about to make a repo public and the README is your front door. The audit walks clone-to-first-green-test as a new reader, names the exact step where they get stuck, and flags the missing value line, badge row, management summary, and architecture diagram."
        },
        {
          "title": "After a refactor renamed things",
          "body": "A refactor renamed scripts, env vars, and module paths, but the docs still describe the old names. The audit tests documented commands against package.json, env vars against what the code reads, and .env.example against reality, returning a drift register that cites both the doc and the code line for every mismatch."
        },
        {
          "title": "Handing a service to on-call",
          "body": "You are giving another team the pager for a service they did not build. The audit checks the runbooks, rollback steps, and reference docs against the actual infra and API surface, so a wrong rollback step or an undocumented required config surfaces as a P0/P1 before 3am does."
        }
      ]
    },
    "de": {
      "tagline": "Prüft deine Doku gegen den Standard und gegen den Code, der sie bestätigt oder widerlegt.",
      "approach": "Spezialisten-Agents gehen jede kritische Leser-Journey nur mit der Doku durch und verifizieren dann jede Aussage gegen die Realität: dokumentierte Commands laufen gegen die Scripts, Env-Variablen werden gegen den lesenden Code geprüft, Code-Beispiele werden nachvollzogen oder ausgeführt. Bewertet werden Repo-Kopf, Onboarding, Doc-Code-Drift, Schreibstil und Diátaxis-Passung auf einer 0-100-Rubrik — jede Seite gemessen an dem Job, den sie erfüllen soll.",
      "output": "Eine Rubrik-Scorecard mit Notenband plus ein Drift-Register und priorisierte deutsche GitHub-Issues, jedes mit einem Vorher/Nachher-Fix.",
      "useCases": [
        {
          "title": "Vor dem Open-Sourcing",
          "body": "Du machst ein Repo öffentlich, und das README ist die Eingangstür. Das Audit geht Clone bis erster grüner Test als neuer Leser durch, nennt den genauen Schritt, an dem er hängenbleibt, und markiert fehlende Value-Line, Badge-Reihe, Management-Summary und Architektur-Diagramm."
        },
        {
          "title": "Nach einem Refactor mit Umbenennungen",
          "body": "Ein Refactor hat Scripts, Env-Variablen und Modulpfade umbenannt, die Doku beschreibt aber noch die alten Namen. Das Audit testet dokumentierte Commands gegen die package.json, Env-Variablen gegen den lesenden Code und .env.example gegen die Realität — und liefert ein Drift-Register, das für jeden Treffer Doku- und Code-Zeile zitiert."
        },
        {
          "title": "Übergabe eines Service an On-Call",
          "body": "Du gibst einem anderen Team den Pager für einen Service, den es nicht gebaut hat. Das Audit prüft Runbooks, Rollback-Schritte und Referenz-Doku gegen die echte Infra und API-Oberfläche, sodass ein falscher Rollback-Schritt oder eine undokumentierte Pflicht-Config als P0/P1 auftaucht, bevor es um 3 Uhr nachts der Alarm tut."
        }
      ]
    }
  },
  "content": {
    "en": {
      "tagline": "Challenges the idea, not just the prose — and rewrites what fails.",
      "approach": "It runs your landing page, essay, launch post, or docs prose through fourteen lenses that test one thing: does the idea hold up. It steelmans the strongest counter-argument to your thesis, checks whether the piece meets the reader at their actual awareness stage, measures information gain against best-in-class content, and verifies every checkable claim. Each confirmed finding ships a concrete before/after rewrite, not 'make it punchier'.",
      "useCases": [
        {
          "title": "Before a product launch post",
          "body": "You are about to publish the announcement and a vague superlative or a promise the product can't keep would cost credibility on day one. The audit flags unsupported claims as P0, verifies the figures and capabilities you cite, and hands back anything it could not check so you fix it before it ships."
        },
        {
          "title": "A landing page that doesn't convert",
          "body": "Traffic arrives but bounces, and you can't see why. The audit shows the value proposition buried under three sentences of throat-clearing, copy pitched at the wrong awareness stage, and a missing or unclear call-to-action — each quoted with its location and rewritten in place."
        },
        {
          "title": "An essay that reads clean but says nothing new",
          "body": "Every sentence is correct, yet a reader could predict each point from the title. The audit measures information gain against the best existing pieces for that reader, flags the commodity content, and names where your one genuine, non-obvious insight is under-used."
        }
      ],
      "output": "A 0–100 content scorecard, an explicit thesis verdict, and priority-sorted GitHub issues — each with a quoted passage, a before/after rewrite, and a re-audit criterion."
    },
    "de": {
      "tagline": "Prüft die Idee, nicht nur die Prosa — und schreibt um, was nicht trägt.",
      "approach": "Es schickt deine Landing-Page, deinen Essay, Launch-Post oder deine Docs-Prosa durch vierzehn Linsen, die eine Sache testen: hält die Idee stand. Es steelmant das stärkste Gegenargument zu deiner These, prüft, ob der Text den Leser auf seiner tatsächlichen Awareness-Stage abholt, misst den Information Gain gegen Best-in-class-Content und verifiziert jede überprüfbare Aussage. Jeder bestätigte Befund liefert ein konkretes Before/After-Rewrite, kein „mach es knackiger“.",
      "useCases": [
        {
          "title": "Vor einem Produkt-Launch-Post",
          "body": "Du willst die Ankündigung veröffentlichen, und ein unbelegter Superlativ oder ein Versprechen, das das Produkt nicht hält, würde am ersten Tag Glaubwürdigkeit kosten. Das Audit markiert unbelegte Behauptungen als P0, verifiziert die Zahlen und Fähigkeiten, die du nennst, und gibt dir alles Unüberprüfbare zurück, damit du es vor dem Launch klärst."
        },
        {
          "title": "Eine Landing-Page, die nicht konvertiert",
          "body": "Traffic kommt an, springt aber ab, und du siehst nicht warum. Das Audit zeigt die Value Proposition unter drei Sätzen Throat-Clearing begraben, Copy auf der falschen Awareness-Stage und einen fehlenden oder unklaren Call-to-Action — jeden mit Fundstelle zitiert und direkt umgeschrieben."
        },
        {
          "title": "Ein Essay, der sauber liest, aber nichts Neues sagt",
          "body": "Jeder Satz stimmt, doch der Leser kann jeden Punkt aus dem Titel vorhersagen. Das Audit misst den Information Gain gegen die besten existierenden Texte für diesen Leser, markiert den Commodity-Content und benennt, wo dein einziger echter, nicht-offensichtlicher Insight zu wenig genutzt ist."
        }
      ],
      "output": "Eine 0–100-Content-Scorecard, ein expliziter Thesen-Verdict und nach Priorität sortierte GitHub-Issues — jedes mit zitierter Passage, Before/After-Rewrite und Re-Audit-Kriterium."
    }
  },
  "lean": {
    "en": {
      "tagline": "Find the bloat, dead code, and unused dependencies — without deleting anything load-bearing.",
      "approach": "A read-only leanness audit across five dimensions: dependency transparency and supply chain, dead code and orphan files, duplication, AI slop and defensive boilerplate, and over-engineering. It builds an SBOM and a reachability map first, then gates every removal behind Chesterton's Fence and a Resurrector skeptic — so each cut is sorted into remove-now, investigate, deprecate, or protected, never a blind delete.",
      "useCases": [
        {
          "title": "Inheriting an AI-generated codebase",
          "body": "After months of agent-written code, you suspect duplicated utilities, restating-the-code comments, and over-defensive boilerplate but cannot prove it. The audit reports duplication density with both clone locations, flags log-and-continue catch blocks, and names which simplifications are behaviour-equivalent."
        },
        {
          "title": "Trimming the dependency surface before a release",
          "body": "You want to shrink install and supply-chain risk but fear breaking a fresh install. It separates declared-but-unused dependencies from phantom used-but-undeclared ones, explains why every transitive package is present, and checks the lockfile and licenses against policy."
        },
        {
          "title": "Deciding whether dead code is really dead",
          "body": "A static tool flagged unused exports and orphan files, but reflection, dynamic imports, and out-of-repo consumers make you hesitant to delete. The audit traces the reachability map, states which dynamic channels were ruled out, and labels each candidate proven-dead or only suspected-dead."
        }
      ],
      "output": "A leanness scorecard plus prioritized GitHub issues, each with a removal class, the reachability proof, and a before/after fix with a revert note."
    },
    "de": {
      "tagline": "Finde Bloat, dead code und ungenutzte Dependencies — ohne etwas Tragendes zu löschen.",
      "approach": "Ein read-only Schlankheits-Audit über fünf Dimensionen: Dependency-Transparenz und Supply Chain, dead code und Orphan-Files, Duplikation, AI-Slop und defensives Boilerplate, sowie Over-Engineering. Es baut zuerst eine SBOM und eine Reachability-Map, dann gated es jede Entfernung hinter Chesterton's Fence und einem Resurrector-Skeptiker — jeder Schnitt landet in remove-now, investigate, deprecate oder protected, nie ein blindes Löschen.",
      "useCases": [
        {
          "title": "Du übernimmst eine AI-generierte Codebase",
          "body": "Nach Monaten agent-geschriebenem Code vermutest du duplizierte Utilities, Code-wiederholende Kommentare und über-defensives Boilerplate, kannst es aber nicht belegen. Das Audit meldet die Duplikations-Dichte mit beiden Clone-Stellen, markiert log-and-continue Catch-Blöcke und benennt, welche Vereinfachungen verhaltens-äquivalent sind."
        },
        {
          "title": "Dependency-Surface vor einem Release verschlanken",
          "body": "Du willst Install- und Supply-Chain-Risiko senken, fürchtest aber einen kaputten Fresh-Install. Es trennt declared-but-unused Dependencies von Phantom-Deps (used-but-undeclared), erklärt, warum jedes transitive Package da ist, und prüft Lockfile und Lizenzen gegen Policy."
        },
        {
          "title": "Entscheiden, ob dead code wirklich tot ist",
          "body": "Ein statisches Tool hat unused Exports und Orphan-Files markiert, aber Reflection, dynamische Imports und Out-of-Repo-Consumer lassen dich zögern. Das Audit verfolgt die Reachability-Map, nennt die ausgeschlossenen dynamischen Kanäle und labelt jeden Kandidaten als proven-dead oder nur suspected-dead."
        }
      ],
      "output": "Eine Schlankheits-Scorecard plus priorisierte GitHub-Issues, jedes mit Removal-Klasse, dem Reachability-Beleg und einem Vorher/Nachher-Fix samt Revert-Note."
    }
  }
};

export function auditDetail(name: string, lang: Lang): AuditDetail | undefined {
  return AUDIT_DETAILS[name]?.[lang];
}
