import { formatRecipeTime, type Recipe } from "@/lib/recipes";

export function RecipeDetails({ recipe }: { recipe: Recipe }) {
  const details = [
    ...(recipe.serves ? [{ label: "Serves", value: recipe.serves }] : []),
    ...(
      [
        ["prepTime", "Prep"],
        ["cookTime", "Cook"],
        ["restTime", "Rest"],
        ["chillTime", "Chill"],
        ["soakTime", "Soak"],
        ["totalTime", "Total"],
      ] as const
    ).flatMap(([field, label]) =>
      recipe[field] !== undefined
        ? [{ label, value: formatRecipeTime(recipe[field]) }]
        : [],
    ),
  ];

  if (!details.length && !recipe.timeNote) return null;

  return (
    <div className="mt-8 first:mt-3">
      {details.length ? (
        <dl
          aria-label="Recipe details"
          className="grid gap-y-2 font-sans text-base/normal md:flex md:flex-wrap md:gap-x-8 md:gap-y-4"
        >
          {details.map(({ label, value }) => (
            <div
              key={label}
              className="grid min-w-0 grid-cols-[3rem_minmax(0,1fr)] items-baseline gap-x-4 md:flex md:max-w-full md:gap-x-2"
            >
              <dt className="shrink-0 text-slate-600">{label}</dt>
              <dd className="min-w-0 text-slate-900">{value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {recipe.timeNote ? (
        <p className="mt-3 font-sans text-base/normal text-slate-600 first:mt-0">
          {recipe.timeNote}
        </p>
      ) : null}
    </div>
  );
}
