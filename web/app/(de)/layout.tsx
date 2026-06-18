import type { Metadata } from "next";
import { RootShell, baseMetadata, viewport } from "../shell";

export { viewport };

export const metadata: Metadata = {
  ...baseMetadata,
  title: "auditor — Multi-Agenten-Audit-Master-Prompts",
  description:
    "Master-Prompts, die jeden KI-Coding-Agenten in einen Schwarm spezialisierter Auditoren verwandeln — belegbasiert, adversariell verifiziert, als deutsche oder englische GitHub-Issues.",
  alternates: {
    canonical: "/de",
    languages: { en: "/", de: "/de", "x-default": "/" },
  },
  openGraph: {
    type: "website",
    url: "/de",
    locale: "de_DE",
    siteName: "auditor",
  },
};

export default function DeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <RootShell lang="de">{children}</RootShell>;
}
