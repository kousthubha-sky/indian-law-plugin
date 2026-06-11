---
id: health-abdm
title: ABDM, Telemedicine Guidelines 2020, EHR Standards (Health Apps)
applies_to: [health]
status: "Active; ABDM integration mandatory for AB-PMJAY hospitals (2026); Telemedicine Guidelines 2020 in force"
penalty: "₹5 lakh (EHR non-compliance); regulatory action by NMC/health ministry for telemedicine violations"
sources:
  - https://abdm.gov.in/
  - https://ehr.network/abdm-compliance-ab-pmjay-hospitals-2026/
  - https://connect.nuvertos.com/blog/abdm-compliant-hospital-software-2026-guide
  - https://doccure.io/telemedicine-guidelines-and-regulations-in-india-updated-for-2026/
---

# Health App Obligations — ABDM + Telemedicine + EHR

Applies to: telemedicine apps, hospital management systems (HIS), diagnostic lab platforms,
EHR/PHR applications, health-monitoring apps that collect diagnostic data.

Health data is SPDI (see spdi-rules.md) and gets the highest level of protection under
both DPDP Act and ABDM framework.

---

### OBL-HLTH-01 — ABHA (Ayushman Bharat Health Account) integration
- **requirement:** Health apps must support ABHA (the national digital health ID) creation and linking during user onboarding. Patients should be able to view their ABHA ID within the app. This is mandatory for hospitals participating in AB-PMJAY (2026 state directives).
- **applies_when:** Health apps, HIS, EHR platforms
- **evidence_hints:** ABHA creation/linking UI in onboarding; `abha_id`, `abha_address`, `health_id` fields in user/patient model; ABDM SDK import; `ABDM_CLIENT_ID`, `ABHA_GATEWAY_URL` env vars; route `/abha-registration` or `/health-id`
- **severity:** high
- **remediation:** Integrate ABHA SDK from ABDM (abdm.gov.in/developers). Add ABHA registration and linking step in patient onboarding. Store ABHA address (not the 14-digit number) in patient record. Test in ABDM sandbox before production.
- **citation:** ABDM HPR/HFR Integration Guidelines 2022; State AB-PMJAY directives 2026

### OBL-HLTH-02 — HIP/HIU gateway registration and consent-based data sharing
- **requirement:** Apps storing health records must register as a Health Information Provider (HIP) with ABDM. Apps consuming health records from other providers must register as a Health Information User (HIU). All data sharing must be consent-driven — the patient approves each data request through the ABDM consent framework.
- **applies_when:** Apps that store or retrieve health records
- **evidence_hints:** ABDM gateway integration code; HIP/HIU credentials in env vars (`ABDM_HIP_ID`, `ABDM_HIU_ID`); consent-request flow before fetching records from another HIP; ABDM consent artefact handling in code
- **severity:** high
- **remediation:** Register as HIP/HIU at abdm.gov.in. Implement ABDM gateway API: consent request → consent artefact → data fetch. Never fetch health records from another provider without a valid consent artefact. Log all data-sharing transactions.
- **citation:** ABDM Health Data Management Policy 2022; DPDP Act 2023 §9 (sensitive data)

### OBL-HLTH-03 — FHIR-format health records
- **requirement:** Health records shared through ABDM must be structured as FHIR (Fast Healthcare Interoperability Resources) JSON/XML resources. This ensures any ABDM-compliant app can read the data. ABDM uses FHIR R4 as the standard.
- **fhir_mappings:** Discharge summary → FHIR Composition; Prescription → FHIR MedicationRequest; Lab report → FHIR DiagnosticReport; Vital signs → FHIR Observation; Patient info → FHIR Patient.
- **applies_when:** HIP apps sharing health records
- **evidence_hints:** FHIR resource construction code; `fhir.js`, `hapi-fhir`, or ABDM FHIR SDK dependency; FHIR JSON structure in API responses; `resourceType: "Composition"` or similar in health record export
- **severity:** medium
- **remediation:** Use ABDM's FHIR Implementation Guide (abdm.gov.in/developers/health-records). Generate FHIR resources for each record type. Validate against FHIR validator before production. Existing non-FHIR records: create a migration pipeline to convert to FHIR.
- **citation:** ABDM FHIR Implementation Guide R4; MoHFW EHR Standards 2016

### OBL-HLTH-04 — Telemedicine practice guidelines compliance
- **requirement:** Apps offering remote consultations must comply with Telemedicine Practice Guidelines 2020 (MoHFW/NMC): only Registered Medical Practitioners (RMPs) enrolled with NMC may consult; patient informed consent required before each consultation; digital records retained for minimum 3 years; narcotics/Schedule X drugs may NOT be prescribed via telemedicine; unsafe or complex cases must be referred for in-person evaluation.
- **applies_when:** Telemedicine / remote consultation apps
- **evidence_hints:** NMC/state medical council registration verification for provider accounts; patient consent step before consultation; consultation record stored with timestamp, provider NMC number, prescription, clinical notes; blocked drug categories in prescription module; `is_rmp_verified`, `nmc_number` in doctor/provider model
- **severity:** high
- **remediation:** Add NMC number field to provider profile; verify against NMC register (nmc.org.in) during onboarding; flag unverified providers. Implement consultation consent screen. Set consultation record retention to >= 3 years. Add a blocked-drug list to the prescription module (narcotics/opioids/Schedule X). Add "Refer for in-person" option with clinical notes.
- **citation:** Telemedicine Practice Guidelines 2020 (MoHFW-NMC); Indian Medical Council (Professional Conduct, Etiquette and Ethics) Regulations
