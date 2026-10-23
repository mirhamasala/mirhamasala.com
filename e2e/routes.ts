import { getPosts } from "@/lib/posts";
import { site } from "@/lib/site";

export type IndexableRoute = {
  path: string;
  title: string;
  heading: string | RegExp;
  description?: string;
};

/** Every indexable route: the static pages plus every published article. */
export async function getIndexableRoutes(): Promise<IndexableRoute[]> {
  const posts = await getPosts();

  return [
    { path: "/", title: site.name, heading: site.name },
    {
      path: "/about",
      title: `About · ${site.name}`,
      heading: /Hi, I’m Mirha\./,
    },
    { path: "/posts", title: `Writing · ${site.name}`, heading: "Writing" },
    ...posts.map((post) => ({
      path: `/posts/${post.slug}`,
      title: `${post.title} · ${site.name}`,
      heading: post.title,
      description: post.description,
    })),
  ];
}

export function absoluteUrl(path: string, baseURL: string | undefined) {
  if (!baseURL) throw new Error("Playwright baseURL is not configured");
  return new URL(path, baseURL).href;
}
