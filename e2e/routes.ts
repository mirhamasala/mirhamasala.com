import { getBooks } from "@/lib/books";
import { getPosts } from "@/lib/posts";
import { getRecipes } from "@/lib/recipes";
import { site } from "@/lib/site";

export type IndexableRoute = {
  path: string;
  title: string;
  heading: string | RegExp;
  description?: string;
};

/** Every indexable route: the static pages plus every published article. */
export async function getIndexableRoutes(): Promise<IndexableRoute[]> {
  const [posts, recipes, books] = await Promise.all([
    getPosts(),
    getRecipes(),
    getBooks(),
  ]);

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
    {
      path: "/recipes",
      title: `Recipes · ${site.name}`,
      heading: "What I keep making.",
    },
    ...recipes.map((recipe) => ({
      path: `/recipes/${recipe.slug}`,
      title: `${recipe.title} · ${site.name}`,
      heading: recipe.title,
      description: recipe.description,
    })),
    {
      path: "/books",
      title: `Books · ${site.name}`,
      heading: "What I wanted to keep.",
    },
    ...books.map((book) => ({
      path: `/books/${book.slug}`,
      title: `${book.title} · ${site.name}`,
      heading: book.title,
      description: book.description,
    })),
  ];
}

export function absoluteUrl(path: string, baseURL: string | undefined) {
  if (!baseURL) throw new Error("Playwright baseURL is not configured");
  return new URL(path, baseURL).href;
}
