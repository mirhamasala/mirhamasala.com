import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { z } from "zod";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

const frontmatterSchema = z.strictObject({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.iso.date(),
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
});

export type Post = z.infer<typeof frontmatterSchema> & {
  slug: string;
  body: string;
};

function parsePost(slug: string, source: string): Post {
  const file = `content/posts/${slug}.md`;
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

/** Published posts, newest first. Drafts are never returned. */
export async function getPosts(): Promise<Post[]> {
  const files = (await readdir(POSTS_DIR)).filter((file) =>
    file.endsWith(".md"),
  );

  const posts = await Promise.all(
    files.map(async (file) => {
      const slug = file.slice(0, -".md".length);
      return parsePost(
        slug,
        await readFile(path.join(POSTS_DIR, file), "utf8"),
      );
    }),
  );

  return posts
    .filter((post) => !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPost(slug: string): Promise<Post | undefined> {
  return (await getPosts()).find((post) => post.slug === slug);
}
