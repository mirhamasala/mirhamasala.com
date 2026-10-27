import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { z } from "zod";

const TRAVEL_STORIES_DIR = path.join(
  process.cwd(),
  "content",
  "travel-stories",
);
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

/** Index order. Cities are the headings the old page used. */
export const travelPlaces = [
  {
    country: "Australia",
    id: "australia",
    cities: [{ city: "Sydney", id: "sydney" }],
  },
  {
    country: "Bosnia and Herzegovina",
    id: "bosnia-and-herzegovina",
    cities: [{ city: "Sarajevo", id: "sarajevo" }],
  },
  {
    country: "Sri Lanka",
    id: "sri-lanka",
    cities: [{ city: "Colombo", id: "colombo" }],
  },
  {
    country: "Israel",
    id: "israel",
    cities: [{ city: "Tel Aviv", id: "tel-aviv" }],
  },
  {
    country: "Japan",
    id: "japan",
    cities: [{ city: "Tokyo", id: "tokyo" }],
  },
] as const;

export type TravelCountry = (typeof travelPlaces)[number]["country"];
export type TravelCity =
  (typeof travelPlaces)[number]["cities"][number]["city"];

const travelCountries = travelPlaces.map((place) => place.country) as [
  TravelCountry,
  ...TravelCountry[],
];

const travelCities = [
  ...new Set(
    travelPlaces.flatMap((place) => place.cities.map((city) => city.city)),
  ),
] as [TravelCity, ...TravelCity[]];

const citiesByCountry = {
  Australia: ["Sydney"],
  "Bosnia and Herzegovina": ["Sarajevo"],
  "Sri Lanka": ["Colombo"],
  Israel: ["Tel Aviv"],
  Japan: ["Tokyo"],
} as const satisfies Record<TravelCountry, readonly TravelCity[]>;

const frontmatterSchema = z
  .strictObject({
    number: z.number().int().positive(),
    country: z.enum(travelCountries),
    city: z.enum(travelCities).optional(),
    location: z.string().min(1),
    date: z.iso.date(),
    instagram: z.url(),
    description: z.string().min(1),
  })
  .superRefine((story, ctx) => {
    if (!story.city) return;
    const allowed: readonly TravelCity[] = citiesByCountry[story.country];
    if (allowed.includes(story.city)) return;
    ctx.addIssue({
      code: "custom",
      path: ["city"],
      message: `${story.city} is not a city in ${story.country}`,
    });
  });

export type TravelStory = z.infer<typeof frontmatterSchema> & {
  slug: string;
  body: string;
};

function parseTravelStory(slug: string, source: string): TravelStory {
  const file = `content/travel-stories/${slug}.md`;
  const match = FRONTMATTER.exec(source);
  if (!match) throw new Error(`${file}: missing YAML frontmatter`);

  const result = frontmatterSchema.safeParse(parseYaml(match[1]));
  if (!result.success) {
    throw new Error(
      `${file}: invalid frontmatter\n${z.prettifyError(result.error)}`,
    );
  }

  if (slug !== String(result.data.number)) {
    throw new Error(
      `${file}: filename ${slug} does not match number ${result.data.number}`,
    );
  }

  return { ...result.data, slug, body: source.slice(match[0].length) };
}

/** All travel stories. Group and sort them with `storiesInPlace`. */
export async function getTravelStories(): Promise<TravelStory[]> {
  const files = (await readdir(TRAVEL_STORIES_DIR)).filter((file) =>
    file.endsWith(".md"),
  );

  const stories = await Promise.all(
    files.map(async (file) => {
      const slug = file.slice(0, -".md".length);
      return parseTravelStory(
        slug,
        await readFile(path.join(TRAVEL_STORIES_DIR, file), "utf8"),
      );
    }),
  );

  const numbers = new Set<number>();
  for (const story of stories) {
    if (numbers.has(story.number)) {
      throw new Error(`duplicate travel story number ${story.number}`);
    }
    numbers.add(story.number);
  }

  return stories;
}

export async function getTravelStory(
  slug: string,
): Promise<TravelStory | undefined> {
  return (await getTravelStories()).find((story) => story.slug === slug);
}

/**
 * Stories for a country, or for one of its cities.
 * Newest date first, then higher number, which is the old page's order.
 */
export function storiesInPlace(
  stories: TravelStory[],
  country: TravelCountry,
  city?: TravelCity,
): TravelStory[] {
  return stories
    .filter((story) =>
      city
        ? story.country === country && story.city === city
        : story.country === country && story.city === undefined,
    )
    .sort((a, b) => b.date.localeCompare(a.date) || b.number - a.number);
}
