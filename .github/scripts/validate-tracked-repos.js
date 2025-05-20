#!/usr/bin/env node
/**
 * validate-tracked-repos.js
 *
 * Validates tracked_repos.json against all rules enforced by CI.
 * Run locally with: node .github/scripts/validate-tracked-repos.js
 *
 * Exit codes:
 *   0 — all checks passed
 *   1 — one or more checks failed (errors printed to stderr)
 *
 * Checks performed (in order):
 *   1. File can be read
 *   2. Content is valid JSON
 *   3. Top-level value is an array
 *   4. Every element is a two-element array of non-empty strings
 *   5. Neither the owner nor name field contains a forward slash
 *      (catches accidental "owner/name"-as-single-string paste errors)
 *   6. No duplicate entries (case-insensitive owner+name comparison)
 */

'use strict';

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** ANSI colours — disabled automatically when stdout is not a TTY */
const USE_COLOUR = process.stdout.isTTY && process.stderr.isTTY;
const red    = (s) => USE_COLOUR ? `\x1b[31m${s}\x1b[0m` : s;
const yellow = (s) => USE_COLOUR ? `\x1b[33m${s}\x1b[0m` : s;
const green  = (s) => USE_COLOUR ? `\x1b[32m${s}\x1b[0m` : s;
const bold   = (s) => USE_COLOUR ? `\x1b[1m${s}\x1b[0m`  : s;

const errors   = [];
const warnings = [];

function fail(msg) {
  errors.push(msg);
  process.stderr.write(red(`  ✗ FAIL  `) + msg + '\n');
}

function warn(msg) {
  warnings.push(msg);
  process.stderr.write(yellow(`  ⚠ WARN  `) + msg + '\n');
}

function pass(msg) {
  process.stdout.write(green(`  ✓ PASS  `) + msg + '\n');
}

// ---------------------------------------------------------------------------
// Resolve file path (repo root / tracked_repos.json)
// ---------------------------------------------------------------------------

// Support running from any directory: resolve relative to this script's location,
// which lives at .github/scripts/ — so repo root is two levels up.
const SCRIPT_DIR = path.dirname(path.resolve(__filename));
const REPO_ROOT  = path.resolve(SCRIPT_DIR, '..', '..');
const FILE_PATH  = path.join(REPO_ROOT, 'tracked_repos.json');

process.stdout.write(bold(`\nValidating: ${FILE_PATH}\n\n`));

// ---------------------------------------------------------------------------
// Check 1 — File is readable
// ---------------------------------------------------------------------------

let raw;
try {
  raw = fs.readFileSync(FILE_PATH, 'utf8');
  pass(`File readable (${raw.length.toLocaleString()} bytes)`);
} catch (e) {
  fail(`Cannot read file: ${e.message}`);
  process.exit(1); // Cannot continue without the file
}

// ---------------------------------------------------------------------------
// Check 2 — Valid JSON
// ---------------------------------------------------------------------------

let data;
try {
  data = JSON.parse(raw);
  pass('Valid JSON');
} catch (e) {
  fail(`JSON parse error: ${e.message}`);
  process.exit(1); // Cannot continue without valid JSON
}

// ---------------------------------------------------------------------------
// Check 3 — Top-level is an array
// ---------------------------------------------------------------------------

if (!Array.isArray(data)) {
  fail(`Top-level value must be an array, got: ${typeof data}`);
  process.exit(1);
}
pass(`Top-level is an array (${data.length.toLocaleString()} entries)`);

// ---------------------------------------------------------------------------
// Check 4 & 5 — Entry schema: [owner, name], no slashes in fields
// ---------------------------------------------------------------------------

let schemaErrors = 0;
const badEntries = [];

for (let i = 0; i < data.length; i++) {
  const entry = data[i];
  const loc   = `entry[${i}]`;

  // Must be an array
  if (!Array.isArray(entry)) {
    fail(`${loc}: expected array, got ${typeof entry} — ${JSON.stringify(entry)}`);
    schemaErrors++;
    continue;
  }

  // Must have exactly two elements
  if (entry.length !== 2) {
    fail(`${loc}: expected 2 elements, got ${entry.length} — ${JSON.stringify(entry)}`);
    schemaErrors++;
    continue;
  }

  const [owner, name] = entry;

  // Both must be non-empty strings
  if (typeof owner !== 'string' || owner.trim() === '') {
    fail(`${loc}: owner must be a non-empty string — ${JSON.stringify(entry)}`);
    schemaErrors++;
  }
  if (typeof name !== 'string' || name.trim() === '') {
    fail(`${loc}: name must be a non-empty string — ${JSON.stringify(entry)}`);
    schemaErrors++;
  }

  // Neither field should contain a slash (catches "owner/name" paste errors)
  if (typeof owner === 'string' && owner.includes('/')) {
    fail(`${loc}: owner contains '/' — did you mean to split "${owner}" into owner + name? Value: ${JSON.stringify(entry)}`);
    schemaErrors++;
  }
  if (typeof name === 'string' && name.includes('/')) {
    fail(`${loc}: name contains '/' — did you mean to split "${name}" into owner + name? Value: ${JSON.stringify(entry)}`);
    schemaErrors++;
  }

  // Track whether this specific entry passed all schema checks
  const isValidEntry = (function() {
    // If any schemaErrors were recorded for this entry, they were added
    // above and we can detect that by checking the last few error messages.
    // Simpler: determine validity from the checks we just ran by re-evaluating
    // the same conditions without mutating globals.
    if (!Array.isArray(entry)) return false;
    if (entry.length !== 2) return false;
    if (typeof owner !== 'string' || owner.trim() === '') return false;
    if (typeof name !== 'string' || name.trim() === '') return false;
    if (owner.includes('/')) return false;
    if (name.includes('/')) return false;
    return true;
  })();

  // Collect valid entries for duplicate check below
  if (isValidEntry) {
    badEntries.push({ i, owner, name });
  }
}

if (schemaErrors === 0) {
  pass('All entries pass schema check (two-element string arrays, no slash fields)');
} else {
  // Already printed individual failures above
}

// ---------------------------------------------------------------------------
// Check 6 — No duplicates (case-insensitive)
// ---------------------------------------------------------------------------

const seen   = new Map(); // normalised key → first occurrence index
let dupCount = 0;

for (let i = 0; i < data.length; i++) {
  const entry = data[i];
  if (!Array.isArray(entry) || entry.length !== 2) continue; // skip already-flagged malformed entries
  const [owner, name] = entry;
  if (typeof owner !== 'string' || typeof name !== 'string') continue;

  const key = `${owner.toLowerCase()}/${name.toLowerCase()}`;

  if (seen.has(key)) {
    const firstIdx = seen.get(key);
    fail(
      `Duplicate entry at index ${i}: ${JSON.stringify(entry)} ` +
      `(first seen at index ${firstIdx} as ${JSON.stringify(data[firstIdx])})`
    );
    dupCount++;
  } else {
    seen.set(key, i);
  }
}

if (dupCount === 0) {
  pass(`No duplicates found (${seen.size.toLocaleString()} unique entries)`);
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

process.stdout.write('\n');

if (errors.length === 0 && warnings.length === 0) {
  process.stdout.write(
    bold(green(`✓ All checks passed — ${data.length.toLocaleString()} entries validated.\n\n`))
  );
  process.exit(0);
} else {
  if (warnings.length > 0) {
    process.stderr.write(yellow(`\n${warnings.length} warning(s) found.\n`));
  }
  if (errors.length > 0) {
    process.stderr.write(
      bold(red(`\n✗ ${errors.length} error(s) found. Fix the issues above and re-run.\n\n`))
    );
    process.exit(1);
  }
  process.exit(0);
}
