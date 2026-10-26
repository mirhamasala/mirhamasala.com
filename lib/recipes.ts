import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { z } from "zod";

const RECIPES_DIR = path.join(process.cwd(), "content", "recipes");
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

const frontmatterSchema = z.strictObject({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.iso.date(),
  serves: z.string().min(1).optional(),
  time: z.string().min(1).optional(),
});

export type Recipe = z.infer<typeof frontmatterSchema> & {
  slug: string;
  body: string;
};

function parseRecipe(slug: string, source: string): Recipe {
  const file = `content/recipes/${slug}.md`;
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

/** All recipes, newest first. */
export async function getRecipes(): Promise<Recipe[]> {
  const files = (await readdir(RECIPES_DIR)).filter((file) =>
    file.endsWith(".md"),
  );

  const recipes = await Promise.all(
    files.map(async (file) => {
      const slug = file.slice(0, -".md".length);
      return parseRecipe(
        slug,
        await readFile(path.join(RECIPES_DIR, file), "utf8"),
      );
    }),
  );

  return recipes.sort(
    (a, b) =>
      b.date.localeCompare(a.date) || a.title.localeCompare(b.title, "en"),
  );
}

export async function getRecipe(slug: string): Promise<Recipe | undefined> {
  return (await getRecipes()).find((recipe) => recipe.slug === slug);
}
