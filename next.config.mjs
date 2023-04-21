import nextMDX from "@next/mdx";
import remarkGfm from "remark-gfm";
import rehypePrism from "@mapbox/rehype-prism";
import rehypeSlug from "rehype-slug";
import redirects from "./src/lib/redirects.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    newNextLinkBehavior: true,
    scrollRestoration: true,
  },
  async redirects() {
    return redirects;
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: "graphql-tag/loader",
    });
    return config;
  },
};

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypePrism, rehypeSlug],
    remarkRehypeOptions: {
      footnoteLabel: "Notes",
      footnoteLabelTagName: "h2",
    },
    providerImportSource: "@mdx-js/react",
  },
});

export default withMDX(nextConfig);
