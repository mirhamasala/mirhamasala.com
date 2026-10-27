import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { z } from "zod";

const TSOP_DIR = path.join(process.cwd(), "content", "tsop");
const POSTS_DIR = path.join(TSOP_DIR, "posts");
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

export const spinOffs = [
  { id: "polyglot", title: "Polyglot" },
  { id: "artist", title: "Artist" },
  { id: "kiteboarder", title: "Kiteboarder" },
  { id: "philanthropist", title: "Philanthropist" },
  { id: "dancer", title: "Dancer" },
  { id: "entrepreneur", title: "Entrepreneur" },
  { id: "reader", title: "Reader" },
  { id: "snowboarder", title: "Snowboarder" },
  { id: "traveler", title: "Traveler" },
  { id: "meditator", title: "Meditator" },
  { id: "surfer", title: "Surfer" },
  { id: "photographer", title: "Photographer" },
] as const;

export const bucketList = {
  id: "bucket-list",
  title: "The bucket list",
} as const;

const spinOffIds = [
  ...spinOffs.map((spinOff) => spinOff.id),
  bucketList.id,
] as const;

const sectionPageOrder = [
  "about",
  "about-me",
  "faqs",
  "resources",
  "now",
  "contact",
] as const;

const pageFrontmatterSchema = z.strictObject({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.iso.date(),
});

const postFrontmatterSchema = pageFrontmatterSchema.extend({
  spinOff: z.enum(spinOffIds),
});

export type TsopPage = z.infer<typeof pageFrontmatterSchema> & {
  slug: string;
  body: string;
};

export type TsopPost = z.infer<typeof postFrontmatterSchema> & {
  slug: string;
  body: string;
};

function parseDocument<T extends Record<string, unknown>>(
  file: string,
  source: string,
  schema: z.ZodType<T>,
): T & { body: string } {
  const match = FRONTMATTER.exec(source);
  if (!match) throw new Error(`${file}: missing YAML frontmatter`);

  const result = schema.safeParse(parseYaml(match[1]));
  if (!result.success) {
    throw new Error(
      `${file}: invalid frontmatter\n${z.prettifyError(result.error)}`,
    );
  }

  return { ...result.data, body: source.slice(match[0].length) };
}

async function readMarkdown(directory: string) {
  const files = (await readdir(directory)).filter((file) =>
    file.endsWith(".md"),
  );

  return Promise.all(
    files.map(async (file) => {
      const slug = file.slice(0, -".md".length);
      const source = await readFile(path.join(directory, file), "utf8");
      return {
        slug,
        source,
        file: path.relative(process.cwd(), path.join(directory, file)),
      };
    }),
  );
}

/** Section pages in their index order. */
export async function getTsopPages(): Promise<TsopPage[]> {
  const documents = await readMarkdown(TSOP_DIR);
  const pages = documents.map(({ slug, source, file }) => ({
    slug,
    ...parseDocument(file, source, pageFrontmatterSchema),
  }));

  const bySlug = new Map(pages.map((page) => [page.slug, page]));
  const unknown = pages.filter(
    (page) =>
      !sectionPageOrder.includes(
        page.slug as (typeof sectionPageOrder)[number],
      ),
  );
  if (unknown.length > 0) {
    throw new Error(
      `Unexpected Spin-Off Project pages: ${unknown.map((page) => page.slug).join(", ")}`,
    );
  }

  return sectionPageOrder.map((slug) => {
    const page = bySlug.get(slug);
    if (!page) throw new Error(`content/tsop/${slug}.md: missing section page`);
    return page;
  });
}

export async function getTsopPage(slug: string): Promise<TsopPage | undefined> {
  return (await getTsopPages()).find((page) => page.slug === slug);
}

/** All posts, newest first. */
export async function getTsopPosts(): Promise<TsopPost[]> {
  const documents = await readMarkdown(POSTS_DIR);
  const posts = documents.map(({ slug, source, file }) => ({
    slug,
    ...parseDocument(file, source, postFrontmatterSchema),
  }));

  return posts.sort(
    (a, b) =>
      b.date.localeCompare(a.date) || a.title.localeCompare(b.title, "en"),
  );
}

export async function getTsopPost(slug: string): Promise<TsopPost | undefined> {
  return (await getTsopPosts()).find((post) => post.slug === slug);
}

function postsInGroup(posts: TsopPost[], spinOff: TsopPost["spinOff"]) {
  return posts
    .filter((post) => post.spinOff === spinOff)
    .sort(
      (a, b) =>
        a.date.localeCompare(b.date) || a.title.localeCompare(b.title, "en"),
    );
}

/** The twelve spin-offs, then the bucket list. Posts are oldest first. */
export function groupTsopPosts(posts: TsopPost[]) {
  return [
    ...spinOffs.map((spinOff, index) => ({
      ...spinOff,
      number: index + 1,
      posts: postsInGroup(posts, spinOff.id),
    })),
    {
      ...bucketList,
      number: null,
      posts: postsInGroup(posts, bucketList.id),
    },
  ];
}
