import { GraphQLClient } from "graphql-request";
import { getSdk } from "./documents";

export async function getCategories() {
  const client = new GraphQLClient("/api/graphql");
  const sdk = getSdk(client);

  const { categories } = await sdk.GetCategoriesWithSpots();

  return categories;
}
