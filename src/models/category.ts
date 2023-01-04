export type CategoryName =
  | "coffee"
  | "drinks"
  | "eats"
  | "gourmet-groceries"
  | "meats"
  | "other"
  | "parks"
  | "shops"
  | "sweets"
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
  parks: {
    id: 7,
    emoji: "🌳",
    label: "Parks",
    slug: "parks",
  },
  coffee: {
    id: 1,
    emoji: "☕️",
    label: "Coffee",
    slug: "coffee",
  },
  meats: {
    id: 5,
    emoji: "🥩",
    label: "Meats",
    slug: "meats",
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
  sights: {
    id: 9,
    emoji: "🏛",
    label: "Sights",
    slug: "sights",
  },
  shops: {
    id: 8,
    emoji: "🛍",
    label: "Shops",
    slug: "shops",
  },
  sweets: {
    id: 10,
    emoji: "🍦",
    label: "Sweets",
    slug: "sweets",
  },
  other: {
    id: 6,
    emoji: "🖇",
    label: "Other",
    slug: "other",
  },
};

export const categoryNames = Object.keys(categories) as CategoryName[];
