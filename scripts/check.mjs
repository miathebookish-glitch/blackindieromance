// Pre-publish checks on the built site (run `npm run build` first).
// Errors fail the run; warnings are printed for a human to review.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const errors = [];
const warnings = [];

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

if (!existsSync(DIST)) { console.error('No dist/ folder. Run npm run build first.'); process.exit(1); }

const fm = (file) => readFileSync(file, 'utf8').match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
const val = (s, k) => s.match(new RegExp(`^${k}:\\s*"?([^"\\n]+)"?`, 'm'))?.[1]?.trim();

// Content checks
const books = readdirSync('src/content/books').filter((f) => f.endsWith('.md'));
const teamTitles = [];
for (const f of books) {
  const s = fm(join('src/content/books', f));
  const title = val(s, 'title');
  if (/sample/i.test(val(s, 'author') ?? '') || /SAMPLE CONTENT/.test(readFileSync(join('src/content/books', f), 'utf8')))
    warnings.push(`Sample book still present: ${f}`);
  if (val(s, 'teamTitle') === 'true') teamTitles.push(title);
  if (/REPLACE/.test(s)) warnings.push(`Placeholder link value in ${f}`);
}
for (const f of readdirSync('src/content/lists').filter((f) => f.endsWith('.md'))) {
  const raw = readFileSync(join('src/content/lists', f), 'utf8');
  const s = fm(join('src/content/lists', f));
  const title = val(s, 'title') ?? '';
  const n = (s.match(/^\s+- \{ book:/gm) || []).length;
  const stated = title.match(/^(\d+)\s/)?.[1];
  if (stated && Number(stated) !== n) warnings.push(`"${title}" says ${stated} but has ${n} entries (${f})`);
  if (/SAMPLE CONTENT/.test(raw)) warnings.push(`Sample list still present: ${f}`);
}
if (/REPLACE/.test(readFileSync('src/lib/site.ts', 'utf8'))) warnings.push('Amazon Associates tag in src/lib/site.ts is still a placeholder');

// Built-site checks
const sitemap = existsSync(join(DIST, 'sitemap-0.xml')) ? readFileSync(join(DIST, 'sitemap-0.xml'), 'utf8') : '';
for (const file of walk(DIST).filter((f) => f.endsWith('.html'))) {
  const html = readFileSync(file, 'utf8');
  const page = '/' + file.slice(DIST.length + 1).replace(/index\.html$/, '');

  // Every Amazon link is marked sponsored
  for (const m of html.matchAll(/<a\b[^>]*href="https:\/\/www\.amazon\.com[^"]*"[^>]*>/g)) {
    if (!/rel="[^"]*sponsored[^"]*"/.test(m[0])) errors.push(`${page}: Amazon link without rel="sponsored"`);
  }
  // Any page that shows a team title in a list or guide carries the team disclosure
  const main = html.split('<main')[1]?.split('</main>')[0] ?? '';
  const showsTeam = teamTitles.some((t) => main.includes(`>${t}</a></h3>`) || main.includes(`<h1 class="h1">${t}</h1>`));
  if (showsTeam && !/written by members of our team/.test(main)) errors.push(`${page}: shows a team title but has no team disclosure`);
  // Footer disclosure everywhere
  if (!/As an Amazon Associate we earn from qualifying purchases/.test(html)) errors.push(`${page}: missing footer disclosure`);
  // Noindex pages stay out of the sitemap
  if (/<meta name="robots" content="noindex/.test(html) && sitemap.includes(`blackindieromance.com${page}<`))
    errors.push(`${page}: noindex page is in the sitemap`);
  if (!/<title>[^<]+<\/title>/.test(html)) errors.push(`${page}: missing <title>`);
  if (!/<meta name="description" content="[^"]+"/.test(html)) errors.push(`${page}: missing meta description`);
  for (const img of html.matchAll(/<img\b[^>]*>/g)) if (!/\balt=/.test(img[0])) errors.push(`${page}: image without alt`);
}

for (const w of warnings) console.log(`warn  ${w}`);
for (const e of errors) console.log(`ERROR ${e}`);
console.log(`\n${errors.length} error(s), ${warnings.length} warning(s)`);
process.exit(errors.length ? 1 : 0);
