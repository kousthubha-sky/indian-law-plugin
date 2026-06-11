---
id: intermediary-rules
title: IT (Intermediary Guidelines & Digital Media Ethics Code) Rules 2021
applies_to: [ugc]
status: "Active; amended February 2026 (tightened takedown timelines and grievance SLAs)"
penalty: "Loss of Section 79 safe harbor (full liability for all hosted content); ₹1 lakh fine per violation"
sources:
  - https://www.khaitanco.com/thought-leadership/MeitY-notifies-the-IT-Amendment-Rules-2026
  - https://www.meity.gov.in/static/uploads/2024/02/Information-Technology-Intermediary-Guidelines-and-Digital-Media-Ethics-Code-Rules-2021-updated-06.04.2023-.pdf
  - https://www.mondaq.com/india/social-media/1050302/highlights-information-technology-intermediary-guidelines-and-digital-media-ethics-code-rules-2021
---

# IT Rules 2021 — Intermediary Due Diligence

These rules apply to "intermediaries" — platforms that host, store, or transmit
third-party content: social platforms, forums, marketplaces, messaging apps, classified
sites, review platforms, user-upload services. Failure to comply removes the IT Act §79
safe harbor, making the platform liable for all content hosted.

---

### OBL-INTR-01 — Grievance mechanism and officer appointment
- **requirement:** Appoint a Grievance Officer (resident in India). Contact details must be published in the app/website Terms of Use and Privacy Policy. Timelines (as amended Feb 2026 — verify current rules at meity.gov.in):
  - Acknowledge grievance within **24 hours**
  - Resolve grievance within **7 days** (general complaints)
  - Remove/address illegal content within **36 hours** of complaint
  - Remove non-consensual intimate imagery (NCII) / deepfakes within **2 hours**
- **applies_when:** All UGC platforms
- **evidence_hints:** Terms of Use or Privacy Policy page listing Grievance Officer name, email, and address; in-app complaint/report form; SLA tracking in support system; `grievance_officer` contact in legal pages
- **severity:** high
- **remediation:** REM-GRIEVANCE-01. Publish Grievance Officer name and contact in T&Cs. Build complaint intake (form or email). Set up a ticketing system with SLA alerts: 24h acknowledgment, 7-day resolution. Implement priority queue for NCII/deepfake reports (2-hour removal).
- **citation:** IT Rules 2021 r.4; IT (Amendment) Rules 2026 (verify at meity.gov.in)

### OBL-INTR-02 — Content takedown and moderation
- **requirement:** Upon receiving a valid court order, government takedown notice, or user report of illegal content, remove the content within the prescribed timeline:
  - Court order / government order: **3 hours** (as of Feb 2026 — verify)
  - General illegal content: within **36 hours**
  - NCII (non-consensual intimate imagery), deepfakes, CSAM: **2 hours**
  Send removal notifications to both the reporter and the original content poster.
- **applies_when:** UGC platforms
- **evidence_hints:** Content removal workflow or moderation pipeline; `content_status: removed`, `removed_at`, `removal_reason` fields in content models; automated takedown timer/alert; CSAM reporting integration (NCMEC hash-check, PhotoDNA equivalent); audit log of removal actions
- **severity:** high
- **remediation:** Build a takedown flow: intake (report form/email/API) → triage → removal within SLA → notification. For CSAM: integrate hash-matching (contact NCMEC for access to hash list). Maintain a removal log with: content ID, reporter, reason, removal timestamp, notification sent.
- **citation:** IT Rules 2021 rr.4, 4A; IT Act 2000 §§79, 67B

### OBL-INTR-03 — Terms of Use and due diligence obligations
- **requirement:** Maintain a Terms of Use/Service Agreement that explicitly prohibits: content threatening national security, defamatory content, obscene material, IP-infringing content, content inciting violence or hatred, CSAM. Users must agree to ToU on registration. Maintain records of user registrations. Must have a Compliance Officer and Nodal Contact Person (for law enforcement liaison) if platform has > 50 lakh (5 million) registered users in India.
- **applies_when:** All UGC platforms
- **evidence_hints:** Terms of Service page with prohibited-content list; checkbox accepting ToU at registration; `tos_accepted_at` in user model; Compliance Officer and Nodal Officer contacts in T&Cs (for large platforms); government data request handling process
- **severity:** medium
- **remediation:** Draft ToU covering all prohibited content categories. Add mandatory ToU acceptance checkbox at signup (store acceptance timestamp). For platforms > 50L users: appoint Compliance Officer and Nodal Officer (India-based); publish their contacts; implement a process for government data requests.
- **citation:** IT Rules 2021 rr.3, 4; IT Act 2000 §79
