import type { ReactNode } from "react";
import { Term } from "../components/term";
import type { Lang } from "./i18n";

type Entry = {
  key: string;
  forms: { en: string[]; de: string[] };
  def: { en: string; de: string };
  /** Case-insensitive match (default false — acronyms match exact case). */
  ci?: boolean;
};

const GLOSSARY: Entry[] = [
  {
    key: "owasp",
    forms: { en: ["OWASP"], de: ["OWASP"] },
    def: {
      en: "Open Worldwide Application Security Project — the reference catalog of web-application security risks.",
      de: "Open Worldwide Application Security Project — der Referenzkatalog für Web-App-Sicherheitsrisiken.",
    },
  },
  {
    key: "cwe",
    forms: { en: ["CWE"], de: ["CWE"] },
    def: {
      en: "Common Weakness Enumeration — a catalog of software weakness types (e.g. CWE-79, XSS).",
      de: "Common Weakness Enumeration — ein Katalog von Software-Schwachstellen-Typen (z. B. CWE-79, XSS).",
    },
  },
  {
    key: "mitre",
    forms: { en: ["MITRE"], de: ["MITRE"] },
    def: {
      en: "MITRE ATT&CK — a knowledge base of real-world attacker tactics and techniques.",
      de: "MITRE ATT&CK — eine Wissensbasis realer Angreifer-Taktiken und -Techniken.",
    },
  },
  {
    key: "cis",
    forms: { en: ["CIS"], de: ["CIS"] },
    def: {
      en: "Center for Internet Security — consensus hardening benchmarks for systems and cloud.",
      de: "Center for Internet Security — Konsens-Härtungs-Benchmarks für Systeme und Cloud.",
    },
  },
  {
    key: "wcag",
    forms: { en: ["WCAG"], de: ["WCAG"] },
    def: {
      en: "Web Content Accessibility Guidelines — the W3C standard for accessible web content.",
      de: "Web Content Accessibility Guidelines — der W3C-Standard für barrierefreie Web-Inhalte.",
    },
  },
  {
    key: "cwv",
    forms: { en: ["CWV"], de: ["CWV"] },
    def: {
      en: "Core Web Vitals — Google's user-experience metrics for loading, interactivity, and visual stability.",
      de: "Core Web Vitals — Googles UX-Metriken für Ladezeit, Interaktivität und visuelle Stabilität.",
    },
  },
  {
    key: "rls",
    forms: { en: ["RLS"], de: ["RLS"] },
    def: {
      en: "Row-Level Security — database rules that limit which rows each user can read or write.",
      de: "Row-Level Security — Datenbankregeln, die einschränken, welche Zeilen ein Nutzer lesen oder schreiben darf.",
    },
  },
  {
    key: "slsa",
    forms: { en: ["SLSA"], de: ["SLSA"] },
    def: {
      en: "Supply-chain Levels for Software Artifacts — a framework for build and supply-chain integrity.",
      de: "Supply-chain Levels for Software Artifacts — ein Framework für Build- und Supply-Chain-Integrität.",
    },
  },
  {
    key: "dora",
    forms: { en: ["DORA"], de: ["DORA"] },
    def: {
      en: "DevOps Research and Assessment — the four key software-delivery performance metrics.",
      de: "DevOps Research and Assessment — die vier zentralen Kennzahlen der Software-Delivery-Performance.",
    },
  },
  {
    key: "sre",
    forms: { en: ["SRE"], de: ["SRE"] },
    def: {
      en: "Site Reliability Engineering — operating systems with engineering, using SLOs and error budgets.",
      de: "Site Reliability Engineering — Systeme mit Engineering betreiben, über SLOs und Error-Budgets.",
    },
  },
  {
    key: "iac",
    forms: { en: ["IaC"], de: ["IaC"] },
    def: {
      en: "Infrastructure as Code — provisioning infrastructure from version-controlled definitions.",
      de: "Infrastructure as Code — Infrastruktur aus versionierten Definitionen bereitstellen.",
    },
  },
  {
    key: "rag",
    forms: { en: ["RAG"], de: ["RAG"] },
    def: {
      en: "Retrieval-Augmented Generation — giving an LLM retrieved documents at query time.",
      de: "Retrieval-Augmented Generation — einem LLM zur Laufzeit abgerufene Dokumente mitgeben.",
    },
  },
  {
    key: "finops",
    forms: { en: ["FinOps"], de: ["FinOps"] },
    def: {
      en: "Cloud financial operations — engineering practices for managing and reducing cloud cost.",
      de: "Cloud Financial Operations — Engineering-Praktiken zur Steuerung und Senkung von Cloud-Kosten.",
    },
  },
  {
    key: "np1",
    forms: { en: ["N+1"], de: ["N+1"] },
    def: {
      en: "An N+1 query: one extra query per row instead of one for the whole set — a common performance trap.",
      de: "Eine N+1-Abfrage: eine Extra-Query pro Zeile statt einer für die ganze Menge — eine häufige Performance-Falle.",
    },
  },
  {
    key: "idempotency",
    forms: { en: ["idempotency"], de: ["Idempotenz"] },
    ci: true,
    def: {
      en: "A property where repeating an operation has the same effect as performing it once.",
      de: "Eine Eigenschaft, bei der das Wiederholen einer Operation denselben Effekt hat wie ein einmaliges Ausführen.",
    },
  },
  {
    key: "diataxis",
    forms: { en: ["Diátaxis"], de: ["Diátaxis"] },
    ci: true,
    def: {
      en: "A documentation framework splitting content into tutorials, how-tos, reference, and explanation.",
      de: "Ein Doku-Framework, das Inhalte in Tutorials, How-tos, Referenz und Erklärung aufteilt.",
    },
  },
  {
    key: "bluf",
    forms: { en: ["BLUF"], de: ["BLUF"] },
    def: {
      en: "Bottom Line Up Front — state the conclusion first, then the supporting detail.",
      de: "Bottom Line Up Front — zuerst das Fazit, dann die Begründung.",
    },
  },
  {
    key: "eeat",
    forms: { en: ["E-E-A-T"], de: ["E-E-A-T"] },
    def: {
      en: "Experience, Expertise, Authoritativeness, Trustworthiness — Google's content-quality signals.",
      de: "Experience, Expertise, Authoritativeness, Trustworthiness — Googles Signale für Content-Qualität.",
    },
  },
  {
    key: "accessible-name",
    forms: { en: ["accessible name"], de: ["Accessible Name"] },
    ci: true,
    def: {
      en: "The text label assistive technology announces for a UI element, derived from its content or attributes.",
      de: "Die Textbezeichnung, die assistive Technik für ein UI-Element ausgibt, abgeleitet aus Inhalt oder Attributen.",
    },
  },
  {
    key: "acid",
    forms: { en: ["ACID"], de: ["ACID"] },
    def: {
      en: "Atomicity, Consistency, Isolation, Durability — the guarantees a database transaction provides.",
      de: "Atomicity, Consistency, Isolation, Durability — die Garantien, die eine Datenbank-Transaktion bietet.",
    },
  },
  {
    key: "ada",
    forms: { en: ["ADA"], de: ["ADA"] },
    def: {
      en: "Americans with Disabilities Act — the US civil-rights law that mandates accessibility, including for digital services.",
      de: "Americans with Disabilities Act — das US-Bürgerrechtsgesetz, das Barrierefreiheit auch für digitale Dienste vorschreibt.",
    },
  },
  {
    key: "ai-slop",
    forms: { en: ["AI slop"], de: ["AI-Slop"] },
    def: {
      en: "Low-value, redundant code or text that AI agents generate in bulk without adding real substance.",
      de: "Minderwertiger, redundanter Code oder Text, den KI-Agenten in Masse erzeugen, ohne echten Mehrwert zu schaffen.",
    },
  },
  {
    key: "attack-surface",
    forms: { en: ["attack surface", "attack-surface"], de: ["Angriffsfläche", "Attack-Surface"] },
    ci: true,
    def: {
      en: "The full set of points where an attacker can try to enter or extract data from a system.",
      de: "Die Gesamtheit der Punkte, an denen ein Angreifer in ein System eindringen oder Daten abziehen kann.",
    },
  },
  {
    key: "awareness-stage",
    forms: { en: ["awareness stage"], de: ["Awareness-Stage"] },
    ci: true,
    def: {
      en: "How much a reader already knows about the problem and solution, from unaware to most aware.",
      de: "Awareness-Stage — wie viel ein Leser über Problem und Lösung schon weiß, von ahnungslos bis voll informiert.",
    },
  },
  {
    key: "backoff",
    forms: { en: ["backoff"], de: ["Backoff"] },
    ci: true,
    def: {
      en: "Waiting progressively longer between retries so a struggling dependency can recover.",
      de: "Das zunehmend längere Warten zwischen Retries, damit sich eine angeschlagene Dependency erholen kann.",
    },
  },
  {
    key: "backpressure",
    forms: { en: ["backpressure"], de: ["Backpressure"] },
    ci: true,
    def: {
      en: "A signal that slows a fast producer so a slower consumer is not overwhelmed.",
      de: "Ein Signal, das einen schnellen Produzenten bremst, damit ein langsamerer Konsument nicht überlastet wird.",
    },
  },
  {
    key: "blast-radius",
    forms: { en: ["blast-radius", "blast radius"], de: ["Blast-Radius"] },
    ci: true,
    def: {
      en: "The set of systems and data affected when one component fails or is compromised.",
      de: "Die Menge an Systemen und Daten, die betroffen ist, wenn eine Komponente ausfällt oder kompromittiert wird.",
    },
  },
  {
    key: "bola",
    forms: { en: ["BOLA"], de: ["BOLA"] },
    def: {
      en: "Broken Object Level Authorization — an API serves an object without checking the caller may access it.",
      de: "Broken Object Level Authorization — eine API liefert ein Objekt, ohne zu prüfen, ob der Aufrufer darauf zugreifen darf.",
    },
  },
  {
    key: "cap",
    forms: { en: ["CAP"], de: ["CAP"] },
    def: {
      en: "Consistency, Availability, Partition tolerance — a distributed store can fully hold only two at once.",
      de: "Consistency, Availability, Partition tolerance — ein verteilter Speicher kann nur zwei davon zugleich voll erfüllen.",
    },
  },
  {
    key: "ccpa",
    forms: { en: ["CCPA"], de: ["CCPA"] },
    def: {
      en: "California Consumer Privacy Act — the California law granting consumers rights over their personal data.",
      de: "California Consumer Privacy Act — das kalifornische Gesetz, das Verbrauchern Rechte an ihren personenbezogenen Daten gibt.",
    },
  },
  {
    key: "chestertons-fence",
    forms: { en: ["Chesterton's Fence"], de: ["Chesterton's Fence"] },
    def: {
      en: "The principle that you should not remove something until you understand why it was put there.",
      de: "Das Prinzip, etwas erst zu entfernen, wenn man versteht, warum es ueberhaupt da ist.",
    },
  },
  {
    key: "circuit-breaker",
    forms: { en: ["circuit breakers"], de: ["Circuit Breaker"] },
    ci: true,
    def: {
      en: "A guard that stops calling a failing dependency for a while, so failures don't pile up.",
      de: "Ein Schutzmechanismus, der Aufrufe an eine ausfallende Dependency vorübergehend stoppt, damit sich Fehler nicht stauen.",
    },
  },
  {
    key: "commodity-content",
    forms: { en: ["commodity content"], de: ["Commodity-Content"] },
    ci: true,
    def: {
      en: "Generic, interchangeable writing that repeats what is widely available and offers nothing distinctive.",
      de: "Commodity-Content — generischer, austauschbarer Text, der bereits Verbreitetes wiederholt und nichts Eigenes bietet.",
    },
  },
  {
    key: "cro",
    forms: { en: ["CRO"], de: ["CRO"] },
    def: {
      en: "Conversion Rate Optimization — systematically improving the share of visitors who complete a goal.",
      de: "Conversion Rate Optimization — systematisches Steigern des Anteils der Besucher, die ein Ziel abschließen.",
    },
  },
  {
    key: "cve",
    forms: { en: ["CVE"], de: ["CVEs"] },
    def: {
      en: "Common Vulnerabilities and Exposures — a public registry of unique IDs for known security flaws.",
      de: "Common Vulnerabilities and Exposures — ein öffentliches Register eindeutiger IDs für bekannte Sicherheitslücken.",
    },
  },
  {
    key: "cvss",
    forms: { en: ["CVSS"], de: ["CVSS"] },
    def: {
      en: "Common Vulnerability Scoring System — a 0–10 standard for rating a vulnerability's severity.",
      de: "Common Vulnerability Scoring System — ein 0–10-Standard zur Bewertung der Schwere einer Schwachstelle.",
    },
  },
  {
    key: "dark-patterns",
    forms: { en: ["dark patterns"], de: ["Dark Patterns"] },
    ci: true,
    def: {
      en: "Interface designs that manipulate users into choices they would not otherwise make.",
      de: "Interface-Designs, die Nutzer zu Entscheidungen drängen, die sie sonst nicht treffen würden.",
    },
  },
  {
    key: "data-subject-rights",
    forms: { en: ["data-subject rights"], de: ["Betroffenenrechte"] },
    ci: true,
    def: {
      en: "The rights the GDPR gives individuals over their data, such as access, erasure, and portability.",
      de: "Die Rechte (data-subject rights), die die DSGVO Personen über ihre Daten gibt, etwa Auskunft, Löschung und Portabilität.",
    },
  },
  {
    key: "dead-code",
    forms: { en: ["dead code"], de: ["dead code", "toter Code"] },
    ci: true,
    def: {
      en: "Code that can never execute or is never referenced, so removing it changes nothing.",
      de: "Code, der nie ausgefuehrt oder referenziert wird, sodass sein Entfernen nichts veraendert.",
    },
  },
  {
    key: "disaster-recovery",
    forms: { en: ["DR"], de: ["DR"] },
    def: {
      en: "Disaster Recovery — the plan and tooling to restore systems and data after a major outage.",
      de: "Disaster Recovery — Notfallwiederherstellung: Plan und Werkzeuge, um Systeme und Daten nach einem schweren Ausfall wiederherzustellen.",
    },
  },
  {
    key: "doc-code-drift",
    forms: { en: ["doc-code drift", "doc–code drift"], de: ["Doc-Code-Drift"] },
    ci: true,
    def: {
      en: "Divergence between what the documentation says and what the code actually does.",
      de: "Die Abweichung zwischen dem, was die Doku sagt, und dem, was der Code tatsächlich tut.",
    },
  },
  {
    key: "dpia",
    forms: { en: ["DPIA"], de: ["DPIA"] },
    def: {
      en: "Data Protection Impact Assessment — a GDPR-required risk analysis for high-risk processing of personal data.",
      de: "Data Protection Impact Assessment (Datenschutz-Folgenabschätzung) — die von der DSGVO geforderte Risikoanalyse für risikoreiche Verarbeitung.",
    },
  },
  {
    key: "dx",
    forms: { en: ["DX"], de: ["DX"] },
    def: {
      en: "Developer Experience — how easy and pleasant an API is for developers to learn and use.",
      de: "Developer Experience — wie leicht und angenehm eine API für Entwickler zu lernen und zu nutzen ist.",
    },
  },
  {
    key: "eaa",
    forms: { en: ["EAA"], de: ["EAA"] },
    def: {
      en: "European Accessibility Act — the EU law (Directive 2019/882) requiring many products and services to be accessible.",
      de: "European Accessibility Act — das EU-Gesetz (Richtlinie 2019/882), das viele Produkte und Dienste zur Barrierefreiheit verpflichtet.",
    },
  },
  {
    key: "en-301-549",
    forms: { en: ["EN 301 549"], de: ["EN 301 549"] },
    def: {
      en: "The European accessibility standard for ICT products and services, referenced by the EAA.",
      de: "Der europäische Standard für die Barrierefreiheit von IKT-Produkten und -Diensten, auf den der EAA verweist.",
    },
  },
  {
    key: "encryption-at-rest",
    forms: { en: ["encryption at rest"], de: ["Encryption at Rest"] },
    ci: true,
    def: {
      en: "Encrypting stored data so it stays unreadable if the disk or backup is stolen.",
      de: "Das Verschlüsseln gespeicherter Daten, damit sie unlesbar bleiben, wenn Datenträger oder Backup gestohlen werden.",
    },
  },
  {
    key: "eprivacy",
    forms: { en: ["ePrivacy"], de: ["ePrivacy"] },
    def: {
      en: "EU ePrivacy Directive — rules on cookies, tracking, and electronic communications, alongside the GDPR.",
      de: "ePrivacy Directive (ePrivacy-Richtlinie) — EU-Regeln zu Cookies, Tracking und elektronischer Kommunikation, neben der DSGVO.",
    },
  },
  {
    key: "eu-ai-act",
    forms: { en: ["EU AI Act"], de: ["EU AI Act", "EU-AI-Act"] },
    def: {
      en: "EU Artificial Intelligence Act — the EU regulation classifying and governing AI systems by risk.",
      de: "EU Artificial Intelligence Act (KI-Verordnung) — die EU-Verordnung, die KI-Systeme nach Risiko klassifiziert und reguliert.",
    },
  },
  {
    key: "eval-injection",
    forms: { en: ["eval injection"], de: ["eval-Injection"] },
    ci: true,
    def: {
      en: "Feeding untrusted text into a code-evaluation call so it executes as program code.",
      de: "Untrusted Text in einen Code-Evaluierungs-Aufruf geben, sodass er als Programmcode ausgeführt wird.",
    },
  },
  {
    key: "evals",
    forms: { en: ["evals"], de: ["Evals"] },
    ci: true,
    def: {
      en: "Repeatable test suites that measure an LLM feature's quality and safety on known cases.",
      de: "Wiederholbare Test-Suiten, die Qualität und Sicherheit eines LLM-Features an bekannten Fällen messen.",
    },
  },
  {
    key: "expand-contract-migration",
    forms: { en: ["expand/contract"], de: ["Expand/Contract"] },
    ci: true,
    def: {
      en: "A migration done in phases — add the new shape, backfill, switch over, then drop the old — so it stays reversible.",
      de: "Eine Migration in Phasen — neue Form anlegen, backfillen, umschalten, Altes entfernen — damit sie reversibel bleibt.",
    },
  },
  {
    key: "exploitability",
    forms: { en: ["exploitability"], de: ["Exploitability"] },
    ci: true,
    def: {
      en: "How realistically and easily an attacker can actually abuse a given vulnerability.",
      de: "Wie realistisch und leicht ein Angreifer eine Schwachstelle tatsächlich ausnutzen kann.",
    },
  },
  {
    key: "foreign-key",
    forms: { en: ["FK"], de: ["FK"] },
    def: {
      en: "Foreign Key — a column whose values must reference an existing row in another table.",
      de: "Foreign Key — eine Spalte, deren Werte auf eine bestehende Zeile einer anderen Tabelle verweisen müssen.",
    },
  },
  {
    key: "gdpr",
    forms: { en: ["GDPR"], de: ["DSGVO", "GDPR"] },
    def: {
      en: "General Data Protection Regulation — the EU law governing how personal data may be processed.",
      de: "General Data Protection Regulation (DSGVO) — das EU-Gesetz, das die Verarbeitung personenbezogener Daten regelt.",
    },
  },
  {
    key: "grpc",
    forms: { en: ["gRPC"], de: ["gRPC"] },
    def: {
      en: "gRPC Remote Procedure Calls — a high-performance RPC framework using Protocol Buffers over HTTP/2.",
      de: "gRPC Remote Procedure Calls — ein performantes RPC-Framework, das Protocol Buffers über HTTP/2 nutzt.",
    },
  },
  {
    key: "hallucination",
    forms: { en: ["hallucination"], de: ["Halluzination"] },
    ci: true,
    def: {
      en: "A model output that states fabricated or unsupported information as if it were fact.",
      de: "Eine Modell-Ausgabe, die erfundene oder unbelegte Information als Tatsache darstellt.",
    },
  },
  {
    key: "high-availability",
    forms: { en: ["high availability", "HA"], de: ["High Availability", "HA"] },
    ci: true,
    def: {
      en: "High Availability — designing a system to keep running through component failures, with minimal downtime.",
      de: "High Availability — Hochverfügbarkeit: ein System so auslegen, dass es Komponentenausfälle mit minimaler Downtime übersteht.",
    },
  },
  {
    key: "i18n",
    forms: { en: ["i18n"], de: ["i18n"] },
    def: {
      en: "Internationalization — designing software so it adapts to different languages and regions.",
      de: "Internationalization — Software so gestalten, dass sie sich an verschiedene Sprachen und Regionen anpasst.",
    },
  },
  {
    key: "iam",
    forms: { en: ["IAM"], de: ["IAM"] },
    def: {
      en: "Identity and Access Management — the system governing who may do what on which resources.",
      de: "Identity and Access Management — das System, das regelt, wer was auf welchen Ressourcen darf.",
    },
  },
  {
    key: "idor",
    forms: { en: ["IDOR"], de: ["IDOR"] },
    def: {
      en: "Insecure Direct Object Reference — accessing another user's data by changing an ID the server fails to authorize.",
      de: "Insecure Direct Object Reference — fremde Daten abrufen, indem man eine ID ändert, die der Server nicht prüft.",
    },
  },
  {
    key: "indirect-injection",
    forms: { en: ["indirect injection"], de: ["indirekte Injection"] },
    ci: true,
    def: {
      en: "Prompt injection where the malicious instructions arrive via retrieved content rather than the user.",
      de: "Prompt-Injection, bei der die bösartigen Anweisungen über abgerufene Inhalte statt vom Nutzer kommen.",
    },
  },
  {
    key: "information-gain",
    forms: { en: ["information gain"], de: ["Information Gain"] },
    ci: true,
    def: {
      en: "How much genuinely new or useful information a piece adds beyond what comparable content already covers.",
      de: "Information Gain — wie viel echten Mehrwert ein Text gegenüber vergleichbaren Inhalten bietet.",
    },
  },
  {
    key: "jailbreak",
    forms: { en: ["jailbreaks"], de: ["Jailbreaks"] },
    ci: true,
    def: {
      en: "A prompt crafted to bypass a model's safety guardrails and make it produce restricted output.",
      de: "Ein Prompt, der die Sicherheits-Leitplanken eines Modells umgeht, um eingeschränkte Ausgaben zu erzwingen.",
    },
  },
  {
    key: "jitter",
    forms: { en: ["jitter"], de: ["Jitter"] },
    ci: true,
    def: {
      en: "Random variation added to retry timing so many clients don't retry in the same instant.",
      de: "Eine zufällige Schwankung im Retry-Timing, damit nicht viele Clients gleichzeitig erneut versuchen.",
    },
  },
  {
    key: "jwt",
    forms: { en: ["JWT"], de: ["JWT"] },
    def: {
      en: "JSON Web Token — a signed, self-contained token carrying claims about a user or session.",
      de: "JSON Web Token — ein signiertes, eigenständiges Token mit Claims über einen Nutzer oder eine Session.",
    },
  },
  {
    key: "kubernetes",
    forms: { en: ["Kubernetes", "k8s"], de: ["Kubernetes", "k8s"] },
    def: {
      en: "An open-source platform that automates deploying, scaling, and running containerized applications.",
      de: "Eine Open-Source-Plattform, die das Deployen, Skalieren und Betreiben containerisierter Anwendungen automatisiert.",
    },
  },
  {
    key: "lawful-basis",
    forms: { en: ["lawful basis"], de: ["Rechtsgrundlage"] },
    ci: true,
    def: {
      en: "The legal ground under the GDPR that justifies processing personal data, such as consent or contract.",
      de: "Die rechtliche Grundlage (lawful basis) nach der DSGVO, die eine Verarbeitung personenbezogener Daten rechtfertigt, etwa Einwilligung oder Vertrag.",
    },
  },
  {
    key: "load-shedding",
    forms: { en: ["load shedding"], de: ["Load Shedding"] },
    ci: true,
    def: {
      en: "Deliberately dropping or rejecting some requests under overload to keep the rest healthy.",
      de: "Das bewusste Verwerfen oder Ablehnen einiger Requests unter Überlast, damit der Rest stabil bleibt.",
    },
  },
  {
    key: "multi-tenant",
    forms: { en: ["Multi-tenant"], de: ["Multi-Tenant"] },
    ci: true,
    def: {
      en: "An architecture where one system instance serves many customers while keeping their data isolated.",
      de: "Eine Architektur, in der eine Systeminstanz viele Kunden bedient und deren Daten isoliert hält.",
    },
  },
  {
    key: "nist-ai-rmf",
    forms: { en: ["NIST AI RMF"], de: ["NIST AI RMF"] },
    def: {
      en: "NIST AI Risk Management Framework — the U.S. standard for governing AI system risk.",
      de: "NIST AI Risk Management Framework — der US-Standard zur Steuerung von Risiken in KI-Systemen.",
    },
  },
  {
    key: "openapi",
    forms: { en: ["OpenAPI"], de: ["OpenAPI"] },
    def: {
      en: "OpenAPI Specification — a standard, language-agnostic description format for HTTP APIs.",
      de: "OpenAPI Specification — ein standardisiertes, sprachunabhängiges Beschreibungsformat für HTTP-APIs.",
    },
  },
  {
    key: "optimistic-concurrency",
    forms: { en: ["optimistic concurrency"], de: ["Optimistic Concurrency"] },
    ci: true,
    def: {
      en: "A control method that detects conflicting concurrent writes via a version check instead of locking.",
      de: "Eine Kontrollmethode, die konkurrierende Schreibzugriffe per Versionsprüfung statt per Sperre erkennt.",
    },
  },
  {
    key: "orphan-files",
    forms: { en: ["orphan files"], de: ["Orphan-Files"] },
    ci: true,
    def: {
      en: "Files that no other part of the codebase imports or references, so nothing reaches them.",
      de: "Dateien, die kein anderer Teil des Codes importiert oder referenziert und die niemand mehr erreicht.",
    },
  },
  {
    key: "orphan-rows",
    forms: { en: ["orphaned", "orphans"], de: ["verwaisten", "Orphans"] },
    ci: true,
    def: {
      en: "Rows whose referenced parent record no longer exists, leaving a dangling reference.",
      de: "Zeilen, deren referenzierter Eltern-Datensatz nicht mehr existiert und so einen ins Leere zeigenden Verweis hinterlassen.",
    },
  },
  {
    key: "owasp-llm-top-10",
    forms: { en: ["OWASP LLM Top 10"], de: ["OWASP LLM Top 10"] },
    def: {
      en: "OWASP Top 10 for LLM Applications — the reference list of the most critical LLM security risks.",
      de: "OWASP Top 10 for LLM Applications — die Referenzliste der kritischsten LLM-Sicherheitsrisiken.",
    },
  },
  {
    key: "phantom-dependency",
    forms: { en: ["phantom deps", "phantom"], de: ["Phantom-Deps"] },
    ci: true,
    def: {
      en: "A package the code actually uses but never declares in the manifest, so it works only by accident.",
      de: "Ein Paket, das der Code nutzt, aber nicht im Manifest deklariert, sodass es nur zufaellig funktioniert.",
    },
  },
  {
    key: "pii",
    forms: { en: ["PII"], de: ["PII"] },
    def: {
      en: "Personally Identifiable Information — data that can identify a specific individual.",
      de: "Personally Identifiable Information — Daten, die eine bestimmte Person identifizieren können.",
    },
  },
  {
    key: "prompt-injection",
    forms: { en: ["prompt injection", "Prompt injection"], de: ["Prompt-Injection"] },
    ci: true,
    def: {
      en: "An attack that smuggles instructions into model input to override or hijack the system prompt.",
      de: "Ein Angriff, der Anweisungen in den Modell-Input schmuggelt, um den System-Prompt zu überschreiben oder zu kapern.",
    },
  },
  {
    key: "pull-request-target",
    forms: { en: ["pull_request_target"], de: ["pull_request_target"] },
    def: {
      en: "A GitHub Actions trigger that runs with repository secrets, risky to expose to untrusted pull requests.",
      de: "Ein GitHub-Actions-Trigger, der mit Repository-Secrets läuft und bei nicht vertrauenswürdigen Pull Requests riskant ist.",
    },
  },
  {
    key: "reachability-map",
    forms: { en: ["reachability map"], de: ["Reachability-Map"] },
    ci: true,
    def: {
      en: "A graph of which code is actually reachable from real entry points, used to prove what is unused.",
      de: "Ein Graph, welcher Code von echten Einstiegspunkten aus erreichbar ist, um Ungenutztes zu belegen.",
    },
  },
  {
    key: "referential-integrity",
    forms: { en: ["referential integrity"], de: ["referenzielle Integrität"] },
    ci: true,
    def: {
      en: "A guarantee that every foreign-key value points to a row that actually exists.",
      de: "Eine Garantie, dass jeder Foreign-Key-Wert auf eine tatsächlich existierende Zeile zeigt.",
    },
  },
  {
    key: "rfc-9110",
    forms: { en: ["RFC 9110"], de: ["RFC 9110"] },
    def: {
      en: "HTTP Semantics — the standard defining HTTP methods, status codes, and header fields.",
      de: "HTTP Semantics — der Standard, der HTTP-Methoden, Status-Codes und Header-Felder definiert.",
    },
  },
  {
    key: "rfc-9457",
    forms: { en: ["RFC 9457"], de: ["RFC 9457"] },
    def: {
      en: "Problem Details for HTTP APIs — a standard JSON format for machine-readable error responses.",
      de: "Problem Details for HTTP APIs — ein standardisiertes JSON-Format für maschinenlesbare Fehlerantworten.",
    },
  },
  {
    key: "ropa",
    forms: { en: ["RoPA"], de: ["RoPA"] },
    def: {
      en: "Record of Processing Activities — the GDPR-mandated inventory of how an organization processes personal data.",
      de: "Record of Processing Activities (Verzeichnis von Verarbeitungstätigkeiten) — das von der DSGVO geforderte Inventar der Verarbeitung personenbezogener Daten.",
    },
  },
  {
    key: "runbook",
    forms: { en: ["runbooks"], de: ["Runbooks"] },
    ci: true,
    def: {
      en: "A documented, step-by-step procedure for operating a system or handling a specific incident.",
      de: "Eine dokumentierte Schritt-für-Schritt-Anleitung, um ein System zu betreiben oder einen bestimmten Vorfall zu bearbeiten.",
    },
  },
  {
    key: "sbom",
    forms: { en: ["SBOM"], de: ["SBOM"] },
    def: {
      en: "Software Bill of Materials — a complete inventory of the components and dependencies a piece of software ships.",
      de: "Software Bill of Materials — eine vollstaendige Stueckliste aller Komponenten und Dependencies, die eine Software enthaelt.",
    },
  },
  {
    key: "sdl",
    forms: { en: ["SDL"], de: ["SDL"] },
    def: {
      en: "Schema Definition Language — the syntax for declaring a GraphQL API's types and operations.",
      de: "Schema Definition Language — die Syntax zum Deklarieren von Typen und Operationen einer GraphQL-API.",
    },
  },
  {
    key: "slo",
    forms: { en: ["SLOs"], de: ["SLOs"] },
    def: {
      en: "Service Level Objective — a target for a reliability metric, such as 99.9% availability.",
      de: "Service Level Objective — ein Zielwert für eine Zuverlässigkeitsmetrik, etwa 99,9 % Verfügbarkeit.",
    },
  },
  {
    key: "spa",
    forms: { en: ["SPA"], de: ["SPA"] },
    def: {
      en: "Single-Page Application — a web app that updates content via JavaScript without full page reloads.",
      de: "Single-Page Application — eine Web-App, die Inhalte per JavaScript ohne vollständige Seiten-Reloads aktualisiert.",
    },
  },
  {
    key: "spof",
    forms: { en: ["single points of failure"], de: ["Single Points of Failure"] },
    ci: true,
    def: {
      en: "Single Point of Failure — one component whose failure takes down the whole system.",
      de: "Single Point of Failure — eine einzelne Komponente, deren Ausfall das ganze System lahmlegt.",
    },
  },
  {
    key: "steelman",
    forms: { en: ["steelmans"], de: ["steelmant"] },
    ci: true,
    def: {
      en: "Restating an argument in its strongest, most charitable form before critiquing it — the opposite of a strawman.",
      de: "Ein Argument in seiner stärksten, wohlwollendsten Form wiedergeben, bevor man es kritisiert — das Gegenteil eines Strohmanns.",
    },
  },
  {
    key: "success-criterion",
    forms: { en: ["Success Criterion"], de: ["Success Criterion"] },
    def: {
      en: "A single testable WCAG requirement, each with a number and conformance level (A, AA, or AAA).",
      de: "Eine einzelne testbare WCAG-Anforderung, jeweils mit Nummer und Konformitätsstufe (A, AA oder AAA).",
    },
  },
  {
    key: "tls",
    forms: { en: ["TLS"], de: ["TLS"] },
    def: {
      en: "Transport Layer Security — the protocol that encrypts and authenticates network traffic (the S in HTTPS).",
      de: "Transport Layer Security — das Protokoll, das Netzwerkverkehr verschlüsselt und authentifiziert (das S in HTTPS).",
    },
  },
  {
    key: "transitive-dependency",
    forms: { en: ["transitive"], de: ["transitive"] },
    ci: true,
    def: {
      en: "A dependency you don't depend on directly — it is pulled in by one of your direct dependencies.",
      de: "Eine Abhaengigkeit, die nicht direkt, sondern ueber eine deiner direkten Dependencies hereinkommt.",
    },
  },
  {
    key: "trust-boundary",
    forms: { en: ["trust boundaries"], de: ["Trust Boundaries"] },
    ci: true,
    def: {
      en: "A line where data or requests cross between zones of different trust and must be re-validated.",
      de: "Eine Grenze, an der Daten oder Anfragen zwischen Zonen unterschiedlichen Vertrauens wechseln und neu geprüft werden müssen.",
    },
  },
  {
    key: "user-journey",
    forms: { en: ["critical user journeys", "critical journey"], de: ["User Journeys", "kritische Journey"] },
    ci: true,
    def: {
      en: "The end-to-end path a user takes to complete a key task, across screens and steps.",
      de: "Der durchgängige Weg, den ein Nutzer über Screens und Schritte zurücklegt, um eine zentrale Aufgabe abzuschließen.",
    },
  },
  {
    key: "version-drift",
    forms: { en: ["version drift"], de: ["Version-Drift"] },
    ci: true,
    def: {
      en: "The same dependency or runtime pinned to inconsistent versions across configs, workspaces, or environments.",
      de: "Dieselbe Dependency oder Runtime, die über Configs, Workspaces oder Umgebungen hinweg auf inkonsistente Versionen festgelegt ist.",
    },
  },
  {
    key: "vpat",
    forms: { en: ["VPAT"], de: ["VPAT"] },
    def: {
      en: "Voluntary Product Accessibility Template — a standard document reporting how a product conforms to accessibility requirements.",
      de: "Voluntary Product Accessibility Template — ein Standarddokument, das die Barrierefreiheits-Konformität eines Produkts dokumentiert.",
    },
  },
  {
    key: "well-architected",
    forms: { en: ["Well-Architected"], de: ["Well-Architected"] },
    def: {
      en: "AWS Well-Architected Framework — cloud design best practices across reliability, security, cost, and operations.",
      de: "AWS Well-Architected Framework — Best Practices für Cloud-Design über Zuverlässigkeit, Sicherheit, Kosten und Betrieb.",
    },
  },
  {
    key: "xss",
    forms: { en: ["XSS"], de: ["XSS"] },
    def: {
      en: "Cross-Site Scripting — injecting attacker-controlled script that runs in another user's browser.",
      de: "Cross-Site Scripting — Einschleusen von Angreifer-Skript, das im Browser eines anderen Nutzers läuft.",
    },
  },
  {
    key: "yagni",
    forms: { en: ["YAGNI"], de: ["YAGNI"] },
    def: {
      en: "You Aren't Gonna Need It — a principle against building functionality before it is actually required.",
      de: "You Aren't Gonna Need It — ein Prinzip, Funktionalitaet erst zu bauen, wenn sie wirklich gebraucht wird.",
    },
  },
];

const isWord = (c: string) => /[A-Za-z0-9]/.test(c);

/**
 * Wrap the first occurrence of each known glossary term in a Term tooltip.
 * Whole-token matches only (boundary-checked) so acronyms never match inside a
 * longer word; case-sensitive by default. Returns the original string when
 * nothing matched, so it is safe to drop in anywhere.
 */
export function glossify(text: string, lang: Lang): ReactNode {
  const matchers = GLOSSARY.flatMap((e) =>
    e.forms[lang].map((form) => ({
      form,
      lower: form.toLowerCase(),
      def: e.def[lang],
      key: e.key,
      ci: e.ci ?? false,
    })),
  ).sort((a, b) => b.form.length - a.form.length);

  const used = new Set<string>();
  const out: ReactNode[] = [];
  let buf = "";
  let i = 0;

  while (i < text.length) {
    let hit: { form: string; def: string; key: string } | null = null;
    for (const m of matchers) {
      if (used.has(m.key)) continue;
      const slice = text.slice(i, i + m.form.length);
      if (slice.length < m.form.length) continue;
      const eq = m.ci ? slice.toLowerCase() === m.lower : slice === m.form;
      if (!eq) continue;
      const before = i > 0 ? text[i - 1] : "";
      const after = text[i + m.form.length] ?? "";
      if (isWord(m.form[0]) && before && isWord(before)) continue;
      if (isWord(m.form[m.form.length - 1]) && after && isWord(after)) continue;
      hit = { form: slice, def: m.def, key: m.key };
      break;
    }
    if (hit) {
      if (buf) {
        out.push(buf);
        buf = "";
      }
      used.add(hit.key);
      out.push(
        <Term key={`t${i}`} def={hit.def}>
          {hit.form}
        </Term>,
      );
      i += hit.form.length;
    } else {
      buf += text[i];
      i += 1;
    }
  }
  if (buf) out.push(buf);
  return out.length === 1 && typeof out[0] === "string" ? out[0] : out;
}
