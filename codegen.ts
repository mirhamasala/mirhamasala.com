import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "schema.graphql",
  documents: ["src/**/*.{ts,tsx}"],
  generates: {
    "./src/graphql/documents.ts": {
      config: {
        preset: "client",
      },
      plugins: [
        "cli",
        "client-preset",
        "typescript-operations",
        "typescript-resolvers",
        "typescript",
      ],
    },
  },
};
export default config;
