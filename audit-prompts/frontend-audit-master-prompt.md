# Frontend Excellence Audit — Master Orchestration Prompt

> **Mission:** Subject the target frontend to the most rigorous, multi-perspective audit
> achievable. Deploy a swarm of specialist agents, each operating at the level of a
> world-class domain expert (staff-engineer and staff-designer grade at a top-decile
> product company). The output must be exceptional: every finding evidence-backed,
> adversarially verified, severity-scored, and translated into a prioritized, actionable
> roadmap. Token cost is explicitly NOT a constraint — exhaustiveness and correctness are
> the only success criteria.
>
> **Universality:** This prompt is product-type and stack agnostic. It applies unchanged
> to SaaS, e-commerce, marketplaces, content/editorial sites, marketing sites, web apps,
> PWAs, dashboards, and government/institutional sites, on any framework or none. Agents
> adapt their mandate to what the target actually is (Phase 0 decides); mandates that
> reference surfaces the target lacks (e.g., pricing page, checkout, search) are applied
> conditionally and logged as "not applicable" rather than skipped silently.

---

## How to use this prompt

Paste this entire document into your agent orchestrator (Claude Code with `ultracode` /
Workflow mode recommended) together with the **target**:

```
TARGET: <URL and/or local repo path>
SCOPE: <all pages | specific flows, e.g. "landing → signup → onboarding → core task">
AUDIENCE: <who the product serves, if known>
BUSINESS GOAL: <primary success event — e.g. signup, purchase, lead, booking,
               subscription, article read-through, task completion, return visit>
```

If any of these are unknown, Phase 0 must infer them from the product itself and state
its assumptions explicitly in the final report.

---

## Operating principles (binding for every agent)

1. **Evidence or it didn't happen.** Every finding cites concrete evidence: a file/line
   reference, a DOM selector, a screenshot description, a measured metric, a quoted string
   of copy, or a reproducible interaction sequence. "The navigation feels cluttered" is
   rejected; "The primary nav exposes 11 top-level items (`header nav > ul > li`),
   exceeding the 5–7 range supported by Hick's Law and observed at every top-decile SaaS
   property" is accepted.
2. **Cite the principle, not vibes.** Each finding names the law, heuristic, guideline, or
   benchmark it violates (e.g., WCAG 2.2 SC 2.4.7, Nielsen heuristic #1, Fitts's Law,
   Core Web Vitals INP < 200 ms, Google SEO Starter Guide).
3. **Severity is earned, not asserted.** Use the severity scale below. An agent claiming
   P0 must articulate the user/business harm chain explicitly.
4. **Adversarial humility.** Every finding will be attacked by independent skeptic agents
   in Phase 3. Write findings so they survive: include the refutation you anticipated and
   why it fails.
5. **Praise what is excellent.** A world-class audit also identifies what must NOT be
   changed. Each specialist returns its top 3 "protect this" observations.
6. **No silent truncation.** If an agent samples (e.g., audits 10 of 40 pages), it must
   state exactly what was skipped and why the sample is representative.
7. **Fix-forward.** Every confirmed finding ships with a concrete remediation: code
   snippet, copy rewrite, design pattern reference, or config change — not just a diagnosis.

### Severity scale

| Level | Definition |
|---|---|
| **P0 — Critical** | Blocks task completion, loses revenue, legal/accessibility exposure (WCAG A failures), or destroys trust for a meaningful user segment. |
| **P1 — High** | Significant friction in a core flow; measurable conversion, comprehension, or performance harm. |
| **P2 — Medium** | Clear deviation from best practice; cumulative quality erosion; polish gaps a discerning user notices. |
| **P3 — Low** | Refinement opportunity; consistency nit; future-proofing. |

Each finding also gets an **effort estimate** (S/M/L/XL) and a computed
**priority score = impact × confidence ÷ effort** (ICE).

---

## Phase 0 — Reconnaissance (1–2 agents, sequential, feeds everyone else)

Before any specialist runs, build the shared map every agent receives:

- **Product model:** What is this product? Who is it for? What is the #1 job-to-be-done?
  What is the primary conversion event? What stage of trust is a first-time visitor in?
- **Surface inventory:** Every route/page/screen in scope, grouped into flows
  (acquisition → activation → core usage → retention surfaces). Include error pages,
  empty states, auth screens, emails-with-links if present.
- **Tech stack fingerprint:** Framework, rendering strategy (SSR/SSG/CSR/ISR), CSS
  approach, component library, analytics, fonts, image pipeline, hosting/CDN.
- **Critical user journeys (CUJs):** The 3–5 paths that carry the business. These get
  double audit coverage.
- **Competitive frame:** Name 3 best-in-class references for this product category that
  Phase 4 will benchmark against.

Output: a structured brief (`recon.json` shape) distributed to all Phase 1 agents.

---

## Phase 1 — Specialist swarm (16 parallel agents)

Each agent receives the recon brief, its mandate below, and returns findings in the
**shared finding schema** (bottom of this document). Each agent must be exhaustive
within its mandate — inspect every in-scope surface, not a sample, unless it logs the
sampling decision.

### Agent 1 — Usability heuristics
Mandate: Full Nielsen 10-heuristic evaluation plus ISO 9241-110 dialogue principles
across every screen. For each heuristic, walk every CUJ asking: visibility of system
status, match to real-world mental models, user control & undo, consistency (internal
and platform), error prevention, recognition over recall, flexibility/accelerators,
minimalist design, error recovery, help/documentation. Score each heuristic 0–10 per flow.

### Agent 2 — Cognitive & behavioral psychology
Mandate: Audit through the lens of decision science. Specifically test for:
- **Cognitive load** (intrinsic/extraneous/germane): count decisions, fields, and novel
  concepts per screen; flag screens exceeding working-memory limits (Miller, Sweller).
- **Hick's Law** (choice-set sizes), **Fitts's Law** (target size/distance for primary
  actions), **Jakob's Law** (convention adherence), **Tesler's Law** (complexity dumped
  on the user that the system should absorb).
- **Peak–end rule**: what are the emotional peaks and the ending of each CUJ? Are they
  designed or accidental?
- **Goal-gradient & progress mechanics** in multi-step flows.
- **Loss aversion, anchoring, social proof, authority, scarcity** — where used, are they
  honest and effective? Where absent, where would ethical persuasion materially help?
- **Dark pattern sweep** (deceptive patterns taxonomy: confirmshaming, roach motel,
  forced continuity, disguised ads, trick wording, obstruction). Any hit is automatic P0/P1
  with regulatory context (FTC, EU DSA/Omnibus).
- **Default effects and friction asymmetry**: is the happy path the easy path?

### Agent 3 — Visual design & typography
Mandate: Audit visual hierarchy, grid discipline, spacing system (is there a consistent
scale — 4/8pt — or ad-hoc values?), type system (scale ratio, line-height, measure
45–75 ch, hierarchy depth, font pairing, rendering quality), color system (semantic
roles, contrast pairs, dark-mode integrity if present), iconography consistency,
elevation/shadow logic, border-radius consistency, density appropriateness for the
audience. Compare against the polish bar of the best-in-class references named in
Phase 0. Identify the 5 visual decisions most responsible for the current quality ceiling.

### Agent 4 — Accessibility (WCAG 2.2 AA, targeting AAA where cheap)
Mandate: Full conformance sweep: semantic HTML correctness (landmarks, headings outline,
lists, buttons-vs-links), keyboard operability of every interactive element (tab order,
focus visible, no traps, skip links), screen-reader experience (accessible names, ARIA
used correctly — and flag ARIA that should be native HTML), forms (labels, error
association via `aria-describedby`, autocomplete attributes), contrast (text 4.5:1,
large text & UI components 3:1), target size (24×24 minimum, SC 2.5.8), motion
(`prefers-reduced-motion` respected), zoom/reflow at 200%/400%, focus management in
SPAs (route changes announced, focus moved), media alternatives. Map every failure to
its SC number. Note legal exposure (ADA, EAA 2025, EN 301 549).

### Agent 5 — Performance & Core Web Vitals
Mandate: Audit LCP (< 2.5 s), INP (< 200 ms), CLS (< 0.1) per key page, plus TTFB,
bundle composition (total JS, unused JS, duplicate deps, tree-shaking failures),
image pipeline (formats, responsive `srcset`, lazy-loading, dimensions set), font
loading strategy (`font-display`, preload, subsetting), render-blocking resources,
hydration cost and strategy, caching headers/CDN behavior, third-party script weight
and loading discipline, long tasks, layout-shift culprits. Run or reason from Lighthouse/
field data where available; otherwise audit code-level causes. Every finding includes the
estimated metric improvement of the fix.

### Agent 6 — Technical SEO
Mandate: Crawlability (robots.txt, sitemap.xml, internal linking depth, orphan pages),
indexability (canonicals, noindex misuse, parameter handling, duplicate content),
metadata (unique titles 50–60 ch, descriptions 140–160 ch, heading hierarchy with one
H1), structured data (Organization, Product, FAQ, Breadcrumb, Article as applicable —
validate shape), Open Graph/Twitter cards on every shareable page, hreflang if
multilingual, URL architecture (readable, stable, hyphenated), pagination handling,
JS-rendering risk for crawlers, image SEO (alt text doubling as keyword surface, file
names), Core Web Vitals as ranking input (cross-reference Agent 5). E-E-A-T signals:
author/company credibility surfaces, about/contact/legal pages.

### Agent 7 — Content strategy & microcopy
Mandate: Audit every string a user reads. Value proposition clarity (can a stranger say
what this product does, for whom, and why it's better within 5 seconds on the hero?),
benefit-vs-feature balance, reading level (aim ≈ grade 7–9 for broad audiences), voice
and tone consistency, CTA copy (verb-first, specific, value-loaded — "Start free trial"
not "Submit"), error messages (human, blame-free, recovery-oriented), empty states
(educational, action-prompting), confirmation/success moments, button/label/menu
terminology consistency (one concept = one word everywhere), jargon audit, microcopy at
anxiety points (pricing, credit-card forms, data permissions).

### Agent 8 — Conversion & funnel (CRO)
Mandate: Walk every step from entry to the primary success event (as defined in Phase 0 —
purchase, signup, lead, booking, read-through, task completion) as a skeptical, busy,
first-time visitor. Audit: above-the-fold persuasion stack (headline, subhead, proof,
CTA, visual), friction inventory (every click, field, decision, and load between arrival
and the success event — count them), trust architecture (logos, testimonials with faces/
names/specifics, security badges at payment, guarantees, social proof freshness), pricing
or offer-page psychology where present (anchoring, option naming, decoy structure,
billing-period framing, FAQ objection handling), form conversion (cross-ref Agent 12),
urgency/risk-reversal mechanics, exit points and leak analysis, post-conversion momentum
(what happens in the first 60 seconds after the success event?). Estimate conversion
impact of top findings.

### Agent 9 — Information architecture & navigation
Mandate: Card-sort the actual content: does the navigation taxonomy match user mental
models or org-chart thinking? Audit: labeling clarity (front-loaded keywords, no clever-
but-vague labels), nav depth vs breadth, current-location signaling (active states,
breadcrumbs where depth ≥ 3), footer as secondary sitemap, search (if present: placement,
tolerance for typos, zero-results experience), cross-linking between related surfaces,
URL structure as IA mirror, findability test: pick the 10 most important user intents and
score how many clicks/decisions each takes from the homepage.

### Agent 10 — Responsive & cross-device
Mandate: Audit at 320, 375, 768, 1024, 1440, 1920+ widths. Touch targets ≥ 44×44 pt with
8 pt spacing on mobile, thumb-zone placement of primary actions, hover-dependent
functionality with no touch fallback, viewport meta correctness, horizontal-scroll leaks,
fixed-element stacking and keyboard-overlap on mobile, responsive images actually serving
smaller files, tables/data-grids on small screens, orientation handling, foldable/
ultra-wide sanity, print styles if content warrants.

### Agent 11 — Interaction design, states & motion
Mandate: For every interactive component enumerate its full state matrix: default, hover,
focus, active, disabled (with explanation affordance), loading, success, error, empty.
Flag any component missing states. Audit feedback latency rules (instant acknowledgment
< 100 ms, spinner ≥ 1 s, skeleton + progress for longer), optimistic UI opportunities,
animation audit (durations 150–300 ms for micro-interactions, easing curves, purposeful
vs decorative, `prefers-reduced-motion` compliance — cross-ref Agent 4), scroll behavior
(restoration, anchoring, hijacking violations), drag/swipe affordances, undo vs confirm
dialogs (prefer undo), destructive-action protection.

### Agent 12 — Forms & input UX
Mandate: Audit every form: field count vs necessity (each field costs conversion — justify
every one), label placement (top-aligned), input types and `inputmode` for mobile
keyboards, `autocomplete` attributes for autofill, validation timing (validate on blur,
re-validate on input after error — never only on submit), error message quality and
placement, password UX (show toggle, requirements upfront, paste allowed, strength
meter), multi-step structure (progress, back-navigation safety, data persistence),
smart defaults and prefill, address/phone international tolerance, file-upload
affordances, success confirmation. Score each form 0–100.

### Agent 13 — Frontend code quality & architecture
Mandate (repo access required, else skip with note): Stack-agnostic — adapt to whatever
the target uses (React, Vue, Svelte, Angular, Astro, server-rendered templates, plain
HTML/JS). Audit: component/module architecture (composition, coupling, server/client
boundaries where applicable), semantic HTML in components/templates, state management
hygiene (derived state recomputed not stored, single source of truth), lifecycle/effect
misuse, render performance (memoization where measured, list virtualization for long
lists, stable keys), error-boundary and loading-state discipline, design-token usage vs
hardcoded values, dead code and duplicate components, dependency health (outdated,
vulnerable, abandonware), type-safety posture (if a typed language is in use), testing
posture for critical flows, CSS architecture (specificity wars, unused styles,
!important density).

### Agent 14 — Trust, security & privacy perception
Mandate: Audit what makes users feel (and be) safe: HTTPS everywhere with no mixed
content, security headers (CSP, HSTS, X-Frame-Options — as perceivable quality signal),
cookie-consent UX (compliant AND non-hostile — reject must equal accept in effort, GDPR/
ePrivacy), privacy policy/imprint reachability, data-permission requests with
contextual justification, payment-surface trust signals, error pages that don't leak
stack traces, account-security UX (2FA discoverability, session messaging), email
sender/domain alignment if auth emails in scope, perceived-permanence signals (last-
updated dates, changelog, active blog).

### Agent 15 — Internationalization & localization readiness
Mandate: Even if currently single-locale: hardcoded strings vs extraction, date/number/
currency formatting via Intl APIs, layouts that survive +35% German string expansion,
RTL feasibility (logical CSS properties vs left/right), locale-aware sorting/collation,
translatable images-with-text, `lang` attributes correct (including inline language
switches), hreflang (cross-ref Agent 6), cultural assumptions in icons/colors/imagery,
timezone handling in displayed times.

### Agent 16 — First impressions, brand & emotional design
Mandate: Simulate the 5-second test on every entry page: what does a stranger believe
this product is, and does that match intent? Audit aesthetic-usability leverage (does
the visual quality match the price point and audience sophistication?), brand
distinctiveness (would this be recognizable with the logo removed, or is it template-
generic?), emotional arc across the CUJ (where is delight engineered — and is it ever?),
imagery/illustration quality and consistency, favicon/OG-image/PWA-icon polish, loading
experience as first touchpoint, 404/error pages as brand moments, memorable details
inventory (the small, deliberate touches that signal craft).

---

## Phase 2 — Cross-pollination barrier

After all 16 specialists return: a synthesis agent merges the finding pool, **dedupes**
overlapping findings (same root cause reported by multiple lenses → merge, keep all
lens-citations — multi-lens findings get a confidence boost), and identifies
**compound findings** where two P2s interact to create a P1 (e.g., slow LCP × weak hero
copy = first-impression failure).

---

## Phase 3 — Adversarial verification (the findings gauntlet)

Every P0/P1 finding, and every P2 the synthesis flagged as compound or uncertain, is
attacked by **3 independent skeptic agents** with distinct lenses:

1. **The Refuter:** "Prove this finding wrong. Is the cited evidence real? Is the cited
   principle actually violated, or misapplied? Default to refuted if uncertain."
2. **The Context Defender:** "Is this a deliberate, defensible product decision rather
   than an error? Would the fix harm another dimension (e.g., the SEO fix that hurts
   UX)?"
3. **The Impact Auditor:** "Is the severity honest? Re-derive the harm chain from
   scratch. Re-score independently."

A finding survives with ≥ 2/3 confirmations; severity is set to the median of the three
independent scores. Killed findings are listed in an appendix with the refutation —
transparency over tidiness.

---

## Phase 4 — World-class benchmark

For the top 10 surviving findings plus the 3 CUJs, a benchmark agent compares the
target's pattern against the named best-in-class references from Phase 0: what exactly
does the category leader do at this same moment in the journey, and what transferable
mechanic explains why it works? Output: concrete pattern references, not "be more like
[leader]."

---

## Phase 5 — Synthesis & deliverables

A final synthesis agent (with a **completeness critic** pass: "which mandate was
under-covered, which claim is still unverified?") produces:

### 1. Executive summary (≤ 1 page)
The 3 sentences a founder needs: current quality verdict, the single biggest lever, the
realistic ceiling after remediation.

### 2. Scorecard
0–100 per dimension (one row per Phase 1 agent), with a one-line justification each and
an overall weighted score. Weighting: CUJ-affecting dimensions × 2.

### 3. Prioritized backlog
Every surviving finding as: `[Px] [Effort S/M/L/XL] [ICE score] Title — evidence —
principle violated — concrete fix (code/copy/pattern) — expected impact`. Sorted by ICE.

### 4. Quick-wins sprint
Everything shippable in ≤ 1 day of work with disproportionate impact, as a checklist.

### 5. "Do not touch" list
The protected excellence inventory from all agents.

### 6. Strategic roadmap
30/60/90-day sequencing of the backlog, dependency-aware (e.g., design tokens before
visual polish; IA before SEO restructure).

### 7. Re-audit criteria
Measurable exit conditions per P0/P1 so a follow-up audit is pass/fail, not vibes.

### Appendices
A: Killed findings with refutations. B: Coverage map (every page × every agent — what
was actually inspected). C: Assumptions registry from Phase 0.

---

## Issue output — mandatory (see [`ISSUE-OUTPUT-STANDARD.md`](../ISSUE-OUTPUT-STANDARD.md))

After Phase 3 verification, turn surviving findings into GitHub issues — **German by default**
(`OUTPUT_LANG`); preview/dry-run first, created only on explicit authorization + repo access.
Two-part contract:

1. **Tracking issue first** — `[AUDIT] Frontend — Befund-Tracker & Roadmap`. Body: a management
   summary (verdict, biggest lever, realistic ceiling), the scorecard, a **priority-sorted
   checklist** (P0→P3, then ICE) where each line links its child issue, and the 30/60/90 roadmap.
   Labels: `audit`, `tracking`, `frontend`.
2. **One issue per surviving finding** — top-notch, German, each opening with its own
   **management summary** (2–3 sentences: what, impact, one-line recommendation), then the full
   finding (severity + ICE, principle violated, surfaces, evidence, harm chain, concrete
   before/after fix, effort, expected impact). Labels: `audit`, `sev:p0…p3`, `domain:<x>`,
   `effort:S|M|L`; back-link to the tracking issue.

Create child issues first, collect their numbers, then create/update the tracking issue so its
checklist links resolve. Detect existing audit issues by label and update rather than duplicate.

---

## Shared finding schema (all agents)

```json
{
  "id": "A04-017",
  "agent": "accessibility",
  "title": "Modal dialogs trap neither focus nor escape",
  "severity": "P0",
  "confidence": 0.95,
  "effort": "S",
  "surfaces": ["/checkout", "/settings"],
  "evidence": "Dialog at components/Modal.tsx:41 renders without focus trap; Tab reaches background content; Esc not handled.",
  "principle": "WCAG 2.2 SC 2.1.2 No Keyboard Trap (inverse), 2.4.3 Focus Order; ARIA APG dialog pattern",
  "harm_chain": "Keyboard/SR users cannot complete checkout → direct revenue loss + legal exposure",
  "fix": "Adopt native <dialog> with showModal() or focus-trap lib; restore focus to invoker on close. ~20 LOC.",
  "expected_impact": "Restores checkout for keyboard users; removes WCAG A failure",
  "anticipated_refutation": "‘Mouse users unaffected’ — irrelevant: SC 2.1.1 requires full keyboard operability; also affects power users."
}
```

---

## Definition of done (self-check before delivering)

- [ ] Every in-scope surface and the critical user journeys were inspected; any sampling was logged.
- [ ] Every surviving finding cites concrete evidence and survived (or was downgraded by) the Phase 3 gauntlet.
- [ ] Each finding names the law/heuristic/guideline it violates and ships a concrete fix.
- [ ] WCAG failures are mapped to their SC numbers; performance findings carry an estimated metric gain.
- [ ] The "do not touch" / protected-excellence inventory is included.
- [ ] Coverage map and assumptions appendices are complete and honest.
- [ ] The target was left unmodified.

---

## Execution notes for the orchestrator

- Phase 1 agents run **fully parallel**; Phases 2–3 pipeline per-finding (verify each
  finding as soon as its dedupe completes — no global barrier except the Phase 2 merge).
- If repo AND live URL are both available, agents must cross-validate (code says X,
  rendered output shows Y).
- Budget guidance: this audit is intentionally expensive. Prefer a second verification
  round over an unverified claim. If a token budget is set, scale finder depth, never
  skip Phase 3 verification.
- Language of all output: English. Tone: direct, specific, zero filler.
