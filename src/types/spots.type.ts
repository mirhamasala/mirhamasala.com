import { Category } from "@/data/categories";
import { CityID, City } from "@/data/cities";

export type Spot = {
  category: string;
  city: CityID;
  belongsTo?: CityID;
  description?: string;
  geo?: {
    latitude: number;
    longitude: number;
  };
  googleMapsUrl?: string;
  name: string;
  published: boolean;
  slug: string;
  url?: string;
};

export type PublishedSpotWithCategoryAndCity = Omit<
  Spot,
  "category" | "city"
> & {
  category: Category;
  city: City;
};
