import type { Metadata } from "next";
import Link from "next/link";
import { getRecipes } from "@/lib/recipes";

export const metadata: Metadata = {
  title: "Recipes",
  description: "The recipes Mirha keeps making.",
  alternates: { canonical: "/recipes" },
};

export default async function RecipesPage() {
  const recipes = await getRecipes();

  return (
    <article className="mx-auto max-w-[96rem] overflow-x-clip px-4 pt-7 pb-8 md:px-8 md:pt-10">
      <header>
        <p className="mb-4 text-[1rem] leading-none font-medium text-slate-600 md:mb-6">
          Recipes
        </p>
        <h1 className="font-display text-[clamp(5.7rem,21vw,20rem)] leading-[0.76] tracking-[-0.045em] text-slate-950 md:text-[clamp(10rem,17.4vw,20rem)] md:tracking-[-0.055em]">
          What I keep making.
        </h1>
      </header>

      <ul className="mt-16 max-w-[80rem] space-y-10 md:mt-24 md:space-y-12">
        {recipes.map((recipe) => (
          <li key={recipe.slug}>
            <Link
              href={`/recipes/${recipe.slug}`}
              className="group block w-fit max-w-[44rem] no-underline"
            >
              <h2 className="font-display text-[2rem] leading-none tracking-[-0.02em] underline decoration-slate-300 decoration-[2px] underline-offset-[8px] group-hover:decoration-slate-950 group-focus-visible:decoration-slate-950 md:text-[2.65rem]">
                {recipe.title}
              </h2>
              <p className="mt-3 font-serif text-[1.05rem] leading-[1.45] text-slate-600 md:mt-4 md:text-[1.15rem]">
                {recipe.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
