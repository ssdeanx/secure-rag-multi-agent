#!/usr/bin/env node
/**
 * Validates all AGENTS.md files for required metadata + structural sections.
 * Exit codes:
 * 0 = success
 * 1 = validation failures
 * 2 = execution/runtime error
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const REQUIRED_META_FIELDS = ["title","version","last_updated","applies_to","tags","status"];
const REQUIRED_SECTIONS = [
  '## Persona',
  '## Change Log'
];

function walk(dir, acc=[]) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      walk(full, acc);
    } else if (entry === 'AGENTS.md') {
             acc.push(full);
           }
  }
  return acc;
}

function parseMeta(content, file) {
  const metaMatch = content.match(/<!--\s*AGENTS-META\s*(\{[\s\S]*?\})\s*-->/);
  if (!metaMatch) {
    return { ok: false, errors: [`${file}: Missing AGENTS-META block`] };
  }
  try {
    const json = JSON.parse(metaMatch[1]);
    const missing = REQUIRED_META_FIELDS.filter(f => !(f in json));
    if (missing.length) {
      return { ok: false, errors: [`${file}: Missing meta fields: ${missing.join(', ')}`] };
    }
    if (!Array.isArray(json.tags) || json.tags.length === 0) {
      return { ok: false, errors: [`${file}: tags must be a non-empty array`] };
    }
    // basic ISO 8601 validation
    if (!/^\d{4}-\d{2}-\d{2}T/.test(json.last_updated)) {
      return { ok: false, errors: [`${file}: last_updated should be ISO-8601`] };
    }
    return { ok: true, meta: json };
  } catch (e) {
    return { ok: false, errors: [`${file}: Invalid JSON in AGENTS-META (${e.message})`] };
  }
}

function validateSections(content, file) {
  const missing = REQUIRED_SECTIONS.filter(sec => !content.includes(sec));
  return missing.length ? [`${file}: Missing required section(s): ${missing.join(', ')}`] : [];
}

function main() {
  const files = walk(ROOT);
  const allErrors = [];
  for (const file of files) {
    const content = readFileSync(file, 'utf8');
    const metaRes = parseMeta(content, file);
    if (!metaRes.ok) {
      allErrors.push(...metaRes.errors);
    }
    const sectionErrors = validateSections(content, file);
    allErrors.push(...sectionErrors);
    // change log minimal validation
    if (!/\|\s*Version\s*\|\s*Date/.test(content)) {
      allErrors.push(`${file}: Change Log table missing or malformed`);
    }
  }
  if (allErrors.length) {
    console.error('\nAGENTS.md validation FAILED:\n');
    for (const err of allErrors) console.error(' -', err);
    console.error(`\n${allErrors.length} issue(s) found.`);
    process.exit(1);
  } else {
    console.log(`Validated ${files.length} AGENTS.md files successfully.`);
  }
}

try { main(); } catch (e) {
  console.error('Validator runtime error:', e);
  process.exit(2);
}
