import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { z } from "zod";

const RECIPES_DIR = path.join(process.cwd(), "content", "recipes");
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

/** Closed set of recipe categories, in index order. */
export const recipeCategories = [
  "Breakfast",
  "Mains",
  "Soups",
  "Sides",
  "Bakes",
  "Desserts",
  "Drinks",
  "Kitchen Basics",
  "Home & Body",
] as const;

const minutesSchema = z.number().int().nonnegative();
const durationSchema = z.union([
  minutesSchema,
  z
    .strictObject({ min: minutesSchema, max: minutesSchema })
    .refine(({ min, max }) => min <= max, {
      message: "Maximum time must be at least the minimum time",
      path: ["max"],
    }),
]);
const waitingTimeSchema = z.union([durationSchema, z.literal("overnight")]);

const frontmatterSchema = z.strictObject({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.iso.date(),
  category: z.enum(recipeCategories),
  serves: z.string().min(1).optional(),
  attribution: z.string().min(1).optional(),
  prepTime: durationSchema.optional(),
  cookTime: durationSchema.optional(),
  restTime: waitingTimeSchema.optional(),
  chillTime: waitingTimeSchema.optional(),
  soakTime: waitingTimeSchema.optional(),
  totalTime: durationSchema.optional(),
  timeNote: z.string().min(1).optional(),
  draft: z.boolean().default(false),
});

export type Recipe = z.infer<typeof frontmatterSchema> & {
  slug: string;
  body: string;
};

type RecipeTime = z.infer<typeof waitingTimeSchema>;

function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return [
    hours ? `${hours} ${hours === 1 ? "hour" : "hours"}` : null,
    remainder || !hours
      ? `${remainder} ${remainder === 1 ? "minute" : "minutes"}`
      : null,
  ]
    .filter(Boolean)
    .join(" ");
}

/** Stored durations are minutes; overnight stays deliberately unquantified. */
export function formatRecipeTime(time: RecipeTime): string {
  if (time === "overnight") return time;
  if (typeof time === "number") return formatMinutes(time);
  if (time.min === time.max) return formatMinutes(time.min);
  if (time.max < 60) return `${time.min} to ${time.max} minutes`;
  if (time.min % 60 === 0 && time.max % 60 === 0) {
    return `${time.min / 60} to ${time.max / 60} hours`;
  }
  return `${formatMinutes(time.min)} to ${formatMinutes(time.max)}`;
}

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

/** Published recipes, newest first. Drafts are never returned. */
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

  return recipes
    .filter((recipe) => !recipe.draft)
    .sort(
      (a, b) =>
        b.date.localeCompare(a.date) || a.title.localeCompare(b.title, "en"),
    );
}

export async function getRecipe(slug: string): Promise<Recipe | undefined> {
  return (await getRecipes()).find((recipe) => recipe.slug === slug);
}
