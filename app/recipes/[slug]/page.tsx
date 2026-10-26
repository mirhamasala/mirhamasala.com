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
    <article className="mx-auto max-w-[96rem] overflow-x-clip px-4 pt-7 pb-8 md:px-8 md:pt-10">
      <header>
        <h1 className="pb-[0.28em] font-display text-[clamp(5.7rem,21vw,20rem)] leading-[0.76] tracking-[-0.045em] text-slate-950 md:text-[clamp(10rem,17.4vw,20rem)] md:tracking-[-0.055em]">
          {recipe.title}
        </h1>

        <div className="mt-6 md:mt-10 md:grid md:grid-cols-12 md:gap-8">
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
