#!/usr/bin/env node
/**
 * Front-matter linter for the avuru obs docs.
 *
 * Enforces required front-matter keys per document type so contributors get
 * recaled at CI time instead of in review — "the linter replaces 80% of the
 * manual styling work".
 *
 *   node scripts/lint-frontmatter.mjs
 *
 * Rules
 *   every page         → non-empty `title`
 *   integration pages  → + description, tags[], support_level, since_version
 *   metric pages       → + unit, type, stability
 *   enum checks        → support_level ∈ {community,official,experimental}
 *                        type         ∈ {counter,gauge,histogram,updowncounter}
 *                        stability    ∈ {stable,experimental,deprecated}
 */
import {readdirSync, readFileSync, statSync} from 'node:fs';
import {join, extname, basename, relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import matter from 'gray-matter';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const SCAN_DIRS = ['docs', 'guides', 'reference', 'integrations', 'blog', 'changelog', 'templates', 'i18n'];
const EXTS = new Set(['.md', '.mdx']);

const SUPPORT_LEVELS = ['community', 'official', 'experimental'];
const METRIC_TYPES = ['counter', 'gauge', 'histogram', 'updowncounter'];
const STABILITIES = ['stable', 'experimental', 'deprecated'];

/** Recursively collect markdown files under a directory. */
function walk(dir, acc = []) {
  let entries;
  try {
    entries = readdirSync(dir, {withFileTypes: true});
  } catch {
    return acc; // directory may not exist (e.g. i18n before translations)
  }
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) walk(full, acc);
    else if (EXTS.has(extname(e.name))) acc.push(full);
  }
  return acc;
}

function nonEmpty(v) {
  return v !== undefined && v !== null && String(v).trim() !== '';
}

function classify(file, data) {
  const rel = relative(ROOT, file).replace(/\\/g, '/');
  const id = typeof data.id === 'string' ? data.id : '';
  const tags = Array.isArray(data.tags) ? data.tags : [];
  const isIndex = basename(file).replace(/\.mdx?$/, '') === 'index';

  const isMetric = id.startsWith('metric-') || 'unit' in data;
  const isIntegration =
    !isMetric &&
    (id.startsWith('integration-') ||
      tags.includes('integration') ||
      (/^integrations\//.test(rel) && !isIndex && /\/(frameworks|languages|databases|infra)\//.test(rel)));

  if (isMetric) return 'metric';
  if (isIntegration) return 'integration';
  return 'doc';
}

function lintFile(file) {
  const errors = [];
  let parsed;
  try {
    parsed = matter(readFileSync(file, 'utf8'));
  } catch (err) {
    return [`invalid front-matter YAML: ${err.message}`];
  }
  const data = parsed.data ?? {};
  const kind = classify(file, data);

  if (!nonEmpty(data.title)) errors.push('missing required key: title');

  if (kind === 'integration') {
    for (const key of ['description', 'support_level', 'since_version']) {
      if (!nonEmpty(data[key])) errors.push(`integration page missing required key: ${key}`);
    }
    if (!Array.isArray(data.tags) || data.tags.length === 0) {
      errors.push('integration page missing required key: tags (non-empty array)');
    }
    if (nonEmpty(data.support_level) && !SUPPORT_LEVELS.includes(String(data.support_level))) {
      errors.push(`support_level must be one of ${SUPPORT_LEVELS.join(' | ')}`);
    }
  }

  if (kind === 'metric') {
    for (const key of ['unit', 'type', 'stability']) {
      if (!nonEmpty(data[key])) errors.push(`metric page missing required key: ${key}`);
    }
    if (nonEmpty(data.type) && !METRIC_TYPES.includes(String(data.type))) {
      errors.push(`type must be one of ${METRIC_TYPES.join(' | ')}`);
    }
    if (nonEmpty(data.stability) && !STABILITIES.includes(String(data.stability))) {
      errors.push(`stability must be one of ${STABILITIES.join(' | ')}`);
    }
  }

  return errors;
}

let files = [];
for (const d of SCAN_DIRS) files = files.concat(walk(join(ROOT, d)));

let failed = 0;
for (const file of files.sort()) {
  const errors = lintFile(file);
  if (errors.length) {
    failed += errors.length;
    const rel = relative(ROOT, file);
    for (const e of errors) console.error(`✖ ${rel}: ${e}`);
  }
}

if (failed) {
  console.error(`\nfront-matter lint failed: ${failed} problem(s) across ${files.length} file(s).`);
  process.exit(1);
}
console.log(`✓ front-matter lint passed (${files.length} files).`);
