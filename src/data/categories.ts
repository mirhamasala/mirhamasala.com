const baseMarkerPath = "/markers/";

type CategorySlug =
  | "parks"
  | "coffee"
  | "meats"
  | "eats"
  | "drinks"
  | "gourmet-groceries"
  | "sights"
  | "shops"
  | "sweets"
  | "other";

export interface Category {
  emoji: string;
  label: string;
  marker: string;
  slug: CategorySlug;
}

export const categoriesOrder: CategorySlug[] = [
  "parks",
  "coffee",
  "meats",
  "eats",
  "drinks",
  "gourmet-groceries",
  "sights",
  "shops",
  "sweets",
  "other",
];

export const categories: Category[] = [
  {
    emoji: "🌳",
    label: "Parks",
    marker: `${baseMarkerPath}tree.svg`,
    slug: "parks",
  },
  {
    emoji: "☕️",
    label: "Coffee",
    marker: `${baseMarkerPath}coffee.svg`,
    slug: "coffee",
  },
  {
    emoji: "🥩",
    label: "Meats",
    marker: `${baseMarkerPath}steak.svg`,
    slug: "meats",
  },
  {
    emoji: "🌮",
    label: "Eats",
    marker: `${baseMarkerPath}taco.svg`,
    slug: "eats",
  },
  {
    emoji: "🍸",
    label: "Drinks",
    marker: `${baseMarkerPath}martini-glass.svg`,
    slug: "drinks",
  },
  {
    emoji: "🍯",
    label: "Gourmet Groceries",
    marker: `${baseMarkerPath}honey-pot.svg`,
    slug: "gourmet-groceries",
  },
  {
    emoji: "🏛",
    label: "Sights",
    marker: `${baseMarkerPath}classical-building.svg`,
    slug: "sights",
  },
  {
    emoji: "🛍",
    label: "Shops",
    marker: `${baseMarkerPath}shopping-bags.svg`,
    slug: "shops",
  },
  {
    emoji: "🍦",
    label: "Sweets",
    marker: `${baseMarkerPath}ice-cream.svg`,
    slug: "sweets",
  },
  {
    emoji: "🖇",
    label: "Other",
    marker: `${baseMarkerPath}paperclips.svg`,
    slug: "other",
  },
];
