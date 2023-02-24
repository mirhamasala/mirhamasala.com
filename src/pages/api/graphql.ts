import { createSchema, createYoga } from "graphql-yoga";
import { Resolvers } from "@/graphql/documents";
import type { NextApiRequest, NextApiResponse } from "next";

import { categories } from "@/data/categories";
import importSpots, { allSpots } from "@/lib/importSpots";

import typeDefs from "schema.graphql";

export const config = {
  api: {
    bodyParser: false,
  },
};

const publishedSpots = (slug: string, city: string) => {
  if (!city) {
    allSpots.filter((spot) => spot.category === slug && spot.published);
  }
  return importSpots(city).filter(
    (spot) => spot.category === slug && spot.published
  );
};

const resolvers: Resolvers = {
  Query: {
    categories(_parent, { withSpots, city }) {
      city = city;

      if (!withSpots) {
        return categories.map((category) => ({
          ...category,
          spots: [],
        }));
      }

      const categoryIDs = categories
        .map((category) => ({
          ...category,
          spots: publishedSpots(category.slug, city),
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
    spots: (category, __, ___, info) =>
      publishedSpots(category.slug, info.variableValues.city as string),
  },
};

export default createYoga<{
  req: NextApiRequest;
  res: NextApiResponse;
}>({
  schema: createSchema({ typeDefs, resolvers }),
  graphqlEndpoint: "/api/graphql",
});
