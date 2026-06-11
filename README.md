# indian-law-compliance — Claude Code Plugin

An AI-powered compliance audit plugin for Indian developers and freelancers. Audits any
software project against the Indian laws and regulations that govern building apps for
clients — ERP, school/public websites, startups, e-commerce, fintech, health tech, and more.

> **NOT LEGAL ADVICE.** This plugin flags technical compliance signals and cites published
> law. It does not constitute legal advice. Consult a qualified legal professional for
> compliance decisions. Verify current law status at official sources (meity.gov.in,
> cert-in.org.in, rbi.org.in, indiacode.nic.in).

---

## Why this exists

No developer-facing tool audits a codebase against Indian law. Generic privacy scanners
(Privado, Presidio, Semgrep) carry only GDPR/CCPA rules. DPDP compliance SaaS platforms
target legal teams, not developers. This plugin is the first to combine:

- India-specific law rules (DPDP, IT Act, CERT-In, RBI, RPwD/accessibility, ABDM, Aadhaar)
- India-specific PII detection (Aadhaar with Verhoeff checksum, PAN, IFSC, UPI VPA)
- Hybrid engine: deterministic code scanners + AI contextual reasoning
- Actionable findings with law citations and remediation guidance

---

## Laws covered

| Law | Area | Severity |
|---|---|---|
| **DPDP Act 2023 + Rules 2025** | Consent, data rights, breach notification, children's data, security | ₹250 crore penalty |
| **IT Act 2000** | Security, intermediary liability, cybercrime | ₹5 lakh + imprisonment |
| **SPDI Rules 2011** | Sensitive personal data (passwords, financial, health, biometric) | Compensation liability |
| **CERT-In Directions 2022** | 6-hr incident reporting, 180-day India-stored logs, NTP sync | ₹1 lakh fine |
| **RPwD Act 2016 + IS 17802** | Accessibility — WCAG 2.1 AA | ₹1–5 lakh (SEBI entities) |
| **IT Intermediary Rules 2021** | Grievance officer, takedown SLAs, due diligence (UGC platforms) | Loss of §79 safe harbor |
| **RBI Payment Data + Digital Lending** | Payment localization in India (24h), KYC, lending disclosures | License cancellation |
| **Consumer Protection Act + E-Commerce Rules** | Mandatory disclosures, grievance SLA, pricing transparency | ₹10 lakh fine |
| **Aadhaar Act + UIDAI** | Consent, no raw Aadhaar storage, KUA/AUA registration, SHA-256 | ₹1 crore fine |
| **ABDM + Telemedicine Guidelines** | ABHA integration, HIP/HIU, FHIR, NMC verification | Regulatory action |
| **GST + Companies Act** | Business registration, invoicing, TDS (informational checklist) | Tax penalties |
| **IS 17428, ISO 27001** | Voluntary standards — reduce liability, required by enterprise clients | Voluntary |

---

## Install

```bash
# In Claude Code: install from local path
/plugin install <path-to-this-directory>

# Or clone and install
git clone https://github.com/your-org/indian-law-plugin
cd indian-law-plugin
# Then in Claude Code:
/plugin install .
```

Requires Node.js 18+ for the deterministic detector layer.

---

## Usage

```bash
# Full audit of current project
/india-audit

# Audit a specific area only
/india-audit dpdp
/india-audit cert-in
/india-audit rbi
/india-audit accessibility
/india-audit health
/india-audit aadhaar
/india-audit children
/india-audit security
/india-audit ecommerce
/india-audit intermediary
/india-audit all

# Interactive checklist for non-code items
# (GST, DPO appointment, incident response plan, insurance, etc.)
/india-checklist

# Run detectors standalone (no AI needed)
node detectors/run-detectors.mjs /path/to/project
node detectors/run-detectors.mjs /path/to/project --json
node detectors/run-detectors.mjs /path/to/project --pack india-pii
```

---

## How it works

### Hybrid engine

1. **App-type detection** — reads `package.json`, route files, dependency names to classify
   the project: `generic`, `ecommerce`, `fintech`, `health`, `ugc`, `children`, `aadhaar`,
   `public-website`, `erp`.

2. **Deterministic detectors** — `detectors/run-detectors.mjs` scans the codebase for hard
   signals:
   - India PII: Aadhaar (Verhoeff-validated), PAN, IFSC, UPI VPA hardcoded in source
   - Non-India cloud regions (triggers DPDP cross-border + RBI localization flags)
   - Missing policy artifacts: privacy policy, T&Cs, grievance contact, consent banner
   - Security: hardcoded secrets, weak password hashing, plain-HTTP API URLs, SQL injection
   - Accessibility: images without alt text, missing HTML lang attr, suppressed focus outline

3. **AI reasoning** — reads each applicable rule pack and inspects the codebase for the
   full set of obligations (consent flows, data deletion endpoints, encryption, children's
   data handling, FHIR format, etc.).

4. **Report** — writes `india-compliance-report.md` to the project root with:
   - Posture summary per law pack (Compliant / Partial / Gap / Not-auto-verifiable)
   - Findings with file:line evidence, law citation, remediation guidance
   - Manual review checklist for items that can't be verified from code

### Report example

```
## Posture Summary

| Law Pack      | Posture | Critical | High | Medium |
|---------------|---------|----------|------|--------|
| DPDP Act 2023 | gap     | 1        | 3    | 1      |
| CERT-In 2022  | partial | 0        | 1    | 2      |
| Security      | gap     | 2        | 1    | 0      |
| Accessibility | partial | 0        | 0    | 3      |

## Finding: [CRITICAL] OBL-SEC-04 — Hardcoded credentials

- **Status:** gap
- **Evidence:** `src/config/db.js:12` — `password = "mysecret123"`
- **Law:** DPDP Act 2023 §8(1); IT Act 2000 §43A
- **Remediation:** Move to environment variable. Use AWS Secrets Manager or .env file (add .env to .gitignore).
```

---

## Project structure

```
indian-law-plugin/
├── .claude-plugin/plugin.json          # Plugin manifest
├── commands/
│   ├── india-audit.md                  # /india-audit command
│   └── india-checklist.md              # /india-checklist command
├── skills/india-compliance-audit/
│   ├── SKILL.md                        # Audit orchestrator
│   ├── references/
│   │   ├── app-type-detection.md
│   │   ├── report-format.md
│   │   └── remediation-patterns.md
│   └── rules/                          # 14 law pack knowledge files
│       ├── _index.md                   # Applicability matrix
│       ├── dpdp-act.md
│       ├── dpdp-children.md
│       ├── it-act.md
│       ├── spdi-rules.md
│       ├── cert-in.md
│       ├── security-safeguards.md
│       ├── accessibility.md
│       ├── rbi-fintech.md
│       ├── consumer-ecommerce.md
│       ├── aadhaar-uidai.md
│       ├── health-abdm.md
│       ├── intermediary-rules.md
│       ├── business-tax.md
│       └── standards.md
└── detectors/
    ├── run-detectors.mjs               # Zero-dependency Node.js scanner
    ├── patterns/
    │   ├── india-pii.json
    │   ├── data-residency.json
    │   ├── policy-artifacts.json
    │   ├── security.json
    │   └── accessibility.json
    ├── __fixtures__/bad-app.js         # Test fixture with known violations
    └── README.md
```

---

## Key 2026 / 2027 deadlines

| Date | Event |
|---|---|
| Nov 13, 2026 | DPDP Phase 2: Consent Manager Framework — integrate NOW |
| ~May 14, 2027 | DPDP Phase 3: Full obligations live — NO grace period |
| Ongoing | CERT-In 6-hour reporting — active now |
| Ongoing | RBI payment data in India within 24h — active now |

*Always verify current dates at meity.gov.in — DPDP phase timelines have shifted before.*

---

## Contributing

Rule files are the core of this plugin. To improve or add a rule:

1. Edit the relevant `skills/india-compliance-audit/rules/<law>.md` file.
2. Every obligation needs: `id`, `requirement`, `evidence_hints`, `severity`, `citation` (primary source URL).
3. For detector patterns: edit `detectors/patterns/<pack>.json`.
4. Test against the fixture: `node detectors/run-detectors.mjs detectors/__fixtures__`.

Pull requests with law citations to primary government sources (meity.gov.in, cert-in.org.in,
rbi.org.in, indiacode.nic.in, uidai.gov.in, abdm.gov.in) are preferred over secondary sources.

---

## Disclaimer (full)

This plugin is provided for informational and educational purposes only. It is NOT legal
advice. The findings generated are technical signals, not legal determinations. The plugin
authors are not lawyers and do not represent that any output constitutes legal compliance
or a complete audit.

Indian law requirements change. DPDP Rules were last updated in 2025; deadlines have
shifted; sector regulations are amended regularly. Always verify current requirements with
a qualified legal professional and at official government sources.

Use of this plugin does not guarantee or imply that your application is legally compliant
with any Indian law or regulation. The authors accept no liability for actions taken based
on plugin output.

---

## License

MIT — see [LICENSE](LICENSE).
