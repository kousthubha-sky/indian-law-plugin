---
id: business-tax
title: Business & Tax Compliance for Software Freelancers and Startups
applies_to: [all — informational; non-code items go in manual review checklist]
status: "Active; GST and income tax obligations are ongoing"
penalty: "GST: ₹10,000 + 18% interest per annum; TDS default: 1.5% per month; Companies Act: ₹25,000–₹5 lakh"
sources:
  - https://taxadda.com/gst-on-freelancers/
  - https://www.xflowpay.com/blog/gst-for-freelancers
  - https://taxguru.in/company-law/legal-compliances-software-companies-india.html
  - https://mygstindia.in/blog/gst-ecommerce-sellers-2026.html
---

# Business & Tax Compliance

These are not code-level checks — they appear in the **Manual Review Checklist** section
of the report. Included here for completeness and developer awareness.

---

### OBL-BIZ-01 — GST registration and invoicing
- **requirement:** Mandatory GST registration once annual turnover of software services exceeds **₹20 lakh** (₹10 lakh in special category states: NE states, Himachal, Jammu & Kashmir, Uttarakhand). Software services are taxed at **18% GST** (HSN/SAC 998361).
- **invoicing_requirements:** Every invoice must include: GSTIN, SAC code (998361), invoice date and number, client's GSTIN (for B2B), taxable value, CGST 9% + SGST 9% (or IGST 18% for interstate), total amount.
- **auto_verifiable:** Partially — check invoice templates in code for GSTIN and GST line items.
- **evidence_hints:** Invoice template showing GSTIN, SAC code, GST breakdown; `gstin` in business config; invoice generation code
- **severity:** info
- **remediation:** Register at gst.gov.in once threshold is crossed. Use GST-compliant invoicing software or library. File: GSTR-1 (outward supplies) monthly/quarterly; GSTR-3B (summary return) monthly; GSTR-9 (annual return) by Dec 31.
- **citation:** CGST Act 2017 §22; GST Rate Notification for IT Services

### OBL-BIZ-02 — E-invoicing (for turnover > ₹5 crore)
- **requirement:** If the entity's annual turnover exceeded ₹5 crore in any previous financial year, all B2B invoices must be generated through the Invoice Registration Portal (IRP) with a QR code and IRN (Invoice Reference Number). E-invoices must be digitally signed.
- **auto_verifiable:** Partially — check if billing system integrates IRP API.
- **evidence_hints:** IRP API integration in billing code; `irn`, `qr_code` fields in invoice model; `IRP_API_URL` or `EINVOICE_ENABLED` env var
- **severity:** info
- **remediation:** Integrate with NIC's IRP API (einvoice1.gst.gov.in). Before generating any B2B invoice, POST to IRP, get IRN + signed QR code, embed in invoice PDF. If using Tally, Zoho, or SAP: enable e-invoicing module.
- **citation:** CGST Rule 48(4); GST E-Invoicing Circular

### OBL-BIZ-03 — TDS on software services
- **requirement:** If a client (company or specified person) pays for software services exceeding ₹30,000 per annum (or ₹30,000 per single payment), they are required to deduct TDS at **10%** under Income Tax Act §194C/§194J. As a freelancer/agency, you may receive payments net of TDS — account for this.
- **auto_verifiable:** Not code-verifiable. Manual review item.
- **severity:** info
- **remediation:** Track TDS deductions in accounting software. Include a note on invoices to clients: "TDS to be deducted per Income Tax Act." Reconcile Form 26AS / AIS against TDS certificates (Form 16A) received from clients. Claim TDS credit while filing Income Tax Return.
- **citation:** Income Tax Act 1961 §§194C, 194J

### OBL-BIZ-04 — Companies Act compliance (if incorporated)
- **requirement:** If operating as a Private Limited Company or OPC (One Person Company): quarterly board meetings, annual statutory audit (if applicable), Annual Return (Form AOC-4) with Registrar of Companies, at least one director resident in India ≥ 182 days/year, share certificate dematerialization (deadline extended to 2026 for private companies — verify with MCA).
- **auto_verifiable:** Not code-verifiable. Manual review item.
- **severity:** info
- **remediation:** Engage a Company Secretary (CS) for annual compliance. Key filings: MGT-7 (Annual Return); AOC-4 (Financial Statements); DIR-3 KYC (Director KYC annually). Register on MCA portal (mca.gov.in) for filing access.
- **citation:** Companies Act 2013 §§92, 129, 149, 196

### OBL-BIZ-05 — Importer Exporter Code (IEC) for export of software/services
- **requirement:** If providing software development services or SaaS to foreign clients and receiving foreign currency, register for an IEC (Importer Exporter Code) from DGFT. Also file Foreign Inward Remittance Certificate (FIRC) for each foreign payment for GST exemption on exports.
- **auto_verifiable:** Partially — check if `IEC_CODE` or export service category is in business config.
- **severity:** info
- **remediation:** Apply for IEC at dgft.gov.in (free of cost). For each foreign payment, obtain FIRC from bank. File LUT (Letter of Undertaking) with GST department to export services without paying IGST. Ensure foreign receipts are reported under FEMA (Foreign Exchange Management Act).
- **citation:** Foreign Trade Policy 2023; CGST Act §2(6) (zero-rated supply); FEMA 1999
