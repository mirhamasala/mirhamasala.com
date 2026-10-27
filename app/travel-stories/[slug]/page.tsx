import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArchiveEyebrow } from "@/components/archive-eyebrow";
import { DisplayTitle } from "@/components/display-title";
import { formatLongDate } from "@/lib/format-date";
import { LetterMarkdownContent } from "@/lib/markdown";
import { getTravelStories, getTravelStory } from "@/lib/travel-stories";

export const dynamicParams = false;

export async function generateStaticParams() {
  const stories = await getTravelStories();
  return stories.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/travel-stories/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const story = await getTravelStory(slug);
  if (!story) return {};

  return {
    title: `#${story.number} · ${story.location}`,
    description: story.description,
    alternates: { canonical: `/travel-stories/${story.slug}` },
  };
}

export default async function TravelStoryPage({
  params,
}: PageProps<"/travel-stories/[slug]">) {
  const { slug } = await params;
  const story = await getTravelStory(slug);
  if (!story) notFound();

  return (
    <article className="mx-auto max-w-[96rem] overflow-x-clip px-4 pt-7 pb-8 md:px-8 md:pt-10">
      <header>
        <ArchiveEyebrow section="travel-stories" />
        <DisplayTitle title={`#${story.number}`} />

        <div className="mt-4 md:mt-6 md:grid md:grid-cols-12 md:gap-8">
          <div className="max-w-[44rem] md:col-span-7 md:col-start-3">
            <p className="text-[1rem] leading-snug text-slate-950">
              {story.location}
            </p>
            <time
              dateTime={story.date}
              className="mt-2 block text-[1rem] leading-snug text-slate-600"
            >
              {formatLongDate(story.date)}
            </time>
          </div>
        </div>
      </header>

      <div className="mt-10 md:mt-12 md:grid md:grid-cols-12 md:gap-8">
        <div className="max-w-[44rem] md:col-span-7 md:col-start-3">
          <LetterMarkdownContent source={story.body} />
        </div>
      </div>
    </article>
  );
}
