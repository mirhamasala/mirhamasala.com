import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink } from "@/components/external-link";
import { PageHeader } from "@/components/page-header";
import { PlacePinButton, PlacePins } from "@/components/place-pin-button";
import type { MapSpot } from "@/components/places-map";
import {
  categoryEmoji,
  getPlaces,
  placeCategories,
  placeCities,
  type Place,
  type PlaceCity,
} from "@/lib/places";

function MapLoading() {
  return <div className="h-[32rem] bg-slate-200 md:h-[38rem]" />;
}

const PlacesMap = dynamic(
  () => import("@/components/places-map").then((mod) => mod.PlacesMap),
  { loading: () => <MapLoading /> },
);

export const metadata: Metadata = {
  title: "Places",
  description:
    "Places I’ve eaten, drunk, stayed or stopped, and would recommend to a friend.",
  alternates: { canonical: "/places" },
};

const textLinkClassName =
  "underline decoration-slate-400 decoration-1 underline-offset-[0.18em] hover:decoration-slate-950 focus-visible:decoration-slate-950";

const mapFrameClassName =
  "flex h-[32rem] items-center justify-center bg-slate-200 px-6 md:h-[38rem]";

function cityHref(city: PlaceCity) {
  if (city.id === placeCities[0].id) return "/places" as const;
  return `/places?city=${city.id}` as const;
}

function isHttpUrl(url: string): url is `http${string}` {
  return url.startsWith("https://") || url.startsWith("http://");
}

function httpUrl(url: string | undefined): `http${string}` | undefined {
  if (url && isHttpUrl(url)) return url;
  return undefined;
}

function mapSpots(places: Place[]): MapSpot[] {
  return places.flatMap((place) => {
    if (place.latitude === undefined || place.longitude === undefined)
      return [];
    return [
      {
        slug: place.slug,
        title: place.title,
        emoji: categoryEmoji(place.category),
        latitude: place.latitude,
        longitude: place.longitude,
        body: place.body,
        url: httpUrl(place.url),
        map: place.map,
      },
    ];
  });
}

export default async function PlacesPage({
  searchParams,
}: PageProps<"/places">) {
  const places = await getPlaces();
  const { city: requestedCity } = await searchParams;
  const requested = Array.isArray(requestedCity)
    ? requestedCity[0]
    : requestedCity;
  if (requested && !placeCities.some((city) => city.id === requested)) {
    redirect("/places");
  }

  const city =
    placeCities.find((item) => item.id === requested) ?? placeCities[0];
  const cityPlaces = places.filter((place) => place.cityId === city.id);
  const groups = placeCategories.flatMap((category) => {
    const spots = cityPlaces.filter(
      (place) => place.category === category.label,
    );
    return spots.length === 0 ? [] : [{ ...category, spots }];
  });
  const apiKey =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() || undefined;
  const mapId =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID?.trim() || "DEMO_MAP_ID";
  const essay = "essay" in city ? city.essay : undefined;

  return (
    <article className="pt-7 pb-8 md:pt-10">
      <PageHeader
        eyebrow="Places"
        title="Where I’d go."
        lede="Places I’ve eaten, drunk, stayed or stopped, and would recommend to a friend."
      />

      <PlacePins key={city.id}>
        <section className="mx-auto mt-16 max-w-[96rem] px-4 md:mt-24 md:px-8">
          <div className="flex items-baseline justify-between gap-6 border-b border-slate-300 pb-2">
            <p
              id="choose-a-place"
              className="text-[1rem] leading-none font-medium tracking-[0.14em] text-slate-600 uppercase"
            >
              Choose a place
            </p>
            <p className="text-[1rem] leading-none text-slate-500">
              ({placeCities.length} cities)
            </p>
          </div>
          <nav aria-labelledby="choose-a-place" className="mt-5 md:mt-6">
            <ol className="flex flex-wrap items-baseline font-display text-[clamp(2.35rem,5vw,4.15rem)] leading-[1.08] tracking-[-0.03em] italic">
              {placeCities.map((item, index) => {
                const selected = item.id === city.id;
                const count = places.filter(
                  (place) => place.cityId === item.id,
                ).length;
                return (
                  <li key={item.id} className="mr-[0.28em]">
                    <Link
                      href={cityHref(item)}
                      scroll={false}
                      aria-current={selected ? "true" : undefined}
                      className={
                        selected
                          ? "text-slate-950 underline decoration-slate-400 decoration-1 underline-offset-[0.14em]"
                          : "text-slate-500 underline decoration-transparent underline-offset-[0.14em] hover:text-slate-800 hover:decoration-current focus-visible:text-slate-950 focus-visible:decoration-current"
                      }
                    >
                      {item.label}
                      <sup className="ml-[0.15em] align-super font-sans text-[1rem] leading-none font-medium tracking-normal text-inherit not-italic">
                        {count}
                      </sup>
                    </Link>
                    {index < placeCities.length - 1 ? (
                      <span aria-hidden="true" className="text-slate-300">
                        ,
                      </span>
                    ) : null}
                  </li>
                );
              })}
            </ol>
          </nav>

          <div
            id="places-map"
            role="region"
            aria-label={`Map of ${city.label}`}
            className="mt-8 scroll-mt-8"
          >
            {apiKey ? (
              <PlacesMap
                key={city.id}
                apiKey={apiKey}
                mapId={mapId}
                center={{ latitude: city.latitude, longitude: city.longitude }}
                spots={mapSpots(cityPlaces)}
              />
            ) : (
              <div className={mapFrameClassName}>
                <p className="max-w-[24rem] text-center font-serif text-[1.15rem] leading-snug text-slate-600">
                  The map isn’t available just now.
                </p>
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
            <h2 className="text-[1rem] leading-snug font-medium text-slate-950">
              {city.label}
              <span className="text-slate-500">
                {" "}
                · {cityPlaces.length}{" "}
                {cityPlaces.length === 1 ? "place" : "places"}
              </span>
            </h2>
            {essay ? (
              <Link href={essay.href} className={textLinkClassName}>
                Read {essay.title}
              </Link>
            ) : null}
          </div>
        </section>

        <div className="mt-10 md:mt-12">
          {groups.map((group, index) => (
            <section
              key={group.label}
              className={index === 0 ? undefined : "border-t border-slate-300"}
            >
              <div className="mx-auto max-w-[96rem] px-4 py-8 md:px-8 md:py-10">
                <div className="max-w-[40rem]">
                  <h3 className="font-sans text-[1rem] font-medium tracking-[0.14em] text-slate-600 uppercase">
                    <span aria-hidden="true">{group.emoji}</span> {group.label}
                  </h3>
                  <ul className="mt-7 space-y-8">
                    {group.spots.map((spot) => {
                      const website = httpUrl(spot.url);
                      const directions = httpUrl(spot.map);
                      return (
                        <li
                          key={spot.slug}
                          id={spot.slug}
                          className="scroll-mt-8"
                        >
                          {apiKey &&
                          spot.latitude !== undefined &&
                          spot.longitude !== undefined ? (
                            <PlacePinButton
                              slug={spot.slug}
                              title={spot.title}
                            />
                          ) : (
                            <h4 className="font-serif text-[1.35rem] leading-snug text-slate-950 md:text-[1.5rem]">
                              {spot.title}
                            </h4>
                          )}
                          {spot.locality ? (
                            <p className="mt-1 text-[1rem] leading-snug text-slate-500">
                              {spot.locality}
                            </p>
                          ) : null}
                          {spot.body ? (
                            <p className="mt-2 font-serif text-[1.15rem] leading-[1.45] text-slate-700">
                              {spot.body}
                            </p>
                          ) : null}
                          {website || directions ? (
                            <p className="mt-3 flex flex-wrap items-baseline gap-x-3 text-[1rem] leading-snug">
                              {website ? (
                                <ExternalLink
                                  href={website}
                                  className={textLinkClassName}
                                >
                                  Website
                                </ExternalLink>
                              ) : null}
                              {website && directions ? (
                                <span
                                  aria-hidden="true"
                                  className="text-slate-400"
                                >
                                  ·
                                </span>
                              ) : null}
                              {directions ? (
                                <ExternalLink
                                  href={directions}
                                  className={textLinkClassName}
                                >
                                  Google Maps
                                </ExternalLink>
                              ) : null}
                            </p>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </section>
          ))}
        </div>
      </PlacePins>
    </article>
  );
}
