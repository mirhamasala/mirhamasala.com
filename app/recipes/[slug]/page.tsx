import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DisplayTitle } from "@/components/display-title";
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

  const recipeDetails = [
    recipe.serves
      ? `${recipe.serves} ${recipe.serves === "1" ? "serving" : "servings"}`
      : null,
    recipe.time,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="mx-auto max-w-[96rem] overflow-x-clip px-4 pt-7 pb-8 md:px-8 md:pt-10">
      <header>
        <DisplayTitle title={recipe.title} />

        <div className="mt-4 md:mt-6 md:grid md:grid-cols-12 md:gap-8">
          <div className="max-w-[44rem] md:col-span-7 md:col-start-3">
            <p className="font-serif text-[1.2rem] leading-[1.35] text-slate-700 italic md:text-[1.35rem]">
              {recipe.description}
            </p>

            {recipeDetails ? (
              <p className="mt-6 font-sans text-[1rem] leading-[1.4] text-slate-600 md:mt-7">
                {recipeDetails}
              </p>
            ) : null}
          </div>
        </div>
      </header>

      <div className="mt-10 md:mt-12 md:grid md:grid-cols-12 md:gap-8">
        <div className="max-w-[44rem] md:col-span-7 md:col-start-3">
          <RecipeMarkdownContent source={recipe.body} />
        </div>
      </div>
    </article>
  );
}
