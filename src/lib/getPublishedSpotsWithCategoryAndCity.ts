import { categories } from "@/data/categories";
import { cities } from "@/data/cities";
import { Spot, PublishedSpotWithCategoryAndCity } from "@/types/spots.type";

const getPublishedSpotsWithCategoryAndCity = (
  spots: Spot[]
): PublishedSpotWithCategoryAndCity[] => {
  const publishedSpots = spots.filter((spot) => spot.published);

  const PublishedSpotWithCategoryAndCity = publishedSpots.map((spot) => {
    const category = categories.find((cat) => cat.slug === spot.category);
    const city = cities.find((city) => city.id === spot.city);

    if (!category) {
      throw new Error(`Category not found for spot with slug '${spot.slug}'`);
    }

    if (!city) {
      throw new Error(`City not found for spot with slug '${spot.slug}'`);
    }

    return {
      ...spot,
      category,
      city,
    };
  });

  return PublishedSpotWithCategoryAndCity;
};

export { getPublishedSpotsWithCategoryAndCity };
