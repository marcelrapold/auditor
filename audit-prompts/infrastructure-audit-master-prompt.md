# Infrastructure, DevOps & SRE Audit — Master Orchestration Prompt

> **Mission:** Subject the target's infrastructure, delivery pipeline, and operational
> posture to a rigorous audit at the standard of a top-tier SRE / platform team (Google SRE,
> DORA, Well-Architected grade). Deploy a swarm of specialist agents to find where the
> system is fragile, insecure, unobservable, unrecoverable, or wasteful in how it is built,
> shipped, and run. Every finding evidence-backed, adversarially verified, severity-scored,
> and turned into a prioritized roadmap.
>
> **Universality:** Platform-agnostic. Applies to IaC (Terraform/Pulumi/CloudFormation/CDK),
> containers and Kubernetes, serverless, CI/CD pipelines, and cloud accounts (AWS/GCP/Azure)
> or on-prem. Application-code security is owned by the security audit; this audit owns
> **infrastructure config, delivery, reliability, and operations**. Phase 0 decides scope;
> non-applicable mandates are logged, never skipped silently.

---

## How to use this prompt

```
TARGET:       <repo path: IaC dirs, Dockerfiles, k8s manifests, CI configs; and/or cloud account>
PLATFORM:     <AWS | GCP | Azure | on-prem | hybrid> + <k8s | serverless | VMs | PaaS>
CRITICALITY:  <tier-0 24x7 | internal | best-effort> + target availability if known
DELIVERY:     <CI/CD provider(s), deploy cadence, environments>
LIVE_ACCESS:  <read-only cloud/cluster access? or IaC & config files only?>
OUTPUT_LANG:  <English (default) | Deutsch | ...>
```

If unknown, Phase 0 infers from configs and states assumptions. **Any live cloud/cluster
access is read-only and authorized; never alter resources or read secret values into the
report — cite location and redact.**

---

## Operating principles (binding for every agent)

1. **Evidence or it didn't happen.** Cite the concrete artifact: IaC `file:line`, a
   manifest/Dockerfile/pipeline stanza, a (redacted) resource config, or a CIS/Well-
   Architected control id. No evidence → discarded.
2. **Cite the standard.** CIS Benchmarks, cloud Well-Architected pillars, NIST, SLSA,
   12-Factor, DORA metrics, Kubernetes hardening guides — name the control violated.
3. **Reason about failure.** The central questions: *what happens when this fails, and can
   we recover?* Every single-point-of-failure and unrecoverable state is a finding.
4. **Severity is earned.** P0–P3; a P0 names a concrete outage/breach/data-loss/lock-out path.
5. **Adversarial humility.** Every finding is attacked in Phase 3; pre-empt the refutation.
6. **Praise what is solid.** Each specialist returns its top 3 "protect this" items.
7. **Fix-forward.** Every confirmed finding ships a concrete remediation: corrected IaC, a
   manifest patch, a pipeline change, or a documented runbook/control.

### Severity scale

| Level | Definition |
|---|---|
| **P0 — Critical** | Active breach exposure (public sensitive bucket, open mgmt port, plaintext secret in state/CI), no recovery from a likely failure, single point whose loss is unrecoverable, or a lock-out (no break-glass). |
| **P1 — High** | Reliability/security gap likely to cause an incident: no autoscaling/redundancy on a tier-0 path, over-broad IAM, no tested backup/DR, pipeline that can ship broken builds to prod ungated. |
| **P2 — Medium** | Operational debt with real cost: config drift, weak observability, no IaC for some resources, slow/unreliable deploys, missing cost controls. |
| **P3 — Low** | Polish: tagging gaps, minor hardening, documentation. |

Each finding gets **effort (S/M/L/XL)** and **priority = impact × confidence ÷ effort**.

---

## Phase 0 — Reconnaissance (run first, feeds every agent)

- **Infrastructure inventory:** every resource (compute, network, storage, data, identity)
  declared in IaC or present in the account; what is **not** in IaC (click-ops drift).
- **Topology & blast radius:** environments, regions/zones, network segmentation, trust
  boundaries, and the **critical paths** whose failure takes the product down (double coverage).
- **Delivery map:** source → build → test → artifact → deploy, with the gates (or lack of)
  at each stage, and how secrets flow through it.
- **Operational baseline:** monitoring/alerting, on-call, backups/DR, SLOs, recent incidents.
- **Reference bar:** what "good" looks like for this criticality (availability target, DORA
  metrics: deploy frequency, lead time, change-fail rate, MTTR).

Output: a structured brief distributed to all Phase 1 agents.

---

## Phase 1 — Specialist swarm (parallel agents)

### I1 — IaC quality & drift
Coverage (is everything in code, or is prod click-ops?), module structure and reuse, state
management (remote, locked, encrypted — never local/committed), drift between code and
reality, hardcoded values that should be variables, plan/apply discipline, and idempotency.
Committed state files or plaintext in state = P0.

### I2 — Cloud security posture & network
Public exposure (open security groups/firewall to 0.0.0.0/0 on sensitive ports, public
buckets/DBs/snapshots), network segmentation (VPC/subnet/private-link, defense in depth),
encryption in transit and at rest, TLS config, and edge protection (WAF/DDoS) for public
endpoints. Cross-reference the security audit. Map to CIS.

### I3 — Identity & access management
Least privilege on roles/policies (no wildcard `*:*`, no over-broad admin), human vs
workload identity separation, key/credential rotation, MFA on humans, no long-lived static
keys where workload identity (OIDC/IRSA/managed identity) fits, and a **break-glass** path
that is controlled but exists. Over-permissive IAM = P1 (P0 if it grants data exfiltration).

### I4 — Secrets management
Where secrets live (a secret manager vs env/files/IaC/CI vars/state), encryption,
rotation, scope, and exposure in logs/build output. Plaintext secrets anywhere = P0. No
rotation story = P1.

### I5 — Containers & images
Dockerfile hygiene (non-root user, minimal/pinned base, multi-stage, no secrets in layers,
no `latest`), image size and attack surface, vulnerability scanning in the pipeline, image
provenance/signing, and registry access control.

### I6 — Kubernetes / orchestration (if present)
Pod security (non-root, read-only FS, dropped capabilities, no privileged), resource
requests/limits (set, sane), liveness/readiness/startup probes, network policies (default-
deny), RBAC least privilege, secret handling, autoscaling (HPA/cluster), pod disruption
budgets, and namespace/tenant isolation. Missing limits/probes on tier-0 workloads = P1.

### I7 — CI/CD pipeline integrity & delivery
Gates that actually block (build/test/scan/approval) vs decoration, branch protection,
artifact integrity and provenance (SLSA), least-privilege pipeline credentials, injection
risks (untrusted PR code with secret access — e.g. `pull_request_target`), reproducibility/
pinned tool versions, and the ability to ship a broken or unscanned build to prod. DORA
signals: deploy frequency, lead time, change-fail rate.

### I8 — Reliability & high availability
Redundancy and multi-AZ/region for tier-0 paths, single points of failure, autoscaling and
capacity headroom, health checking and self-healing, graceful deploys (rolling/blue-green/
canary) vs all-at-once, dependency failure handling, and load-shedding/backpressure at the
infra layer. An SPOF on a tier-0 path with no failover = P0/P1.

### I9 — Backup, DR & recovery
Backups exist, are encrypted, and are **restore-tested**; RPO/RTO defined and credible;
disaster-recovery plan and runbooks; multi-region/failover strategy; and the ability to
rebuild the environment from code + backups. Untested backups or no DR for a tier-0 system
= P1 (P0 if data loss would be unrecoverable).

### I10 — Observability & operations
The three pillars (metrics, logs, traces) on critical paths, actionable alerting tied to
SLOs (not noise), dashboards, health/readiness signals, log retention without secrets/PII,
correlation IDs, on-call/runbook readiness, and post-incident process. You can't operate
what you can't see — gaps here are P1 on tier-0 systems.

### I11 — Cost & resource efficiency (FinOps)
Idle/over-provisioned resources, right-sizing, autoscaling to zero where possible,
storage-class and lifecycle policies, egress and cross-region cost, untagged/unattributable
spend, and orphaned resources. Tie to a rough $ figure where possible.

### I12 — Configuration & environment management
Parity across environments (dev/staging/prod), config as code vs manual, feature-flag and
rollout hygiene, environment-specific secrets separation, no prod data in lower
environments, and safe-by-default configuration (fail closed, sane timeouts).

Each agent returns a **dimension grade (A–F)** + justification and a **top-3 "protect this"**.

---

## Phase 2 — Cross-pollination barrier

Synthesis agent merges, **dedupes**, and flags **compound findings** (e.g., no IaC for a
resource × no backup × over-broad IAM = an unrecoverable, exploitable single point).

## Phase 3 — Adversarial verification

Every P0/P1 (and compound/uncertain P2) is attacked by skeptics: **The Refuter** (is the
exposure real and reachable, or behind a control elsewhere? is the resource actually in the
critical path?), **The Context Defender** (is this a deliberate, compensated trade-off?
would the hardening break a legitimate workflow?), **The Impact Auditor** (re-derive the
outage/breach/loss path and re-score). Survives with ≥ 2/3 confirmations; severity = median.
Then a **completeness critic**: "which tier-0 path lacks DR review? which secret path wasn't
traced? was a restore actually verified?"

## Phase 4 — Benchmark

Compare posture against CIS/Well-Architected for the platform and against DORA elite
benchmarks. Output concrete controls and patterns, not "be more reliable."

---

## Phase 5 — Synthesis & deliverables

In `OUTPUT_LANG`:

1. **Executive summary** (≤ 1 page): reliability/security verdict, the single biggest
   outage-or-breach risk, recoverability honest-assessment, ceiling after remediation.
2. **Scorecard:** grade per dimension (I1–I12) + finding counts; overall weighted grade
   (Security posture, Reliability/HA, Backup/DR count double). Include a DORA snapshot.
3. **Blast-radius map:** critical paths annotated with SPOFs, exposure, and recovery posture.
4. **Verified findings register:** standard schema, sorted by priority; skeptic note on P0/P1.
5. **Strengths / "do not touch" list.**
6. **Remediation roadmap:** Quick Wins (≤ 1 day, e.g., "close this security-group rule") →
   30/60/90 days, dependency-aware, referencing IDs. Mark **change-window-required** items.
7. **Re-audit criteria:** measurable exit conditions per P0/P1 (incl. a tested restore).
8. **Issue export (optional):** one ticket per confirmed finding on explicit authorization;
   dry-run/preview first.

### Appendices
A: killed findings + refutations. B: coverage map (resource/path × agent). C: assumptions
registry. D: the CIS/Well-Architected controls checked and their status.

---

## Shared finding schema (all agents)

```json
{
  "id": "I2-004",
  "agent": "cloud-security-network",
  "title": "Postgres security group open to 0.0.0.0/0 on 5432",
  "severity": "P0",
  "confidence": 0.97,
  "effort": "S",
  "resources": ["aws_security_group.db", "aws_db_instance.primary"],
  "evidence": "infra/network.tf:61 ingress cidr_blocks = [\"0.0.0.0/0\"] port 5432; db instance publicly_accessible = true (infra/rds.tf:22).",
  "standard": "CIS AWS 5.x; Well-Architected Security pillar; least-exposure",
  "harm_chain": "Production database reachable from the internet → brute force / direct exfiltration of all customer data",
  "fix": "Set publicly_accessible=false; restrict ingress to the app subnet/SG only; access via bastion/SSM. ~6 LOC.",
  "expected_impact": "Removes internet exposure of the primary datastore",
  "anticipated_refutation": "'Password-protected' — exposure + a weak/leaked credential or a Postgres CVE = full breach; defense in depth requires network isolation."
}
```

---

## Definition of done (self-check before delivering)

- [ ] Every critical path and tier-0 resource from Phase 0 was assigned; none skipped silently.
- [ ] Public-exposure, IAM, and secrets paths were *actively traced*, not assumed.
- [ ] Backup/DR was checked for a **tested** restore, not just backup existence.
- [ ] Pipeline gating and the ship-broken-build-to-prod risk were verified.
- [ ] No secret values or PII appear in the report; locations are cited and redacted.
- [ ] Coverage, assumptions, and controls appendices are complete.
- [ ] No live resource was modified; all access was read-only and authorized.
```
