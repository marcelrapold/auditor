import { AUDITS, PHASES, PRINCIPLES, STANDARDS, type Audit } from "./content";

export type Lang = "en" | "de";
export const LANGS: Lang[] = ["en", "de"];

// UI chrome strings.
export const ui = {
  en: {
    nav: { use: "Use it", audits: "Audits", how: "How it works", standards: "Standards" },
    skip: "Skip to content",
    heroBadge: "audits · MIT · copy & paste",
    heroTitle: "Turn any AI agent into a swarm of specialist auditors",
    heroSub:
      "An open-source library of master prompts — copy one into your AI coding agent and get back an evidence-bound, adversarially verified audit backlog, filed as GitHub issues led by a priority-sorted tracker.",
    heroCtaGithub: "View on GitHub",
    heroCtaStandard: "Read the standard",
    heroMeta: "evidence-bound · adversarially verified · 30/60/90 roadmap",
    agentEyebrow: "Run it",
    agentTitle: "Point your AI agent at auditor.rapold.io",
    agentLead:
      "No install. Tell your AI coding agent to audit a repo using auditor.rapold.io — it fetches the orchestrator, asks your language and which audits to run, then files the issues.",
    agentCmdVerb: "Audit",
    agentCmdUsing: "using",
    agentExplain:
      "The orchestrator then asks: output language (Deutsch / English), which of the {count} audits (or the full repo), and whether to create issues — then runs them and opens a priority-sorted tracker.",
    agentNotePre: "AI agents: fetch",
    agentNotePost: "and act as the audit orchestrator (ask language + scope, then run).",
    prinEyebrow: "Why it is different",
    prinTitle: "Most audit prompts return unverified opinions. These enforce discipline.",
    audEyebrow: "The library",
    audTitle: "Eleven stack-agnostic audits, one shared methodology",
    audLead:
      "Each is a self-contained master prompt. Run several against the same target and the findings compose cleanly.",
    howEyebrow: "The method",
    howTitle: "Six phases, every time",
    howLead:
      "Recon, a parallel specialist swarm, then adversarial verification before anything reaches the report.",
    stdEyebrow: "The yardsticks",
    stdTitle: "Two normative standards govern the output",
    stdLead:
      "Reusable on their own. They keep every audit's report and issues consistent and measurable.",
    ctaTitle: "Point one at your repo and read the issues",
    ctaLead:
      "Paste a master prompt into your AI coding agent, fill the small config block, and review a priority-sorted backlog of fixes.",
    ctaBtnGet: "Get the prompts",
    ctaBtnQuick: "Quickstart",
    footerLicense: "auditor — MIT licensed",
    footerGithub: "GitHub",
    footerStandard: "Standard",
    footerChangelog: "Changelog",
  },
  de: {
    nav: { use: "Nutzen", audits: "Audits", how: "Ablauf", standards: "Standards" },
    skip: "Zum Inhalt springen",
    heroBadge: "Audits · MIT · copy & paste",
    heroTitle: "Mach aus jedem KI-Agenten einen Schwarm spezialisierter Auditoren",
    heroSub:
      "Eine Open-Source-Bibliothek von Master-Prompts — kopiere einen in deinen KI-Coding-Agenten und bekomme ein belegbasiertes, adversariell verifiziertes Audit-Backlog zurück, als GitHub-Issues mit einem nach Priorität sortierten Tracker.",
    heroCtaGithub: "Auf GitHub ansehen",
    heroCtaStandard: "Standard lesen",
    heroMeta: "belegbasiert · adversariell verifiziert · 30/60/90-Roadmap",
    agentEyebrow: "Loslegen",
    agentTitle: "Richte deinen KI-Agenten auf auditor.rapold.io",
    agentLead:
      "Keine Installation. Sag deinem KI-Coding-Agenten, er soll ein Repo „using auditor.rapold.io“ auditieren — er holt den Orchestrator, fragt Sprache und welche Audits, und legt die Issues an.",
    agentCmdVerb: "Audit",
    agentCmdUsing: "using",
    agentExplain:
      "Der Orchestrator fragt dann: Ausgabesprache (Deutsch / English), welche der {count} Audits (oder das ganze Repo) und ob Issues erstellt werden dürfen — dann führt er sie aus und öffnet einen nach Priorität sortierten Tracker.",
    agentNotePre: "KI-Agenten: hole",
    agentNotePost: "und agiere als Audit-Orchestrator (Sprache + Umfang erfragen, dann ausführen).",
    prinEyebrow: "Warum es anders ist",
    prinTitle: "Die meisten Audit-Prompts liefern unverifizierte Meinungen. Diese erzwingen Disziplin.",
    audEyebrow: "Die Bibliothek",
    audTitle: "Elf stack-agnostische Audits, eine gemeinsame Methodik",
    audLead:
      "Jedes ist ein eigenständiger Master-Prompt. Mehrere gegen dasselbe Ziel laufen lassen — die Befunde fügen sich sauber zusammen.",
    howEyebrow: "Die Methode",
    howTitle: "Sechs Phasen, jedes Mal",
    howLead:
      "Recon, ein paralleler Spezialisten-Schwarm, dann adversarielle Verifikation, bevor irgendetwas in den Bericht kommt.",
    stdEyebrow: "Die Maßstäbe",
    stdTitle: "Zwei normative Standards steuern die Ausgabe",
    stdLead:
      "Für sich allein nutzbar. Sie halten Bericht und Issues jedes Audits konsistent und messbar.",
    ctaTitle: "Auf dein Repo richten und die Issues lesen",
    ctaLead:
      "Master-Prompt in deinen KI-Coding-Agenten einfügen, den kleinen Config-Block ausfüllen und ein nach Priorität sortiertes Backlog an Fixes prüfen.",
    ctaBtnGet: "Prompts holen",
    ctaBtnQuick: "Quickstart",
    footerLicense: "auditor — MIT-lizenziert",
    footerGithub: "GitHub",
    footerStandard: "Standard",
    footerChangelog: "Changelog",
  },
} as const;

// German prose for the data that lives in content.ts (icons/files/names stay shared).
const auditBlurbDe: Record<string, string> = {
  security: "14 Domänen: Injection, AuthN/Z, Secrets, Supply Chain, IaC, CI/CD, Business-Logik, Datenschutz, LLM.",
  repo: "Repo-Engineering: Architektur, Stack-Konsistenz, Docs, Tests, Deps, CI/CD, Git-Hygiene.",
  frontend: "16-Agenten-Frontend-Sweep: Usability, Psychologie, Visual Design, A11y, Performance, SEO, Copy, CRO.",
  api: "API-Design: Ressourcen-Modell, HTTP-Semantik, Error-Model, Versionierung, Idempotenz, Rate-Limits, DX.",
  performance: "Performance & Skalierung: Hotspots, N+1, Caching, Concurrency, Leaks, Lastverhalten, Resilienz, FinOps.",
  data: "Daten & Datenbank: Modellierung, Typen, Constraints, Migrations-Sicherheit, Transaktionen, Integrität, Backup/DR.",
  infrastructure: "Infra/DevOps/SRE: IaC, Cloud-Security, IAM, Secrets, Container, k8s, CI/CD, HA, DR, Observability, Kosten.",
  "ai-llm": "KI/LLM: Prompt-Injection, Jailbreaks, Output-Handling, Agent/Tool-Safety, RAG, Halluzination, Evals, Kosten.",
  "compliance-privacy": "Datenschutz: Rechtsgrundlage, Consent/Cookies, Betroffenenrechte, Aufbewahrung, Transfers, Breach-Readiness.",
  accessibility: "Tiefes A11y: Semantik, Tastatur, Fokus, Screenreader, Kontrast, Formulare, Zoom, Motorik, Motion, Kognition.",
  documentation: "Doku-Qualität vs. Standard: Repo-Kopf, Onboarding, Doc-Code-Drift, Schreibstil, Diátaxis, Repo-Health.",
};

const principleDe: { title: string; body: string }[] = [
  {
    title: "Beleg oder nichts",
    body: "Jeder Befund nennt ein konkretes Artefakt — file:line, einen Query-Plan, einen Request, einen Config-Wert, eine gemessene Metrik. Kein Beleg, kein Befund.",
  },
  {
    title: "Adversarielle Selbst-Challenge",
    body: "Kein Befund überlebt, bevor unabhängige Skeptiker-Agenten ihn zu widerlegen versucht haben. Der stärkste Schutz gegen False Positives.",
  },
  {
    title: "Blind-Spot-Jagd",
    body: "Ein Completeness-Critic fragt jede Runde, welche Oberfläche, welcher Use-Case oder welche Annahme ungeprüft blieb. Lücken werden deklariert, nie verschwiegen.",
  },
  {
    title: "Umsetzbarer Issue-Tracker",
    body: "Ausgabe sind GitHub-Issues, angeführt von einem nach Priorität sortierten Tracking-Issue, jedes mit Management-Summary und Vorher/Nachher-Fix.",
  },
];

const phaseDe: Record<string, { title: string; body: string }> = {
  "0": { title: "Reconnaissance", body: "Faktisches Inventar + Surface-Map. Noch keine Meinungen." },
  "1": { title: "Spezialisten-Schwarm", body: "Viele Domänen-Experten parallel, jeder belegpflichtig." },
  "2": { title: "Cross-Pollination", body: "Mergen, deduplizieren, Compound-Findings sichtbar machen." },
  "3": { title: "Adversarielle Verifikation", body: "Unabhängige Skeptiker widerlegen jeden P0/P1; ≥2 von 3 zum Überleben." },
  "4": { title: "Benchmark", body: "Vergleich gegen benannte Best-in-Class-Referenzen und Standards." },
  "5": { title: "Synthese", body: "Bericht, Scorecard, Issues und eine 30/60/90-Roadmap." },
};

const standardBlurbDe: Record<string, string> = {
  "Documentation standard":
    "Ein Google-Grade-Dokumentationsstandard mit fünf Repo-Profilen und einer 0–100-Rubrik. Der Maßstab, an dem das Documentation-Audit misst.",
  "Issue-output standard":
    "Der verbindliche Vertrag, dem jedes Audit folgt: zuerst ein nach Priorität sortiertes Tracking-Issue, dann pro Befund ein Issue mit eigener Management-Summary.",
};

export function t(lang: Lang) {
  return ui[lang];
}

export function audits(lang: Lang): Audit[] {
  if (lang === "en") return AUDITS;
  return AUDITS.map((a) => ({ ...a, blurb: auditBlurbDe[a.name] ?? a.blurb }));
}

export function principles(lang: Lang) {
  if (lang === "en") return PRINCIPLES;
  return PRINCIPLES.map((p, i) => ({ ...p, ...principleDe[i] }));
}

export function phases(lang: Lang) {
  if (lang === "en") return PHASES;
  return PHASES.map((p) => ({ ...p, ...(phaseDe[p.n] ?? {}) }));
}

export function standards(lang: Lang) {
  if (lang === "en") return STANDARDS;
  return STANDARDS.map((s) => ({ ...s, blurb: standardBlurbDe[s.name] ?? s.blurb }));
}
