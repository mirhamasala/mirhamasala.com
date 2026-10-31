import type { NextConfig } from "next";
import { legacyRedirects } from "./lib/redirects";

const nextConfig: NextConfig = {
  // pdfkit loads its standard-font data from Node. Bundling those files breaks.
  serverExternalPackages: ["pdfkit"],
  async redirects() {
    return [
      ...legacyRedirects.map((redirect) => ({
        ...redirect,
        permanent: true,
      })),
      {
        source: "/pages/tsop/:path*",
        destination: "/tsop/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
