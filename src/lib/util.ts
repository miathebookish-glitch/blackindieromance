import { SITE } from './site';

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

type LinkBook = { asin: string; linkType: 'attribution' | 'associates'; attributionUrl?: string };

/** Amazon link for a book: Attribution URL for team titles, Associates tag for everyone else. */
export function amazonUrl(b: LinkBook): string {
  if (b.linkType === 'attribution' && b.attributionUrl) return b.attributionUrl;
  return `https://www.amazon.com/dp/${encodeURIComponent(b.asin)}?tag=${encodeURIComponent(SITE.associatesTag)}`;
}

export function pinterestSaveUrl(pageUrl: string, imageUrl: string, description: string) {
  const q = new URLSearchParams({ url: pageUrl, media: imageUrl, description });
  return `https://www.pinterest.com/pin/create/button/?${q.toString()}`;
}

export function formatMonthYear(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
}

export function readMinutes(words: number) {
  return Math.max(2, Math.round(words / 220));
}
