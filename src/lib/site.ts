export const SITE = {
  name: 'Black Indie Romance',
  url: 'https://blackindieromance.com',
  tagline: 'Black love, well read.',
  description:
    'Book lists and reading guides for Black romance: novels by Black authors with Black leads, with tropes, heat level and content notes up front.',
  // Amazon Associates tracking ID. Replace once the account is approved.
  associatesTag: 'REPLACE-20',
  // Pinterest site-claim code from Pinterest > Settings > Claimed accounts.
  pinterestVerify: '',
  pinterestProfile: 'https://www.pinterest.com/',
};

// The disclosure text used in the footer, on /disclosure/, and as the basis
// for the per-page line. Keep these in sync with the FTC note in the brief.
export const DISCLOSURE_FULL =
  'BlackIndieRomance.com is run by Black romance authors, and some books we feature are written by members of our team. As an Amazon Associate we earn from qualifying purchases.';

export const HEAT_LEVELS = [
  { level: 1, slug: 'sweet', name: 'Sweet', desc: 'Closed door. All yearning.' },
  { level: 2, slug: 'warm', name: 'Warm', desc: 'A door left slightly open.' },
  { level: 3, slug: 'steamy', name: 'Steamy', desc: 'On page, still tender.' },
  { level: 4, slug: 'spicy', name: 'Spicy', desc: 'Explicit and plot-driven.' },
  { level: 5, slug: 'scorching', name: 'Scorching', desc: 'Bring a fan. And water.' },
] as const;

// Hubs with fewer items than this are rendered but kept out of search.
export const HUB_MIN_ITEMS = 3;
