import { useState, useEffect } from "react";
import { getCategories } from "@/graphql/queries";

export function Spots() {
  const [categoriesWithSpots, setCategoriesWithSpots] = useState([]);

  useEffect(() => {
    getCategories().then((data) => {
      setCategoriesWithSpots(
        data.filter((category) => category.spots.length > 0)
      );
    });
  }, []);

  if (!categoriesWithSpots) return <div>Loading...</div>;

  return (
    <div>
      {categoriesWithSpots.map((category) => {
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