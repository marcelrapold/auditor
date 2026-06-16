# auditor — web

The landing page for the [auditor](https://github.com/marcelrapold/auditor) master-prompt
library, served at [auditor.rapold.io](https://auditor.rapold.io).

> [!NOTE]
> **Management summary.** A single-page Next.js 16 site that presents the audit library, the
> shared six-phase method, and the two governing standards. It is **ZVV-Atlas-conformant** — it
> follows the Atlas tech stack and conventions (Next.js 16 App Router, Tailwind v4, shadcn/ui
> new-york + neutral with HSL CSS-variable tokens, next-themes, framer-motion) — but ships
> auditor's own brand (an emerald "verified" accent) and uses **no ZVV brand assets**, so it
> stays clean for a public repo with no private dependency.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Styling | Tailwind v4 (`@tailwindcss/postcss`) |
| Components | shadcn/ui conventions (new-york, neutral, CSS variables) |
| Theme | next-themes (class strategy, dark default) |
| Motion | framer-motion (respects `prefers-reduced-motion`) |
| Icons | lucide-react + an inline GitHub mark |
| Hosting | Vercel |

## Local development

```bash
cd web
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build
npm run start      # serve the production build
npm run typecheck  # tsc --noEmit
```

## Structure

```
web/
├── app/
│   ├── globals.css        design tokens (HSL) + Tailwind v4 @theme mapping + reveal CSS
│   ├── layout.tsx         fonts, metadata (canonical, OG), ThemeProvider
│   ├── page.tsx           the landing page (server component + client islands) + JSON-LD
│   ├── not-found.tsx      branded 404
│   ├── icon.svg           favicon (ShieldCheck mark)
│   ├── apple-icon.tsx     180×180 apple-touch-icon (next/og)
│   ├── opengraph-image.tsx  1200×630 social card (next/og)
│   ├── manifest.ts        PWA web app manifest
│   ├── robots.ts          robots.txt
│   └── sitemap.ts         sitemap.xml
├── components/
│   ├── reveal.tsx          scroll-in reveal (CSS + IntersectionObserver, reduced-motion aware)
│   ├── theme-provider.tsx  next-themes wrapper
│   ├── theme-toggle.tsx    light/dark toggle
│   ├── mobile-nav.tsx      mobile disclosure navigation
│   ├── icons.tsx           inline GitHub mark
│   └── ui/                 button (buttonVariants), badge (cva)
└── lib/
    ├── content.ts      audits, principles, phases, standards, nav (single source)
    ├── site.ts         SITE_URL, TITLE, DESCRIPTION (shared by metadata/robots/sitemap)
    └── utils.ts        cn()
```

To change the content (audits, phases, copy), edit `lib/content.ts`.

## Deploy to Vercel

The Vercel project's **Root Directory must be `web`** (this is a monorepo; the site lives in a
subfolder). Production domain: `auditor.rapold.io`.

### Option A — Vercel CLI (copy-paste)

```bash
# from the repo root
npm i -g vercel            # or: npx vercel@latest

# link this folder to a Vercel project (set Root Directory = web when asked)
cd web
vercel link

# first production deploy
vercel --prod

# attach the custom domain to the project
vercel domains add auditor.rapold.io
```

`vercel domains add` prints the DNS record to create. Because `rapold.io` is on **Cloudflare**,
add this record there (DNS-only, grey cloud — do not proxy a Vercel deploy):

```
Type:   CNAME
Name:   auditor
Target: cname.vercel-dns.com
Proxy:  DNS only (grey cloud)
```

Vercel issues the TLS certificate automatically once the record resolves.

### Option B — Claude Code Vercel skills

If you drive this from Claude Code, these skills wrap the same flow:

- `/vercel:status` — show the linked project, recent deployments, and env overview.
- `/vercel:deploy` — preview deploy; `/vercel:deploy prod` — production deploy.
- `/vercel:env` — list, pull, add, remove, or diff environment variables.

There is also a `vercel:deployment-expert` agent for CI/CD, preview URLs, rollbacks, and domain
configuration.

### Environment variables

None are required. Optionally set `NEXT_PUBLIC_APP_URL` to the canonical URL so Open Graph and
`metadataBase` resolve correctly:

```bash
vercel env add NEXT_PUBLIC_APP_URL production   # value: https://auditor.rapold.io
```

## Notes

- Build output is fully static (`○ (Static)`), so it serves from Vercel's edge with no runtime.
- The site follows the project's own [documentation standard](../DOCUMENTATION-STANDARD.md):
  sentence-case headings, no emojis in headings, accessible motion and contrast.
