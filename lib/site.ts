const vercelEnv = process.env.VERCEL_ENV;

if (vercelEnv === "production" && !process.env.SITE_URL) {
  throw new Error("SITE_URL must be set for production builds");
}

export const site = {
  name: "Mirha Masala",
  url: new URL(process.env.SITE_URL ?? "http://localhost:3000").origin,
  /** Vercel preview and development deployments must never be indexed. */
  isIndexable: !vercelEnv || vercelEnv === "production",
  since: 2012,
  nav: [
    { href: "/posts", label: "Writing" },
    { href: "/about", label: "About" },
  ],
  collections: [
    { href: "/books", label: "Books" },
    { href: "/recipes", label: "Recipes" },
    { href: "/places", label: "Places" },
  ],
  archive: [
    { href: "/tsop", label: "The Spin-Off Project" },
    { href: "/travel-archives", label: "Travel Stories" },
    { href: "/letters", label: "Letters" },
  ],
  profiles: [
    { href: "https://github.com/mirhamasala", label: "GitHub" },
    { href: "https://www.linkedin.com/in/mirhamasala", label: "LinkedIn" },
    { href: "https://www.instagram.com/mirhamasala", label: "Instagram" },
  ],
} as const;

/** Absolute URL for a site path, resolved against `SITE_URL`. */
export function absoluteUrl(path: string): string {
  return new URL(path, site.url).href;
}
