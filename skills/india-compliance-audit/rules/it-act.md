---
id: it-act
title: Information Technology Act, 2000 (key sections for developers)
applies_to: [all]
status: "Active and enforced"
penalty: "Varies by section — ₹5 lakh fine + up to 3 years imprisonment (§72A); compensation without upper limit (§43A)"
sources:
  - https://www.indiacode.nic.in/handle/123456789/2048
  - https://www.meity.gov.in/static/uploads/2024/02/Information-Technology-Intermediary-Guidelines-and-Digital-Media-Ethics-Code-Rules-2021-updated-06.04.2023-.pdf
---

# IT Act 2000 — Developer Obligations

The IT Act 2000 is the parent statute governing electronic transactions, cybercrime,
intermediary liability, and data protection. The DPDP Act (2023) supplements but does
not fully repeal the IT Act.

---

### OBL-ITA-01 — Section 43A: Compensation for data loss due to negligent security
- **requirement:** Any "body corporate" (company, startup, LLP, even sole proprietor handling data commercially) that possesses, deals with, or handles "sensitive personal data" (see spdi-rules.md) must implement "reasonable security practices." Failure causing wrongful loss/gain to any person → liable to pay compensation.
- **applies_when:** All commercial apps handling personal or sensitive data
- **evidence_hints:** Security controls present (encryption, access control, input validation, logging). Absence of these is evidence of non-compliance.
- **severity:** high
- **remediation:** Implement controls in security-safeguards.md. Conduct annual security audit or pen test. Reference IS 17428 / ISO 27001 as your baseline standard.
- **citation:** IT Act 2000 §43A; SPDI Rules 2011 r.8

### OBL-ITA-02 — Section 72A: No unauthorized disclosure of personal information
- **requirement:** Disclosing personal information obtained under a contract/service — without consent or in breach of the contract — is a criminal offence. Penalty: up to 3 years imprisonment + ₹5 lakh fine.
- **applies_when:** All apps; especially third-party integrations, analytics, data sharing with partners
- **evidence_hints:** Third-party SDK integrations (analytics, CRM, marketing automation); data export pipelines; API endpoints exposing user data to third parties; employee/contractor data access logs
- **severity:** high
- **remediation:** Review all third-party data-sharing. Ensure: (a) user consent covers the third party's use, (b) Data Processing Agreements (DPAs) are in place with vendors, (c) APIs don't expose PII to unauthorized parties. Mask PII in logs.
- **citation:** IT Act 2000 §72A

### OBL-ITA-03 — Section 79: Intermediary safe harbor conditions
- **requirement:** An "intermediary" (platform that hosts third-party content, marketplace, message platform) has safe harbor from liability for user content IF it meets due diligence conditions. Failure to maintain conditions = loss of safe harbor = liability for all hosted content.
- **applies_when:** ugc profile — apps hosting user-generated content
- **evidence_hints:** See intermediary-rules.md for the full set. Minimum: Terms of Use prohibiting illegal content; grievance officer mechanism; content takedown process.
- **severity:** high
- **remediation:** See intermediary-rules.md
- **citation:** IT Act 2000 §79; IT Rules 2021

### OBL-ITA-04 — Sections 66/67/69: Prevent cybercrime via your platform
- **requirement:** §66 (hacking/unauthorized access), §67 (obscene/CSAM content), §69 (government lawful interception) create liability if your platform facilitates or fails to prevent these. You must also maintain capability for lawful interception orders.
- **applies_when:** All apps (especially UGC and consumer apps)
- **evidence_hints:** OWASP Top 10 defenses: SQL injection, XSS, CSRF protections; CSAM/illegal content detection (if UGC); no hardcoded credentials; dependency vulnerability scanning
- **severity:** high
- **remediation:** Implement OWASP Top 10 fixes (see security-safeguards.md). For UGC apps: hash-based CSAM detection (PhotoDNA or equivalent), content moderation pipeline, NCMEC reporting mechanism. Maintain audit logs for lawful interception compliance.
- **citation:** IT Act 2000 §§66, 67, 69
