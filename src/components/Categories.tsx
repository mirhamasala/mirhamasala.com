import Link from "next/link";
import useCategories from "@/hooks/useCategories";

export function Categories({ withSpots }: { withSpots: boolean }) {
  const { categories, isLoading, isError, error } = useCategories({
    withSpots,
  });

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Oops. {error.message}</div>;

  return (
    <div className="not-prose">
      <ul className="px-3 text-sm font-medium text-zinc-800  dark:text-zinc-200">
        {categories.map((category) => (
          <li key={category.slug}>
            <Link
              href={`/categories/${category.slug}`}
              className="whitespace-nowrap px-3 py-2 hover:text-teal-500 dark:hover:text-teal-400"
            >
              {category.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
