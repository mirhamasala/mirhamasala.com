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

const emptySpots = [
  {
    category: "parks",
    description:
      "G and I only recently stumbled into these community gardens. They're cute. And just next to the Westerpark.",
    geo: {
      latitude: 52.38752,
      longitude: 4.85745,
    },
    googleMapsUrl: "https://goo.gl/maps/A4kkrcMkuFKjRfzp7",
    hasMarkdown: true,
    name: "Tuinpark Nut & Genoegen",
    published: true,
    slug: "tuinpark-nut-en-genoegen",
    url: "http://www.nutengenoegen.amsterdam/",
  },
  {
    category: "parks",
    description: "",
    geo: {
      latitude: 52.35799,
      longitude: 4.86864,
    },
    googleMapsUrl: "https://www.google.com/maps?cid=7842025157712464437",
    hasMarkdown: false,
    name: "Vondelpark",
    published: false,
    slug: "vondelpark",
    url: "https://www.hetvondelpark.net/",
  },
];

const resolvers: Resolvers = {
  Query: {
    categories: () => {
      return categories.map((category) => {
        return {
          ...category,
          spots: [],
        };
      });
    },
  },
  Category: {
    spots: (category) => {
      const categoriesWithSpots = emptySpots.filter(
        (spot) => spot.category === category.slug
      );

      return categoriesWithSpots.map((spot) => {
        return {
          ...spot,
          category: category,
        };
      });
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
