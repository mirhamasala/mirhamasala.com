import { request, gql } from "graphql-request";

export async function getCategoriesWithSpots() {
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
  const { categories } = await request(process.env.NEXT_PUBLIC_API_URL, query);
  return categories;
}
