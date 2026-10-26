import type { Metadata } from "next";
import { notFound } from "next/navigation";
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

  const hasDetails = recipe.serves || recipe.time;

  return (
    <article className="mx-auto max-w-[96rem] px-4 pt-12 pb-8 md:px-8 md:pt-20">
      <header>
        <h1 className="max-w-[92rem] font-display text-[clamp(4.5rem,13vw,13rem)] leading-[0.78] tracking-[-0.045em] md:tracking-[-0.055em]">
          {recipe.title}
        </h1>

        <div className="mt-8 md:grid md:grid-cols-12 md:gap-8">
          <div className="max-w-[44rem] md:col-span-7 md:col-start-3">
            <p className="font-serif text-[1.2rem] leading-[1.35] text-slate-700 italic md:text-[1.35rem]">
              {recipe.description}
            </p>

            {hasDetails ? (
              <dl className="mt-8 flex gap-12 font-sans md:mt-10">
                {recipe.serves ? (
                  <div>
                    <dt className="text-[1rem] leading-none font-medium text-slate-600">
                      Serves
                    </dt>
                    <dd className="mt-1 font-serif text-[1.35rem] leading-none">
                      {recipe.serves}
                    </dd>
                  </div>
                ) : null}
                {recipe.time ? (
                  <div>
                    <dt className="text-[1rem] leading-none font-medium text-slate-600">
                      Time
                    </dt>
                    <dd className="mt-1 font-serif text-[1.35rem] leading-none">
                      {recipe.time}
                    </dd>
                  </div>
                ) : null}
              </dl>
            ) : null}
          </div>
        </div>
      </header>

      <div className="mt-12 md:mt-16 md:grid md:grid-cols-12 md:gap-8">
        <div className="max-w-[44rem] md:col-span-7 md:col-start-3">
          <RecipeMarkdownContent source={recipe.body} />
        </div>
      </div>
    </article>
  );
}
