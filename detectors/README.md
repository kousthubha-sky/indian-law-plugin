# Detectors

Zero-dependency Node.js scanner that finds hard compliance signals in a codebase.
Used as the deterministic layer of the hybrid audit engine.

## Usage

```bash
node run-detectors.mjs <project-root>
node run-detectors.mjs <project-root> --pack india-pii
node run-detectors.mjs <project-root> --json   # JSON output (for programmatic use)
```

Requires Node.js 18+ (uses native ESM, fs, readline).

## What it scans

| Pack | What it finds |
|---|---|
| `india-pii` | Aadhaar numbers (Verhoeff-validated), PAN, IFSC, UPI VPA, mobile numbers hardcoded in source |
| `data-residency` | Non-India AWS/GCP/Azure region configs — triggers for DPDP cross-border and RBI payment localization |
| `policy-artifacts` | Missing privacy policy, T&Cs, grievance officer contact, consent banner, accessibility statement |
| `security` | Hardcoded secrets/API keys, weak password hashing (MD5/SHA1), plain-HTTP API URLs, SQL injection patterns |
| `accessibility` | Images missing alt text, HTML missing lang attribute, inputs lacking labels, focus outline suppressed |

## Output format

```json
{
  "projectRoot": "/path/to/project",
  "runDate": "2026-06-11T10:00:00.000Z",
  "summary": { "total": 5, "critical": 1, "high": 2, "medium": 2, "low": 0, "packsRun": ["..."] },
  "findings": [
    {
      "id": "SEC-01",
      "name": "Hardcoded password or secret",
      "file": "src/config/database.js",
      "line": 12,
      "match": "password = \"mysecret123\"",
      "severity": "critical",
      "obligation": "OBL-SEC-04",
      "note": null
    }
  ]
}
```

## Extending

Add a new pattern pack by dropping a JSON file in `patterns/` following the schema
of existing packs. The scanner auto-discovers all `.json` files in the `patterns/`
directory.

## Limitations

- Pattern-based — no AST/semantic analysis. Some false positives are expected.
- `india-pii` uses Verhoeff checksum for Aadhaar (low FP rate) but PAN/IFSC patterns
  have moderate false-positive rates in non-Indian codebases.
- Does not analyse binary files, PDFs, or images.
- Policy-artifact checks look for file names and text patterns — they can miss
  externally hosted or dynamically generated policy pages.
- ALWAYS pair with the AI reasoning pass (`/india-audit`) for full coverage.
