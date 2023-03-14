import { createSchema, createYoga } from "graphql-yoga";
import { Resolvers } from "@/graphql/documents";
import type { NextApiRequest, NextApiResponse } from "next";

import { categories } from "@/data/categories";
import allSpots from "@/lib/getSpots";

import typeDefs from "schema.graphql";

export const config = {
  api: {
    bodyParser: false,
  },
};

const publishedSpots = (slug: string) =>
  allSpots.filter((spot) => spot.category === slug && spot.published);

const citySpots = (id: string) =>
  allSpots.filter((spot) => spot.city === id && spot.published);

const resolvers: Resolvers = {
  Query: {
    categories: (_, { withSpots }) => {
      if (!withSpots) {
        return categories.map((category) => ({
          ...category,
          spots: [],
        }));
      }

      const categoryIDs = categories
        .map((category) => ({
          ...category,
          spots: publishedSpots(category.slug),
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
    city: (_, { id }) => ({ id, spots: [] }),
  },
  Category: {
    spots: (category) =>
      publishedSpots(category.slug).map((spot) => ({
        ...spot,
        category: category,
        city: { id: spot.city, spots: [] },
      })),
  },
  City: {
    spots: (city) =>
      citySpots(city.id).map((spot) => ({
        ...spot,
        category: {
          ...categories.find((category) => category.slug === spot.category),
          spots: [],
        },
        city: { id: spot.city, spots: [] },
      })),
  },
};

export default createYoga<{
  req: NextApiRequest;
  res: NextApiResponse;
}>({
  schema: createSchema({ typeDefs, resolvers }),
  graphqlEndpoint: "/api/graphql",
});
