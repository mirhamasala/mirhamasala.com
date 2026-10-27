import type { Metadata } from "next";
import Link from "next/link";
import { ArchiveEyebrow } from "@/components/archive-eyebrow";
import { formatLongDate } from "@/lib/format-date";
import { proseLinkClassName } from "@/lib/markdown";
import {
  getTravelStories,
  storiesInPlace,
  travelPlaces,
  type TravelCity,
  type TravelCountry,
  type TravelStory,
} from "@/lib/travel-stories";

export const metadata: Metadata = {
  title: "Travel Stories",
  description:
    "Stories, photographs, and recommendations originally published on Instagram.",
  alternates: { canonical: "/travel-stories" },
};

export default async function TravelStoriesPage() {
  const stories = await getTravelStories();

  return (
    <article className="pt-7 pb-8 md:pt-10">
      <header className="mx-auto max-w-[96rem] px-4 md:px-8">
        <ArchiveEyebrow section="travel-stories" current />
        <h1 className="pb-[0.28em] font-display text-[clamp(5.7rem,21vw,20rem)] leading-[0.76] tracking-[-0.045em] text-slate-950 md:text-[clamp(10rem,17.4vw,20rem)] md:tracking-[-0.055em]">
          What I brought home.
        </h1>
        <p className="mt-6 max-w-[34rem] font-serif text-[1.2rem] leading-[1.45] text-slate-600 md:mt-8 md:text-[1.3rem]">
          Stories, photographs, and recommendations originally published on
          Instagram.
        </p>
      </header>

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
                      stories={storiesInPlace(
                        stories,
                        place.country,
                        city.city,
                      )}
                    />
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </article>
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
