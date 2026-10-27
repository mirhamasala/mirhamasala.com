import type { NextConfig } from "next";
import { legacyRedirects } from "./lib/redirects";

const nextConfig: NextConfig = {
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
