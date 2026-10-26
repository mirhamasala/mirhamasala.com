import type { Metadata } from "next";
import Link from "next/link";
import { getRecipes } from "@/lib/recipes";

export const metadata: Metadata = {
  title: "Recipes",
  description: "Recipes Mirha makes often enough to want somewhere permanent.",
  alternates: { canonical: "/recipes" },
};

export default async function RecipesPage() {
  const recipes = await getRecipes();

  return (
    <article className="mx-auto max-w-[96rem] px-4 pt-12 pb-8 md:px-8 md:pt-20">
      <header>
        <h1 className="font-display text-[clamp(5.7rem,18vw,17rem)] leading-[0.76] tracking-[-0.045em] md:tracking-[-0.055em]">
          Recipes
        </h1>
        <p className="mt-8 max-w-[38rem] font-serif text-[1.2rem] leading-[1.4] text-slate-700 md:mt-10 md:text-[1.35rem]">
          Recipes I make often enough to want them somewhere permanent.
        </p>
      </header>

      <ul className="mt-24 max-w-[80rem] space-y-10 border-t border-slate-500 pt-6 md:mt-36 md:space-y-12 md:pt-7">
        {recipes.map((recipe) => (
          <li key={recipe.slug}>
            <Link
              href={`/recipes/${recipe.slug}`}
              className="group block w-fit max-w-[44rem] no-underline"
            >
              <h2 className="font-display text-[2rem] leading-none tracking-[-0.02em] underline decoration-slate-400 underline-offset-[0.12em] group-hover:decoration-current md:text-[2.65rem]">
                {recipe.title}
              </h2>
              <p className="mt-2 font-serif text-[1.05rem] leading-[1.45] text-slate-700 md:text-[1.15rem]">
                {recipe.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
