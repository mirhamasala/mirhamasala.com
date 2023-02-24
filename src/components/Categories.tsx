import useCategories from "@/hooks/useCategories";

export function Categories() {
  const { categories, isLoading, isError, error } = useCategories({
    withSpots: false,
    city: "",
  });

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Oops. {error.message}</div>;

  return (
    <div>
      {categories.map((category) => (
        <li key={category.slug}>{category.label}</li>
      ))}
    </div>
  );
}
