# Build Plan — Indian Law Compliance Audit Plugin

## Context

A freelancer/dev building client apps (ERP, school/public sites, startups, e‑commerce,
fintech, health) in India must satisfy a layered, actively‑enforcing compliance regime —
DPDP Act 2023, IT Act, CERT‑In, RBI, accessibility law, sector rules, plus business/tax.
DPDP's full substantive obligations land **~May 2027 with no grace period** (penalties up
to ₹250 crore), so a tool that flags gaps *while the app is being built* is timely.

**Research verdict — nothing like this exists.** Generic privacy scanners (Privado,
Presidio, Semgrep) carry only GDPR/CCPA/HIPAA rules and no Aadhaar/PAN awareness; DPDP
SaaS platforms (DPDPA Shield, PrivacyEngine, Protecto) are GRC paperwork tools that never
read code; the few "DPDP" AI skills are guidance docs, not auditors. **No tool audits a
codebase against Indian law.** This plugin would be the first.

## Locked decisions

| Decision | Choice |
|---|---|
| Build target | **Claude Code plugin** (skills + commands + knowledge base), portable to other AI assistants |
| Audit engine | **Hybrid** — deterministic detectors find hard signals; AI reasons + writes the report |
| v1 coverage | **Everything** — core universal + all sector packs + business/tax |
| Process | This plan first; build after review |

## Guiding principle — accuracy over coverage

This is **not legal advice**; it flags technical compliance signals and cites the law.
Every rule file **must cite a primary/official source** (meity.gov.in, cert-in.org.in,
rbi.org.in, indiacode.nic.in, official gazette). Specific figures gathered in research
(exact DPDP phase dates, the Feb‑2026 takedown‑hour amendments, "SC order on consent")
**must be re‑verified against primary sources at build time** before they appear in a
rule. Where a number can't be confirmed, the rule states the obligation qualitatively and
marks the figure "verify."

## Architecture & file layout

```
indian-law-plugin/
├── .claude-plugin/plugin.json          # manifest: name "indian-law-compliance", v0.1.0
├── README.md                           # what/why, install, usage, prominent disclaimer
├── LICENSE
├── commands/
│   ├── india-audit.md                  # /india-audit [area] — full or scoped audit
│   └── india-checklist.md              # /india-checklist — interactive Q&A for non-code items
├── skills/india-compliance-audit/
│   ├── SKILL.md                        # orchestrator (the hybrid flow, below)
│   ├── references/
│   │   ├── app-type-detection.md       # classify: erp | public-website | ecommerce | fintech | health | ugc | generic
│   │   ├── report-format.md            # severity model, posture levels, report template
│   │   └── remediation-patterns.md     # reusable fixes (consent UI, deletion API, grievance contact…)
│   └── rules/                          # the knowledge base — one file per law area
│       ├── _index.md                   # catalog + applicability matrix (app-type → rule packs)
│       ├── dpdp-act.md          ├── intermediary-rules.md   ├── aadhaar-uidai.md
│       ├── dpdp-children.md     ├── accessibility.md        ├── health-abdm.md
│       ├── it-act.md            ├── rbi-fintech.md          ├── business-tax.md
│       ├── spdi-rules.md        ├── consumer-ecommerce.md   └── standards.md
│       ├── cert-in.md           └── security-safeguards.md
└── detectors/                          # deterministic layer of the hybrid engine
    ├── run-detectors.mjs               # Node CLI: scans repo → JSON findings (no deps, zero-install)
    ├── patterns/
    │   ├── india-pii.json              # Aadhaar (12-digit + Verhoeff), PAN, IFSC, UPI VPA, voter ID
    │   ├── data-residency.json         # non-India cloud regions (us-east-1, eu-west…) for localization checks
    │   ├── policy-artifacts.json       # presence of privacy policy / terms / grievance / a11y statement
    │   ├── security.json               # hardcoded secrets, md5/sha1 password hashing, missing TLS hints
    │   └── accessibility.json          # <img> w/o alt, inputs w/o labels, missing lang attr
    └── README.md
```

## Hybrid audit flow (SKILL.md orchestrator)

1. **Detect** app type + stack — read `package.json`/`requirements.txt`/`pom.xml`, routes,
   and keyword signals (payment, aadhaar, patient/EHR, cart/order, user-content) → one or
   more profiles.
2. **Select** applicable rule packs via the matrix in `rules/_index.md`.
3. **Run detectors** — `node detectors/run-detectors.mjs <path>` → JSON of hard findings
   (Aadhaar/PAN/IFSC in code or logs, non-India regions, missing policy files, weak hashing,
   a11y gaps). Heuristics reduce false positives (e.g., Aadhaar Verhoeff checksum).
4. **AI reasoning pass** — for each applicable obligation, read the rule file, inspect the
   codebase for the checkable behaviour (consent flow, data-deletion endpoint, breach
   logging, encryption, grievance officer, FHIR, KYC…), and fuse with detector output.
5. **Report** — write `india-compliance-report.md` into the audited project.

## Rule-file schema (the core contract)

Markdown-first (AI reads it) with YAML frontmatter, and each obligation carries a stable
`id` so detectors and a future CLI can map to it.

```markdown
---
id: dpdp-act
title: Digital Personal Data Protection Act, 2023 (+ DPDP Rules 2025)
applies_to: [all]                 # all | public-website | ecommerce | fintech | health | ugc | children
status: "Phased; full obligations ~May 2027 (verify)"
sources: [https://www.meity.gov.in/...]
---

### OBL-DPDP-01 — Granular, purpose-specific consent
- requirement: separate, standalone, opt-in consent per purpose; no pre-ticked/bundled
- applies_when: app collects personal data
- detect: AI + detector (consent UI, per-purpose checkboxes)
- evidence_hints: signup forms, cookie banners, consent components
- severity: high
- remediation: <reusable pattern reference>
- citation: DPDP Act 2023 §6; DPDP Rules 2025 r.3
```

## Coverage matrix (law pack → applies to)

| Pack | Applies to |
|---|---|
| dpdp-act, it-act, spdi-rules, cert-in, security-safeguards | **all** apps with personal data |
| dpdp-children | apps usable by <18 (schools, edtech, social, games) |
| accessibility (RPwD/IS 17802/WCAG 2.1 AA) | all; **mandatory** for public/gov + SEBI-regulated |
| intermediary-rules | user-generated-content platforms |
| rbi-fintech | payments / lending / wallets |
| consumer-ecommerce | e-commerce / marketplace |
| aadhaar-uidai | apps doing Aadhaar auth / eKYC |
| health-abdm | health / telemedicine / EHR |
| business-tax, standards | the freelancer/firm (GST, TDS, PAN/TAN/IEC, Companies Act; IS 17428, ISO 27001) |

## Report format

`india-compliance-report.md` in the audited repo:
- **Header** — detected profile(s), packs applied, date, disclaimer (not legal advice).
- **Posture summary** — counts by severity + per-pack level: `Compliant / Partial / Gap /
  Not auto-verifiable` (no false-precision %).
- **Findings** — grouped by law, each: id, title, severity, status, evidence (`file:line`
  or "not found"), citation, remediation, confidence.
- **Manual / legal review** — items code can't verify (DPO appointment, registrations,
  insurance, actual breach process).
- **Roadmap callout** — e.g., DPDP Phase 3 ~May 2027.

## Build milestones (sequenced even though scope = everything)

- **M1 — Skeleton:** manifest, README+disclaimer, SKILL.md flow, app-type detection,
  report-format, `rules/_index.md` matrix.
- **M2 — Core + detectors:** rule packs dpdp-act, dpdp-children, it-act, spdi-rules,
  cert-in, security-safeguards, accessibility; `run-detectors.mjs` + patterns
  (india-pii, data-residency, policy-artifacts, security, accessibility).
- **M3 — Sector + business:** rbi-fintech, consumer-ecommerce, aadhaar-uidai, health-abdm,
  intermediary-rules, business-tax, standards.
- **M4 — Commands + polish:** `/india-audit`, `/india-checklist`, run end-to-end on a
  fixture, tighten false positives, finalize disclaimer.

## Verification

1. **Fixture app** under `detectors/__fixtures__/` with deliberate violations: Aadhaar/PAN
   in code, no privacy policy, `us-east-1` region, `<img>` without alt, md5 password hash.
2. `node detectors/run-detectors.mjs detectors/__fixtures__` → asserts the known findings.
3. `/india-audit` in Claude Code on the fixture → review report quality, citations, severity.
4. Plugin loads cleanly — manifest valid, skill + commands discovered (`/plugin`).
5. Spot-check 3–4 rule citations against primary sources (meity/cert-in/rbi/indiacode).

## Out of scope (v1)

Auto-remediation/code-fixing, a standalone non-AI CLI distribution (the rule schema is
designed so this is addable later), and real-time CI gating (a hook can be added post-v1).
