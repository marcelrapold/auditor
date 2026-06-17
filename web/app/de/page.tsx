import type { Metadata } from "next";
import { Landing } from "@/components/landing";

export const metadata: Metadata = {
  title: "auditor — Multi-Agenten-Audit-Master-Prompts",
  description:
    "Master-Prompts, die jeden KI-Coding-Agenten in einen Schwarm spezialisierter Auditoren verwandeln — belegbasiert, adversariell verifiziert, als deutsche oder englische GitHub-Issues.",
  alternates: {
    canonical: "/de",
    languages: { en: "/", de: "/de" },
  },
  openGraph: {
    locale: "de_DE",
    url: "/de",
  },
};

export default function HomeDe() {
  return <Landing lang="de" />;
}
