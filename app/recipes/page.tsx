import type { Metadata } from "next";
import { IndexEntry } from "@/components/index-entry";
import { PageHeader } from "@/components/page-header";
import { getRecipes } from "@/lib/recipes";

export const metadata: Metadata = {
  title: "Recipes",
  description: "The recipes Mirha keeps making.",
  alternates: { canonical: "/recipes" },
};

export default async function RecipesPage() {
  const recipes = await getRecipes();

  return (
    <article className="overflow-x-clip pt-7 pb-8 md:pt-10">
      <PageHeader eyebrow="Recipes" title="What I keep making." />

      <div className="mx-auto mt-16 max-w-384 px-4 md:mt-24 md:px-8">
        <ul className="max-w-7xl space-y-10 md:space-y-12">
          {recipes.map((recipe) => (
            <IndexEntry
              key={recipe.slug}
              href={`/recipes/${recipe.slug}`}
              title={recipe.title}
              description={recipe.description}
              level="h2"
            />
          ))}
        </ul>
      </div>
    </article>
  );
}
