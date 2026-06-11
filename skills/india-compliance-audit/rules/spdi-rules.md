---
id: spdi-rules
title: SPDI Rules 2011 — Sensitive Personal Data or Information
applies_to: [all]
status: "Active; expected to be superseded by DPDP Act Phase 3 (~May 2027 — verify at meity.gov.in)"
penalty: "Compensation under IT Act §43A (no upper limit); criminal liability under §72A"
sources:
  - https://iclg.com/practice-areas/data-protection-laws-and-regulations/india/
  - https://www.indiacode.nic.in/handle/123456789/2048
  - https://www.meity.gov.in/sites/upload_files/dit/files/GSR313E_10511(1).pdf
---

# SPDI Rules 2011 — Sensitive Personal Data

These rules under the IT Act 2000 §43A define "sensitive personal data or information"
(SPDI) and require extra protections. They remain in force until the DPDP Act fully
supersedes them (expected Phase 3 ~May 2027 — verify).

## What counts as SPDI

- Passwords
- Financial information: bank account number, card details, debit/credit/other payment instrument details
- Physical, physiological, and mental health conditions
- Sexual orientation
- Medical records and history
- Biometric information (fingerprints, iris, facial geometry)
- Any details relating to the above as provided to a body corporate for providing a service

**Not SPDI:** Name, address, phone number, email in isolation (though these are "personal data" under DPDP).

---

### OBL-SPDI-01 — Identify and tag all SPDI categories in the codebase
- **requirement:** Know where SPDI is stored, processed, and transmitted. Apply enhanced protection to all SPDI fields.
- **applies_when:** App stores any SPDI field
- **evidence_hints:** ORM/model fields named: `password`, `card_number`, `bank_account`, `health_condition`, `biometric`, `fingerprint`, `medical_record`, `sexual_orientation`; raw financial data in any store
- **severity:** high
- **remediation:** Audit all database schemas and object models for SPDI fields. Tag them explicitly. Apply REM-ENCRYPT-01 to all SPDI fields at rest.
- **citation:** IT Act 2000 §43A; SPDI Rules 2011 r.3

### OBL-SPDI-02 — Explicit consent before collecting SPDI
- **requirement:** Obtain explicit consent specifically for collecting each SPDI category. Consent must be in writing or electronic form and can be withdrawn. Do not collect SPDI without user's consent.
- **applies_when:** Any collection of SPDI fields
- **evidence_hints:** Separate consent checkbox for sensitive data (e.g., health, financial, biometric); consent flow before financial-data entry screen
- **severity:** high
- **remediation:** Add distinct consent step before collecting SPDI — separate from general account consent. Store the SPDI-specific consent record.
- **citation:** SPDI Rules 2011 r.5

### OBL-SPDI-03 — Do not disclose SPDI to third parties without consent
- **requirement:** SPDI must not be shared with third parties (including service providers, analytics, advertisers) without user's explicit consent, or unless required by law.
- **applies_when:** Any third-party integration touching SPDI fields
- **evidence_hints:** Third-party analytics/CRM receiving health, financial, or biometric data; API responses including SPDI fields that reach third parties; data exports
- **severity:** high
- **remediation:** Audit all outbound data flows from SPDI fields. Ensure third-party contracts include data protection obligations. Never send raw SPDI to analytics/marketing platforms.
- **citation:** SPDI Rules 2011 r.6
