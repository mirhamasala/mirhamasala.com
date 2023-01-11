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
    spots: [Spot!]
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
    categories(hasSpots: Boolean): [Category!]!
    spots: [Spot!]!
  }
`;

const resolvers = {
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
    spots: () => spots,
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
