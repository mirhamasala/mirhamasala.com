import { categories, categoryNames } from "@/models/category";
import { type Spot } from "@/models/spot";

export function Spots({ spots }: { spots: Spot[] }) {
  let spotsByCategory: Spot[] = [];

  function getSpotsByCategory(category: string) {
    spotsByCategory = spots.filter((spot) => spot.category === category);
  }

  return (
    <>
      {categoryNames.map((category) => {
        getSpotsByCategory(category);
        return (
          <>
            {spotsByCategory.length > 0 && (
              <section key={category}>
                <h3 className="flex gap-2">
                  <span className="mr-4">{categories[category].emoji}</span>
                  <span>{categories[category].label}</span>
                </h3>
                <ul>
                  {spotsByCategory.map((spot) => {
                    return (
                      <>
                        {spot.description.length > 0 && (
                          <li key={spot.name}>
                            <h4>
                              {spot.googleMapsUrl ? (
                                <a href={spot.googleMapsUrl}>{spot.name}</a>
                              ) : (
                                spot.name
                              )}
                            </h4>
                            <p>{spot.description}</p>
                          </li>
                        )}
                      </>
                    );
                  })}
                </ul>
              </section>
            )}
          </>
        );
      })}
    </>
  );
}
