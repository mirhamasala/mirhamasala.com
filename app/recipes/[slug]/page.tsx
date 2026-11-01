import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { DisplayTitle } from "@/components/display-title";
import { ReadingColumn } from "@/components/reading-column";
import { RecipeDetails } from "@/components/recipe-details";
import { RecipeMarkdownContent } from "@/lib/markdown";
import { getRecipe, getRecipes } from "@/lib/recipes";

export const dynamicParams = false;

export async function generateStaticParams() {
  const recipes = await getRecipes();
  return recipes.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/recipes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getRecipe(slug);
  if (!recipe) return {};

  return {
    title: recipe.title,
    description: recipe.description,
    alternates: { canonical: `/recipes/${recipe.slug}` },
  };
}

export default async function RecipePage({
  params,
}: PageProps<"/recipes/[slug]">) {
  const { slug } = await params;
  const recipe = await getRecipe(slug);
  if (!recipe) notFound();

  return (
    <Container as="article" className="overflow-x-clip pt-7 pb-8 md:pt-10">
      <header>
        <DisplayTitle title={recipe.title} />

        <ReadingColumn className="mt-4 md:mt-6">
          <p className="font-serif text-[1.2rem] leading-[1.35] text-slate-700 italic md:text-[1.35rem]">
            {recipe.description}
          </p>
        </ReadingColumn>
      </header>

      <ReadingColumn className="mt-5">
        <div className="flow-root">
          <RecipeMarkdownContent
            source={recipe.body}
            attribution={recipe.attribution}
            details={<RecipeDetails recipe={recipe} />}
          />
        </div>
      </ReadingColumn>
    </Container>
  );
}
