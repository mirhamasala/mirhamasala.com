import { readFile } from "node:fs/promises";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { z } from "zod";

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

const frontmatterSchema = z.strictObject({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.iso.date(),
});

export type StandalonePage = z.infer<typeof frontmatterSchema> & {
  body: string;
};

async function readPage(slug: "resume" | "dropbox"): Promise<StandalonePage> {
  const file = `content/pages/${slug}.md`;
  const source = await readFile(path.join(process.cwd(), file), "utf8");
  const match = FRONTMATTER.exec(source);
  if (!match) throw new Error(`${file}: missing YAML frontmatter`);

  const result = frontmatterSchema.safeParse(parseYaml(match[1]));
  if (!result.success) {
    throw new Error(
      `${file}: invalid frontmatter\n${z.prettifyError(result.error)}`,
    );
  }

  return { ...result.data, body: source.slice(match[0].length) };
}

export function getResume(): Promise<StandalonePage> {
  return readPage("resume");
}

export function getDropbox(): Promise<StandalonePage> {
  return readPage("dropbox");
}
