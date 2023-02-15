import { createSchema, createYoga } from "graphql-yoga";
import { Resolvers } from "@/graphql/documents";
import type { NextApiRequest, NextApiResponse } from "next";
import { type Category } from "@/graphql/documents";
import appConfig from "@/lib/config";

import { categories } from "@/data/categories";
import { spots } from "@/data/spots/amsterdam";
import typeDefs from "schema.graphql";

export const config = {
  api: {
    bodyParser: false,
  },
};

const resolvers: Resolvers = {
  Query: {
    categoriesWithSpots() {
      return categories.reduce((categoriesWithSpots, category) => {
        let categorySpots = spots
          .filter((spot) => spot.category === category.slug && spot.published)
          .map((spot) => ({
            ...spot,
            category,
          }));

        if (categorySpots.length) {
          categoriesWithSpots.push({ ...category, spots: categorySpots });
        }

        return categoriesWithSpots;
      }, [] as Category[]);
    },
  },
};


export default createYoga<{
  req: NextApiRequest;
  res: NextApiResponse;
}>({
  schema: createSchema({ typeDefs, resolvers }),
  graphqlEndpoint: appConfig.api_path,
});
