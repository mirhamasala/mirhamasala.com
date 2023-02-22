import { request, gql } from "graphql-request";
// import { graphql } from "@/graphql/documents";

export async function getCategories() {
  const query = gql`
    query {
      categories(withSpots: true) {
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

  const { categories } = await request<{
    categories;
  }>("/api/graphql", query);
  return categories;
}
