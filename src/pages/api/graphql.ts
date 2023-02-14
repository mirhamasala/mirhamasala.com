import { createSchema, createYoga } from "graphql-yoga";
import { readFileSync } from "node:fs";
import path from "path";
import { Resolvers } from "@/graphql/documents";
import type { NextApiRequest, NextApiResponse } from "next";

import { categories } from "@/data/categories";
import { spots } from "@/data/spots/amsterdam";

const typeDefsPath = path.join(process.cwd(), "schema.graphql");
const typeDefs = readFileSync(typeDefsPath, "utf8");

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
  graphqlEndpoint: process.env.NEXT_PUBLIC_API_URL,
});
