// Works out which hub pages are too thin to index, so the sitemap can skip
// them. Hub pages mark themselves noindex with the same rule at render time.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const HUB_MIN_ITEMS = 3;

const slugify = (s) =>
  s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

function frontmatter(file) {
  const m = readFileSync(file, 'utf8').match(/^---\n([\s\S]*?)\n---/);
  return m ? m[1] : '';
}

function inlineArray(fm, key) {
  const m = fm.match(new RegExp(`^${key}:\\s*\\[(.*)\\]\\s*$`, 'm'));
  if (!m) return [];
  return m[1].split(',').map((s) => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
}

function scalar(fm, key) {
  const m = fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  return m ? m[1].trim() : '';
}

function files(dir) {
  return existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => join(dir, f)) : [];
}

export function thinHubPaths(root = process.cwd()) {
  const counts = new Map();
  const heat = new Map();
  let ku = 0;
  const bump = (m, k) => m.set(k, (m.get(k) || 0) + 1);
  for (const f of files(join(root, 'src/content/books'))) {
    const fm = frontmatter(f);
    for (const t of inlineArray(fm, 'tropes')) bump(counts, slugify(t));
    bump(heat, scalar(fm, 'heat'));
    if (scalar(fm, 'ku') === 'true') ku++;
  }
  for (const f of files(join(root, 'src/content/lists'))) {
    for (const t of inlineArray(frontmatter(f), 'tropes')) bump(counts, slugify(t));
  }
  const out = [];
  for (const [slug, n] of counts) if (n < HUB_MIN_ITEMS) out.push(`/tropes/${slug}/`);
  const heatSlugs = ['sweet', 'warm', 'steamy', 'spicy', 'scorching'];
  heatSlugs.forEach((s, i) => { if ((heat.get(String(i + 1)) || 0) < HUB_MIN_ITEMS) out.push(`/heat/${s}/`); });
  if (ku < HUB_MIN_ITEMS) out.push('/free-in-ku/');
  return out;
}

export const NOINDEX_PATHS = ['/404/', ...thinHubPaths()];
