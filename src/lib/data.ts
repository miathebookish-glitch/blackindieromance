import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { slugify } from './util';
import { HUB_MIN_ITEMS } from './site';

export type Book = CollectionEntry<'books'>;
export type List = CollectionEntry<'lists'>;

export async function allBooks() {
  return (await getCollection('books')).sort((a, b) => a.data.title.localeCompare(b.data.title));
}

export async function allLists() {
  return (await getCollection('lists')).sort((a, b) => +b.data.published - +a.data.published);
}

/** Resolve a list's entries to books, in order. Throws on a missing book so builds fail loudly. */
export async function listBooks(list: List) {
  return Promise.all(
    list.data.entries.map(async (e) => {
      const book = await getEntry(e.book);
      if (!book) throw new Error(`List "${list.id}" references missing book "${e.book.id}"`);
      return { book, hook: e.hook ?? book.data.hook };
    }),
  );
}

export async function quickPicks(list: List) {
  return Promise.all(
    list.data.quickPicks.map(async (q) => {
      const book = await getEntry(q.book);
      if (!book) throw new Error(`Quick pick in "${list.id}" references missing book "${q.book.id}"`);
      return { label: q.label, book };
    }),
  );
}

/** Every trope with its display name, books and lists. */
export async function tropeIndex() {
  const books = await allBooks();
  const lists = await allLists();
  const map = new Map<string, { name: string; slug: string; books: Book[]; lists: List[] }>();
  const get = (name: string) => {
    const slug = slugify(name);
    if (!map.has(slug)) map.set(slug, { name, slug, books: [], lists: [] });
    return map.get(slug)!;
  };
  for (const b of books) for (const t of b.data.tropes) get(t).books.push(b);
  for (const l of lists) for (const t of l.data.tropes) get(t).lists.push(l);
  return [...map.values()].sort((a, b) => b.books.length + b.lists.length - (a.books.length + a.lists.length));
}

export const isThin = (count: number) => count < HUB_MIN_ITEMS;

/** Lists a book appears in. */
export async function listsForBook(bookId: string) {
  return (await allLists()).filter((l) => l.data.entries.some((e) => e.book.id === bookId));
}

/** Other books in the same series, in order. */
export async function seriesBooks(book: Book) {
  if (!book.data.series) return [];
  return (await allBooks())
    .filter((b) => b.data.series === book.data.series)
    .sort((a, b) => (a.data.seriesOrder ?? 99) - (b.data.seriesOrder ?? 99));
}
