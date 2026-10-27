import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { z } from "zod";

const LETTERS_DIR = path.join(process.cwd(), "content", "letters");
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

const frontmatterSchema = z.strictObject({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.iso.date(),
});

export type Letter = z.infer<typeof frontmatterSchema> & {
  slug: string;
  body: string;
};

const letterDateFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeZone: "UTC",
});

function parseLetter(slug: string, source: string): Letter {
  const file = `content/letters/${slug}.md`;
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

/** All letters, newest first. */
export async function getLetters(): Promise<Letter[]> {
  const files = (await readdir(LETTERS_DIR)).filter((file) =>
    file.endsWith(".md"),
  );

  const letters = await Promise.all(
    files.map(async (file) => {
      const slug = file.slice(0, -".md".length);
      return parseLetter(
        slug,
        await readFile(path.join(LETTERS_DIR, file), "utf8"),
      );
    }),
  );

  return letters.sort(
    (a, b) =>
      b.date.localeCompare(a.date) || a.title.localeCompare(b.title, "en"),
  );
}

export async function getLetter(slug: string): Promise<Letter | undefined> {
  return (await getLetters()).find((letter) => letter.slug === slug);
}

/** Long date in UTC, so a `YYYY-MM-DD` value stays on that calendar day. */
export function formatLetterDate(date: string): string {
  return letterDateFormat.format(new Date(`${date}T00:00:00Z`));
}
