import type { Metadata } from "next";
import { Container } from "@/components/container";
import { IndexEntry } from "@/components/index-entry";
import { Page } from "@/components/page";
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
    <Page>
      <PageHeader eyebrow="Recipes" title="What I keep making." />

      <Container className="mt-16 md:mt-24">
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
      </Container>
    </Page>
  );
}
