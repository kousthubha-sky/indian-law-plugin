---
id: dpdp-children
title: DPDP Act 2023 — Children's Data (under 18)
applies_to: [children]
status: "Phase 3 (~May 2027) — prepare now; applies when app is accessible to or targets minors"
penalty: "Up to ₹200 crore"
sources:
  - https://www.meity.gov.in/content/digital-personal-data-protection-act-2023
  - https://www.indiacode.nic.in/handle/123456789/22037
  - https://ksandk.com/data-protection-and-data-privacy/dpdp-compliance-for-schools-and-edtech/
---

# DPDP Act 2023 — Children's Data Obligations

India's DPDP Act treats anyone under 18 as a "child". These rules apply to any app that:
- Is used by or marketed to users who may be under 18 (schools, edtech, games, social apps, public portals)
- Collects a date of birth that yields age < 18
- Has no age gate (i.e., any user including minors could sign up)

Children's data obligations are in addition to all regular DPDP obligations.

---

### OBL-CHILD-01 — Age verification before data collection
- **requirement:** Before collecting any personal data, the app must verify whether the user is under 18. A simple DOB field or self-declaration is insufficient — must be "verifiable."
- **applies_when:** Any app where minors may create accounts or provide data
- **evidence_hints:** DOB or age field in registration form; age-gate middleware; `age_verification`, `isMinor`, `dob` in code; document/ID check integration
- **severity:** high
- **remediation:** Add DOB field to registration. If DOB results in age < 18, route to parental consent flow. Log the verification method used.
- **citation:** DPDP Act 2023 §9(1); DPDP Rules 2025 r.10

### OBL-CHILD-02 — Verifiable parental consent for under-18 users
- **requirement:** If a user is under 18, obtain verifiable parental/guardian consent before account activation or data collection. Parental consent must be explicit, informed, and revocable.
- **applies_when:** Confirmed minor user
- **evidence_hints:** `parentalConsent`, `guardian_email`, `parent_approval`, parent-consent email flow, `parentConsent: true` in user model
- **severity:** high
- **remediation:** REM-AGE-01 — implement parent email flow, OTP confirmation, or parent-account linkage. Store consent record with parent contact, timestamp, consent version.
- **citation:** DPDP Act 2023 §9(1)

### OBL-CHILD-03 — No behavioral tracking or monitoring of children
- **requirement:** Do not deploy tracking technologies (cookies, device fingerprinting, pixel trackers, session recording) that monitor or profile children's behavior.
- **applies_when:** Minor user accounts
- **evidence_hints:** Analytics SDK initialisation (Google Analytics, Mixpanel, Segment, Hotjar, FullStory); must be gated/skipped for minor user sessions. Check if analytics init checks `isMinor` before firing.
- **severity:** critical
- **remediation:** Wrap all analytics and tracking SDK calls in a guard: `if (!user.isMinor) { analytics.track(...) }`. Test that no analytics events fire for minor-flagged sessions.
- **citation:** DPDP Act 2023 §9(3)

### OBL-CHILD-04 — No targeted advertising to children
- **requirement:** Do not serve interest-based or behaviorally targeted advertising to users under 18. Contextual advertising is permitted; behavioral profiling for ads is not.
- **applies_when:** Apps with advertisements or ad networks
- **evidence_hints:** Ad network SDK (Google AdSense, Meta Audience Network, InMobi); must pass `tfua=1` (Tag for Under-Age) or equivalent child-safe flag for minor users. Check ad initialisation code.
- **severity:** critical
- **remediation:** Pass child-safe/COPPA equivalent flags to all ad SDKs for users flagged as minors. For Google Ads: set `npa=1` and `tfua=1`. For Meta: set `DataProcessingOptions=["LDU"]`. Alternatively, show no ads to minor users.
- **citation:** DPDP Act 2023 §9(3)
