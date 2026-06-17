import type { Metadata } from "next";
import { RootShell, baseMetadata, viewport } from "../shell";

export { viewport };

export const metadata: Metadata = {
  ...baseMetadata,
  alternates: {
    canonical: "/",
    languages: { en: "/", de: "/de" },
  },
  openGraph: {
    type: "website",
    url: "/",
    locale: "en_US",
    siteName: "auditor",
  },
};

export default function EnLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <RootShell lang="en">{children}</RootShell>;
}
