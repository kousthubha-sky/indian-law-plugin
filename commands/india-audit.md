# /india-audit

Run an Indian-law compliance audit on the current project (or a specified path).

## Usage

```
/india-audit
/india-audit all
/india-audit <area>
/india-audit <area> <path>
```

## Area arguments

| Area | Law packs audited |
|---|---|
| (none) / `all` | Everything applicable to the detected app profile |
| `dpdp` | DPDP Act 2023 + DPDP Rules 2025 |
| `children` | DPDP children's data obligations |
| `it-act` | IT Act 2000 key sections |
| `spdi` | SPDI Rules 2011 |
| `cert-in` | CERT-In Directions 2022 |
| `security` | Security safeguards (cross-statute) |
| `accessibility` | RPwD Act, IS 17802, WCAG 2.1 AA |
| `rbi` | RBI payment data, digital lending, KYC |
| `ecommerce` | Consumer Protection Act + E-Commerce Rules |
| `aadhaar` | Aadhaar Act + UIDAI requirements |
| `health` | ABDM, Telemedicine Guidelines, EHR |
| `intermediary` | IT Intermediary Rules 2021 |
| `business` | GST, TDS, Companies Act (informational checklist) |

## What this command does

Invokes the `india-compliance-audit` skill (SKILL.md) which:

1. Detects the app's profile (ecommerce / fintech / health / ugc / children / generic).
2. Selects applicable law packs from the rules directory.
3. Runs `detectors/run-detectors.mjs` for deterministic findings.
4. Performs AI reasoning over the codebase against each obligation.
5. Writes `india-compliance-report.md` to the project root.
6. Prints a summary of findings.

## Examples

```bash
# Full audit of current directory
/india-audit

# Only check DPDP compliance
/india-audit dpdp

# Audit a different project path
/india-audit all /path/to/my-startup-app

# Only check accessibility
/india-audit accessibility
```

## Output

- `india-compliance-report.md` written to the audited project root.
- Terminal summary with posture levels and finding counts.
- Manual review checklist for items that cannot be verified from code.

## Disclaimer

This audit flags technical signals against published Indian law. It is NOT legal advice.
Consult a qualified legal professional for compliance decisions. Verify current law
status at meity.gov.in, cert-in.org.in, rbi.org.in, indiacode.nic.in.
