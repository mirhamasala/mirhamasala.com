import type { MetadataRoute } from "next";
import { getBooks } from "@/lib/books";
import { getLetters } from "@/lib/letters";
import { getTsopPages, getTsopPosts } from "@/lib/tsop";
import { getPosts } from "@/lib/posts";
import { getRecipes } from "@/lib/recipes";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, recipes, books, letters, tsopPosts, tsopPages] =
    await Promise.all([
      getPosts(),
      getRecipes(),
      getBooks(),
      getLetters(),
      getTsopPosts(),
      getTsopPages(),
    ]);

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
    { url: absoluteUrl("/books") },
    ...books.map((book) => ({
      url: absoluteUrl(`/books/${book.slug}`),
    })),
    { url: absoluteUrl("/archive") },
    { url: absoluteUrl("/letters") },
    ...letters.map((letter) => ({
      url: absoluteUrl(`/letters/${letter.slug}`),
      lastModified: letter.date,
    })),
    { url: absoluteUrl("/tsop") },
    ...tsopPosts.map((post) => ({
      url: absoluteUrl(`/tsop/posts/${post.slug}`),
      lastModified: post.date,
    })),
    ...tsopPages.map((page) => ({
      url: absoluteUrl(`/tsop/${page.slug}`),
      lastModified: page.date,
    })),
  ];
}
