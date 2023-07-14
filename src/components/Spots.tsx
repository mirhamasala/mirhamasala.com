import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCity } from "@/hooks/useCity";
import { Category, Spot } from "@/graphql/documents";

function Spots({ id }: { id: string }) {
  const { data, isLoading, isError, error } = useCity(id);

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Oops. {error.message}</div>;

  const categories = data?.city.spots.reduce((acc, spot) => {
    const category = spot.category;

    if (!acc[category.slug]) {
      acc[category.slug] = {
        ...category,
        spots: [],
      };
    }
    acc[category.slug].spots.push(spot as Spot);
    return acc;
  }, {} as Record<string, Category>);

  if (typeof window === "undefined") {
    return null;
  }

  return (
    <>
      {Object.values(categories).map((category) => (
        <section id={category.slug} key={category.slug}>
          <h3 className="flex gap-2">
            <span aria-hidden="true">{category.emoji}</span>
            <span>{category.label}</span>
          </h3>
          <ul>
            {category.spots.map((spot) => (
              <li key={spot.slug}>
                <h4>
                  {spot.googleMapsUrl ? (
                    <a id={spot.slug} href={spot.googleMapsUrl}>
                      {spot.name}
                    </a>
                  ) : (
                    spot.name
                  )}
                </h4>
                <p>{spot.description}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}

function WrappedSpots(props: { id: string }) {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <Spots {...props} />
    </QueryClientProvider>
  );
}

export default WrappedSpots;
