import type { MetadataRoute } from "next";
import { getBooks } from "@/lib/books";
import { getLetters } from "@/lib/letters";
import { getPosts } from "@/lib/posts";
import { getRecipes } from "@/lib/recipes";
import { getTravelStories } from "@/lib/travel-stories";
import { getTsopPages, getTsopPosts } from "@/lib/tsop";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, recipes, books, letters, stories, tsopPosts, tsopPages] =
    await Promise.all([
      getPosts(),
      getRecipes(),
      getBooks(),
      getLetters(),
      getTravelStories(),
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
    { url: absoluteUrl("/travel-stories") },
    ...stories.map((story) => ({
      url: absoluteUrl(`/travel-stories/${story.slug}`),
      lastModified: story.date,
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
