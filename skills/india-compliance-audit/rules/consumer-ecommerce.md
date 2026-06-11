---
id: consumer-ecommerce
title: Consumer Protection Act 2019 + E-Commerce Rules 2020
applies_to: [ecommerce]
status: "Active; E-Commerce Rules 2020 in force; Consumer Protection (Amendment) Rules 2021 in force"
penalty: "Up to ₹10 lakh fine; imprisonment for repeat offenders"
sources:
  - https://www.lexology.com/library/detail.aspx?g=63b1027b-d4bb-4ab3-9556-3d7b197219ff
  - https://www.teamleaseregtech.com/blogs/134/e-commerce-compliance-in-india-understanding-the-consumer-protection-e-commerce-rules-2020/
  - https://www.akmllp.com/blog/compliance-framework-for-consumer-protection-e-commerce-rules-2020/
---

# Consumer Protection Act 2019 + E-Commerce Rules 2020

Applies to any "e-commerce entity" — a company or person that buys or sells goods/services
over a digital network. Covers B2C marketplaces, SaaS businesses with consumer subscribers,
and any app selling goods/services online.

---

### OBL-ECOM-01 — Mandatory disclosures on the platform
- **requirement:** Every e-commerce platform must display the following information prominently, in a legible manner, before the customer places an order:
  - Legal name and registered address of the entity
  - Contact details (email and phone)
  - GSTIN
  - Product/service details: price (itemized: product + tax + shipping), country of origin (for all products), warranty information (if applicable)
  - For imported products: importer's name and address must be displayed
  - Refund/return/exchange policy with timeline
  - Grievance Officer name, email, phone, and address (see OBL-ECOM-02)
- **applies_when:** All e-commerce apps selling goods or services to consumers
- **evidence_hints:** Website footer with legal name and address; product page showing country of origin field; tax invoice component breaking down price + GST + shipping; refund policy linked on product/checkout page; "About Us" or legal information page
- **severity:** high
- **remediation:** Add a "Legal / Company Info" footer section with all required fields. Add "Country of Origin" field to all product listings. Generate GST-compliant tax invoices. Add refund policy to product pages and checkout flow.
- **citation:** Consumer Protection (E-Commerce) Rules 2020, Rule 4 & 5

### OBL-ECOM-02 — Grievance redressal mechanism
- **requirement:** Appoint a Grievance Officer. Acknowledge consumer complaints within **48 hours**. Resolve within **1 month** from receipt. Grievance officer's name, contact details, and designation must be visible on the platform.
- **applies_when:** All e-commerce entities
- **evidence_hints:** Grievance officer contact in website footer or "Contact Us" page; in-app complaint form or email; ticketing system with SLA tracking; `grievance_officer` field in site config or contact page
- **severity:** high
- **remediation:** REM-GRIEVANCE-01 — set up a dedicated grievance inbox; implement auto-acknowledgment within 48h; track resolution deadlines in a support system.
- **citation:** Consumer Protection (E-Commerce) Rules 2020, Rule 4(1)(e); Consumer Protection Act 2019 §17

### OBL-ECOM-03 — Transparent pricing and no dark patterns
- **requirement:** Prices must be all-inclusive — show total cost (product + tax + delivery) before final checkout confirmation. No hidden fees revealed at payment step. No deceptive UI patterns that obscure the true price or auto-add items to cart.
- **applies_when:** All e-commerce checkouts
- **evidence_hints:** Checkout summary showing itemised price breakdown before final confirm; absence of surprise fees added at payment step; no pre-selected add-ons or insurance in cart without user action; price displayed on product page matches checkout price
- **severity:** medium
- **remediation:** Implement a checkout review page showing: unit price × quantity + applicable taxes + shipping fee = total. Ensure no add-ons are pre-checked by default. Test: price on product page = price in cart = price on checkout = amount charged.
- **citation:** Consumer Protection Act 2019 §2(47) (unfair trade practice); Consumer Protection (E-Commerce) Rules 2020, Rule 4(2)
