import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { z } from "zod";

const PLACES_DIR = path.join(process.cwd(), "content", "places");
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

/** Map order, then the order of each city's notes. */
export const placeCities = [
  {
    id: "amsterdam",
    label: "Amsterdam",
    latitude: 52.3676,
    longitude: 4.9041,
    essay: {
      href: "/posts/all-my-amsterdam-memories-gather-round-food",
      title: "All My Amsterdam Memories Gather Round Food",
    },
  },
  {
    id: "barcelona",
    label: "Barcelona",
    latitude: 41.3851,
    longitude: 2.1734,
  },
  {
    id: "ericeira",
    label: "Ericeira",
    latitude: 38.96685758,
    longitude: -9.406102315,
  },
  {
    id: "madrid",
    label: "Madrid",
    latitude: 40.4167754,
    longitude: -3.7037902,
  },
  {
    id: "melbourne",
    label: "Melbourne",
    latitude: -37.8136,
    longitude: 144.9631,
  },
  {
    id: "sarajevo",
    label: "Sarajevo",
    latitude: 43.8563,
    longitude: 18.4131,
  },
  {
    id: "singapore",
    label: "Singapore",
    latitude: 1.286022977,
    longitude: 103.85721528,
    essay: {
      href: "/posts/goodbye-little-red-dot",
      title: "Goodbye, Little Red Dot",
    },
  },
  {
    id: "tel-aviv",
    label: "Tel Aviv",
    latitude: 32.0853,
    longitude: 34.7818,
  },
] as const;

/** Category order within a city. Emoji is the map pin. */
export const placeCategories = [
  { label: "Parks", emoji: "🌳" },
  { label: "Coffee", emoji: "☕️" },
  { label: "Meats", emoji: "🥩" },
  { label: "Eats", emoji: "🌮" },
  { label: "Drinks", emoji: "🍸" },
  { label: "Gourmet Groceries", emoji: "🍯" },
  { label: "Sights", emoji: "🏛" },
  { label: "Shops", emoji: "🛍" },
  { label: "Sweets", emoji: "🍦" },
  { label: "Other", emoji: "🖇" },
] as const;

export type PlaceCity = (typeof placeCities)[number];
export type PlaceCityId = PlaceCity["id"];
export type PlaceCategory = (typeof placeCategories)[number]["label"];

const placeCityLabels = placeCities.map((city) => city.label) as [
  PlaceCity["label"],
  ...PlaceCity["label"][],
];
const placeCategoryLabels = placeCategories.map(
  (category) => category.label,
) as [PlaceCategory, ...PlaceCategory[]];

const frontmatterSchema = z.strictObject({
  title: z.string().min(1),
  city: z.enum(placeCityLabels),
  category: z.enum(placeCategoryLabels),
  locality: z.string().min(1).optional(),
  url: z.url().optional(),
  map: z.url().optional(),
  latitude: z.number().gte(-90).lte(90).optional(),
  longitude: z.number().gte(-180).lte(180).optional(),
  draft: z.boolean().default(false),
});

export type Place = z.infer<typeof frontmatterSchema> & {
  slug: string;
  body: string;
  cityId: PlaceCityId;
};

function cityByLabel(label: PlaceCity["label"]): PlaceCity {
  const city = placeCities.find((item) => item.label === label);
  if (!city) throw new Error(`unknown city ${label}`);
  return city;
}

export function categoryEmoji(label: PlaceCategory): string {
  const category = placeCategories.find((item) => item.label === label);
  if (!category) throw new Error(`unknown category ${label}`);
  return category.emoji;
}

function parsePlace(file: string, slug: string, source: string): Place {
  const match = FRONTMATTER.exec(source);
  if (!match) throw new Error(`${file}: missing YAML frontmatter`);

  const result = frontmatterSchema.safeParse(parseYaml(match[1]));
  if (!result.success) {
    throw new Error(
      `${file}: invalid frontmatter\n${z.prettifyError(result.error)}`,
    );
  }

  const { latitude, longitude } = result.data;
  if ((latitude === undefined) !== (longitude === undefined)) {
    throw new Error(`${file}: latitude and longitude must both be set`);
  }

  return {
    ...result.data,
    slug,
    body: source.slice(match[0].length).trim(),
    cityId: cityByLabel(result.data.city).id,
  };
}

function cityIndex(id: PlaceCityId): number {
  return placeCities.findIndex((city) => city.id === id);
}

function categoryIndex(label: PlaceCategory): number {
  return placeCategories.findIndex((category) => category.label === label);
}

/** Published spots. Drafts stay in the files and off the page. */
export async function getPlaces(): Promise<Place[]> {
  const entries = await readdir(PLACES_DIR, { withFileTypes: true });
  const found: { cityId: PlaceCityId; slug: string; fullPath: string }[] = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    if (!entry.isDirectory()) {
      throw new Error(
        `content/places/${entry.name}: spots live in a city folder`,
      );
    }

    const city = placeCities.find((item) => item.id === entry.name);
    if (!city) {
      throw new Error(`content/places/${entry.name}: unknown city folder`);
    }

    const cityDir = path.join(PLACES_DIR, entry.name);
    for (const file of await readdir(cityDir)) {
      if (file.startsWith(".")) continue;
      if (!file.endsWith(".md")) {
        throw new Error(
          `content/places/${entry.name}/${file}: expected a Markdown spot`,
        );
      }
      found.push({
        cityId: city.id,
        slug: file.slice(0, -".md".length),
        fullPath: path.join(cityDir, file),
      });
    }
  }

  const places = await Promise.all(
    found.map(async ({ cityId, slug, fullPath }) => {
      const place = parsePlace(
        `content/places/${cityId}/${slug}.md`,
        slug,
        await readFile(fullPath, "utf8"),
      );
      if (place.cityId !== cityId) {
        throw new Error(
          `content/places/${cityId}/${slug}.md: city is ${place.city}, so the file belongs in content/places/${place.cityId}/`,
        );
      }
      return place;
    }),
  );

  const slugs = new Map<string, string>();
  for (const place of places) {
    const existing = slugs.get(place.slug);
    if (existing) {
      throw new Error(
        `content/places: ${place.slug} is in both ${existing} and ${place.cityId}`,
      );
    }
    slugs.set(place.slug, place.cityId);
  }

  return places
    .filter((place) => !place.draft)
    .sort(
      (a, b) =>
        cityIndex(a.cityId) - cityIndex(b.cityId) ||
        categoryIndex(a.category) - categoryIndex(b.category) ||
        a.title.localeCompare(b.title, "en", { sensitivity: "base" }),
    );
}
