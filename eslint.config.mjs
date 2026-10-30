import eslintPluginBetterTailwindcss from "eslint-plugin-better-tailwindcss";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  globalIgnores([".next/**", "out/**", "next-env.d.ts"]),
  {
    settings: {
      "better-tailwindcss": {
        entryPoint: "app/globals.css",
        // html { font-size: 100% } keeps the browser default of 16px.
        rootFontSize: 16,
      },
    },
    plugins: {
      "better-tailwindcss": eslintPluginBetterTailwindcss,
    },
    rules: {
      "better-tailwindcss/enforce-canonical-classes": "error",
    },
  },
]);
