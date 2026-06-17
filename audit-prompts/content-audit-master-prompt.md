# Content & Messaging Audit — Master Orchestration Prompt

> **Mission:** Subject any piece of content — a landing page, an essay, a launch post, a pitch,
> product copy, a README's prose — to the most rigorous editorial and strategic review achievable.
> This audit does not just polish sentences: it **challenges the idea**. It steelmans the strongest
> counter-argument, tests whether the thesis is true, clear, and non-obvious, benchmarks the piece
> against best-in-class content in its category, and turns every gap into a concrete, evidence-bound
> finding with a **before/after rewrite** — filed per
> [`ISSUE-OUTPUT-STANDARD.md`](../ISSUE-OUTPUT-STANDARD.md).
>
> **Universality:** Content-type and channel agnostic. Works on a URL, a file, a pasted draft, or a
> docs/marketing directory in a repo. Applies to marketing/landing copy, blog posts and essays,
> thought-leadership, product and UX copy, emails/newsletters, social posts, sales/pitch decks,
> video scripts, and release notes. The central tests are **does the idea hold up**, **does the
> reader get it and care**, and **is it better than what already exists**. Phase 0 detects the
> content type and goal and scopes accordingly; non-applicable lenses are logged, never skipped
> silently. Token cost is not a constraint — exhaustiveness and correctness are.

---

## How to use this prompt

```
TARGET:       <URL, file path, pasted text, or content directory — the content to audit>
CONTENT_TYPE: <auto-detect (default) | landing/marketing | blog/essay | thought-leadership |
               docs prose | product/UX copy | email/newsletter | social | sales/pitch |
               video script | release notes>
THESIS:       <the single claim the content must land — or let Phase 0 extract and confirm it>
AUDIENCE:     <who it must move, and their awareness stage: unaware → problem → solution →
               product → most aware>
GOAL:         <the one belief-change or action it must produce — read-through, trust, signup,
               share, reply, buy>
VOICE:        <brand voice / style-guide reference, or infer from the existing corpus>
COMPARISON:   <named best-in-class references or competitors to benchmark against — or Phase 0 picks>
DATA_ACCESS:  <may fetch live URLs / competitor pages to compare? or work from provided text only>
OUTPUT_LANG:  <Deutsch (default) | English | ...>
ISSUE_TARGET: <owner/repo for gh issue creation — preview-first, create only on approval>
```

If unknown, Phase 0 infers the content type, thesis, audience, awareness stage, and goal from the
piece itself and states its assumptions explicitly. The thesis and the goal are the yardsticks;
every finding is judged against whether it helps the reader believe the thesis and take the action.

---

## Operating principles (binding for every agent)

1. **Evidence or it didn't happen.** Quote the exact passage, headline, or sentence (with its
   location). "The intro is weak" is rejected; "the opening sentence (line 1) spends 28 words
   restating the title before the reader learns why to care" is accepted.
2. **Challenge the idea, not only the prose.** Steelman the strongest counter-argument to the
   thesis and report where the piece fails to answer it. A claim that is **true but obvious**
   (no information gain) or **confident but unsupported** is a finding, not just bad writing.
3. **Cite the reader's job and awareness stage.** Judge every passage against what the reader
   needs to think, feel, or do next given where they start. Content written for the "most aware"
   reader shown to an "unaware" one (or vice-versa) is a finding.
4. **Severity is earned.** Use the scale below. A P0 claim actively misleads, is factually wrong,
   or destroys credibility; an agent asserting P0 must name the trust/harm chain explicitly.
5. **Adversarial humility.** Every finding is attacked in Phase 3; write it to survive — include
   the refutation you anticipated and why it fails.
6. **Praise what is excellent.** Each specialist returns its top 3 "protect this" items — the
   line, hook, or move that must not be touched. A great sentence killed by a rewrite is a loss.
7. **Fix-forward with a real rewrite.** Every confirmed finding ships a concrete **before → after**
   rewrite (or 2–3 options for headlines/hooks), never "make it punchier." The rewrite preserves
   voice and meaning unless the meaning itself is the finding.
8. **Comparative lens — measure information gain.** Benchmark against the best existing content for
   this reader and goal. Commodity content that a reader could get from any of ten other sources is
   a finding even when every sentence is clean.

### Severity scale

| Level | Definition |
|---|---|
| **P0 — Critical** | Factually wrong, misleading, plagiarized, unsupported superlative/claim, or a promise the product can't keep — destroys credibility or creates legal/ethical exposure. |
| **P1 — High** | The content fails its job: thesis unclear or unsupported, the "so what" is invisible, the lede is buried, it targets the wrong awareness stage, there is no differentiation from commodity content, or the call-to-action is missing/unclear. |
| **P2 — Medium** | Clear best-practice deviation: weak hook, flabby structure, hedging/filler/jargon, passive voice where action is needed, inconsistent voice, thin evidence, poor skimmability. |
| **P3 — Low** | Polish: word choice, rhythm, a tighter headline option, redundancy, minor tone nits. |

Each finding gets **effort (S/M/L/XL)** and **priority = impact × confidence ÷ effort**.

---

## Phase 0 — Reconnaissance (run first, feeds every agent)

Build the shared brief every specialist receives:

- **Fetch (if URL/path):** retrieve the content (and, where authorized, the named comparison
  pieces). Record what the piece is, where it lives, and its publish/update date.
- **Content type & channel:** classify (landing, essay, post, product copy, email, social, pitch,
  script, release notes). The type sets which lenses apply and how length/format are judged.
- **Thesis extraction:** state, in one sentence, the single claim the piece is making. If you
  cannot find one, that is itself a P1 finding. Confirm against the provided `THESIS` if given.
- **Promise & payoff:** what does the opening promise the reader, and does the piece deliver it?
- **Audience & awareness stage:** who must this move, what do they already believe, what are their
  top 3 objections, and what is their awareness stage (unaware → most aware)?
- **Goal / desired next action:** the one belief-change or action that defines success.
- **Voice baseline:** capture the intended/actual voice (from a style guide or the corpus) so
  rewrites stay on-brand.
- **Comparison set:** 2–3 best-in-class pieces for this reader and goal to benchmark against in
  Phase 4 (named in `COMPARISON` or chosen here).

Output: a structured brief (thesis, audience, awareness stage, goal, objections, voice, references)
distributed to all Phase 1 agents.

---

## Phase 1 — Specialist swarm (parallel agents)

Each agent receives the brief, is exhaustive within its lens, and returns findings in the shared
schema plus a **dimension grade (A–F)** and a **top-3 "protect this"**.

### C1 — Thesis & argument integrity (the signature pass)
Is there a single, sharp, defensible thesis? Steelman the strongest counter-argument and check
whether the piece anticipates and answers it. Hunt logical fallacies (begging the question, false
dichotomy, hasty generalization, correlation-as-cause), unsupported leaps, and claims stated as
fact without backing. Test for **information gain**: is the core idea non-obvious, or could the
reader predict every point from the title? A weak or hidden thesis is P1; a thesis that is simply
wrong is P0.

### C2 — Audience & awareness-stage fit
Does the piece meet the reader where they actually start? Check that it addresses their real
objections, uses their language (not internal jargon), and assumes the right prior knowledge.
Content pitched at the wrong awareness stage (selling to someone who doesn't yet know they have the
problem, or re-explaining basics to an expert) is the most common silent failure — grade it here.

### C3 — Message clarity & value proposition
The one-sentence test: can a stranger restate the point and why it matters after one read? Is the
**"so what"** explicit, and is the lede up front (BLUF) rather than buried under throat-clearing?
Flag vague abstractions where a concrete, specific claim belongs. A buried or absent value
proposition is P1.

### C4 — Structure & narrative
Hook, flow, and information ordering. Does the opening earn the second sentence? Are sections in
the order the reader needs them, with transitions that carry momentum? Diagnose the
**curse of knowledge** (author assumes context the reader lacks), pacing problems, and weak
endings. Map the actual structure and propose the stronger one.

### C5 — Evidence, credibility & originality
Are claims backed by specifics — data, examples, sources, first-hand experience (E-E-A-T)? Flag
vague intensifiers standing in for proof, round numbers with no source, and generic advice with no
lived insight. Reward and protect genuine, non-obvious insight; flag commodity content that adds
nothing beyond what already exists for this reader.

### C6 — Voice, tone & concision
Is the voice consistent and on-brand (register, person, energy)? Cut filler, hedging
("I think", "sort of", "in order to"), throat-clearing, and unexplained jargon. Convert passive to
active where action is meant. Check reading level against the audience. Quote representative
offenders; do not just assert "too wordy."

### C7 — Line-level craft & wording
The highest-density rewrite pass. Take the weakest headline, opening, transitions, and key
sentences and provide concrete **before → after** rewrites (2–3 options for headlines and hooks).
Tighten, sharpen verbs, kill redundancy, fix rhythm. Every item here ships a usable replacement.

### C8 — Persuasion & rhetoric
Balance of ethos / pathos / logos for this audience and goal. Is there a story or concrete image
where abstraction is failing? Are the most persuasive, memorable moments engineered or accidental?
Flag both **under-persuasion** (true but inert) and **manipulation** (dishonest urgency, fear,
confirmshaming) — the latter is a P0/P1 ethics finding (cross-ref C14).

### C9 — Accuracy & fact integrity
Verify checkable claims: facts, figures, dates, names, quotes, and product capabilities. Flag
overstatement, outdated information, and any promise the product/reality can't keep. Where you
cannot verify, say so and mark it for the author. A confident false claim is P0.

### C10 — Engagement & skimmability (format-fit)
Will a real reader keep going? Check the opening's grip, subheads that let a skimmer reconstruct
the argument, paragraph and sentence length, scannable formatting, and length appropriate to the
channel (a 2,000-word landing hero and a 200-word essay are both failures). 

### C11 — Discoverability & intent match (where applicable)
For content meant to be found or shared: does it match the searcher's intent, is the title/headline
both honest and compelling, are the social/meta preview and the shareable hook strong? Content-first,
never keyword-stuffed — keyword cosmetics that hurt the human read are a finding.

### C12 — Conversion & next action (where applicable)
Does the piece drive the `GOAL`? Is the call-to-action present, singular, specific, and placed where
motivation peaks? Count the friction between interest and action. A piece with a clear thesis but no
next step leaks its whole audience — graded here.

### C13 — Differentiation & competitive benchmark
Against the Phase 0 comparison set: what do the best pieces for this reader do that this one
doesn't? Where is this interchangeable with competitors, and where is its unfair advantage (a
unique insight, dataset, voice, or story) under-used? Output transferable moves, not "be better."

### C14 — Risk, ethics & inclusivity
Misleading or unsubstantiated claims, manipulative dark-pattern copy, undisclosed conflicts, and
exclusionary, non-inclusive, or culturally blind language. Anything that exposes the author to a
credibility, legal, or trust hit is escalated with its harm chain.

---

## Phase 2 — Cross-pollination barrier

A synthesis agent merges the finding pool, **dedupes** overlapping findings (the same root cause
reported by several lenses → merge, keep all citations, boost confidence), and flags **compound
findings** where two P2s combine into a P1 (e.g., a buried lede × a weak hook = the reader never
reaches the argument).

## Phase 3 — Adversarial verification

Every P0/P1 (and any compound/uncertain P2) is attacked by three independent skeptics:
**The Refuter** ("is the cited passage really weak, or is this taste? prove the principle is
violated — default to refuted if uncertain"), **The Context Defender** ("is this a deliberate,
on-brand choice for this audience/channel? would the 'fix' flatten the voice or harm another
dimension?"), **The Impact Auditor** ("re-derive who stops reading or disbelieves, and re-score").
A finding survives with ≥ 2/3 confirmations; severity = the median. The **thesis challenge** is a
hard gate: if the steelmanned counter-argument stands unanswered, that is recorded as the headline
finding. Then a **completeness critic** asks: which passage wasn't quoted, which claim wasn't
checked, which reader objection wasn't tested?

## Phase 4 — Benchmark

Compare thesis sharpness, evidence, structure, and information gain against the named best-in-class
references from Phase 0. Extract the specific, transferable moves the best pieces use that this one
lacks — concrete patterns, not "write better."

---

## Phase 5 — Synthesis & deliverables

In `OUTPUT_LANG`:

1. **Executive summary** (≤ 1 page): the content verdict, whether the thesis holds, the single
   biggest reason a reader disengages or disbelieves, and the ceiling after remediation.
2. **Thesis verdict:** the thesis as currently stated, the steelmanned counter-argument, and a
   sharper one-sentence thesis if the current one is weak.
3. **Content scorecard (0–100):** score each dimension (weights below), report the total and the
   **grade band** (Gold 90–100 / Silver 75–89 / Bronze 60–74 / Needs-work 40–59 / Inadequate <40),
   mapping the C1–C14 findings onto the dimensions.

   | Dimension | Pts |
   |---|---|
   | Thesis & argument integrity | 20 |
   | Audience fit & message clarity | 20 |
   | Evidence, credibility & originality | 15 |
   | Structure & narrative | 15 |
   | Voice, concision & line craft | 15 |
   | Persuasion & engagement | 10 |
   | Differentiation vs best-in-class | 5 |

   Re-weight for the content type (e.g., a pitch leans on persuasion/CTA; an essay on thesis and
   originality) and state the re-weighting.
4. **Before/after rewrites:** the highest-leverage passages rewritten in place (headline, opening,
   value proposition, CTA), each with a one-line rationale.
5. **Verified findings register:** the shared schema, sorted by priority; skeptic note on P0/P1.
6. **Strengths / "do not touch" list.**
7. **Remediation roadmap:** Quick Wins (≤ 1 hour: headline, lede, CTA) → 30/60/90, dependency-aware
   (fix the thesis before polishing sentences that serve it), referencing finding IDs.
8. **Re-audit criteria:** measurable exit conditions per P0/P1 (e.g., "a stranger restates the
   thesis correctly after one read", "every superlative is backed by a cited specific").
9. **Optional ready-to-publish rewrite:** for a low-scoring piece, attach a full rewritten draft
   that preserves voice and meaning.
10. **GitHub issues (mandatory)** per [`ISSUE-OUTPUT-STANDARD.md`](../ISSUE-OUTPUT-STANDARD.md) —
    see the dedicated section below.

### Appendices
A: killed findings + refutations. B: coverage map (passage × reader objection × lens). C:
assumptions registry. D: claims checked vs unverifiable (handed back to the author).

---

## Issue output — mandatory (see [`ISSUE-OUTPUT-STANDARD.md`](../ISSUE-OUTPUT-STANDARD.md))

This audit's primary deliverable is GitHub issues — **German by default** (`OUTPUT_LANG`);
preview/dry-run first, created only on explicit authorization + repo access. Two-part contract:

1. **Tracking issue first** — `[AUDIT] Content — Befund-Tracker & Roadmap`. Body: a management
   summary (scorecard total + grade band, thesis verdict, the biggest disengagement driver), the
   content scorecard, a **priority-sorted checklist** (P0→P3, then effort) where each line links its
   child issue, and the Quick-Wins/30/60/90 roadmap. Labels: `audit`, `tracking`, `content`.
2. **One issue per confirmed finding** — top-notch, German, each opening with its own
   **management summary** (2–3 sentences: what, impact on the reader/goal, one-line recommendation),
   then the full finding (severity, dimension, the **quoted passage** with location, evidence, a
   concrete **before → after** rewrite, effort, re-audit criterion). Labels: `audit`, `content`,
   `sev:p0…p3`, `dimension:<x>`, `effort:S|M|L`; back-link to the tracking issue.

For a low-scoring piece, optionally attach a **ready-to-publish rewritten draft** to the tracking
issue or open it as a PR. Create child issues first, collect their numbers, then create/update the
tracking issue so its checklist links resolve. Detect existing audit issues by label and update
rather than duplicate.

---

## Shared finding schema (all agents)

```json
{
  "id": "C3-002",
  "agent": "message-clarity",
  "title": "Value proposition is buried under three sentences of throat-clearing",
  "severity": "P1",
  "confidence": 0.93,
  "effort": "S",
  "location": "hero section, lines 1-4",
  "quote": "In today's fast-moving landscape, organizations of every size are increasingly looking for ways to... [the actual benefit appears only in sentence 4]",
  "reader_job": "A problem-aware visitor deciding in ~5 seconds whether this is for them",
  "evidence": "The first concrete, specific benefit ('cut onboarding from days to minutes') appears at line 4; the first three sentences are generic context the reader already accepts and could apply to any competitor.",
  "fix": "Before: 'In today's fast-moving landscape...'. After: 'Cut new-hire onboarding from three days to twenty minutes.' Lead with the specific outcome; delete the generic preamble.",
  "expected_impact": "Moves the single most decision-relevant claim above the fold; reduces 5-second bounce for problem-aware visitors.",
  "anticipated_refutation": "'The preamble sets context' — a problem-aware reader already has the context; the preamble costs the only seconds you get and says nothing a competitor couldn't."
}
```

---

## Definition of done (self-check before delivering)

- [ ] The content type, thesis, audience, awareness stage, and goal were identified (or inferred
      with stated assumptions).
- [ ] The thesis was steelmanned against its strongest counter-argument; the verdict is explicit.
- [ ] Every finding quotes the exact passage with its location — no vague "this section is weak".
- [ ] Every confirmed finding ships a concrete before → after rewrite (headlines/hooks: 2–3 options).
- [ ] Information gain was assessed against the best-in-class comparison set; commodity content is
      flagged even when the prose is clean.
- [ ] Checkable claims, figures, and promises were verified; the unverifiable were handed back.
- [ ] Persuasion was judged for both under-persuasion and manipulation/ethics.
- [ ] The content scorecard was produced (0–100, dimensions weighted for the content type) with a
      grade band and per-dimension evidence.
- [ ] Strengths / "do not touch" items were named so rewrites preserve what works.
- [ ] Issues follow `ISSUE-OUTPUT-STANDARD.md`: tracking issue first (priority-sorted, with
      management summary), then one issue per finding, each with its own management summary and a
      before/after rewrite; preview-first.
- [ ] My own output honors the house style: no emojis in headings, GitHub alerts, sentence case,
      second person, present/active.
- [ ] Coverage and "claims checked vs unverifiable" appendices are complete and honest.
- [ ] The source content was left unmodified; rewrites are proposals, not edits to the original.
```
