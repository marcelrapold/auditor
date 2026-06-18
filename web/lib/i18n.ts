import { AUDITS, PHASES, PRINCIPLES, STANDARDS, type Audit } from "./content";

export type Lang = "en" | "de";
export const LANGS: Lang[] = ["en", "de"];

// UI chrome strings.
export const ui = {
  en: {
    nav: { use: "Use it", audits: "Audits", how: "How it works", standards: "Standards" },
    skip: "Skip to content",
    heroBadge: "audits · MIT",
    heroTitle: "Turn any AI agent into a swarm of specialist auditors",
    heroSub:
      "Copy one master prompt into your AI coding agent. It runs many specialists in parallel, makes independent skeptics refute every finding, and files only what survives — as priority-sorted GitHub issues.",
    heroContrast:
      'Not another "audit my code" prompt — these make your agent prove every finding before it files it.',
    heroCtaCopy: "Copy the command",
    heroCtaProof: "See a real run",
    heroMeta: "evidence-bound · ≥2-of-3 adversarial verification · 30/60/90 roadmap",
    agentEyebrow: "Run it",
    agentTitle: "Point your AI agent at auditor.rapold.io",
    agentLead:
      "No install — works with any agent that can fetch a URL and run tools (runs on Claude Code). Tell it to audit a repo using auditor.rapold.io: it fetches the audit prompt — a single entry point that asks your language and which audits to run — then files the issues.",
    agentCmdVerb: "Audit",
    agentCmdUsing: "using",
    agentCopy: "Copy command",
    agentCopied: "Copied",
    agentCopyHint: "Copy it, swap in your repo, paste into your agent.",
    agentCtaSeeAudits: "See the {count} audits",
    agentExplain:
      "It then asks: output language (Deutsch / English), which of the {count} audits (or the full repo), and whether to create issues — then runs them and opens a priority-sorted tracker.",
    agentNotePre: "AI agents: fetch",
    agentNotePost: "and act as the audit orchestrator (ask language + scope, then run).",
    trustTitle: "Honest answers to the obvious questions",
    trust: [
      {
        q: "Won't it hallucinate evidence?",
        a: "Every file:line is re-checked against the actual file in adversarial verify (Phase 3); unverifiable claims are dropped.",
      },
      {
        q: "Does my code leave my machine?",
        a: "No — your agent fetches the prompt; your repo never touches our domain.",
      },
      {
        q: "What does a run cost?",
        a: "Just your agent's tokens — scope it to a few audits to control spend.",
      },
    ],
    prinEyebrow: "Why it is different",
    prinTitle: "Most audit prompts return unverified opinions. These enforce discipline.",
    proofEyebrow: "Proof, not claims",
    proofTitle: "We pointed the whole suite at our own repo",
    proofLead:
      'The library is dogfooded on itself — run end-to-end against this very repo, with the backlog filed as public GitHub issues. The cross-audit pass even caught itself: "CHECKSUMS.txt not verified in CI" surfaced independently from three lenses and merged into one. Below: the scorecard, and one finding from that run, exactly as filed.',
    proofEvidence: "Evidence",
    proofBefore: "Before",
    proofAfter: "After",
    proofCta: "See the full run (#97)",
    audEyebrow: "The library",
    audTitle: "Twelve stack-agnostic audits, one shared methodology",
    audLead:
      'Each is a self-contained master prompt: a multi-phase spec, not a one-shot "review my code" question. Run several against the same repo and their findings merge into one priority-sorted tracker — no duplicates — because every audit emits the same issue contract.',
    howEyebrow: "The method",
    howTitle: "Six phases, every time",
    howLead:
      "Recon, a parallel specialist swarm, then adversarial verification before anything reaches the report.",
    stdEyebrow: "The yardsticks",
    stdTitle: "Two yardsticks. Every report measured against them.",
    stdLead:
      "Reusable on their own. One scores 0–100 against a rubric; the other fixes the exact issue shape — so two runs stay comparable even when the generated prose differs.",
    ctaTitle: "See what your AI agent finds when it has to prove every claim.",
    ctaLead:
      "It is free and MIT-licensed. Run it on a throwaway branch, read findings that had to survive 2-of-3 skeptics, and keep only the fixes you agree with.",
    proofStrip: "Every claim here survived the same audit — read the public backlog (#97).",
    ctaBtnGet: "Browse the prompts",
    ctaBtnQuick: "Quickstart",
    footerLicense: "auditor — MIT licensed",
    footerGithub: "GitHub",
    footerStandard: "Standard",
    footerChangelog: "Changelog",
  },
  de: {
    nav: { use: "Nutzen", audits: "Audits", how: "Ablauf", standards: "Standards" },
    skip: "Zum Inhalt springen",
    heroBadge: "Audits · MIT",
    heroTitle: "Mach aus jedem KI-Agenten einen Schwarm spezialisierter Auditoren",
    heroSub:
      "Kopiere einen Master-Prompt in deinen KI-Coding-Agenten. Er führt viele Spezialisten parallel aus, lässt unabhängige Skeptiker jeden Befund angreifen und reicht nur das Überlebende ein — als nach Priorität sortierte GitHub-Issues.",
    heroContrast:
      "Kein weiterer „audit mein Code“-Prompt — diese zwingen deinen Agenten, jeden Befund zu belegen, bevor er ihn einreicht.",
    heroCtaCopy: "Befehl kopieren",
    heroCtaProof: "Echten Lauf ansehen",
    heroMeta: "belegbasiert · ≥2-von-3 adversariell verifiziert · 30/60/90-Roadmap",
    agentEyebrow: "Loslegen",
    agentTitle: "Richte deinen KI-Agenten auf auditor.rapold.io",
    agentLead:
      "Keine Installation — funktioniert mit jedem Agenten, der eine URL abrufen und Tools ausführen kann (läuft mit Claude Code). Sag ihm, er soll ein Repo „using auditor.rapold.io“ auditieren: er holt den Audit-Prompt — einen einzigen Einstiegspunkt, der Sprache und Umfang erfragt — und legt dann die Issues an.",
    agentCmdVerb: "Audit",
    agentCmdUsing: "using",
    agentCopy: "Befehl kopieren",
    agentCopied: "Kopiert",
    agentCopyHint: "Kopieren, dein Repo einsetzen, in deinen Agenten einfügen.",
    agentCtaSeeAudits: "Alle {count} Audits ansehen",
    agentExplain:
      "Er fragt dann: Ausgabesprache (Deutsch / English), welche der {count} Audits (oder das ganze Repo) und ob Issues erstellt werden dürfen — dann führt er sie aus und öffnet einen nach Priorität sortierten Tracker.",
    agentNotePre: "KI-Agenten: hole",
    agentNotePost: "und agiere als Audit-Orchestrator (Sprache + Umfang erfragen, dann ausführen).",
    trustTitle: "Ehrliche Antworten auf die naheliegenden Fragen",
    trust: [
      {
        q: "Halluziniert es Belege?",
        a: "Jede file:line wird in der adversariellen Verifikation (Phase 3) gegen die echte Datei gegengeprüft; nicht verifizierbare Aussagen werden verworfen.",
      },
      {
        q: "Verlässt mein Code meine Maschine?",
        a: "Nein — dein Agent holt nur den Prompt; dein Repo berührt unsere Domain nie.",
      },
      {
        q: "Was kostet ein Lauf?",
        a: "Nur die Tokens deines Agenten — beschränke dich auf einige Audits, um die Kosten zu steuern.",
      },
    ],
    prinEyebrow: "Warum es anders ist",
    prinTitle: "Die meisten Audit-Prompts liefern unverifizierte Meinungen. Diese erzwingen Disziplin.",
    proofEyebrow: "Beweise statt Behauptungen",
    proofTitle: "Wir haben die ganze Suite auf das eigene Repo gerichtet",
    proofLead:
      "Die Bibliothek wird auf sich selbst angewendet — end-to-end gegen genau dieses Repo, das Backlog als öffentliche GitHub-Issues. Der Cross-Audit-Durchlauf hat sich sogar selbst ertappt: „CHECKSUMS.txt nicht in CI verifiziert“ tauchte unabhängig aus drei Linsen auf und wurde zu einem Issue zusammengeführt. Unten: die Scorecard und ein Finding aus diesem Lauf, genau so eingereicht.",
    proofEvidence: "Beleg",
    proofBefore: "Vorher",
    proofAfter: "Nachher",
    proofCta: "Ganzen Lauf ansehen (#97)",
    audEyebrow: "Die Bibliothek",
    audTitle: "Zwölf stack-agnostische Audits, eine gemeinsame Methodik",
    audLead:
      "Jedes ist ein eigenständiger Master-Prompt: eine mehrphasige Spezifikation, keine einmalige „Review mein Code“-Frage. Mehrere gegen dasselbe Repo laufen lassen — ihre Befunde fließen ohne Duplikate in einen einzigen, prioritätssortierten Tracker, weil jedes Audit denselben Issue-Kontrakt liefert.",
    howEyebrow: "Die Methode",
    howTitle: "Sechs Phasen, jedes Mal",
    howLead:
      "Recon, ein paralleler Spezialisten-Schwarm, dann adversarielle Verifikation, bevor irgendetwas in den Bericht kommt.",
    stdEyebrow: "Die Maßstäbe",
    stdTitle: "Zwei Maßstäbe. Jeder Bericht daran gemessen.",
    stdLead:
      "Für sich allein nutzbar. Der eine bewertet 0–100 anhand einer Rubrik; der andere legt die exakte Issue-Form fest — so bleiben zwei Läufe vergleichbar, auch wenn die generierte Formulierung abweicht.",
    ctaTitle: "Sieh, was dein KI-Agent findet, wenn er jede Aussage belegen muss.",
    ctaLead:
      "Es ist kostenlos und MIT-lizenziert. Lass es auf einem Wegwerf-Branch laufen, lies Befunde, die 2-von-3 Skeptikern standhalten mussten, und behalte nur die Fixes, denen du zustimmst.",
    proofStrip: "Jede Aussage hier hat dasselbe Audit überstanden — lies das öffentliche Backlog (#97).",
    ctaBtnGet: "Prompts ansehen",
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
  content: "Inhalt & Botschaft: These challengen, Zielgruppen-Fit, Belege & Originalität, Struktur, Stimme, konkrete Umformulierungen.",
};

const principleDe: { title: string; body: string }[] = [
  {
    title: "Beleg oder nichts",
    body: "Jeder Befund nennt ein konkretes Artefakt — file:line, einen Query-Plan, einen Request, einen Config-Wert, eine gemessene Metrik. Kein Beleg, kein Befund.",
  },
  {
    title: "Adversarielle Selbst-Challenge",
    body: "Kein Befund überlebt, bevor unabhängige Skeptiker-Agenten ihn zu widerlegen versucht haben — er muss mindestens zwei von drei überstehen, sonst wird er verworfen. Wer eine feindselige Lesart nicht übersteht, ist kein Befund.",
  },
  {
    title: "Blind-Spot-Jagd",
    body: "Ein Completeness-Critic fragt jede Runde, welche Oberfläche, welcher Use-Case oder welche Annahme ungeprüft blieb. Lücken werden deklariert, nie verschwiegen.",
  },
  {
    title: "Umsetzbarer Issue-Tracker",
    body: "Ausgabe sind GitHub-Issues, angeführt von einem nach Priorität sortierten Tracking-Issue, jedes mit Management-Summary und Vorher/Nachher-Fix. Ein Befund, den du nicht umsetzen kannst, ist nur eine Meinung.",
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
    "Ein Dokumentationsstandard mit fünf Repo-Profilen und einer 0–100-Rubrik — derselbe Maßstab, an dem das Documentation-Audit misst.",
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
