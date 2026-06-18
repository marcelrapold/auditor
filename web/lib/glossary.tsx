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
