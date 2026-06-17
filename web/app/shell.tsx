import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { DESCRIPTION, SITE_URL, TITLE } from "@/lib/site";
import type { Lang } from "@/lib/i18n";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

// Mono is only used for small labels (eyebrows/badges/footer), never the LCP
// element — keep it off the critical preload path.
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-jetbrains",
  display: "swap",
  preload: false,
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

// Locale-agnostic metadata shared by both root layouts (/ and /de). Each locale
// layout spreads this and overrides title/description/alternates/openGraph.
// twitter intentionally omits title/description so Next derives them per route.
export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "auditor",
  authors: [{ name: "Marcel Rapold" }],
  keywords: [
    "security audit",
    "code review",
    "AI agents",
    "prompt engineering",
    "OWASP",
    "documentation standard",
  ],
  twitter: {
    card: "summary_large_image",
  },
};

/**
 * The single HTML shell. Each locale has its own root layout (route groups
 * `(en)` and `(de)`) so the document `<html lang>` is correct per route for
 * assistive tech and crawlers (WCAG 3.1.1). The global 404 reuses this too.
 */
export function RootShell({
  lang,
  children,
}: Readonly<{ lang: Lang; children: React.ReactNode }>) {
  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
