import useCategories from "@/hooks/useCategories";

export function Spots() {
  const { categories, isLoading, isError, error } = useCategories({
    withSpots: true,
  });

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Oops. {error.message}</div>;

  return (
    <div>
      {categories.map((category) => (
        <section key={category.slug}>
          <h3 className="flex gap-2">
            <span className="mr-4">{category.emoji}</span>
            <span>{category.label}</span>
          </h3>
          <ul>
            {category.spots.map((spot) => {
              return (
                <li key={spot.slug}>
                  <h4>
                    {spot.googleMapsUrl ? (
                      <a href={spot.googleMapsUrl}>{spot.name}</a>
                    ) : (
                      spot.name
                    )}
                  </h4>
                  <p>{spot.description}</p>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
