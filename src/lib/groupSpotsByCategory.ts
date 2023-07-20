import { categories } from "@/data/categories";
import { PublishedSpotWithCategoryAndCity } from "@/types/spots.type";

interface CategoryMap {
  [key: string]: {
    emoji: string;
    label: string;
    slug: string;
    spots: PublishedSpotWithCategoryAndCity[];
  };
}

export function groupSpotsByCategory(
  spots: PublishedSpotWithCategoryAndCity[]
) {
  const categoriesWithSpots: CategoryMap = {};

  spots.forEach((spot) => {
    const { slug, ...categoryDetails } = spot.category;

    if (!categoriesWithSpots[slug]) {
      const category = categories.find((cat) => cat.slug === slug);
      categoriesWithSpots[slug] = {
        ...category!,
        spots: [],
      };
    }

    categoriesWithSpots[slug].spots.push({
      ...categoryDetails,
      ...spot,
    });
  });

  return categoriesWithSpots;
}
