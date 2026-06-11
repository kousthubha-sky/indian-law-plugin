---
id: accessibility
title: Digital Accessibility — RPwD Act 2016, IS 17802, WCAG 2.1 Level AA
applies_to: [all, public-website priority]
status: "Active; mandatory for SEBI-regulated entities (deadlines passed); mandatory for government portals (GIGW 3.0); generally required under RPwD Act §§40-46"
penalty: "₹1–5 lakh (SEBI-regulated entities); regulatory action for government portals; civil liability under RPwD Act"
sources:
  - https://www.s4carlisle.com/post/a-quick-overview-of-digital-accessibility-mandates-in-india
  - https://www.pivotalaccessibility.com/2026/03/a-chronological-guide-to-sebis-digital-accessibility-circulars/
  - https://www.pivotalaccessibility.com/2025/06/rpwd-act-and-is-17802-indias-digital-accessibility-standards-2025-guide/
  - https://www.w3.org/TR/WCAG21/
---

# Digital Accessibility Obligations

The Rights of Persons with Disabilities Act 2016 (§§40-46) requires all digital
establishments to provide accessible content. India's standard IS 17802:2021 aligns with
WCAG 2.1 Level AA. GIGW 3.0 applies to government and public-facing portals.

SEBI-regulated entities had compliance deadlines through 2026; for all other apps, the
RPwD Act imposes a general accessibility duty.

---

### OBL-A11Y-01 — HTML language attribute
- **requirement:** Every HTML page must declare its primary language via `<html lang="...">`. Mandatory for screen reader software to use the correct language engine.
- **applies_when:** All web apps
- **evidence_hints:** `<html` tag in HTML templates; absence of `lang=` attribute; React root component, `_document.js` (Next.js), base template file
- **severity:** medium
- **detector:** accessibility patterns
- **remediation:** Add `lang="en"` (or `lang="hi"` etc.) to the root `<html>` element. For multilingual pages, use `lang=` on content blocks that switch language.
- **citation:** RPwD Act 2016 §40; IS 17802:2021; WCAG 2.1 SC 3.1.1

### OBL-A11Y-02 — Alt text for all images
- **requirement:** Every `<img>` element must have an `alt` attribute. Non-decorative images need descriptive alt text; decorative images need `alt=""` (empty string, not omitted).
- **applies_when:** All web apps with images
- **evidence_hints:** `<img` tags without `alt=`; JSX `<img />` without `alt` prop
- **severity:** medium
- **detector:** accessibility patterns
- **remediation:** For each `<img>` that conveys information: write a concise description in `alt="..."`. For purely decorative `<img>`: use `alt=""`. Never use `alt="image"` or `alt="photo"` — be specific.
- **citation:** WCAG 2.1 SC 1.1.1

### OBL-A11Y-03 — Form inputs must have associated labels
- **requirement:** Every `<input>`, `<select>`, and `<textarea>` must have an accessible label — either via `<label for="id">`, `aria-label`, or `aria-labelledby`. Placeholder text alone is not a label.
- **applies_when:** All web apps with forms
- **evidence_hints:** `<input` without a preceding `<label`; `<input placeholder=` without `aria-label`; form fields identified only by placeholder
- **severity:** medium
- **detector:** accessibility patterns
- **remediation:** Wrap each input with a `<label>`: `<label for="email">Email</label><input id="email">`. For icon-only inputs use `aria-label="..."`. Keep placeholder as supplementary hint, not the only label.
- **citation:** WCAG 2.1 SC 1.3.1, 3.3.2

### OBL-A11Y-04 — Keyboard navigation (all functionality accessible)
- **requirement:** All interactive elements (buttons, links, form fields, modals, dropdowns) must be reachable and operable via keyboard (Tab, Shift+Tab, Enter, Space, arrow keys). No keyboard traps.
- **applies_when:** All web apps
- **evidence_hints:** `tabIndex="-1"` on interactive elements (traps focus); event listeners only on `click` without `keydown`/`keyup`; custom dropdown/modal components without focus management; `outline: none` / `outline: 0` in CSS without a replacement focus indicator
- **severity:** medium
- **remediation:** Test with keyboard only — Tab through the entire app. Fix: remove `outline: none` without replacement; add `keydown` handlers alongside click handlers; manage focus in modals (trap focus inside, return on close). Use `<button>` not `<div onClick>`.
- **citation:** WCAG 2.1 SC 2.1.1, 2.1.2

### OBL-A11Y-05 — Sufficient colour contrast
- **requirement:** Text contrast ratio must be ≥ 4.5:1 for normal text, ≥ 3:1 for large text (≥18pt or ≥14pt bold). Does not apply to decorative text, logos, or disabled UI elements.
- **applies_when:** All web apps
- **evidence_hints:** CSS color values for text-on-background combinations; cannot be auto-detected without rendering — flag for manual check
- **severity:** medium
- **remediation:** Test with WebAIM Contrast Checker or browser DevTools accessibility panel. Fix failing text-background pairs. Common issues: grey text on white, white text on light-colored buttons, disabled-state text that's too faint.
- **citation:** WCAG 2.1 SC 1.4.3

### OBL-A11Y-06 — Accessibility statement
- **requirement:** Publish an accessibility statement on the website/app that describes: current conformance level, known limitations, contact for accessibility feedback, date of last review. Required for SEBI-regulated entities and recommended for all.
- **applies_when:** All public-facing apps
- **evidence_hints:** File named `accessibility`, `a11y-statement`, or link in footer to accessibility page; route `/accessibility`
- **severity:** low
- **detector:** policy-artifacts patterns
- **remediation:** Create an accessibility statement page. Minimum content: "This website aims to conform to WCAG 2.1 Level AA (IS 17802:2021). We welcome feedback at [email]. Last reviewed: [date]." Link in website footer.
- **citation:** RPwD Act 2016 §45; SEBI accessibility circular (2025/2026)
