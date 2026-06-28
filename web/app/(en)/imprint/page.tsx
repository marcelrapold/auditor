import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { legal } from "@/lib/legal";

const LANG = "en" as const;
const PATH = "/imprint";
const DE_PATH = "/de/impressum";
const doc = legal(LANG).imprint;

export const metadata: Metadata = {
  title: `${doc.title} — auditor`,
  description: doc.intro,
  alternates: {
    canonical: PATH,
    languages: { en: PATH, de: DE_PATH, "x-default": PATH },
  },
  openGraph: { type: "website", url: PATH, title: doc.title, description: doc.intro },
};

export default function Page() {
  return <LegalPage lang={LANG} doc={doc} langHref={DE_PATH} />;
}
