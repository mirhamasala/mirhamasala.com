import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "schema.graphql",
  documents: "src/**/*.graphql",
  generates: {
    "./src/graphql/documents.ts": {
      config: {
        preset: "client",
      },
      plugins: [
        "typescript",
        "typescript-graphql-request",
        "typescript-operations",
        "typescript-resolvers",
      ],
    },
  },
};
export default config;
