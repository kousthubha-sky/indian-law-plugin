# Contributing to indian-law-compliance

Thank you for helping keep this plugin accurate and up to date. Indian law changes
frequently — DPDP Rules were updated in 2025, CERT-In directions have evolved, RBI
circulars get amended. Community contributions are essential to keep this useful.

---

## What needs contributions most

1. **Law updates** — when a regulation changes (new DPDP Rules, amended CERT-In directions,
   new RBI circular), update the relevant rule file with the new obligation and a primary
   source citation.

2. **New sector packs** — laws we haven't covered yet (TRAI, SEBI-specific rules,
   DISHA when passed, state-level rules, education sector RTE compliance).

3. **Detector patterns** — new India-PII patterns, better security heuristics, lower
   false-positive rates on existing patterns.

4. **Verified citations** — if you find a rule citing a secondary source and you have
   the primary government URL, please update it.

5. **Bug reports** — false positives / false negatives in the detector output.

---

## Rule file format

Every obligation in a rule pack must follow this structure:

```markdown
### OBL-[PACK]-[NN] — [Short title]
- **requirement:** Plain-English description of the legal obligation.
- **applies_when:** When does this obligation trigger?
- **evidence_hints:** What to look for in the codebase (file names, route patterns, keywords, dependencies).
- **severity:** critical | high | medium | low
- **phase:** (optional) e.g. "Phase 3 (~May 2027) — prepare now"
- **remediation:** REM-XX-XX (reference to remediation-patterns.md) or inline fix description.
- **citation:** [Regulation Name §Section](primary-source-URL)
```

**Severity guide:**

| Severity | When to use |
|---|---|
| `critical` | Active breach triggers immediate penalty; or the violation enables a data breach |
| `high` | Core compliance requirement discovered in any routine audit |
| `medium` | Important but context-dependent, phased, or lower-probability |
| `low` | Best-practice / voluntary / future phase |

---

## Citation rules — this is the most important rule

**Every obligation MUST cite a primary government source.** Secondary sources (news articles,
law firm blogs) may be used as supplementary context but not as the sole citation.

**Accepted primary sources:**
- `meity.gov.in` — DPDP Act, IT Rules, CERT-In directions
- `indiacode.nic.in` — all Acts (IT Act, Aadhaar Act, Consumer Protection Act, RPwD Act)
- `cert-in.org.in` — CERT-In directions and advisories
- `rbi.org.in` — RBI circulars, master directions, FAQs
- `uidai.gov.in` — Aadhaar regulations
- `abdm.gov.in` — ABDM health data standards
- `egazette.gov.in` / `gazette.india.gov.in` — Official Gazette notifications
- `sebi.gov.in` — SEBI circulars
- `bis.gov.in` — BIS standards (IS 17428, IS 17802)

If you cannot find a primary-source URL for an obligation, mark it clearly:
```
- **citation:** [Regulation §Section] — primary URL not found; verify at meity.gov.in
```

Do **not** add an obligation without any citation. Unverified rules cause developers to
take wrong actions; this is worse than a missing rule.

---

## How to add a new law pack

1. Create `skills/india-compliance-audit/rules/<law-id>.md` following the schema above.
2. Add the pack to the matrix in `skills/india-compliance-audit/rules/_index.md`:
   - Which profiles trigger it (`applies_to`)
   - Obligation count
   - Key penalty
3. Update `skills/india-compliance-audit/SKILL.md` if the pack needs special detection logic.
4. Add the area argument to `commands/india-audit.md`.
5. Test by running `/india-audit <area>` on a relevant fixture or sample project.

---

## How to add a detector pattern

1. Edit the relevant JSON file in `detectors/patterns/`.
2. Pattern fields:

```json
{
  "id": "PACK-NN",
  "name": "Short human-readable name",
  "description": "What this detects and why it matters.",
  "regex": "your-regex-here",
  "case_insensitive": true,
  "severity": "critical|high|medium|low",
  "obligation": "OBL-XX-NN",
  "false_positive_filters": ["regex_to_skip_line_if_matched"],
  "file_types": [".js", ".ts"],
  "note": "False-positive notes or verification advice."
}
```

3. Test your pattern against the fixture:
   ```bash
   node detectors/run-detectors.mjs detectors/__fixtures__ --pack <pack-name>
   ```
4. If your pattern has a non-trivial false-positive rate, add `false_positive_filters`.
5. Add a deliberate violation to `detectors/__fixtures__/bad-app.js` so future contributors
   can verify the pattern still works.

**Regex notes:**
- Use `"case_insensitive": true` instead of `(?i)` — JavaScript's RegExp doesn't support inline flags.
- Avoid lookaheads/lookbehinds where possible; stick to patterns that work with `matchAll`.
- Test the regex at regex101.com (set to JavaScript flavour) before submitting.

---

## Submitting changes

1. Fork the repo.
2. Create a branch: `git checkout -b rule/dpdp-consent-manager-update`
3. Make your changes.
4. Run the fixture test: `node detectors/run-detectors.mjs detectors/__fixtures__`
   — output should still include all expected findings (no regressions).
5. Open a PR. In the description:
   - State what changed (which obligation, which section of law)
   - Link to the primary government source you used
   - Note the effective date of the change

---

## Reporting issues

Use GitHub Issues for:
- False positives (detector flags something it shouldn't)
- False negatives (known violation the detector misses)
- Outdated obligations (law changed, rule file not updated)
- Missing laws you think should be covered

Please include: which rule/pattern, what the app type was, and a minimal example if possible.

---

## What NOT to contribute

- Legal opinions or interpretations — stick to what the statute text says.
- Obligations without primary-source citations.
- Detector patterns with very high false-positive rates and no mitigations.
- Anything that constitutes legal advice. The disclaimer must remain prominent.

---

## Disclaimer reminder

This plugin is informational and educational — NOT legal advice. All contributions
must preserve the disclaimer in README.md and in report outputs. If you're unsure
whether an obligation is accurate, open an Issue rather than merging uncertain content.
