import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { legal } from "@/lib/legal";

const LANG = "de" as const;
const PATH = "/de/impressum";
const EN_PATH = "/imprint";
const doc = legal(LANG).imprint;

export const metadata: Metadata = {
  title: `${doc.title} — auditor`,
  description: doc.intro,
  alternates: {
    canonical: PATH,
    languages: { en: EN_PATH, de: PATH, "x-default": EN_PATH },
  },
  openGraph: { type: "website", url: PATH, title: doc.title, description: doc.intro },
};

export default function Page() {
  return <LegalPage lang={LANG} doc={doc} langHref={EN_PATH} />;
}
