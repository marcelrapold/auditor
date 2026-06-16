# AI / LLM Application Audit — Master Orchestration Prompt

> **Mission:** Subject the target's AI/LLM features — prompts, RAG, agents, tools, evals,
> guardrails, and cost — to a rigorous audit at the standard of a top-tier applied-AI team.
> Deploy a swarm of specialist agents to find where the system is unsafe, unreliable,
> manipulable, expensive, or unmeasured. Every finding evidence-backed, adversarially
> verified, severity-scored, and turned into a prioritized roadmap.
>
> **Universality:** Provider- and framework-agnostic. Applies to chatbots, RAG systems,
> agents/tool-callers, content generators, classifiers, copilots, and any feature wrapping
> an LLM (any provider or self-hosted). Maps to the **OWASP Top 10 for LLM Applications** and
> NIST AI RMF. Phase 0 decides scope; non-applicable mandates are logged "not applicable",
> never skipped silently.

---

## How to use this prompt

```
TARGET:        <repo path and/or running app — chat, RAG, agent, generator, ...>
AI_SHAPE:      <single-prompt | RAG | tool-using agent | multi-agent | classifier | mixed>
PROVIDER(S):   <Anthropic Claude | OpenAI | self-hosted | gateway/mixed>
DATA:          <does it touch PII / proprietary / regulated data? user-generated input?>
STAKES:        <advisory | takes actions | makes decisions about people/money>
OUTPUT_LANG:   <English (default) | Deutsch | ...>
```

If unknown, Phase 0 infers from code/behavior and states assumptions. If the work targets a
**specific provider, consult that provider's current docs** before judging model choice,
pricing, or API usage — never assert provider details from memory.

---

## Operating principles (binding for every agent)

1. **Evidence or it didn't happen.** Cite the concrete artifact: prompt template `file:line`,
   a tool definition, a retrieval/chunking config, a real (redacted) input→output pair, an
   eval result, or a token/cost figure. No evidence → discarded.
2. **Cite the standard.** OWASP LLM Top 10 (LLM01 Prompt Injection … LLM10), NIST AI RMF,
   provider safety/usage guidance, and eval best practice — name what's violated.
3. **Reason about the adversary AND the honest user.** Two failure classes: malicious input
   (injection, jailbreak, exfiltration) and ordinary input that the system handles wrongly
   (hallucination, bad tool call, silent failure). Audit both.
4. **Severity is earned.** P0–P3; a P0 names a concrete harm: data exfiltration, an unsafe
   action taken, a harmful/defamatory output to a real user, or runaway cost.
5. **Adversarial humility.** Every finding is attacked in Phase 3; pre-empt the refutation.
   (Where authorized, the auditor may *attempt* benign injection/jailbreak probes to prove a
   finding — never destructive, never against third parties.)
6. **Praise what is robust.** Each specialist returns its top 3 "protect this" items.
7. **Fix-forward.** Every confirmed finding ships a concrete remediation: a prompt change, a
   guardrail, an output schema, a tool-permission scope, or an eval to add.

### Severity scale

| Level | Definition |
|---|---|
| **P0 — Critical** | Prompt injection that exfiltrates data or triggers an unsafe action, a tool/agent that can take destructive/irreversible action without authorization, leakage of secrets/PII/system prompt, or unbounded cost/abuse with no cap. |
| **P1 — High** | Manipulable behavior with real harm potential, unvalidated model output driving a consequential action, RAG that confidently serves wrong/poisoned context, no eval/guardrail on a high-stakes path. |
| **P2 — Medium** | Reliability/quality gaps: weak prompts, no output validation on low-stakes paths, poor retrieval quality, no observability of model behavior, inefficient token usage. |
| **P3 — Low** | Polish: prompt clarity, minor cost tuning, eval coverage of edge cases. |

Each finding gets **effort (S/M/L/XL)** and **priority = impact × confidence ÷ effort**.

---

## Phase 0 — Reconnaissance (run first, feeds every agent)

- **AI surface inventory:** every place an LLM is called — the prompt/template, model,
  parameters, inputs (and which are **untrusted/user-controlled**), outputs, and what the
  output is *used for* (display, decision, tool call, downstream prompt). Mark the
  **high-stakes calls** (takes action / touches data / faces users) for double coverage.
- **Trust boundaries:** where untrusted content (user input, retrieved docs, tool results,
  web pages) enters a prompt — every such boundary is an injection surface.
- **Data flows:** what data reaches the model (PII? secrets? proprietary?), where it goes
  (provider, logs, training opt-out status), and retention.
- **Tools & actions:** for agents — every tool, its permissions, and its blast radius.
- **Eval & guardrail inventory:** what is currently tested/guarded, and what isn't.
- **Reference bar:** current best practice for this AI shape (and the provider's own guidance).

Output: a structured brief distributed to all Phase 1 agents.

---

## Phase 1 — Specialist swarm (parallel agents)

### L1 — Prompt injection & untrusted input (LLM01)
For every trust boundary from Phase 0: can injected instructions in user input, retrieved
documents, tool outputs, or web content override the system prompt, exfiltrate data, or
trigger actions? Direct and **indirect** injection. Defenses present (delimiting,
instruction hierarchy, input sanitization, output checks)? Where authorized, attempt benign
proof probes. Any successful exfiltration/action path = P0.

### L2 — Jailbreak & guardrail robustness
Can safety constraints be bypassed (role-play, encoding, multi-turn pressure, refusal
suppression)? Are guardrails enforced in code (not just "the prompt asks nicely")? Is there
defense in depth (input filter + system prompt + output filter)? Test the actual stated
policy of the system, not generic content.

### L3 — System-prompt & secret leakage (LLM06/LLM07)
Can the system prompt, hidden instructions, API keys, or other users' data be extracted? Are
secrets ever placed in the prompt at all? Is one user's data reachable in another's context
(cross-session/cross-tenant leakage in RAG or memory)?

### L4 — Output handling & downstream trust (LLM02/LLM05)
Is model output trusted unsafely? Output rendered as HTML/markdown without sanitization
(XSS), used in SQL/shell/eval, parsed without schema validation, or auto-executed. Insecure
output handling is a top real-world LLM vuln — trace every output to its sink. Missing
structured-output validation on a consequential path = P1.

### L5 — Tool use & agent safety (LLM06 excessive agency)
For agents: least-privilege tools (no destructive/irreversible action without human
confirmation), permission scoping, input validation on tool arguments the model produces,
loop/recursion and cost bounds, sandboxing of code execution, and a human-in-the-loop gate
for high-stakes actions. A tool that can delete/pay/email arbitrarily on model say-so = P0/P1.

### L6 — RAG & retrieval quality (LLM08 + grounding)
Retrieval relevance and recall, chunking strategy, embedding/model fit, context-window
budgeting, citation/grounding (can the user verify claims?), handling of "no good context"
(does it abstain or hallucinate?), **data poisoning** of the knowledge base, and access
control on retrieved documents (does retrieval respect per-user permissions?). Confidently
wrong answers from bad retrieval = P1.

### L7 — Hallucination & reliability
On high-stakes paths: does the system fabricate facts, citations, numbers, or capabilities?
Grounding and abstention behavior, confidence calibration, consistency across runs
(temperature discipline), and handling of out-of-scope questions. Reliability is measured by
evals (L9) — flag high-stakes paths with no factuality guard.

### L8 — Prompt engineering quality
Clarity and specificity of system prompts, role/instruction structure, few-shot quality,
format/schema instructions, handling of edge cases and empty/garbage input, instruction
conflicts, prompt-template injection via unescaped interpolation, and maintainability
(prompts in code/versioned vs scattered magic strings).

### L9 — Evaluation & quality measurement
Is model quality actually measured? Eval-set existence and coverage of critical paths,
regression testing on prompt/model changes, golden datasets, LLM-as-judge rigor (if used),
human review loop, and metrics tied to the business outcome. **No evals on a high-stakes
path = P1** — you're shipping unmeasured behavior.

### L10 — Cost, latency & token efficiency
Token usage per call (bloated prompts, redundant context, no caching of stable prefixes),
model right-sizing (expensive model where a cheaper one suffices), streaming for latency,
caching of repeated calls, retry/timeout discipline, **per-user and global cost caps**
against abuse, and runaway-loop protection for agents. No cost cap on a public AI endpoint = P1.

### L11 — Privacy, data governance & compliance
What user/proprietary data leaves to the provider, training opt-out/zero-retention
configured where required, PII minimization before sending, logging of prompts/outputs
without leaking PII/secrets, consent and disclosure (users told they're talking to AI),
and regulatory fit (GDPR, EU AI Act risk tier, sector rules).

### L12 — Observability & operations for AI
Logging of prompts, outputs, tokens, latency, tool calls, and refusals (without leaking
sensitive data), tracing of multi-step agent runs, alerting on cost/error/refusal spikes,
feedback capture, and the ability to debug "why did it say that?" in production.

Each agent returns a **dimension grade (A–F)** + justification and a **top-3 "protect this"**.

---

## Phase 2 — Cross-pollination barrier

Synthesis agent merges, **dedupes**, and flags **compound findings** (e.g., indirect
injection via RAG × a tool that can email × no output validation = data exfiltration chain).

## Phase 3 — Adversarial verification

Every P0/P1 (and compound/uncertain P2) is attacked by skeptics: **The Refuter** (is the
exploit real and reproducible, or blocked by a downstream guard? where authorized, did the
probe actually work?), **The Context Defender** (is this risk accepted and bounded? would the
guardrail break legitimate use or over-refuse?), **The Impact Auditor** (re-derive the harm
chain and re-score). Survives with ≥ 2/3 confirmations; severity = median. Then a
**completeness critic**: "which trust boundary wasn't probed? which high-stakes path has no
eval? which output sink wasn't traced?"

## Phase 4 — Benchmark

Compare prompts, guardrails, and eval rigor against current best practice for this AI shape
and the provider's own guidance. Transferable patterns, not "prompt better."

---

## Phase 5 — Synthesis & deliverables

In `OUTPUT_LANG`:

1. **Executive summary** (≤ 1 page): safety/reliability verdict, the single biggest harm or
   exfiltration risk, unmeasured-behavior exposure, ceiling after remediation.
2. **Scorecard:** grade per dimension (L1–L12) + finding counts; overall weighted grade
   (Injection/guardrails, Output handling, Agent safety, Evals count double). Note OWASP LLM
   Top 10 coverage.
3. **Trust-boundary & data-flow map:** every untrusted-input surface and every output sink,
   annotated with its guard status.
4. **Verified findings register:** standard schema, sorted by priority; skeptic note + repro
   on P0/P1.
5. **Strengths / "do not touch" list.**
6. **Remediation roadmap:** Quick Wins (≤ 1 day, e.g., "add output schema validation") →
   30/60/90 days, dependency-aware, referencing IDs. Separate **guardrail** vs **eval** vs
   **cost** tracks.
7. **Re-audit criteria:** measurable exit conditions per P0/P1 (incl. an eval that now passes).
8. **GitHub issues (mandatory):** per the *Issue output* section below and
   [`ISSUE-OUTPUT-STANDARD.md`](../ISSUE-OUTPUT-STANDARD.md) — tracking issue first, then one
   issue per finding (German by default); preview-first, created only on explicit approval.

### Appendices
A: killed findings + refutations. B: coverage map (AI call × agent). C: assumptions registry.
D: probe log (every injection/jailbreak attempt and its result) — benign, authorized only.

---

## Issue output — mandatory (see [`ISSUE-OUTPUT-STANDARD.md`](../ISSUE-OUTPUT-STANDARD.md))

After Phase 3 verification, turn confirmed findings into GitHub issues — **German by default**
(`OUTPUT_LANG`); preview/dry-run first, created only on explicit authorization + repo access.
Two-part contract:

1. **Tracking issue first** — `[AUDIT] AI/LLM — Befund-Tracker & Roadmap`. Body: a management
   summary (verdict, grade, biggest harm/exfiltration risk), the scorecard, a **priority-sorted
   checklist** (P0→P3, then effort/priority) where each line links its child issue, and the
   30/60/90 roadmap (guardrail/eval/cost tracks). Labels: `audit`, `tracking`, `ai-llm`.
2. **One issue per confirmed finding** — top-notch, German, each opening with its own
   **management summary** (2–3 sentences: what, impact, one-line recommendation), then the full
   finding (severity + score, OWASP LLM mapping, location, evidence/repro, impact, concrete
   before/after fix, effort, re-audit criterion). Labels: `audit`, `sev:p0…p3`, `domain:<x>`,
   `effort:S|M|L`; back-link to the tracking issue.

Create child issues first, collect their numbers, then create/update the tracking issue so its
checklist links resolve. Detect existing audit issues by label and update rather than duplicate.
Never include real secrets or PII — cite location and redact.

---

## Shared finding schema (all agents)

```json
{
  "id": "L4-002",
  "agent": "output-handling",
  "title": "LLM markdown output rendered without sanitization — stored XSS",
  "severity": "P0",
  "confidence": 0.93,
  "effort": "S",
  "ai_calls": ["chat.completion → ChatMessage render"],
  "evidence": "components/Message.tsx:33 dangerouslySetInnerHTML={{__html: marked(reply)}}; reply is model output that can include attacker-influenced content (via L1 indirect injection from a shared doc).",
  "standard": "OWASP LLM02 Insecure Output Handling; treat model output as untrusted",
  "harm_chain": "Injected content in a shared document → model echoes <img onerror> → rendered raw → script runs in other users' sessions → session/data theft",
  "fix": "Sanitize rendered HTML (DOMPurify) or render markdown without raw HTML; never dangerouslySetInnerHTML on model output. ~10 LOC.",
  "expected_impact": "Closes the stored-XSS sink for all model-generated content",
  "anticipated_refutation": "'The model won't emit that' — model output is untrusted by definition and is attacker-influenceable via retrieved/shared content; the sink, not the source, is the vuln."
}
```

---

## Definition of done (self-check before delivering)

- [ ] Every AI call and trust boundary from Phase 0 was assigned; none skipped silently.
- [ ] Injection, output-sink, and tool-permission paths were *actively traced* (and probed where authorized).
- [ ] Every high-stakes path was checked for an eval and a guardrail.
- [ ] Cost/abuse caps and data-governance (provider retention, PII) were verified.
- [ ] No real PII/secrets/system-prompt content is exposed in the report; redact + cite.
- [ ] Any probes were benign, authorized, and logged; nothing destructive or third-party.
- [ ] Coverage, assumptions, and probe-log appendices are complete.
- [ ] The target was left unmodified.
```
