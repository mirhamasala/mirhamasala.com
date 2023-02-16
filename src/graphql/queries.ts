import { request, gql } from "graphql-request";
import { type Category } from "@/graphql/documents";
import config from "@/lib/config";

export async function getCategories() {
  const query = gql`
    query {
      categoriesWithSpots {
        emoji
        label
        slug
        spots {
          description
          googleMapsUrl
          name
          slug
        }
      }
    }
  `;

  const { categoriesWithSpots } = await request<{
    categoriesWithSpots: Category[];
  }>(config.api_path, query);
  return categoriesWithSpots;
}
