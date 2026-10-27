import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { z } from "zod";

const BOOKS_DIR = path.join(process.cwd(), "content", "books");
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

/** Index order for "The rest." */
export const bookTopics = [
  "Creativity & writing",
  "Focus, habits & time",
  "Learning & thinking",
  "Career & life",
  "People & leadership",
  "Building a business",
  "Code & design",
  "Money",
] as const;

/** Order of the "Start with these" list. */
const recommendedSlugs = [
  "four-thousand-weeks",
  "the-artists-way",
  "range",
  "atomic-habits",
] as const;

const frontmatterSchema = z.strictObject({
  title: z.string().min(1),
  subtitle: z.string().min(1).optional(),
  author: z.string().min(1),
  description: z.string().min(1),
  topic: z.enum(bookTopics),
  recommend: z.literal(true).optional(),
  why: z.string().min(1).optional(),
  url: z.url(),
  number: z.number().int().positive(),
  format: z.enum(["audio"]).optional(),
});

export type Book = z.infer<typeof frontmatterSchema> & {
  slug: string;
  body: string;
};

function parseBook(slug: string, source: string): Book {
  const file = `content/books/${slug}.md`;
  const match = FRONTMATTER.exec(source);
  if (!match) throw new Error(`${file}: missing YAML frontmatter`);

  const result = frontmatterSchema.safeParse(parseYaml(match[1]));
  if (!result.success) {
    throw new Error(
      `${file}: invalid frontmatter\n${z.prettifyError(result.error)}`,
    );
  }

  return { ...result.data, slug, body: source.slice(match[0].length) };
}

/** All books, most recently finished first. */
export async function getBooks(): Promise<Book[]> {
  const files = (await readdir(BOOKS_DIR)).filter((file) =>
    file.endsWith(".md"),
  );

  const books = await Promise.all(
    files.map(async (file) => {
      const slug = file.slice(0, -".md".length);
      return parseBook(
        slug,
        await readFile(path.join(BOOKS_DIR, file), "utf8"),
      );
    }),
  );

  return books.sort(
    (a, b) => b.number - a.number || a.title.localeCompare(b.title, "en"),
  );
}

export async function getBook(slug: string): Promise<Book | undefined> {
  return (await getBooks()).find((book) => book.slug === slug);
}

export function getRecommendedBooks(books: Book[]): Book[] {
  const order = new Map<string, number>(
    recommendedSlugs.map((slug, index) => [slug, index]),
  );

  return books
    .filter((book) => book.recommend)
    .sort((a, b) => {
      const aIndex = order.get(a.slug);
      const bIndex = order.get(b.slug);
      return (
        (aIndex ?? order.size) - (bIndex ?? order.size) || b.number - a.number
      );
    });
}

/** A blockquote that opens the notes, lifted out as the page's pull quote. */
export function splitLeadQuote(body: string): {
  quote: string | null;
  rest: string;
} {
  const source = body.replace(/^\n+/, "");
  if (!source.startsWith(">")) return { quote: null, rest: source };

  const lines = source.split("\n");
  const quoteLines: string[] = [];
  let index = 0;

  for (; index < lines.length; index++) {
    const line = lines[index];
    if (line.startsWith(">")) {
      quoteLines.push(line.replace(/^>\s?/, ""));
      continue;
    }
    if (line.trim() === "") break;
    return { quote: null, rest: source };
  }

  const quote = quoteLines.join("\n").trim();
  if (!quote) return { quote: null, rest: source };

  return {
    quote,
    rest: lines.slice(index).join("\n").replace(/^\n+/, ""),
  };
}
