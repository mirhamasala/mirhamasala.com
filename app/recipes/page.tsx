import type { Metadata } from "next";
import Link from "next/link";
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

      <div className="mx-auto mt-16 max-w-[96rem] px-4 md:mt-24 md:px-8">
        <ul className="max-w-[80rem] space-y-10 md:space-y-12">
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
      </div>
    </article>
  );
}
