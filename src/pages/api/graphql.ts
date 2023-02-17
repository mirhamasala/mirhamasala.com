import { createSchema, createYoga } from "graphql-yoga";
import { Resolvers } from "@/graphql/documents";
import type { NextApiRequest, NextApiResponse } from "next";

import { categories } from "@/data/categories";
import { spots } from "@/data/spots/amsterdam";
import appConfig from "@/lib/config";

import typeDefs from "schema.graphql";

export const config = {
  api: {
    bodyParser: false,
  },
};

const getCategoriesWithSpots = (slug: string) =>
  spots.filter((spot) => spot.category === slug);

const resolvers: Resolvers = {
  Query: {
    categories: () =>
      categories.map((category) => ({
        ...category,
        spots: [],
      })),
    categoriesWithSpots: () => {
      const categoryIDs = categories
        .map((category) => ({
          ...category,
          spots: getCategoriesWithSpots(category.slug),
        }))
        .filter((category) => category.spots.length)
        .map((category) => category.slug);

      return categories
        .map((category) => ({
          ...category,
          spots: [],
        }))
        .filter((category) => categoryIDs.includes(category.slug));
    },
  },
  Category: {
    spots: (category) =>
      getCategoriesWithSpots(category.slug).map((spot) => ({
        ...spot,
        category: category,
      })),
  },
};

export default createYoga<{
  req: NextApiRequest;
  res: NextApiResponse;
}>({
  schema: createSchema({ typeDefs, resolvers }),
  graphqlEndpoint: appConfig.api_path,
});
