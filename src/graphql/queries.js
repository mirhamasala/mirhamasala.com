import { request, gql } from "graphql-request";

const GRAPHQL_ENDPOINT = "http://localhost:3000/api/graphql";

export async function getCategories() {
  const query = gql`
    query {
      categories(hasSpots: true) {
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
  const { categories } = await request(GRAPHQL_ENDPOINT, query);
  return categories;
}
