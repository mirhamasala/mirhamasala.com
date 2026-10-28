import type { Metadata } from "next";
import Link from "next/link";
import { archiveCrumbs } from "@/components/breadcrumbs";
import { PageHeader } from "@/components/page-header";
import { formatLongDate } from "@/lib/format-date";
import { proseLinkClassName } from "@/lib/markdown";
import {
  getTravelStories,
  storiesByNumber,
  storiesInPlace,
  travelPlaces,
  type TravelCity,
  type TravelCountry,
  type TravelStory,
} from "@/lib/travel-stories";

type TravelStoriesView = "list" | "photographs";

const viewLinkClassName =
  "underline decoration-transparent underline-offset-[0.18em] hover:decoration-current focus-visible:decoration-current aria-[current=page]:text-slate-950 aria-[current=page]:decoration-current";

export const metadata: Metadata = {
  title: "Travel Stories",
  description:
    "Stories, photographs, and recommendations originally published on Instagram.",
  alternates: { canonical: "/travel-stories" },
};

export default async function TravelStoriesPage({
  searchParams,
}: PageProps<"/travel-stories">) {
  const stories = await getTravelStories();
  const { view: requestedView } = await searchParams;
  const view: TravelStoriesView =
    requestedView === "photographs" ? "photographs" : "list";

  return (
    <article className="pt-7 pb-8 md:pt-10">
      <PageHeader
        breadcrumbs={archiveCrumbs("travel-stories", { current: true })}
        title="What I brought home."
        lede="Stories, photographs, and recommendations originally published on Instagram."
      />
      <div className="mx-auto max-w-[96rem] px-4 md:px-8">
        <ViewSwitch view={view} />
      </div>

      {view === "photographs" ? (
        <PhotographGrid stories={stories} />
      ) : (
        <PlaceList stories={stories} />
      )}
    </article>
  );
}

function ViewSwitch({ view }: { view: TravelStoriesView }) {
  return (
    <nav
      aria-label="View"
      className="mt-8 font-sans text-[1rem] font-medium tracking-[0.14em] text-slate-600 uppercase md:mt-10"
    >
      <ul className="flex gap-x-6">
        <li>
          <Link
            href="/travel-stories"
            aria-current={view === "list" ? "page" : undefined}
            className={viewLinkClassName}
          >
            By place
          </Link>
        </li>
        <li>
          <Link
            href="/travel-stories?view=photographs"
            aria-current={view === "photographs" ? "page" : undefined}
            className={viewLinkClassName}
          >
            Photographs
          </Link>
        </li>
      </ul>
    </nav>
  );
}

function PhotographGrid({ stories }: { stories: TravelStory[] }) {
  return (
    <ul
      aria-label="Photographs"
      className="mx-auto mt-16 grid max-w-[96rem] grid-cols-3 gap-1 px-4 md:mt-24 md:grid-cols-6 md:px-8"
    >
      {storiesByNumber(stories).map((story) => (
        <li key={story.slug}>
          <Link
            href={`/travel-stories/${story.slug}`}
            className="block aspect-square"
          >
            <span className="relative block h-full overflow-hidden">
              {/* Photographs stay plain img elements until image optimization is decided. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={story.photo.src}
                alt={`#${story.number}, ${story.location} ${story.photo.alt}`}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover hover:opacity-90 motion-safe:transition-opacity"
              />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function PlaceList({ stories }: { stories: TravelStory[] }) {
  return (
    <div className="mt-16 md:mt-24">
      {travelPlaces.map((place, index) => {
        const countryStories = storiesInPlace(stories, place.country);

        return (
          <section
            key={place.country}
            aria-labelledby={place.id}
            className={index === 0 ? undefined : "border-t border-slate-300"}
          >
            <div className="mx-auto max-w-[96rem] px-4 pt-9 pb-8 md:px-8">
              <div className="max-w-[44rem]">
                <h2
                  id={place.id}
                  className="font-sans text-[1rem] font-medium tracking-[0.14em] text-slate-600 uppercase"
                >
                  {place.country}
                </h2>

                {place.country === "Australia" ? <MelbourneNote /> : null}

                {countryStories.length > 0 ? (
                  <StoryList stories={countryStories} />
                ) : null}

                {place.cities.map((city) => (
                  <CityGroup
                    key={city.id}
                    country={place.country}
                    city={city.city}
                    id={city.id}
                    stories={storiesInPlace(stories, place.country, city.city)}
                  />
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

function CityGroup({
  country,
  city,
  id,
  stories,
}: {
  country: TravelCountry;
  city: TravelCity;
  id: string;
  stories: TravelStory[];
}) {
  return (
    <div className="mt-12">
      <h3
        id={id}
        className="font-serif text-[1.5rem] leading-snug text-slate-950 md:text-[1.75rem]"
      >
        {city}
      </h3>
      {country === "Japan" && city === "Tokyo" ? <TokyoNote /> : null}
      <StoryList stories={stories} />
    </div>
  );
}

function StoryList({ stories }: { stories: TravelStory[] }) {
  return (
    <ul className="mt-6">
      {stories.map((story) => (
        <li key={story.slug} id={story.slug}>
          <Link
            href={`/travel-stories/${story.slug}`}
            className="group grid grid-cols-1 gap-x-6 py-[0.45rem] no-underline sm:grid-cols-[4.75rem_minmax(0,1fr)_auto] sm:items-baseline"
          >
            <span className="font-serif text-[1.375rem] text-slate-950 tabular-nums underline decoration-slate-300 decoration-[2px] underline-offset-[8px] group-hover:decoration-slate-950 group-focus-visible:decoration-slate-950">
              #{story.number}
            </span>
            <span className="font-serif text-[1.2rem] leading-snug text-slate-800 md:text-[1.25rem]">
              {story.location}
            </span>
            <time
              dateTime={story.date}
              className="font-sans text-[1rem] text-slate-600 tabular-nums sm:text-right sm:whitespace-nowrap"
            >
              {formatLongDate(story.date)}
            </time>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function MelbourneNote() {
  return (
    <div className="mt-8">
      <h3
        id="melbourne"
        className="font-serif text-[1.5rem] leading-snug text-slate-950 md:text-[1.75rem]"
      >
        Melbourne
      </h3>
      <p className="mt-3 font-serif text-[1.2rem] leading-[1.5] text-slate-800 md:text-[1.25rem]">
        For sunset-watching coordinates, a trio of pubs, my new, all-time
        favorite brunch and dinner spots, and a bit more, see{" "}
        <Link href="/posts/10-things-melbourne" className={proseLinkClassName}>
          10 Things to Do in Melbourne
        </Link>
        .
      </p>
    </div>
  );
}

function TokyoNote() {
  return (
    <p className="mt-3 font-serif text-[1.2rem] leading-[1.5] text-slate-800 md:text-[1.25rem]">
      You might also like{" "}
      <Link href="/posts/found-in-nothing" className={proseLinkClassName}>
        Found in Nothing (and My Latest Tokyo Favorites)
      </Link>
      .
    </p>
  );
}
