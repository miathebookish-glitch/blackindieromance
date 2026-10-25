# Black Indie Romance

Source for blackindieromance.com: a static Astro site, deployed by Cloudflare Pages on every push to `main`.

## Run it

```
npm install
npm run dev      # local preview at http://localhost:4321
npm run build    # writes the site to dist/
npm run check    # pre-publish checks on dist/ (run after build)
```

## Where things live

| What | Where |
| --- | --- |
| Books (one file each) | `src/content/books/<slug>.md` |
| Lists (one file each) | `src/content/lists/<slug>.md` |
| Associates tag, Pinterest claim code, disclosure text, heat levels | `src/lib/site.ts` |
| Palette and all styles | `src/styles/global.css` |
| Page templates | `src/pages/` |
| Cover images (optional) | `public/covers/` |
| Pin images for the bulk CSV | `public/pins/` |

## Adding a book

```yaml
---
title: "Book Title"
author: "Author Name"
series: "Series Name"        # optional
seriesOrder: 1               # optional
asin: "B0XXXXXXXX"
linkType: associates         # attribution for team titles
# attributionUrl: "..."      # required when linkType is attribution
# teamTitle: true            # any book written by a team member
ku: true
heat: 4                      # 1 Sweet to 5 Scorching
tropes: [bodyguard, slow burn]   # keep this on one line
hook: "One line, in the site voice."
contentNotes: [violence]
# cover: "/covers/book-title.jpg"
# readerNote: "Only if someone on the team has actually read it."
---

Two or three sentences for the book guide page.
```

Keep `tropes` as a one-line array: the sitemap's thin-page rule reads it.

## Rules the build enforces

- Every Amazon link gets `rel="sponsored nofollow"`. Team titles use their Amazon Attribution URL; everyone else's links carry the Associates tag.
- Any page showing a `teamTitle: true` book carries the team disclosure line. The footer disclosure is on every page.
- Trope, heat and Free-in-KU hubs with fewer than 3 items are `noindex` and left out of the sitemap until they fill out.
- No star ratings, invented reader quotes or first-person claims unless someone on the team read the book.

`npm run check` fails the run if any of these break, and warns about sample content, placeholder links and list titles whose number doesn't match the entry count.

## Before launch

1. Replace the sample books and lists (marked `SAMPLE CONTENT`).
2. Set `associatesTag` in `src/lib/site.ts` once Amazon Associates approves the site.
3. Add the Pinterest claim code to `pinterestVerify` and the profile URL to `pinterestProfile`.
4. In Cloudflare: turn off AI-bot blocking for the zone so search crawlers can read the site, and turn on Web Analytics.
5. Submit `https://blackindieromance.com/sitemap-index.xml` to Google Search Console and Bing Webmaster Tools.
