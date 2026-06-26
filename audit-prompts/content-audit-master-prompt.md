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
SOURCE_LANGUAGE:    <auto-detect (default) | English | Deutsch | ... — language of the source draft,
                     used to detect interference>
LOCALISATION_MODE:  <audit-only (default) | native-rewrite | translate-and-rewrite — how far the
                     audit may reshape target-locale wording; values defined under "Localisation
                     modes & terminology policy" below>
TERMINOLOGY_POLICY: <infer from corpus (default) | provided glossary | strict glossary — defined
                     under "Localisation modes & terminology policy" below>
ISSUE_TARGET: <owner/repo for gh issue creation — preview-first, create only on approval>
```

If unknown, Phase 0 infers the content type, thesis, audience, awareness stage, and goal from the
piece itself and states its assumptions explicitly. The thesis and the goal are the yardsticks;
every finding is judged against whether it helps the reader believe the thesis and take the action.

`OUTPUT_LANG` expresses the target **locale**, not merely the language: Deutsch defaults to Swiss
**de-CH** (always *ss*, never *ß*). `VOICE` may point at an approved native corpus or glossary (a
`STYLE_REFERENCE`) the rewrite must match. When `SOURCE_LANGUAGE` differs from the target locale the
localisation apparatus (operating principle 9, lens C15, the Native Reader skeptic) runs in full;
when they match it runs as a lighter native-quality check.

**Localisation modes & terminology policy (control effect).** These two inputs bound how the audit
acts on localisation findings:

- `LOCALISATION_MODE` — how far a confirmed finding may reshape target-locale wording:
  - `audit-only` (default) — report the localisation finding with a suggested native form, but
    propose **no** applied rewrite; the existing target text stays the unit of record.
  - `native-rewrite` — for confirmed C15 findings, ship a native-target rewrite that **preserves
    claims, evidence, meaning, and technical correctness** but may fully re-form sentence structure
    and word choice. Assumes usable target-locale copy already exists.
  - `translate-and-rewrite` — there is **no** usable target-locale copy yet (or it is to be
    discarded): produce the target copy **from the source**, then hold it to the same native-first
    bar as `native-rewrite`. Identical precision and terminology rules — the only difference is
    whether a prior target draft exists.
- `TERMINOLOGY_POLICY` — the authority of the Phase-0 terminology matrix:
  - `infer from corpus` (default) — derive the keep / translate / rephrase decisions from the piece
    itself; the matrix is advisory.
  - `provided glossary` — a supplied glossary (`STYLE_REFERENCE`) seeds the matrix and its decisions
    **bind**, but the audit may **extend** it for terms it does not cover.
  - `strict glossary` — the supplied glossary is the **only** allowed source of terminology
    decisions; a recurring term absent from it is flagged for a human decision rather than rephrased
    on the audit's own judgement.

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
9. **Native-language & locale integrity.** For any output whose target locale differs from the
   source language — and as a lighter native-quality check when source == target — judge the text as
   **original copy in its target locale**, never as a translation. Native-first test: an experienced
   native copywriter in the target locale could plausibly have written it without ever seeing a
   source-language original. Preserve **meaning, not sentence structure**. Precision over purism:
   keep English for code identifiers, standards, established technical terms, UI labels, and
   commands, and wherever it is materially more precise (CI/CD, OWASP, CVSS, SBOM, RAG, `file:line`,
   GitHub-Issue, trust boundary, prompt injection, …). Terminology is **intentional**: each recurrent
   term is explicitly kept / translated / rephrased and then used in **one canonical form**. Locale
   rules are hard requirements; for de-CH: always *ss*, never *ß* (except immutable proper names,
   code, legal titles, or verbatim quotes — each retained *ß* tagged `quote` | `code` | `legal`);
   German „…" quotation marks, never an ASCII straight-quote closer; match the corpus register (the
   auditor corpus uses *du*); comma decimals; orthography and anglicism tolerance only — **no** Swiss
   dialect lexis (no Grüezi / Velo / parkieren / Natel).

### Severity scale

| Level | Definition |
|---|---|
| **P0 — Critical** | Factually wrong, misleading, plagiarized, unsupported superlative/claim, or a promise the product can't keep — destroys credibility or creates legal/ethical exposure. |
| **P1 — High** | The content fails its job: thesis unclear or unsupported, the "so what" is invisible, the lede is buried, it targets the wrong awareness stage, there is no differentiation from commodity content, or the call-to-action is missing/unclear. |
| **P2 — Medium** | Clear best-practice deviation: weak hook, flabby structure, hedging/filler/jargon, passive voice where action is needed, inconsistent voice, thin evidence, poor skimmability. |
| **P3 — Low** | Polish: word choice, rhythm, a tighter headline option, redundancy, minor tone nits. |

Each finding gets **effort (S/M/L/XL)** and **priority = impact × confidence ÷ effort**.

**Localisation severity (C15).** P1 — systemic source-language interference in the hero, primary
value proposition, primary CTA, or core navigation; a phrase that obscures the product's meaning; or
trust-eroding terminology inconsistency in prominent content. P2 — recurring unnatural wording across
a page or module. P3 — isolated awkwardness or a minor locale correction.

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
- **Language & localisation brief:** the target language and locale; the source language and its
  likely interference; the intended register; the reader's technical fluency; protected English
  terms; preferred German terms; suspected translation artefacts; and any explicitly protected
  wording.
- **Terminology matrix:** before any rewrite, build a matrix — *term | keep / translate / rephrase |
  chosen form | rationale | scope* — so every recurrent term resolves to one canonical form.
- **Localisation profile:** state it explicitly. Source == target ⇒ a native-quality check only;
  source != target ⇒ the full apparatus (operating principle 9, lens C15, the Native Reader
  skeptic). When the corpus shows parallel source + target strings (e.g. an English master with
  localized siblings), the profile is source != target.

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

### C15 — Native-language & locale integrity
Runs on the Phase 0 **localisation profile**. Two profiles: source == target ⇒ a lighter
native-quality pass (orthography, terminology consistency, idiom); source != target ⇒ the full
apparatus below. For non-source locales, systematically inspect for: English sentence architecture
and literal translation; imported phrasal-verb logic; unnecessary Denglish verbs; false friends;
unnatural collocations; noun-heavy stacks; inconsistent technical terminology; English terms that are
neither protected nor more precise; translated idioms; register inconsistency across product copy /
control jargon / engineering notes; locale-orthography violations; and CTAs, headings, or microcopy
that are correct but not idiomatic.

**Precision carve-outs (do not puristically replace):** GitHub, CI/CD, CVSS, OWASP, SBOM, RAG, code
identifiers, file paths, commands, and framework terms. **Terms-of-art verbs anchored to a tool**
(Git *mergen*; data *mappen* / *kartieren*) are kept and enforced in one canonical form; only
anchorless translationese verbs (*laufen lassen*, *steelmannen*) are flagged.

**Native-rewrite safety:** meaning-reshaping native-rewrite applies only to marketing / UX copy. For
safety, legal, or factual content, restrict changes to orthography and terminology, and route any
P0/P1 wording change through the accuracy lens (C9) with an explicit claims-preserved assertion.

Each confirmed C15 finding states: the exact text and its location; the language pattern detected;
why it sounds translated or non-native; a technically equivalent native rewrite (precision
preserved); the terminology decision (keep / translate / rephrase); and whether it is systemic or
isolated. Example:

```json
{
  "id": "C15-004",
  "title": "Hero subline reads as a literal translation of an English clause",
  "severity": "P1",
  "confidence": 0.9,
  "effort": "S",
  "location": "hero, line 2",
  "quote": "Wir lassen deinen Code von einem Schwarm von Agenten laufen, um Risiken zu mappen.",
  "language_pattern": "literal carry-over of English clause order + anchorless verb 'laufen lassen' (run)",
  "evidence": "Blind back-translation snaps cleanly to 'We run your code through a swarm of agents to map risks' — same clause order, same verb choice; a native de-CH copywriter would not phrase 'lassen … laufen' here. 'mappen' is an anchored term-of-art and is kept.",
  "fix": "Before: 'Wir lassen deinen Code von einem Schwarm von Agenten laufen, um Risiken zu mappen.' After: 'Ein Agenten-Schwarm prüft deinen Code und mappt die Risiken.'",
  "terminology_decision": "keep 'mappen' (anchored, one canonical form); rephrase 'laufen lassen' → 'prüft'; keep 'Agent' / 'Schwarm'",
  "native_rewrite": "Ein Agenten-Schwarm prüft deinen Code und mappt die Risiken.",
  "locale": "de-CH",
  "expected_impact": "Hero reads as original de-CH copy, not a translation; preserves the 'mappen' term-of-art while removing translationese that erodes trust in the primary value proposition."
}
```

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

**The Native Reader (C15).** For C15-P1/P2 findings this skeptic **replaces** the standard
three-skeptic panel. It works **without the source text** and runs a **blind back-translation**:
translate the target text back into the source language; if it snaps to the source's sentence and
clause order, the text is translationese and criterion (a) is met. It also checks that the proposed
rewrite **preserves technical precision and voice** rather than over-correcting into artificial
purism. A language finding survives only on **≥ 2 of 3**: (a) the text is demonstrably translated or
non-native — the back-translation decides, not taste; (b) a more natural form exists **without losing
precision** — the skeptic must **produce** that native alternative as evidence; (c) the fix improves
flow, trust, or comprehension. Two cases deterministically **override** the "default to refuted"
rule: a de-CH orthography violation (*ß*) and an English-verb-stem + German-inflection hybrid. An
off-manifest technical-term swap additionally requires a **Context Defender** sign-off with a
one-line precision-equivalence statement.

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
   mapping the C1–C15 findings onto the dimensions. The weighting is **mode-dependent**.

   When **source != target** (a localised piece), score a dedicated native-fit axis:

   | Dimension | Pts |
   |---|---|
   | Thesis & argument integrity | 18 |
   | Audience fit & clarity | 18 |
   | Evidence, credibility & originality | 13 |
   | Structure & narrative | 13 |
   | Voice, concision & line craft | 13 |
   | Persuasion & engagement | 9 |
   | Differentiation vs best-in-class | 4 |
   | Native-language quality & locale fit | 12 |

   When **source == target**, add **no** new axis: fold ~3 points of native quality into *Voice,
   concision & line craft* and keep the original seven weights (20 / 20 / 15 / 15 / 15 / 10 / 5 =
   100). In **both** modes, **either** a locale-orthography error (*ß* in de-CH) **or** a precision
   regression (trading a precise English term for a vaguer German one) caps the native-fit
   contribution — the *Native-language quality & locale fit* axis in localised mode, or the points
   folded into *Voice, concision & line craft* in same-language mode; the penalty is symmetric (an
   orthography error and a precision regression weigh the same).

   Re-weight further for the content type (e.g., a pitch leans on persuasion/CTA; an essay on thesis
   and originality) and state the re-weighting.
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
10. **Localisation verdict** (when localisation is in scope): native / mixed / translated-sounding;
    the dominant interference patterns; whether they are systemic or isolated; and the single most
    important language correction.
11. **Terminology decision log:** *term | keep / translate / rephrase | approved form | rationale |
    affected locations* — one canonical form per recurrent term.
12. **Native-copy rewrite set:** the hero, primary value proposition, primary CTA, navigation
    labels, highest-traffic headings, and the most repeated *ss/ß* and Denglish-verb offenders —
    **not** a "jargon cluster", because here the jargon *is* the value proposition. Each native
    rewrite binds to its content key / location, not free text; for German, default to de-CH.
13. **GitHub issues (mandatory)** per [`ISSUE-OUTPUT-STANDARD.md`](../ISSUE-OUTPUT-STANDARD.md) —
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
   `sev:p0…p3`, `dimension:<x>`, `effort:S|M|L`; back-link to the tracking issue. For localisation
   (C15) findings, add `dimension:localisation` (and optionally `locale:de-CH`), title the issue
   `[P1][Lokalisierung] …` (the German word, not `[de-CH]`), and carry — in addition to the
   standard fields — the **language pattern**, the **terminology decision**, the **before/after**,
   and the **re-audit criterion**.

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
  "anticipated_refutation": "'The preamble sets context' — a problem-aware reader already has the context; the preamble costs the only seconds you get and says nothing a competitor couldn't.",

  // C15-only — present only on native-language / localisation findings; otherwise omit these four:
  "language_pattern": "literal translation of English clause order",
  "terminology_decision": "keep 'mappen'; rephrase 'laufen lassen' → 'prüft'",
  "locale": "de-CH",
  "native_rewrite": "Ein Agenten-Schwarm prüft deinen Code und mappt die Risiken."
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
- [ ] The target locale was identified and recorded; the localisation profile (source == / != target)
      was stated.
- [ ] Every non-source rewrite passed the native-first (blind back-translation) test.
- [ ] No *ß* remains in de-CH output except immutable quotes / code / legal names, each tagged.
- [ ] Recurring terminology resolves to one approved form (terminology decision log attached).
- [ ] English was kept only where protected, a standard, or materially more precise.
- [ ] No rewrite traded technical precision for "more German"; each precision regression is logged
      per swap.
- [ ] The hero, primary CTA, navigation, and high-traffic headings were checked separately for
      native quality.
```
