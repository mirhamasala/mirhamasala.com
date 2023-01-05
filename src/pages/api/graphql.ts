import { createSchema, createYoga } from "graphql-yoga";

import { categories } from "@/data/categories";
import { spots } from "@/data/spots/amsterdam";

export const config = {
  api: {
    bodyParser: false,
  },
};

const typeDefs = `
  type Category {
    emoji: String!
    label: String!
    slug: String!
    spots: [Spot!]!
  }

  type Geo {
    latitude: Float!
    longitude: Float!
  }

  type Spot {
    category: Category!
    description: String!
    geo: Geo!
    googleMapsUrl: String!
    hasMarkdown: Boolean!
    name: String!
    published: Boolean!
    slug: String!
    url: String!
  }

  type Query {
    categories: [Category!]!
    spots: [Spot!]!
  }
`;

const resolvers = {
  Query: {
    categories: () => categories,
    spots: () => spots,
  },
  Category: {
    spots: (category) =>
      spots.filter((spot) => spot.category === category.slug && spot.published),
  },
  Spot: {
    category: (spot) =>
      categories.find((category) => category.slug === spot.category),
  },
};

const schema = createSchema({ typeDefs, resolvers });

export default createYoga({
  graphqlEndpoint: "/api/graphql",
  schema,
});
