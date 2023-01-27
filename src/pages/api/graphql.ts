import { createSchema, createYoga } from "graphql-yoga";
import { readFileSync } from "node:fs";
import { Resolvers } from "@/graphql/documents";
import type { NextApiRequest, NextApiResponse } from "next";

import { categories } from "@/data/categories";
import { spots } from "@/data/spots/amsterdam";
const typeDefs = readFileSync("./schema.graphql", "utf8");

export const config = {
  api: {
    bodyParser: false,
  },
};

const resolvers: Resolvers = {
  Query: {
    categories(_obj, { hasSpots }) {
      if (!hasSpots) {
        return categories;
      }

      return categories.reduce((categoriesWithSpots, category) => {
        let categorySpots = spots.filter(
          (spot) => spot.category === category.slug && spot.published
        );

        if (categorySpots.length) {
          categoriesWithSpots.push({ ...category, spots: categorySpots });
        }

        return categoriesWithSpots;
      }, []);
    },
  },
};

export default createYoga<{
  req: NextApiRequest;
  res: NextApiResponse;
}>({
  schema: createSchema({ typeDefs, resolvers }),
  graphqlEndpoint: "/api/graphql",
});
