import { createYoga } from "graphql-yoga";
import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import type { NextApiRequest, NextApiResponse } from "next";

import { spots } from "@/data/amsterdam";

export const config = {
  api: {
    bodyParser: false,
  },
};

let geoType = new GraphQLObjectType({
  name: "Geo",
  fields: () => ({
    latitude: { type: GraphQLFloat },
    longitude: { type: GraphQLFloat },
  }),
});

let spotType = new GraphQLObjectType({
  name: "Spot",
  fields: () => ({
    category: { type: GraphQLString },
    description: { type: GraphQLString },
    geo: { type: geoType },
    googleMapsUrl: { type: GraphQLString },
    hasMarkdown: { type: GraphQLBoolean },
    name: { type: GraphQLString },
    published: { type: GraphQLBoolean },
    slug: { type: GraphQLString },
    url: { type: GraphQLString },
  }),
});

let schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
      spots: {
        type: new GraphQLList(spotType),
        resolve() {
          return spots;
        },
      },
    },
  }),
});

export default createYoga<{
  req: NextApiRequest;
  res: NextApiResponse;
}>({
  graphqlEndpoint: "/api/graphql",
  schema,
});
