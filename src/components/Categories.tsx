import useCategories from "@/hooks/useCategories";

export function Categories() {
  const { categories, error, isLoading, isRejected, isResolved } =
    useCategories({ withSpots: false });

  if (isLoading) return <div>Loading...</div>;

  if (isRejected) return <div>Oops. {error}</div>;

  if (isResolved) {
    return (
      <div>
        {categories.map((category) => (
          <li key={category.slug}>{category.label}</li>
        ))}
      </div>
    );
  }
}
