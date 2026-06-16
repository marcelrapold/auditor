# Security policy

## Reporting a vulnerability

Please report security vulnerabilities **privately** — do not open a public issue.

- Preferred: GitHub **Private Vulnerability Reporting** for this repository
  (Security → Report a vulnerability).
- Alternatively: email **marcel@marcelrapold.com** with details and reproduction steps.

You can expect an initial response within **5 business days**. Please give us a reasonable
window to investigate and ship a fix before any public disclosure.

## Scope

This repository contains audit master prompts (Markdown) and a small Next.js landing page in
`web/`. Relevant reports include:

- Vulnerabilities in the `web/` application or its dependencies.
- Prompt content that could cause an agent to take unsafe or destructive actions.
- Leaked secrets or credentials committed to the repository.

The prompts themselves are read-only audit instructions and are designed to be
non-destructive; see each prompt's authorization and read-only constraints.

## Supported versions

The latest released version on the default branch (`main`) is supported. See
[CHANGELOG.md](CHANGELOG.md) for releases.

| Version | Supported |
|---|---|
| latest (`main`) | yes |
| older tags | no |
