import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/posts";
import { getRecipes } from "@/lib/recipes";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, recipes] = await Promise.all([getPosts(), getRecipes()]);

  return [
    { url: absoluteUrl("/") },
    { url: absoluteUrl("/about") },
    { url: absoluteUrl("/posts") },
    ...posts.map((post) => ({
      url: absoluteUrl(`/posts/${post.slug}`),
      lastModified: post.date,
    })),
    { url: absoluteUrl("/recipes") },
    ...recipes.map((recipe) => ({
      url: absoluteUrl(`/recipes/${recipe.slug}`),
      lastModified: recipe.date,
    })),
  ];
}
