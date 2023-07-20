import Map from "@/components/Map";
import { Spots } from "@/components/Spots";
import { getPublishedSpotsWithCategoryAndCity } from "@/lib/getPublishedSpotsWithCategoryAndCity";
import { Spot } from "@/types/spots.type";

export function SpotsWithMap({ spots }: { spots: Spot[] }) {
  const PublishedSpotWithCategoryAndCity =
    getPublishedSpotsWithCategoryAndCity(spots);
  const center = PublishedSpotWithCategoryAndCity[0].city.geo;

  return (
    <>
      <figure className="not-prose">
        <Map
          center={center}
          spots={PublishedSpotWithCategoryAndCity}
          height="480px"
        />
      </figure>
      <Spots spots={PublishedSpotWithCategoryAndCity} />
    </>
  );
}
