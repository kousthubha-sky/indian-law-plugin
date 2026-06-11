---
id: rbi-fintech
title: RBI — Payment Data Localization, Digital Lending, KYC
applies_to: [fintech]
status: "Active; strictly enforced. Payment data storage directive effective 2018; digital lending guidelines 2022."
penalty: "License cancellation; ₹1–10 lakh fine; regulatory action"
sources:
  - https://www.rbi.org.in/commonperson/English/Scripts/FAQs.aspx?Id=2995
  - https://doverunner.com/blogs/everything-to-know-about-rbi-data-localization-guidelines/
  - https://www.openmalo.com/blog/rbi-digital-lending-guidelines-2026
  - https://www.rbi.org.in/
---

# RBI Payment and Fintech Obligations

Applies to any app that processes payments, offers credit/loans, operates a digital wallet,
provides UPI services, or handles financial transactions. The RBI strictly enforces data
localization; non-compliance can result in license cancellation.

---

### OBL-RBI-01 — Payment data localization (storage in India within 24 hours)
- **requirement:** All payment system data (end-to-end transaction details, customer payment data, transaction metadata) must be stored **within India** (on Indian servers). If processed abroad, the copy abroad must be deleted and only the India-stored copy retained — within 24 hours of the transaction.
- **data_covered:** Customer name, email, phone, address, masked card/account/UPI ID, transaction amount, timestamp, merchant, purpose, tokenization data.
- **applies_when:** Any app processing or storing payment transactions
- **evidence_hints:** Cloud region config for payment data store (must be ap-south-1/asia-south1/Azure India); payment gateway SDK configuration; Terraform/CDK IaC specifying storage region; `AWS_REGION`, `PAYMENT_STORE_REGION` env vars; Razorpay and Cashfree are India-based by default; Stripe/PayPal defaults to US — check data residency settings explicitly
- **severity:** critical
- **detector:** data-residency patterns (non-India regions in payment-related config)
- **remediation:** REM-LOCALIZE-01. Map the entire payment data flow: collection point → processing → final storage. Confirm every step uses India-region infrastructure. Get written confirmation from payment processor that data stays in India.
- **citation:** RBI Storage of Payment System Data Circular, April 2018; RBI Master Directions on Payment System Operators

### OBL-RBI-02 — KYC requirements for financial services
- **requirement:** All fintech services (payments, lending, wallets, prepaid instruments) must perform Customer Due Diligence (KYC) per RBI Master Directions on KYC 2016. Identity verification using government-issued ID is mandatory.
- **minimum_kyc:** Name, DOB, address, PAN, photo ID (Aadhaar XML/eKYC, passport, voter ID, driving licence). Enhanced Due Diligence for transactions exceeding ₹10 lakh.
- **applies_when:** Fintech apps onboarding Indian customers for regulated financial services
- **evidence_hints:** KYC form collecting PAN + address proof + photo ID; Aadhaar eKYC integration (UIDAI API); V-CIP (video KYC) integration; KYC status field in user model; `kyc_verified`, `kyc_status`, `pan_verified` in code
- **severity:** high
- **remediation:** Implement KYC flow: collect PAN + one address proof; verify PAN via NSDL API; optionally use Aadhaar eKYC (see aadhaar-uidai.md). Store KYC documents securely (encrypted). Mark account as KYC-verified only after successful check.
- **citation:** RBI Master Directions on KYC 2016; Prevention of Money Laundering Act

### OBL-RBI-03 — Digital lending guidelines compliance
- **requirement:** Apps offering digital loans must comply with RBI Digital Lending Guidelines 2022: mandatory Key Fact Statement before loan offer, minimum 3-day cooling-off period, credit reporting to all 4 credit bureaus (CIBIL, Equifax, Experian, CRIF High Mark), personal data used only for underwriting (not shared for marketing).
- **applies_when:** Loan, credit, BNPL (Buy Now Pay Later), or EMI apps
- **evidence_hints:** Key Fact Statement generation in loan offer flow (APR, total cost, EMI breakdown, cooling-off notice); `cancellation_period`, `cooling_off_days` in loan model; CIC (Credit Information Company) reporting integration; personal data segregated from marketing data pipeline
- **severity:** high
- **remediation:** Before disbursing any loan: generate and show a Key Fact Statement with APR (Annual Percentage Rate), all fees, total repayment amount, and 3-day cancellation window. Implement loan cancellation within cooling-off period with automatic reversal. Report all loans to all 4 CICs. Ensure loan-application data is not fed into marketing/analytics pipelines.
- **citation:** RBI Digital Lending Guidelines 2022 (RBI/2022-23/111 DOR.CRE.REC.66/21.07.001/2022-23)
