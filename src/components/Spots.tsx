import { type Category } from "@/graphql/documents";
import useCategories from "@/hooks/useCategories";

export function Spots() {
  const spots = useCategories();

  if (!spots) return <div>Loading...</div>;

  return (
    <div>
      {spots.map((category: Category) => {
        return (
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
        );
      })}
    </div>
  );
}
