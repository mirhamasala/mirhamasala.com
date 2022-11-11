import { type CategoryName } from "./category";

export interface Spot {
  category: CategoryName;
  description: string;
  geo: {
    latitude: number;
    longitude: number;
  };
  googleMapsUrl: string;
  hasMarkdown?: boolean;
  name: string;
  published: boolean;
  slug: string;
  url?: string;
}
