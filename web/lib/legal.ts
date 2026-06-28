import type { Lang } from "@/lib/i18n";

/**
 * Rechtstexte (Datenschutz, Impressum) für beide Locales. Bewusst als Daten
 * gehalten, damit `legal-page.tsx` sie generisch rendert. Deutsche Fassung in
 * Schweizer Orthografie (durchgehend ss).
 *
 * ⚠️ Platzhalter `[…]` vor Veröffentlichung mit echten Betreiberdaten füllen
 * (insb. Adresse). Diese Texte sind eine sorgfältige Vorlage, aber keine
 * Rechtsberatung.
 */
export const LEGAL_OPERATOR = "Marcel Rapold";
export const LEGAL_EMAIL = "marcel@marcelrapold.com";
export const LEGAL_ADDRESS = "[Strasse Nr., PLZ Ort, Land — bitte ergänzen]";
export const LEGAL_UPDATED = { en: "June 2026", de: "Juni 2026" } as const;

export type LegalSection = { heading: string; body: string[] };
export type LegalDoc = { title: string; updatedLabel: string; intro: string; sections: LegalSection[] };

function privacy(lang: Lang): LegalDoc {
  if (lang === "de") {
    return {
      title: "Datenschutzerklärung",
      updatedLabel: `Stand: ${LEGAL_UPDATED.de}`,
      intro:
        "Diese Seite ist ein statisches Informationsangebot ohne Benutzerkonten, Formulare oder Anmeldung. Wir verarbeiten so wenig Daten wie möglich. Nachfolgend erklären wir, welche Daten beim Besuch anfallen und worauf sie sich stützen.",
      sections: [
        {
          heading: "Verantwortlicher",
          body: [
            `${LEGAL_OPERATOR}`,
            `${LEGAL_ADDRESS}`,
            `E-Mail: ${LEGAL_EMAIL}`,
          ],
        },
        {
          heading: "Hosting & Server-Protokolle",
          body: [
            "Die Seite wird bei Vercel Inc. (USA) gehostet, das als Auftragsverarbeiter tätig ist. Beim Abruf verarbeitet die Infrastruktur technisch notwendige Verbindungsdaten (u. a. IP-Adresse, Zeitpunkt, angefragte Ressource, User-Agent), um die Seite auszuliefern und den Betrieb abzusichern. Rechtsgrundlage ist das berechtigte Interesse an einem sicheren, funktionsfähigen Betrieb (Art. 6 Abs. 1 lit. f DSGVO; in der Schweiz das DSG).",
          ],
        },
        {
          heading: "Reichweitenmessung (Vercel Web Analytics)",
          body: [
            "Zur aggregierten Reichweitenmessung nutzen wir Vercel Web Analytics. Die Messung ist cookielos: es werden keine Cookies gesetzt und kein geräteübergreifendes Tracking sowie keine Profilbildung betrieben. Verarbeitet werden aggregierte, technische Nutzungsdaten (z. B. aufgerufener Seitenpfad, Referrer, ungefähre Herkunft, Gerät-/Browsertyp) auf Basis verarbeiteter, nicht dauerhaft gespeicherter IP-Daten.",
            "Rechtsgrundlage ist unser berechtigtes Interesse an einer datensparsamen, aggregierten Reichweitenmessung (Art. 6 Abs. 1 lit. f DSGVO). Da keine Informationen in deinem Endgerät gespeichert oder ausgelesen werden, die nicht zwingend erforderlich sind, ist hierfür keine Einwilligung nach ePrivacy/§ 25 TTDSG erforderlich.",
          ],
        },
        {
          heading: "Funktionaler lokaler Speicher",
          body: [
            "Für die Hell-/Dunkel-Designwahl speichern wir eine rein funktionale Präferenz im lokalen Speicher (localStorage) deines Browsers. Diese ist technisch erforderlich, wird nicht an uns übermittelt und benötigt keine Einwilligung.",
          ],
        },
        {
          heading: "Drittlandübermittlung",
          body: [
            "Soweit Vercel (USA) Daten verarbeitet, stützt sich die Übermittlung auf das EU-US Data Privacy Framework bzw. auf Standardvertragsklauseln nach Art. 46 DSGVO.",
          ],
        },
        {
          heading: "Speicherdauer",
          body: [
            "Analytics-Daten werden nur aggregiert ausgewertet; es findet keine personenbezogene Langzeitspeicherung durch uns statt. Server-Protokolle werden nur so lange aufbewahrt, wie es für Betrieb und Sicherheit erforderlich ist.",
          ],
        },
        {
          heading: "Deine Rechte",
          body: [
            "Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Widerspruch sowie Datenübertragbarkeit. Wende dich dafür an die oben genannte E-Mail-Adresse.",
            "Es besteht ein Beschwerderecht bei einer Aufsichtsbehörde — in der Schweiz beim Eidgenössischen Datenschutz- und Öffentlichkeitsbeauftragten (EDÖB), in der EU bei der jeweils zuständigen Behörde.",
          ],
        },
      ],
    };
  }
  return {
    title: "Privacy Policy",
    updatedLabel: `Last updated: ${LEGAL_UPDATED.en}`,
    intro:
      "This site is a static information offering with no user accounts, forms, or sign-in. We process as little data as possible. Below we explain what data is processed when you visit and on what legal basis.",
    sections: [
      {
        heading: "Controller",
        body: [`${LEGAL_OPERATOR}`, `${LEGAL_ADDRESS}`, `Email: ${LEGAL_EMAIL}`],
      },
      {
        heading: "Hosting & server logs",
        body: [
          "The site is hosted by Vercel Inc. (USA), acting as a processor. When the site is requested, the infrastructure processes technically necessary connection data (incl. IP address, timestamp, requested resource, user agent) to serve the site and protect operations. The legal basis is our legitimate interest in secure, functioning operation (Art. 6(1)(f) GDPR; in Switzerland, the FADP).",
        ],
      },
      {
        heading: "Audience measurement (Vercel Web Analytics)",
        body: [
          "For aggregated audience measurement we use Vercel Web Analytics. The measurement is cookieless: no cookies are set, and there is no cross-site tracking or profiling. It processes aggregated technical usage data (e.g. page path, referrer, approximate origin, device/browser type) based on processed, non-persistently stored IP data.",
          "The legal basis is our legitimate interest in privacy-preserving, aggregated audience measurement (Art. 6(1)(f) GDPR). As no information that is not strictly necessary is stored on or read from your device, no consent under ePrivacy is required.",
        ],
      },
      {
        heading: "Functional local storage",
        body: [
          "For the light/dark theme choice we store a purely functional preference in your browser's local storage. It is technically required, is not transmitted to us, and requires no consent.",
        ],
      },
      {
        heading: "International transfers",
        body: [
          "Where Vercel (USA) processes data, the transfer relies on the EU-US Data Privacy Framework or on Standard Contractual Clauses under Art. 46 GDPR.",
        ],
      },
      {
        heading: "Retention",
        body: [
          "Analytics data is only evaluated in aggregate; we do not retain it in a personally identifiable form. Server logs are kept only as long as needed for operation and security.",
        ],
      },
      {
        heading: "Your rights",
        body: [
          "You have the right to access, rectification, erasure, restriction of processing, objection, and data portability. To exercise them, contact the email address above.",
          "You also have the right to lodge a complaint with a supervisory authority — in Switzerland the FDPIC, in the EU the competent authority.",
        ],
      },
    ],
  };
}

function imprint(lang: Lang): LegalDoc {
  if (lang === "de") {
    return {
      title: "Impressum",
      updatedLabel: `Stand: ${LEGAL_UPDATED.de}`,
      intro: "Angaben zum Anbieter dieses Online-Angebots.",
      sections: [
        {
          heading: "Anbieter",
          body: [`${LEGAL_OPERATOR}`, `${LEGAL_ADDRESS}`, `E-Mail: ${LEGAL_EMAIL}`],
        },
        {
          heading: "Verantwortlich für den Inhalt",
          body: [`${LEGAL_OPERATOR}`],
        },
        {
          heading: "Haftung für Inhalte und Links",
          body: [
            "Die Inhalte dieser Seite werden mit Sorgfalt erstellt. Für externe Links wird keine Gewähr übernommen; für deren Inhalte sind ausschliesslich die jeweiligen Betreiber verantwortlich.",
          ],
        },
        {
          heading: "Quellcode & Lizenz",
          body: [
            "Das Projekt ist quelloffen (MIT-Lizenz). Der Quellcode ist öffentlich auf GitHub einsehbar.",
          ],
        },
      ],
    };
  }
  return {
    title: "Legal Notice",
    updatedLabel: `Last updated: ${LEGAL_UPDATED.en}`,
    intro: "Provider information for this online offering.",
    sections: [
      {
        heading: "Provider",
        body: [`${LEGAL_OPERATOR}`, `${LEGAL_ADDRESS}`, `Email: ${LEGAL_EMAIL}`],
      },
      { heading: "Responsible for content", body: [`${LEGAL_OPERATOR}`] },
      {
        heading: "Liability for content and links",
        body: [
          "The content of this site is created with care. No warranty is given for external links; their content is the sole responsibility of the respective operators.",
        ],
      },
      {
        heading: "Source code & licence",
        body: [
          "The project is open source (MIT licence). The source code is publicly available on GitHub.",
        ],
      },
    ],
  };
}

export function legal(lang: Lang): { privacy: LegalDoc; imprint: LegalDoc } {
  return { privacy: privacy(lang), imprint: imprint(lang) };
}
