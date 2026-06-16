# Accessibility (a11y) Audit — Master Orchestration Prompt

> **Mission:** Subject the target to a rigorous, standards-grade accessibility audit against
> **WCAG 2.2 AA** (targeting AAA where cheap) and the platform accessibility APIs. Deploy a
> swarm of specialist agents that each own a slice of the disability-experience surface —
> keyboard, screen reader, low vision, motor, cognitive, motion. Every finding evidence-backed,
> mapped to a specific Success Criterion, adversarially verified, severity-scored, and turned
> into a prioritized remediation roadmap with real code fixes.
>
> **Universality:** Stack- and platform-agnostic. Applies to web apps, marketing sites, design
> systems, PWAs, and (via the platform a11y mandate) native mobile and desktop. Legal lens
> includes the **EU Accessibility Act (EAA, in force June 2025)**, EN 301 549, ADA, and
> Section 508. This audit goes **deeper on a11y than the frontend audit** and is the one to run
> when conformance is the goal. Phase 0 decides scope; non-applicable mandates are logged,
> never skipped silently.

---

## How to use this prompt

```
TARGET:        <repo path and/or running URL/app>
SCOPE:         <all surfaces | specific flows, e.g. signup → checkout>
PLATFORM:      <web | iOS | Android | desktop | design-system>
CONFORMANCE:   <target level: WCAG 2.2 AA (default) | AAA where feasible>
LEGAL_CONTEXT: <EU/EAA | US/ADA-508 | global>
DATA_ACCESS:   <can run AT / keyboard / automated scanners? or code-only?>
OUTPUT_LANG:   <English (default) | Deutsch | ...>
```

If unknown, Phase 0 infers from the product and states assumptions. Prefer testing with real
assistive technology where available; otherwise audit at the code/DOM level and flag the limit.

---

## Operating principles (binding for every agent)

1. **Evidence or it didn't happen.** Cite the concrete artifact: DOM selector / component
   `file:line`, the computed accessible name, a contrast ratio with both hex values, a
   keyboard-interaction sequence, or an AT-announcement transcript. No evidence → discarded.
2. **Cite the SC.** Every finding names its WCAG **Success Criterion** (e.g., 1.4.3, 2.1.1,
   2.4.7, 2.5.8, 4.1.2) and conformance level (A/AA/AAA). "Hard to use" is rejected.
3. **Center the disabled user, not the checklist.** State *who* is blocked and *how* (blind +
   screen reader, low vision + zoom, motor + keyboard-only, cognitive, deaf/HoH, vestibular).
4. **Severity is earned.** P0–P3; a P0 blocks a user group from completing a core task or is a
   WCAG **Level A** failure on a critical path.
5. **Adversarial humility.** Every finding is attacked in Phase 3; pre-empt the refutation.
6. **Praise what is excellent.** Each specialist returns its top 3 "protect this" items.
7. **Fix-forward.** Every confirmed finding ships a concrete remediation: semantic HTML, an
   ARIA correction (or its removal in favor of native), a focus fix, a contrast token change.

### Severity scale

| Level | Definition |
|---|---|
| **P0 — Critical** | Blocks a user group from completing a core task (keyboard trap, unlabeled critical control, inaccessible checkout) or a WCAG **Level A** failure on a critical path → direct legal exposure. |
| **P1 — High** | Level AA failure on a core flow; significant barrier (poor focus management in an SPA, contrast failures on key text, forms without error association). |
| **P2 — Medium** | AA failure off the critical path, or cumulative barriers a discerning AT user hits. |
| **P3 — Low** | AAA opportunities, polish, and robustness hardening. |

Each finding gets **effort (S/M/L/XL)** and **priority = impact × confidence ÷ effort**.

---

## Phase 0 — Reconnaissance (run first, feeds every agent)

- **Surface inventory:** every route/screen/component in scope, grouped into flows; include
  error states, modals, toasts, auth screens, and the **critical user journeys** (double coverage).
- **Tech fingerprint:** framework, rendering model (SPA route changes are a focus-management
  hotspot), component library, design tokens, existing a11y tooling (axe, linters, tests).
- **AT/test matrix:** which assistive tech and viewports are testable (screen readers, keyboard,
  200%/400% zoom, reduced-motion, high-contrast, voice control).
- **Conformance target & legal frame:** WCAG version/level and the applicable law.

Output: a structured brief distributed to all Phase 1 agents.

---

## Phase 1 — Specialist swarm (parallel agents)

### X1 — Semantic structure & landmarks
Correct document structure: one logical heading outline (no skipped levels, one H1 per page),
landmark regions (header/nav/main/footer), lists as lists, tables with headers/scope,
buttons-vs-links used by behavior (action vs navigation), and native elements preferred over
`div`+ARIA. SC 1.3.1, 2.4.1, 2.4.6, 4.1.2.

### X2 — Keyboard operability
Every interactive element reachable and operable by keyboard, logical tab order matching
visual order, **no keyboard traps**, visible skip links, custom widgets implementing the WAI-
ARIA APG keyboard pattern (menu, combobox, tabs, dialog, tree), and no mouse-only
interactions. SC 2.1.1, 2.1.2, 2.4.3, 2.1.4 (character key shortcuts).

### X3 — Focus management & visibility
Visible focus indicator meeting 2.4.11/2.4.13 (not removed by `outline:none`), focus moved and
trapped correctly in modals and restored on close, route-change focus handling in SPAs,
focus not lost on dynamic content, and focus order through disclosure/expanding content.
SC 2.4.7, 2.4.11, 3.2.1.

### X4 — Screen-reader experience
Accessible names and roles for every control (computed name verified, not assumed), correct
ARIA usage — and **flagging ARIA that should be native HTML** (the first rule of ARIA),
live-region announcements for async updates/errors/toasts, state communicated
(`aria-expanded/selected/checked/current`), decorative images hidden, meaningful images with
alt. SC 1.1.1, 4.1.2, 4.1.3.

### X5 — Color & contrast
Text contrast ≥ 4.5:1 (3:1 for large text), UI component and graphical-object contrast ≥ 3:1
(SC 1.4.11), color not the sole means of conveying information (SC 1.4.1), link distinction,
focus-indicator contrast, and dark-mode integrity. Report ratios with both hex values.

### X6 — Forms, inputs & errors
Programmatic labels for every field (not placeholder-as-label), error identification and
**association** via `aria-describedby`, error suggestions, `autocomplete` tokens (SC 1.3.5),
required/invalid states exposed, grouping with fieldset/legend, and accessible custom inputs
(date pickers, comboboxes). SC 1.3.1, 3.3.1, 3.3.2, 3.3.3, 4.1.2.

### X7 — Low vision: zoom, reflow & spacing
Reflow at 320 CSS px / 400% zoom with no loss of content or horizontal scroll (SC 1.4.10),
text resize to 200% (1.4.4), text-spacing override support (1.4.12), content not clipped, and
responsive layouts that survive magnification. Fixed pixel sizing that breaks on zoom is graded here.

### X8 — Motor & target size
Target size ≥ 24×24 CSS px (SC 2.5.8 AA; 44×44 where AAA/mobile), adequate spacing, no
path-based/dragging-only gestures without alternative (2.5.7), pointer cancellation (2.5.2),
generous hit areas for primary actions, and no timing that a motor-impaired user can't meet
(2.2.1). New WCAG 2.2 criteria (2.4.11, 2.5.7, 2.5.8, 3.2.6, 3.3.7, 3.3.8) explicitly checked.

### X9 — Motion, time & media
`prefers-reduced-motion` respected for animation/parallax/auto-play, no content flashing > 3×/s
(2.3.1, seizure risk = P0), pause/stop/hide for moving content (2.2.2), adjustable timeouts
(2.2.1), captions and transcripts for media (1.2.x), and audio control.

### X10 — Cognitive accessibility
Clear language and instructions, consistent navigation and identification (3.2.3, 3.2.4),
error prevention for legal/financial actions (3.3.4), help availability (3.3.5), no redundant-
entry burden (3.3.7 WCAG 2.2), accessible authentication without a cognitive-function test
(3.3.8 WCAG 2.2), and predictable behavior (no context change on focus/input).

### X11 — Robustness, parsing & AT compatibility
Valid name/role/value for custom components across AT, no duplicate IDs breaking associations,
status messages via `role="status"`/`aria-live` (4.1.3), and graceful behavior across
screen-reader + browser pairings. Design-system components audited once and reused.

### X12 — Automated + manual coverage & conformance reporting
Run available automated scanners (axe/Lighthouse) AND manual checks (automation catches
~30–40% of issues — name what it can't). Produce a **WCAG 2.2 conformance table** (every SC ×
pass/fail/NA) so the result can back a VPAT/Accessibility Statement required by the EAA.

Each agent returns a **dimension grade (A–F)** + justification and a **top-3 "protect this"**.

---

## Phase 2 — Cross-pollination barrier

Synthesis agent merges, **dedupes** (one design-system component failing across 40 pages = one
root finding, not 40), and flags **compound findings** (e.g., no focus indicator × SPA focus
loss = blind+keyboard users lost after every navigation).

## Phase 3 — Adversarial verification

Every P0/P1 (and compound/uncertain P2) is attacked by skeptics: **The Refuter** (is the SC
actually failed, or is there an accessible alternative path? is the accessible name truly
missing per the computed tree?), **The Context Defender** (does AT actually handle this fine?
would the ARIA "fix" break native semantics?), **The Impact Auditor** (re-derive which user
group is blocked and re-score against the SC). Survives with ≥ 2/3 confirmations; severity =
median. Then a **completeness critic**: "which AT pairing wasn't tested? which dynamic state
wasn't announced? which WCAG 2.2 new criterion was skipped?"

## Phase 4 — Benchmark

Compare patterns against the WAI-ARIA Authoring Practices Guide and accessible reference
implementations. Cite the correct APG pattern, not "make it accessible."

---

## Phase 5 — Synthesis & deliverables

In `OUTPUT_LANG`:

1. **Executive summary** (≤ 1 page): conformance verdict (AA: pass/partial/fail), the single
   biggest barrier, legal exposure (EAA/ADA), realistic path to conformance.
2. **WCAG 2.2 conformance table:** every applicable SC × status × evidence — VPAT-ready.
3. **Scorecard:** grade per dimension (X1–X12) + finding counts; overall weighted grade
   (Keyboard, Screen reader, Forms, Contrast count double).
4. **Verified findings register:** standard schema, each mapped to its SC; sorted by priority;
   skeptic note on P0/P1.
5. **Strengths / "do not touch" list.**
6. **Remediation roadmap:** Quick Wins (≤ 1 day) → 30/60/90 days, dependency-aware (design-
   system fixes first — they cascade), referencing IDs.
7. **Re-audit criteria:** measurable exit conditions per P0/P1 + a target conformance level.
8. **Accessibility Statement draft** (optional, EAA-relevant).
9. **GitHub issues (mandatory):** per the *Issue output* section below and
   [`ISSUE-OUTPUT-STANDARD.md`](../ISSUE-OUTPUT-STANDARD.md) — tracking issue first, then one
   issue per finding (German by default); preview-first, created only on explicit approval.

### Appendices
A: killed findings + refutations. B: coverage map (surface × AT × agent). C: assumptions & AT
matrix actually tested vs reasoned.

---

## Issue output — mandatory (see [`ISSUE-OUTPUT-STANDARD.md`](../ISSUE-OUTPUT-STANDARD.md))

After Phase 3 verification, turn confirmed findings into GitHub issues — **German by default**
(`OUTPUT_LANG`); preview/dry-run first, created only on explicit authorization + repo access.
Two-part contract:

1. **Tracking issue first** — `[AUDIT] Accessibility — Befund-Tracker & Roadmap`. Body: a
   management summary (conformance verdict, biggest barrier, legal exposure), the WCAG scorecard,
   a **priority-sorted checklist** (P0→P3, then effort/priority) where each line links its child
   issue, and the 30/60/90 roadmap (design-system fixes first). Labels: `audit`, `tracking`,
   `a11y`.
2. **One issue per confirmed finding** — top-notch, German, each opening with its own
   **management summary** (2–3 sentences: what, who is blocked, one-line recommendation), then
   the full finding (severity + WCAG SC, surfaces, evidence, who-is-blocked, concrete
   before/after fix, effort, re-audit criterion). Labels: `audit`, `sev:p0…p3`, `domain:<x>`,
   `effort:S|M|L`; back-link to the tracking issue.

Create child issues first, collect their numbers, then create/update the tracking issue so its
checklist links resolve. Detect existing audit issues by label and update rather than duplicate.

---

## Shared finding schema (all agents)

```json
{
  "id": "X4-008",
  "agent": "screen-reader",
  "title": "Icon-only cart button has no accessible name",
  "severity": "P0",
  "confidence": 0.96,
  "effort": "S",
  "surfaces": ["/ (header)", "all pages"],
  "evidence": "components/Header.tsx:54 <button><svg/></button> — computed accessible name is empty; screen reader announces 'button' with no label. Reused on every page.",
  "wcag": "SC 4.1.2 Name, Role, Value (Level A); SC 1.1.1",
  "who_is_blocked": "Blind/low-vision screen-reader users cannot find or trust the cart control → cannot check out",
  "fix": "Add aria-label=\"Cart, {n} items\" (or visually-hidden text); keep the count in the name. ~2 LOC, fixes site-wide via shared component.",
  "expected_impact": "Restores cart discovery for all AT users on every page; clears a Level A failure on the purchase path",
  "anticipated_refutation": "'The icon is obvious' — only visually; AT exposes no name, so SC 4.1.2 fails regardless of visual clarity."
}
```

---

## Definition of done (self-check before delivering)

- [ ] Every in-scope surface and critical flow was assigned; none skipped silently.
- [ ] Keyboard-only and screen-reader paths were *actually walked* (or code-audited with the limit flagged).
- [ ] Every finding is mapped to a specific WCAG 2.2 Success Criterion and level.
- [ ] The new WCAG 2.2 criteria (2.4.11, 2.5.7, 2.5.8, 3.2.6, 3.3.7, 3.3.8) were explicitly checked.
- [ ] Automated-scanner limits are stated (what it can't catch was checked manually).
- [ ] A WCAG conformance table backs the verdict (VPAT/EAA-ready).
- [ ] Design-system root causes are deduped (not reported per-instance).
- [ ] The target was left unmodified.
```
