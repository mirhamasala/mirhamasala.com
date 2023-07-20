import { groupSpotsByCategory } from "@/lib/groupSpotsByCategory";

function Spot({ spot }) {
  return (
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
  );
}

function CategorySection({ category }) {
  return (
    <section id={category.slug} key={category.slug}>
      <h3 className="flex gap-2">
        <span aria-hidden="true">{category.emoji}</span>
        <span>{category.label}</span>
      </h3>
      <ul>
        {category.spots.map((spot) => (
          <Spot key={spot.slug} spot={spot} />
        ))}
      </ul>
    </section>
  );
}

export function Spots({ spots }) {
  const spotsGroupedByCategory = groupSpotsByCategory(spots);

  return (
    <>
      {Object.values(spotsGroupedByCategory).map((category) => (
        <CategorySection key={category.slug} category={category} />
      ))}
    </>
  );
}
