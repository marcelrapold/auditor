import { AUDITS, PHASES, PRINCIPLES, STANDARDS, type Audit } from "./content";

export type Lang = "en" | "de";

// UI chrome strings.
export const ui = {
  en: {
    nav: { use: "Use it", audits: "Audits", how: "How it works", standards: "Standards", reports: "Reports" },
    skip: "Skip to content",
    langToggle: "Switch to German",
    newTab: "(opens in a new tab)",
    ghRepo: "GitHub repository",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    navMobile: "Mobile navigation",
    themeLight: "Switch to light theme",
    themeDark: "Switch to dark theme",
    themeToggle: "Toggle color theme",
    heroBadge: "audits · MIT",
    heroTitle: "Turn any AI agent into a swarm of specialist auditors",
    heroSub:
      "Copy one master prompt into your AI coding agent. It runs many specialists in parallel, makes independent skeptics refute every finding, and files only what survives — as priority-sorted GitHub issues.",
    heroContrast:
      'Not another "audit my code" prompt — these make your agent prove every finding before it files it.',
    heroCtaCopy: "Copy the command",
    heroCtaProof: "See a real run",
    heroCtaHint: "Copies a template — swap in your repo URL before running.",
    heroMeta: "evidence-bound · ≥2-of-3 adversarial verification · 30/60/90 roadmap",
    agentEyebrow: "Run it",
    agentTitle: "Point your AI agent at auditor.rapold.io",
    agentLead:
      "No install — works with any agent that can fetch a URL and run tools (runs on Claude Code). Tell it to audit a repo using auditor.rapold.io: it fetches the audit prompt — a single entry point that asks your language and which audits to run — then files the issues.",
    agentCmdVerb: "Audit",
    agentCmdUsing: "using",
    agentCopy: "Copy command",
    agentCopied: "Copied",
    agentCopiedAnnounce: "Command copied to clipboard",
    agentCopyFailed: "Copy failed — select the command and press Ctrl/Cmd-C",
    agentCopyHint: "Copy it, swap in your repo, paste it to your agent.",
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
      "The library is dogfooded on itself — pointed at this very repo, with the backlog filed as public GitHub issues. This page got its own content audit; across the full repo, every lens scored A− to A. Below: the real backlog, the grades, and one finding in full.",
    proofAnnotation:
      "The real backlog from auditing this very page — 23 findings, every one now fixed.",
    proofVerifyHint: "Open any issue to check the evidence on GitHub.",
    proofFindings: "findings",
    proofRows: [
      'No visible output proof — it preaches "evidence", ships prose',
      "Activation command is not copyable",
      '"any AI agent" — an unsupported universal claim',
      "End-CTA repeats the hero instead of closing",
      '"Google-grade" — an unsupported superlative',
      'Hero badge "copy & paste" duplicates the subhead',
    ],
    proofEvidence: "Evidence",
    proofBefore: "Before",
    proofAfter: "After",
    proofCta: "See the full run (#97)",
    apKicker: "Audit template",
    apApproach: "How this audit works",
    apUseCases: "Use it when",
    apOutput: "What you get",
    apMaps: "Maps to",
    apViewPrompt: "View the full prompt",
    apAllAudits: "All audits",
    apOthers: "Explore the other audits",
    audEyebrow: "The library",
    audTitle: "{count} stack-agnostic audits, one shared methodology",
    audLead:
      'Each is a self-contained master prompt: a multi-phase spec, not a one-shot "review my code" question. Run several against the same repo and their findings merge into one priority-sorted tracker — no duplicates — because every audit emits the same issue contract.',
    howEyebrow: "The method",
    howTitle: "Six phases, every time",
    howLead:
      "Recon, a parallel specialist swarm, then adversarial verification before anything reaches the report.",
    howInput: "You type — one line, any capable agent.",
    howOutput: "You get — priority-sorted GitHub issues.",
    howParallel: "in parallel",
    howGate: "survives ≥2 of 3",
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
    // Reports gallery.
    repIndexKicker: "Sample reports",
    repIndexTitle: "Real audit runs, every finding traceable to a public issue",
    repIndexLead:
      "No fabricated demos. Each report below is a real run of the suite, rendered from the same data filed as public GitHub issues — open any link to verify the evidence yourself. We seed the gallery with this repo's own self-audit; more real runs are added as they ship.",
    repIndexWhyTitle: "Why these are real, not staged",
    repIndexWhy: [
      {
        t: "Evidence-bound",
        d: "Every finding cites a concrete artifact (file:line, a config value) and links the GitHub issue where it lives.",
      },
      {
        t: "Adversarially verified",
        d: "No P0/P1 survives unless independent skeptics fail to refute it — ≥2 of 3, or it is dropped.",
      },
      {
        t: "Publicly checkable",
        d: "The scorecard, the not-applicable calls with reasons, and the cross-audit dedup all trace to one master tracker.",
      },
    ],
    repViewReport: "View report",
    repTracker: "Master tracker",
    repTarget: "Target",
    repDate: "Run date",
    repBackToReports: "All reports",
    repScorecardTitle: "Scorecard",
    repScorecardLead: "Phase 0 selected {n} applicable audits; each lens scored independently.",
    repNotApplicableTitle: "Declared not applicable",
    repNotApplicableLead:
      "Phase 0 named these out of scope — with a reason — rather than skipping them silently.",
    repFindingsTitle: "Headline findings",
    repFindingsLead: "A slice of the backlog, rendered natively. Open any issue to check the evidence on GitHub.",
    repDedupTitle: "Cross-audit dedup",
    repDedupLead:
      "The payoff of running the audits together: the same gap found by several lenses, merged into one backlog item with every citation kept.",
    repDedupFoundBy: "Found independently by",
    repMethodTitle: "How this run worked",
    repMethodLead:
      "Recon selected the applicable audits, a specialist swarm ran them in parallel, findings were cross-pollinated and deduped, and every P0/P1 had to survive independent skeptics before it reached the report.",
    repViewIssue: "View issue",
    repFullRun: "See the full run",
    repEvidence: "Evidence",
    repBefore: "Before",
    repAfter: "After",
    repZeroP0: "0 P0",
    repOneP1: "1 P1",
    footerReports: "Reports",
    footerLicense: "auditor — MIT licensed",
    footerGithub: "GitHub",
    footerStandard: "Standard",
    footerChangelog: "Changelog",
  },
  de: {
    nav: { use: "Nutzen", audits: "Audits", how: "Ablauf", standards: "Standards", reports: "Berichte" },
    skip: "Zum Inhalt springen",
    langToggle: "Auf Englisch wechseln",
    newTab: "(öffnet in neuem Tab)",
    ghRepo: "GitHub-Repository",
    menuOpen: "Menü öffnen",
    menuClose: "Menü schließen",
    navMobile: "Mobile Navigation",
    themeLight: "Zu hellem Design wechseln",
    themeDark: "Zu dunklem Design wechseln",
    themeToggle: "Farbdesign umschalten",
    heroBadge: "Audits · MIT",
    heroTitle: "Mach aus jedem KI-Agenten einen Schwarm spezialisierter Auditoren",
    heroSub:
      "Kopiere einen Master-Prompt in deinen KI-Coding-Agenten. Er lässt viele Spezialisten parallel laufen und jeden Befund von unabhängigen Skeptikern auf die Probe stellen — nur was standhält, landet als GitHub-Issue in einem nach Priorität sortierten Backlog.",
    heroContrast:
      "Kein weiterer „audit my code“-Prompt — diese zwingen deinen Agenten, jeden Befund zu belegen, bevor er ihn einreicht.",
    heroCtaCopy: "Befehl kopieren",
    heroCtaProof: "Echten Lauf ansehen",
    heroCtaHint: "Kopiert eine Vorlage — ersetze die Repo-URL, bevor du sie ausführst.",
    heroMeta: "belegbasiert · ≥2-von-3 adversariell verifiziert · 30/60/90-Roadmap",
    agentEyebrow: "Loslegen",
    agentTitle: "Richte deinen KI-Agenten auf auditor.rapold.io",
    agentLead:
      "Keine Installation — funktioniert mit jedem Agenten, der eine URL abrufen und Tools ausführen kann (läuft mit Claude Code). Sag ihm, er soll ein Repo mit auditor.rapold.io auditieren: er holt den Audit-Prompt — einen einzigen Einstiegspunkt, der Sprache und Umfang erfragt — und legt dann die Issues an.",
    agentCmdVerb: "Audit",
    agentCmdUsing: "using",
    agentCopy: "Befehl kopieren",
    agentCopied: "Kopiert",
    agentCopiedAnnounce: "Befehl in die Zwischenablage kopiert",
    agentCopyFailed: "Kopieren fehlgeschlagen — Befehl markieren und Strg/Cmd-C drücken",
    agentCopyHint: "Kopiere ihn, setze deine Repo-URL ein, füge ihn in deinen Agenten ein.",
    agentCtaSeeAudits: "Alle {count} Audits ansehen",
    agentExplain:
      "Er fragt dann: Ausgabesprache (Deutsch / English), welche der {count} Audits (oder das ganze Repo) und ob Issues erstellt werden dürfen — dann führt er sie aus und öffnet einen nach Priorität sortierten Tracker.",
    agentNotePre: "KI-Agenten: hole",
    agentNotePost: "und agiere als Audit-Orchestrator (Sprache + Umfang erfragen, dann ausführen).",
    trustTitle: "Ehrliche Antworten auf die naheliegenden Fragen",
    trust: [
      {
        q: "Halluziniert es Belege?",
        a: "Jede file:line wird in der adversariellen Verifikation (Phase 3) anhand der echten Datei nachgeprüft; nicht verifizierbare Aussagen werden verworfen.",
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
      "Die Bibliothek wird auf sich selbst angewendet — auf genau dieses Repo gerichtet, das Backlog als öffentliche GitHub-Issues. Diese Seite bekam ihr eigenes Content-Audit; über das ganze Repo erreichte jede Linse A− bis A. Unten: der echte Backlog, die Noten und ein Finding in voller Tiefe.",
    proofAnnotation:
      "Der echte Backlog aus dem Audit genau dieser Seite — 23 Befunde, jeder davon jetzt behoben.",
    proofVerifyHint: "Öffne ein Issue und prüfe den Beleg auf GitHub.",
    proofFindings: "Befunde",
    proofRows: [
      'Kein sichtbarer Output-Beweis — predigt „Evidence“, liefert Prosa',
      "Aktivierungs-Befehl ist nicht kopierbar",
      '„any AI agent“ — unbelegte Universalbehauptung',
      "End-CTA wiederholt den Hero statt zu schließen",
      '„Google-grade“ — unbelegter Superlativ',
      'Hero-Badge „copy & paste“ doppelt den Subhead',
    ],
    proofEvidence: "Beleg",
    proofBefore: "Vorher",
    proofAfter: "Nachher",
    proofCta: "Ganzen Lauf ansehen (#97)",
    apKicker: "Audit-Vorlage",
    apApproach: "Wie dieses Audit arbeitet",
    apUseCases: "Wann du es einsetzt",
    apOutput: "Was du bekommst",
    apMaps: "Mappt auf",
    apViewPrompt: "Vollständigen Prompt ansehen",
    apAllAudits: "Alle Audits",
    apOthers: "Die anderen Audits ansehen",
    audEyebrow: "Die Bibliothek",
    audTitle: "{count} stack-agnostische Audits, eine gemeinsame Methodik",
    audLead:
      "Jedes ist ein eigenständiger Master-Prompt: eine mehrphasige Spezifikation, keine einmalige „review my code“-Frage. Mehrere gegen dasselbe Repo laufen lassen — ihre Befunde fließen ohne Duplikate in einen einzigen, prioritätssortierten Tracker, weil jedes Audit denselben Issue-Kontrakt liefert.",
    howEyebrow: "Die Methode",
    howTitle: "Sechs Phasen, jedes Mal",
    howLead:
      "Recon, ein paralleler Spezialisten-Schwarm, dann adversarielle Verifikation, bevor irgendetwas in den Bericht kommt.",
    howInput: "Du tippst — eine Zeile, jeder fähige Agent.",
    howOutput: "Du bekommst — nach Priorität sortierte GitHub-Issues.",
    howParallel: "parallel",
    howGate: "übersteht ≥2 von 3",
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
    // Berichte-Galerie.
    repIndexKicker: "Beispiel-Berichte",
    repIndexTitle: "Echte Audit-Läufe — jeder Befund auf ein öffentliches Issue zurückführbar",
    repIndexLead:
      "Keine erfundenen Demos. Jeder Bericht unten ist ein echter Lauf der Suite, gerendert aus denselben Daten, die als öffentliche GitHub-Issues eingereicht wurden — öffne jeden Link und prüfe den Beleg selbst. Wir starten die Galerie mit dem Self-Audit dieses Repos; weitere echte Läufe kommen dazu, sobald sie laufen.",
    repIndexWhyTitle: "Warum diese echt und nicht inszeniert sind",
    repIndexWhy: [
      {
        t: "Belegbasiert",
        d: "Jeder Befund nennt ein konkretes Artefakt (file:line, einen Config-Wert) und verlinkt das GitHub-Issue, in dem er lebt.",
      },
      {
        t: "Adversariell verifiziert",
        d: "Kein P0/P1 überlebt, solange unabhängige Skeptiker ihn nicht widerlegen können — ≥2 von 3, sonst wird er verworfen.",
      },
      {
        t: "Öffentlich prüfbar",
        d: "Die Scorecard, die begründeten Nicht-anwendbar-Entscheide und die Cross-Audit-Dedupe führen alle auf einen Master-Tracker.",
      },
    ],
    repViewReport: "Bericht ansehen",
    repTracker: "Master-Tracker",
    repTarget: "Ziel",
    repDate: "Lauf-Datum",
    repBackToReports: "Alle Berichte",
    repScorecardTitle: "Scorecard",
    repScorecardLead: "Phase 0 wählte {n} anwendbare Audits; jede Linse wurde unabhängig benotet.",
    repNotApplicableTitle: "Als nicht anwendbar deklariert",
    repNotApplicableLead:
      "Phase 0 erklärte diese — mit Begründung — als außerhalb des Umfangs, statt sie still zu überspringen.",
    repFindingsTitle: "Wichtigste Befunde",
    repFindingsLead: "Ein Ausschnitt des Backlogs, nativ gerendert. Öffne ein Issue und prüfe den Beleg auf GitHub.",
    repDedupTitle: "Cross-Audit-Dedupe",
    repDedupLead:
      "Der Mehrwert, die Audits zusammen laufen zu lassen: dieselbe Lücke von mehreren Linsen gefunden, zu einem Backlog-Item gemergt — jedes Zitat erhalten.",
    repDedupFoundBy: "Unabhängig gefunden von",
    repMethodTitle: "Wie dieser Lauf arbeitete",
    repMethodLead:
      "Recon wählte die anwendbaren Audits, ein Spezialisten-Schwarm führte sie parallel aus, Befunde wurden cross-pollinatet und dedupliziert, und jeder P0/P1 musste unabhängige Skeptiker überstehen, bevor er in den Bericht kam.",
    repViewIssue: "Issue ansehen",
    repFullRun: "Ganzen Lauf ansehen",
    repEvidence: "Beleg",
    repBefore: "Vorher",
    repAfter: "Nachher",
    repZeroP0: "0 P0",
    repOneP1: "1 P1",
    footerReports: "Berichte",
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
  lean: "Schlankheit: toter Code, ungenutzte/Phantom-Deps, Duplikation, AI-Slop, Dependency-Transparenz — sicherer Strip-down ohne Über-Löschen.",
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

// --- Reports: localized prose for the data in reports.ts ---------------------
// The hard facts (slugs, scores, issue numbers, dates) live in reports.ts; the
// translatable prose is keyed here so both languages render from one source.

type ReportProse = {
  /** Per-report card title + one-line summary, keyed by report slug. */
  title: string;
  summary: string;
};

const reportProse: Record<Lang, Record<string, ReportProse>> = {
  en: {
    "self-audit": {
      title: "Auditing this repo",
      summary:
        "The suite pointed at its own repository — 7 applicable audits, 4 declared not applicable with reasons, zero P0, one P1.",
    },
  },
  de: {
    "self-audit": {
      title: "Dieses Repo auditieren",
      summary:
        "Die Suite auf das eigene Repository gerichtet — 7 anwendbare Audits, 4 mit Begründung als nicht anwendbar deklariert, null P0, ein P1.",
    },
  },
};

const reportVerdicts: Record<Lang, Record<string, string>> = {
  en: {
    selfAudit:
      "Production-ready. All seven applicable audits scored A− to A (90–94), zero P0, exactly one P1; the only real residual risks concern the supply-chain trust model the product sells, not a live exposure.",
  },
  de: {
    selfAudit:
      "Production-ready. Alle sieben anwendbaren Audits liegen bei A− bis A (90–94), null P0, genau ein P1; die einzigen echten Restrisiken betreffen das Supply-Chain-Vertrauensmodell, das das Produkt verkauft, nicht eine Live-Exposition.",
  },
};

const reportReasons: Record<Lang, Record<string, string>> = {
  en: {
    api: "No route.ts / Server Actions — fully static.",
    data: "No database, schema, or ORM.",
    aiLlm: "Prompts run in the external agent; no in-repo runtime.",
    compliancePrivacy: "No forms, auth, or PII beyond Vercel Analytics.",
  },
  de: {
    api: "Keine route.ts / Server-Actions — voll statisch.",
    data: "Keine Datenbank, kein Schema, kein ORM.",
    aiLlm: "Prompts laufen im externen Agenten; kein In-Repo-Runtime.",
    compliancePrivacy: "Keine Formulare, kein Auth, keine PII außer Vercel Analytics.",
  },
};

type FindingProse = { title: string; evidence?: string; before?: string; after?: string };

const reportFindings: Record<Lang, Record<string, FindingProse>> = {
  en: {
    lang: {
      title: '/de served the document with <html lang="en">',
      evidence: "web/app/layout.tsx:71",
      before: '/ and /de → <html lang="en">',
      after: '/de → <html lang="de">',
    },
    checksums: {
      title: "CHECKSUMS.txt is not verified in CI",
      evidence: "CHECKSUMS.txt · .github/workflows",
      before: 'Promises "verify-before-execute" — not enforced',
      after: "A CI gate verifies checksums on every run",
    },
    pins: {
      title: "~17 hand-maintained version pins with no single source of truth",
      evidence: "scattered v0.5.0 pins across the repo",
      before: "Each pin edited by hand, drift-prone",
      after: "One source of truth, bumped by script",
    },
    enMeta: {
      title: 'EN metadata hardcoded "German GitHub issues"',
      evidence: "web/lib/site.ts",
      before: "English copy claimed German-only output",
      after: "Copy reflects German or English output",
    },
  },
  de: {
    lang: {
      title: '/de lieferte das Dokument mit <html lang="en">',
      evidence: "web/app/layout.tsx:71",
      before: '/ und /de → <html lang="en">',
      after: '/de → <html lang="de">',
    },
    checksums: {
      title: "CHECKSUMS.txt wird in CI nicht verifiziert",
      evidence: "CHECKSUMS.txt · .github/workflows",
      before: 'Verspricht „verify-before-execute" — nicht erzwungen',
      after: "Ein CI-Gate verifiziert die Checksummen bei jedem Lauf",
    },
    pins: {
      title: "~17 hand-gepflegte Versions-Pins ohne Single Source of Truth",
      evidence: "verstreute v0.5.0-Pins im Repo",
      before: "Jeder Pin von Hand editiert, driftanfällig",
      after: "Eine Single Source of Truth, per Skript gebumpt",
    },
    enMeta: {
      title: 'EN-Metadaten hartcodieren „German GitHub issues"',
      evidence: "web/lib/site.ts",
      before: "Englische Copy behauptete nur deutsche Ausgabe",
      after: "Copy spiegelt deutsche oder englische Ausgabe",
    },
  },
};

const reportDedup: Record<Lang, Record<string, { title: string; body: string }>> = {
  en: {
    checksums: {
      title: '"CHECKSUMS.txt is not verified in CI"',
      body: "Found independently by the repo, infrastructure, and security lenses and merged into a single backlog item — all three citations kept. The version-pins half was split off as its own fix.",
    },
  },
  de: {
    checksums: {
      title: '„CHECKSUMS.txt wird in CI nicht verifiziert"',
      body: "Unabhängig von der repo-, infrastructure- und security-Linse gefunden und zu einem einzigen Backlog-Item gemergt — alle drei Zitate erhalten. Die Versions-Pin-Hälfte wurde als eigener Fix abgespalten.",
    },
  },
};

export function reportProseFor(lang: Lang, slug: string): ReportProse | undefined {
  return reportProse[lang][slug];
}
export function reportVerdict(lang: Lang, key: string): string {
  return reportVerdicts[lang][key] ?? "";
}
export function reportReason(lang: Lang, key: string): string {
  return reportReasons[lang][key] ?? "";
}
export function reportFinding(lang: Lang, key: string): FindingProse {
  return reportFindings[lang][key] ?? { title: key };
}
export function reportDedupProse(lang: Lang, key: string): { title: string; body: string } {
  return reportDedup[lang][key] ?? { title: key, body: "" };
}

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
