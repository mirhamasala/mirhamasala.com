import { categories, categoriesOrder } from "@/data/categories";
import { PublishedSpotWithCategoryAndCity } from "@/types/spots.type";

interface CategoryMap {
  [key: string]: {
    emoji: string;
    label: string;
    slug: string;
    spots: PublishedSpotWithCategoryAndCity[];
  };
}

function addSpotToCategory(
  spot: PublishedSpotWithCategoryAndCity,
  categoriesWithSpots: CategoryMap
) {
  const { slug, ...categoryDetails } = spot.category;
  const category = categories.find((cat) => cat.slug === slug);

  if (!categoriesWithSpots[slug]) {
    categoriesWithSpots[slug] = {
      ...category!,
      spots: [],
    };
  }

  categoriesWithSpots[slug].spots.push({
    ...categoryDetails,
    ...spot,
  });
}

function filterAndOrderCategories(categoriesWithSpots: CategoryMap) {
  return categoriesOrder
    .filter(
      (slug) =>
        categoriesWithSpots[slug] && categoriesWithSpots[slug].spots.length > 0
    )
    .map((slug) => categoriesWithSpots[slug]);
}

export function groupSpotsByCategory(
  spots: PublishedSpotWithCategoryAndCity[]
) {
  const categoriesWithSpots: CategoryMap = {};

  spots.forEach((spot) => addSpotToCategory(spot, categoriesWithSpots));

  return filterAndOrderCategories(categoriesWithSpots);
}
