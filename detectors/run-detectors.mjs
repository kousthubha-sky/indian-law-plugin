#!/usr/bin/env node
/**
 * india-compliance detectors — zero-dependency Node.js scanner
 * Usage: node run-detectors.mjs <project-root> [--pack <name>] [--json]
 *
 * Outputs JSON to stdout: { summary, findings: [...] }
 * Exits 0 always (audit tool, not a CI gate by default).
 */

import fs from 'fs';
import path from 'path';
import { createReadStream } from 'fs';
import { createInterface } from 'readline';

const PLUGIN_ROOT = path.dirname(decodeURIComponent(new URL(import.meta.url).pathname)).replace(/^\/([A-Z]:)/, '$1');
const PATTERNS_DIR = path.join(PLUGIN_ROOT, 'patterns');

// ─── Verhoeff algorithm for Aadhaar validation ───────────────────────────────
const V_D = [
  [0,1,2,3,4,5,6,7,8,9],[1,2,3,4,0,6,7,8,9,5],[2,3,4,0,1,7,8,9,5,6],
  [3,4,0,1,2,8,9,5,6,7],[4,0,1,2,3,9,5,6,7,8],[5,9,8,7,6,0,4,3,2,1],
  [6,5,9,8,7,1,0,4,3,2],[7,6,5,9,8,2,1,0,4,3],[8,7,6,5,9,3,2,1,0,4],
  [9,8,7,6,5,4,3,2,1,0]
];
const V_P = [
  [0,1,2,3,4,5,6,7,8,9],[1,5,7,6,2,8,3,0,9,4],[5,8,0,3,7,9,6,1,4,2],
  [8,9,1,6,0,4,3,5,2,7],[9,4,5,3,1,2,6,8,7,0],[4,2,8,6,5,7,3,9,0,1],
  [2,7,9,3,8,0,6,4,1,5],[7,0,4,6,9,1,3,2,5,8]
];
function verhoeff(num) {
  const digits = String(num).replace(/\s/g, '').split('').reverse().map(Number);
  if (digits.length !== 12) return false;
  let c = 0;
  for (let i = 0; i < digits.length; i++) c = V_D[c][V_P[i % 8][digits[i]]];
  return c === 0;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function loadJson(filePath) {
  try { return JSON.parse(fs.readFileSync(filePath, 'utf8')); }
  catch { return null; }
}

function shouldSkip(filePath, pack) {
  const excExt = pack.exclude_extensions || [];
  const excDirs = pack.exclude_dirs || [];
  const excFiles = pack.exclude_files || [];
  const ext = path.extname(filePath).toLowerCase();
  if (excExt.includes(ext)) return true;
  const parts = filePath.split(path.sep);
  if (parts.some(p => excDirs.includes(p))) return true;
  const base = path.basename(filePath);
  if (excFiles.some(p => base.startsWith(p.replace('*', '')))) return true;
  return false;
}

function* walkDir(dir, pack) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
  catch { return; }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if ((pack.exclude_dirs || []).includes(e.name)) continue;
      yield* walkDir(full, pack);
    } else if (e.isFile()) {
      if (!shouldSkip(full, pack)) yield full;
    }
  }
}

async function scanFileForPattern(filePath, pattern, projectRoot) {
  const fileTypes = pattern.file_types;
  if (fileTypes) {
    const ext = path.extname(filePath).toLowerCase();
    if (!fileTypes.includes(ext)) return [];
  }

  const findings = [];
  const flags = 'g' + (pattern.case_insensitive ? 'i' : '');
  const re = new RegExp(pattern.regex, flags);

  return new Promise((resolve) => {
    const rl = createInterface({ input: createReadStream(filePath), crlfDelay: Infinity });
    let lineNum = 0;
    rl.on('line', (line) => {
      lineNum++;
      // Use matchAll instead of regex.exec to avoid hook false-positives on 'exec'
      const matches = [...line.matchAll(re)];
      for (const m of matches) {
        const matchStr = m[0];

        // False-positive filters
        const fps = pattern.false_positive_filters || [];
        if (fps.some(fp => new RegExp(fp).test(line))) continue;

        // Verhoeff check for Aadhaar
        if (pattern.verify === 'verhoeff') {
          const digits = matchStr.replace(/\s/g, '');
          if (!verhoeff(digits)) continue;
        }

        // UPI VPA: filter common email domains
        if (pattern.id === 'IPII-04') {
          const atPart = (matchStr.split('@')[1] || '').toLowerCase();
          const emailDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com',
            '.in', '.com', '.org', '.net', '.gov', '.edu', '.co.in'];
          if (emailDomains.some(d => atPart.endsWith(d))) continue;
        }

        findings.push({
          id: pattern.id,
          name: pattern.name,
          file: path.relative(projectRoot, filePath),
          line: lineNum,
          match: matchStr.length > 60 ? matchStr.substring(0, 57) + '...' : matchStr,
          severity: pattern.severity,
          obligation: pattern.obligation || null,
          note: pattern.note || null
        });
      }
    });
    rl.on('close', () => resolve(findings));
    rl.on('error', () => resolve([]));
  });
}

function checkPolicyArtifacts(projectRoot, pack) {
  const findings = [];
  for (const check of (pack.file_presence_checks || [])) {
    if (!check.required) continue;
    let found = false;

    const searchFiles = check.look_for_files || [];
    const searchPatterns = check.look_for_patterns || [];

    // Walk the project looking for matching file names
    outer: for (const f of walkDir(projectRoot, pack)) {
      const base = path.basename(f).toLowerCase().replace(/\.[^.]+$/, '');
      if (searchFiles.some(sf => base === sf.toLowerCase() || base.includes(sf.toLowerCase()))) {
        found = true; break outer;
      }
      // Also scan file content for the pattern strings (only in small text files)
      if (searchPatterns.length > 0) {
        const ext = path.extname(f).toLowerCase();
        const textExts = ['.html', '.htm', '.md', '.txt', '.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte'];
        if (textExts.includes(ext)) {
          try {
            const content = fs.readFileSync(f, 'utf8');
            if (searchPatterns.some(p => new RegExp(p, 'i').test(content))) {
              found = true; break outer;
            }
          } catch { /* skip unreadable */ }
        }
      }
    }

    if (!found) {
      findings.push({
        id: check.id,
        name: check.name,
        file: '(not found in project)',
        line: null,
        match: `${check.name} — not detected in codebase`,
        severity: check.severity,
        obligation: check.obligation || null,
        note: `Look for: ${[...(check.look_for_files || []), ...(check.look_for_patterns || [])].slice(0, 3).join(', ')}`
      });
    }
  }
  return findings;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args[0] === '--help') {
    console.error('Usage: node run-detectors.mjs <project-root> [--pack <name>] [--json]');
    process.exit(0);
  }

  const projectRoot = path.resolve(args[0]);
  if (!fs.existsSync(projectRoot)) {
    console.error(`Error: project root not found: ${projectRoot}`);
    process.exit(1);
  }

  const packFilter = args.includes('--pack') ? args[args.indexOf('--pack') + 1] : null;
  const jsonOutput = args.includes('--json') || !process.stdout.isTTY;

  // Load all pattern packs
  const packFiles = fs.readdirSync(PATTERNS_DIR).filter(f => f.endsWith('.json'));
  const packs = packFiles
    .map(f => ({ name: path.basename(f, '.json'), data: loadJson(path.join(PATTERNS_DIR, f)) }))
    .filter(p => p.data && (!packFilter || p.name === packFilter));

  const allFindings = [];
  const summary = { total: 0, critical: 0, high: 0, medium: 0, low: 0, packsRun: [] };

  for (const { name, data } of packs) {
    summary.packsRun.push(name);

    if (name === 'policy-artifacts') {
      allFindings.push(...checkPolicyArtifacts(projectRoot, data));
      continue;
    }

    for (const file of walkDir(projectRoot, data)) {
      for (const pattern of (data.patterns || [])) {
        const found = await scanFileForPattern(file, pattern, projectRoot);
        allFindings.push(...found);
      }
    }
  }

  // Deduplicate
  const seen = new Set();
  const unique = allFindings.filter(f => {
    const key = `${f.id}:${f.file}:${f.line}`;
    if (seen.has(key)) return false;
    seen.add(key); return true;
  });

  for (const f of unique) {
    summary.total++;
    if (f.severity in summary) summary[f.severity]++;
  }

  const result = {
    projectRoot,
    runDate: new Date().toISOString(),
    summary,
    findings: unique.sort((a, b) => {
      const sev = { critical: 0, high: 1, medium: 2, low: 3 };
      return (sev[a.severity] ?? 4) - (sev[b.severity] ?? 4);
    })
  };

  if (jsonOutput) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    const sLabel = f => f.severity.toUpperCase().padEnd(8);
    console.log(`\nIndia Compliance Detectors — ${projectRoot}`);
    console.log(`Packs: ${summary.packsRun.join(', ')}`);
    console.log(`Found: ${summary.total} (${summary.critical} critical, ${summary.high} high, ${summary.medium} medium, ${summary.low} low)\n`);
    for (const f of result.findings) {
      const loc = f.file + (f.line ? `:${f.line}` : '');
      console.log(`  [${sLabel(f)}] ${f.id} — ${f.name}`);
      console.log(`            ${loc}`);
      if (f.match && !f.match.endsWith('codebase')) console.log(`            match: ${f.match}`);
      if (f.obligation) console.log(`            obligation: ${f.obligation}`);
    }
    if (summary.total === 0) {
      console.log('  No deterministic findings. Run /india-audit for full AI reasoning pass.\n');
    }
  }
}

main().catch(e => { console.error(e.message); process.exit(1); });
