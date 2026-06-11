# india-compliance-audit

Audits a project against applicable Indian laws and regulations using a hybrid engine:
deterministic detectors find hard signals; AI reasoning examines context and writes the
compliance report.

**IMPORTANT — NOT LEGAL ADVICE.** This skill flags technical compliance signals and cites
published law. It does not constitute legal advice. Cite primary sources in findings;
never invent statutory obligations or specific penalty figures from memory — read the
rule files. Always recommend the user verify current law status with a qualified
legal professional and at official sources (meity.gov.in, cert-in.org.in, rbi.org.in,
indiacode.nic.in).

---

## Invocation

Triggered by `/india-audit [area]`.

- No area argument or `all` → full audit (all applicable packs).
- Named area → only that pack: `dpdp`, `cert-in`, `rbi`, `accessibility`, `health`,
  `ecommerce`, `aadhaar`, `children`, `security`, `intermediary`.

---

## Hybrid audit workflow (follow in order)

### Step 1 — Identify project root

If the user did not specify a path, assume the current working directory is the project
root. Confirm the path is a software project (has source files, not just config).

### Step 2 — Detect app type & profiles

Read `references/app-type-detection.md`. Then:

1. Read `package.json` / `pom.xml` / `requirements.txt` / `Cargo.toml` / `build.gradle`
   for dependencies and tech stack.
2. Glob for route files: `**/*routes*`, `**/*controller*`, `**/pages/**`, `**/api/**`.
3. Grep for profile-indicating keywords (payment, aadhaar, patient, student, cart, etc.).
4. Assign all matching profiles. Always include `generic`.
5. Note: if `children`-profile signals are found (student, minor, age-check, parental),
   include `children` — DPDP children's provisions are the harshest.

### Step 3 — Select applicable law packs

Read `rules/_index.md`. Map detected profiles to the pack list. For a scoped run, use
only the named pack.

### Step 4 — Run deterministic detectors

Run the Node.js detector script (zero dependencies):

```
node <plugin-root>/detectors/run-detectors.mjs <project-root>
```

If Node.js is not available, note it and proceed to Step 5 with an advisory that the
deterministic layer was skipped.

Parse the JSON output. Each finding has: `{ id, pattern, file, line, match, severity }`.
Keep this as `detectorFindings` — fuse with AI findings in Step 6.

### Step 5 — AI reasoning pass (per pack)

For each selected pack:
1. Read the pack file from `rules/<pack>.md`.
2. For each obligation in the pack, inspect the codebase for the checkable evidence
   described in the obligation's `evidence_hints`.
3. Classify: `ok` | `gap` | `partial` | `not-auto-verifiable`.
4. Record: status, evidence (file:line if found, or "not found"), confidence, remediation
   reference.

**Inspection strategy per obligation type:**
- **Consent/notice UI:** Look in form components, signup/login routes, modal/dialog files.
  Search for: `checkbox`, `consent`, `agree`, `privacy`, `terms`, `opt-in`.
- **Data deletion:** Look for DELETE routes or endpoints named `delete`, `deactivate`,
  `close-account`, `purge`. Check if they zero out PII fields.
- **Data access/export:** Look for routes named `export`, `download-data`, `my-data`,
  `data-subject-request`.
- **Encryption at rest:** Look for encryption calls on sensitive fields; check ORM models
  for `encrypted`, `bcrypt`, `aes`. Check if PII columns are stored raw.
- **Log storage region:** Look for cloud SDK configs, env vars like `AWS_REGION`,
  `CLOUD_REGION`, Docker/K8s configs.
- **Privacy policy existence:** Look for files named `privacy`, `privacy-policy`,
  `privacypolicy` in public/static directories, or a route `/privacy`.
- **Aadhaar/PAN in code:** Defer to detector output (`india-pii` pattern pack).
- **Children's data:** Check for age-gating code, DOB validation, parental consent flows.
- **Payment data location:** Look for payment-gateway config regions (Razorpay is India-
  based; Stripe defaults to US — check data residency settings).
- **Accessibility:** Defer largely to detector output; also grep HTML templates for
  `<html lang=`, `alt=`, `<label`.

### Step 6 — Fuse findings

Merge detector findings and AI reasoning findings:
- Detector finding with matching AI finding → combine evidence.
- Detector finding with no AI match → include as-is (deterministic is high-confidence).
- AI finding with no detector match → include with AI-assessed confidence level.

### Step 7 — Write the report

Write `india-compliance-report.md` into the **project root** (the audited project, not
the plugin directory). Follow the template in `references/report-format.md` exactly.

Include:
- Posture summary table
- All findings grouped by law pack, severity descending
- Raw detector JSON in the Detector Output section
- Manual/legal review checklist (items the code cannot confirm)
- Key deadline callout (DPDP Phase 3 ~May 2027 — "verify at meity.gov.in")

### Step 8 — Summary to user

After writing the report, print a short summary to the user:
- Profiles detected, packs applied
- Count of critical/high/medium/low findings
- Path to the report file
- Remind: "This is not legal advice. Consult a lawyer for compliance decisions."

---

## Rules for AI reasoning

1. **Never invent obligations.** If unsure whether an obligation applies, read the rule
   file. If still unsure, mark `not-auto-verifiable` and note it in manual review.
2. **Cite the law.** Every finding must include a statutory citation from the rule file.
3. **Conservative confidence.** Don't mark something `ok` just because you didn't find a
   violation — note when you can't confirm. Absence of evidence ≠ compliance.
4. **No false precision.** Never give a "compliance %" score. Use posture levels only.
5. **Specific evidence.** "Found `md5(password)` at `src/auth/login.js:47`" is good.
   "Encryption might be missing" is not. If you can't cite a file:line, lower confidence.
6. **Phased obligations.** For DPDP Phase 3 obligations (full enforcement ~May 2027),
   flag as `high` with note "Phase 3 obligation — begin preparation now."
7. **Sector pack only when profile matched.** Don't apply RBI rules to a static school
   website; don't apply health rules to an e-commerce app unless health signals found.
