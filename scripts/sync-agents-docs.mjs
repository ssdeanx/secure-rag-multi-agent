#!/usr/bin/env node
/* eslint-env node */
/* global console */
import process from 'node:process';
/**
 * Sync script for AGENTS.md documentation.
 * Responsibilities:
 *  - Detect modified AGENTS.md files since base ref (default: origin/main or first commit)
 *  - For each changed file: update last_updated timestamp
 *  - Optionally auto-bump patch version (configurable) if content (excluding metadata line) changed
 *  - Insert change log entry if version bumped
 *  - Dry-run by default; write with --write flag
 *
 * Usage:
 *   node scripts/sync-agents-docs.mjs            # dry run
 *   node scripts/sync-agents-docs.mjs --write    # apply changes
 *   node scripts/sync-agents-docs.mjs --base main --write
 */
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, relative } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = dirname(__dirname);

const args = process.argv.slice(2);
const WRITE = args.includes('--write');
const baseArgIdx = args.indexOf('--base');
const BASE = baseArgIdx !== -1 ? args[baseArgIdx + 1] : detectBase();
const AUTOBUMP = !args.includes('--no-bump');
const UPDATE_INDEX = !args.includes('--no-index');
const QUIET = args.includes('--quiet');

function detectBase() {
  try {
    // Try origin/main; fallback to initial commit
    execSync('git rev-parse --verify origin/main', { stdio: 'ignore' });
    return 'origin/main';
  } catch {
    return execSync('git rev-list --max-parents=0 HEAD').toString().trim();
  }
}

function gitChangedAgents(baseRef) {
  const diff = execSync(`git diff --name-only ${baseRef} -- '**/AGENTS.md'`).toString().trim();
  if (!diff) { return []; }
  return diff.split('\n').filter(Boolean);
}

function listAllAgents(root) {
  const out = [];
  function walk(dir) {
    for (const entry of readdirSync(dir)) {
      const full = `${dir}/${entry}`;
      const st = statSync(full);
      if (st.isDirectory()) { walk(full); } else if (entry === 'AGENTS.md') { out.push(full); }
    }
  }
  walk(root);
  return out;
}

function parseMeta(line) {
  const m = line.match(/<!--\s*AGENTS-META\s*(\{.*\})\s*-->/);
  if (!m) return null;
  try { return JSON.parse(m[1]); } catch { return null; }
}

function formatMeta(meta) {
  return `<!-- AGENTS-META ${JSON.stringify(meta)} -->`;
}

function bumpVersion(v) {
  const parts = v.split('.');
  while (parts.length < 3) { parts.push('0'); }
  const [maj, min, patch] = parts.map(n => parseInt(n || '0', 10));
  return `${maj}.${min}.${(patch || 0) + 1}`;
}

function stableContentHash(lines, metaIdx) {
  const clone = [...lines];
  clone.splice(metaIdx, 1); // remove meta line
  return clone.join('\n')
    .replace(/\r/g,'')
    .replace(/last_updated":"[^"]+"/g,'') // ignore embedded timestamp if any
    .replace(/\s+/g,' ') // collapse whitespace
    .trim();
}

function updateFile(path) {
  const raw = readFileSync(path, 'utf8');
  const lines = raw.split(/\r?\n/);
  const metaLineIdx = lines.findIndex(l => l.includes('AGENTS-META'));
  if (metaLineIdx === -1) { return { path, skipped: true, reason: 'no_meta' }; }
  const meta = parseMeta(lines[metaLineIdx]);
  if (!meta) { return { path, skipped: true, reason: 'bad_meta' }; }

  const beforeHash = stableContentHash(lines, metaLineIdx);
  const newTimestamp = new Date().toISOString().replace(/\..+/, 'Z');
  let changed = false;
  let versionBumped = false;

  // Always set timestamp if file changed in git
  if (meta.last_updated !== newTimestamp) {
    meta.last_updated = newTimestamp;
    changed = true;
  }

  // Determine if substantive content changed (not just timestamp) by comparing hash AFTER possible index regeneration
  // We'll recompute after potential index update

  // Return mutation function for change log insertion
  function insertChangeLog(note) {
    const clIndex = lines.findIndex(l => /^## Change Log/i.test(l));
  if (clIndex === -1) { return; }
  const headerIdx = lines.findIndex((l, idx) => idx > clIndex && /\|\s*Version\s*\|/.test(l));
  if (headerIdx === -1) { return; }
    const sepIdx = headerIdx + 1;
    const insertIdx = sepIdx + 1;
    const row = `| ${meta.version} | ${newTimestamp.split('T')[0]} | ${note} |`;
    lines.splice(insertIdx, 0, row);
  }

  // Regenerate index in root if requested
  if (UPDATE_INDEX && /\/AGENTS.md$/.test(path) && meta.applies_to === '/') {
    const indexStart = lines.findIndex(l => /^## Documentation File Index/.test(l));
    if (indexStart !== -1) {
      const tableHeader = lines.findIndex((l, idx) => idx > indexStart && /^\| Title \| Path/.test(l));
      if (tableHeader !== -1) {
        // find end of table (blank line after)
        let end = tableHeader + 1;
  while (end < lines.length && lines[end].startsWith('|')) { end++; }
        // rebuild table
        const all = listAllAgents(ROOT).filter(p => p !== path);
        const rows = all.map(p => {
          const rel = relative(ROOT, p).replace(/\\/g,'/');
          const content = readFileSync(p,'utf8');
          const metaLine = content.split(/\r?\n/)[0];
          const m = parseMeta(metaLine) || {};
            return `| ${m.title || rel} | [${rel}](${rel}) | ${ (m.tags||[])[0]?.replace('layer:','')||'n/a' } | ${(m.tags||[]).filter(t=>t.startsWith('domain:')).map(d=>d.replace('domain:','')).join(',')||'n/a'} | ${m.status||'n/a'} |`;
        }).sort();
        const newTable = [
          '| Title | Path | Layer | Domain(s) | Status |',
          '|-------|------|-------|-----------|--------|',
          ...rows
        ];
        const before = lines.slice(tableHeader, end).join('\n');
        const after = newTable.join('\n');
        if (before !== after) {
          lines.splice(tableHeader, end - tableHeader, ...newTable);
          changed = true;
        }
      }
    }
  }

  const afterHash = stableContentHash(lines, metaLineIdx);
  const substantiveChanged = beforeHash !== afterHash;

  if (AUTOBUMP && substantiveChanged) {
    const oldVersion = meta.version;
    const newVersion = bumpVersion(oldVersion);
    if (newVersion !== oldVersion) {
      meta.version = newVersion;
      versionBumped = true;
      changed = true;
      insertChangeLog('Auto-bump sync (content update)');
    }
  }

  if (!changed) { return { path, skipped: true, reason: 'no_change_needed' }; }
  lines[metaLineIdx] = formatMeta(meta);
  const updated = lines.join('\n');
  if (WRITE) { writeFileSync(path, updated, 'utf8'); }
  return { path, changed: true, versionBumped, newVersion: meta.version };
}

function main() {
  const changed = gitChangedAgents(BASE);
  if (!changed.length) {
  if (!QUIET) { console.log('No AGENTS.md changes detected against', BASE); }
    process.exit(0);
  }
  const results = changed.map(f => updateFile(f));
  const report = results.map(r => {
    if (r.skipped) {
      return `${relative(ROOT, r.path)}: skipped (${r.reason})`;
    }
    return `${relative(ROOT, r.path)}: updated${r.versionBumped ? ' (version→'+r.newVersion+')' : ''}`;
  });
  if (!QUIET) {
    console.log(report.join('\n'));
  if (!WRITE) { console.log('\n(Dry run) Re-run with --write to apply changes.'); }
  }
}

try { main(); } catch (e) {
  console.error('sync-agents-docs error:', e);
  process.exit(1);
}
