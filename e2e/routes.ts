import { getBooks } from "@/lib/books";
import { getLetters } from "@/lib/letters";
import { getPosts } from "@/lib/posts";
import { getRecipes } from "@/lib/recipes";
import { getTravelStories } from "@/lib/travel-stories";
import { getTsopPages, getTsopPosts } from "@/lib/tsop";
import { site } from "@/lib/site";

export type IndexableRoute = {
  path: string;
  title: string;
  heading: string | RegExp;
  description?: string;
};

/** Every indexable route: the static pages plus every published article. */
export async function getIndexableRoutes(): Promise<IndexableRoute[]> {
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
    { path: "/", title: site.name, heading: site.name },
    {
      path: "/about",
      title: `About · ${site.name}`,
      heading: /Hi, I’m Mirha\./,
    },
    {
      path: "/resume",
      title: `Resume · ${site.name}`,
      heading: "Resume",
    },
    {
      path: "/dropbox",
      title: `Dropbox · ${site.name}`,
      heading: "Dropbox",
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
      path: "/places",
      title: `Places · ${site.name}`,
      heading: "Places I’d recommend.",
    },
    {
      path: "/books",
      title: `Books · ${site.name}`,
      heading: "What I’ve taken from the pages.",
    },
    ...books.map((book) => ({
      path: `/books/${book.slug}`,
      title: `${book.title} · ${site.name}`,
      heading: book.title,
      description: book.description,
    })),
    {
      path: "/archive",
      title: `Archive · ${site.name}`,
      heading: "Archive",
    },
    {
      path: "/letters",
      title: `Letters · ${site.name}`,
      heading: "Flying paper planes.",
    },
    ...letters.map((letter) => ({
      path: `/letters/${letter.slug}`,
      title: `${letter.title} · ${site.name}`,
      heading: letter.title,
      description: letter.description,
    })),
    {
      path: "/travel-stories",
      title: `Travel Stories · ${site.name}`,
      heading: "What I brought home.",
    },
    ...stories.map((story) => ({
      path: `/travel-stories/${story.slug}`,
      title: `#${story.number} · ${story.location} · ${site.name}`,
      heading: `#${story.number}`,
      description: story.description,
    })),
    {
      path: "/tsop",
      title: `The Spin-Off Project · ${site.name}`,
      heading: "The Spin-Off Project",
    },
    ...tsopPosts.map((post) => ({
      path: `/tsop/posts/${post.slug}`,
      title: `${post.title} · ${site.name}`,
      heading: post.title,
      description: post.description,
    })),
    ...tsopPages.map((page) => ({
      path: `/tsop/${page.slug}`,
      title: `${page.title} · ${site.name}`,
      heading: page.title,
      description: page.description,
    })),
  ];
}

export function absoluteUrl(path: string, baseURL: string | undefined) {
  if (!baseURL) throw new Error("Playwright baseURL is not configured");
  return new URL(path, baseURL).href;
}
