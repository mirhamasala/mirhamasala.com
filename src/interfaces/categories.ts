export type CategoryName =
  | "coffee"
  | "eats"
  | "drinks"
  | "gourmet-groceries"
  | "meats"
  | "other"
  | "parks"
  | "shops"
  | "sights";

type Category = {
  [key in CategoryName]: {
    id: number;
    emoji: string;
    label: string;
    slug: string;
  };
};

export const categories: Category = {
  coffee: {
    id: 1,
    emoji: "☕️",
    label: "Coffee",
    slug: "coffee",
  },
  eats: {
    id: 2,
    emoji: "🌮",
    label: "Eats",
    slug: "eats",
  },
  drinks: {
    id: 3,
    emoji: "🍸",
    label: "Drinks",
    slug: "drinks",
  },
  "gourmet-groceries": {
    id: 4,
    emoji: "🍯",
    label: "Gourmet Groceries",
    slug: "gourmet-groceries",
  },
  meats: {
    id: 5,
    emoji: "🥩",
    label: "Meats",
    slug: "meats",
  },
  other: {
    id: 6,
    emoji: "🖇",
    label: "Other",
    slug: "other",
  },
  parks: {
    id: 7,
    emoji: "🌳",
    label: "Parks",
    slug: "parks",
  },
  shops: {
    id: 8,
    emoji: "🛍",
    label: "Shops",
    slug: "shops",
  },
  sights: {
    id: 9,
    emoji: "🏛",
    label: "Sights",
    slug: "sights",
  },
};

export const categoryNames = Object.keys(categories) as CategoryName[];
