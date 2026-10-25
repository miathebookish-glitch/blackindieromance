import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const books = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/books' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    series: z.string().optional(),
    seriesOrder: z.number().optional(),
    asin: z.string(),
    // attribution = team titles (Amazon Attribution link); associates = everyone else
    linkType: z.enum(['attribution', 'associates']),
    attributionUrl: z.string().url().optional(),
    ku: z.boolean().default(false),
    heat: z.number().int().min(1).max(5),
    // Write tropes as an inline array: tropes: [bodyguard, slow burn]
    tropes: z.array(z.string()).min(1),
    hook: z.string(),
    contentNotes: z.array(z.string()).default([]),
    // true for any book written by a member of the team. Triggers the page disclosure.
    teamTitle: z.boolean().default(false),
    // Optional cover image in /public/covers/. Without it a typographic cover is drawn.
    cover: z.string().optional(),
    hea: z.boolean().default(true),
    // Optional first-person note, ONLY when someone on the team has actually read it.
    readerNote: z.string().optional(),
  }).refine((b) => b.linkType !== 'attribution' || !!b.attributionUrl, {
    message: 'attributionUrl is required when linkType is attribution',
  }),
});

const lists = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/lists' }),
  schema: z.object({
    title: z.string(),
    // The word or phrase inside the title set in maroon italics.
    accent: z.string(),
    description: z.string(),
    kind: z.enum(['trope', 'comp', 'vibe', 'seasonal', 'authors', 'setting', 'gift', 'how-to']),
    tropes: z.array(z.string()).default([]),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    heroAlt: z.string().optional(),
    pinImage: z.string().optional(),
    quickPicks: z.array(z.object({ label: z.string(), book: reference('books') })).default([]),
    entries: z.array(
      z.object({
        book: reference('books'),
        hook: z.string().optional(),
      }),
    ).min(1),
  }),
});

export const collections = { books, lists };
