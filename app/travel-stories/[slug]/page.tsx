import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { archiveCrumbs, Breadcrumbs } from "@/components/breadcrumbs";
import { ReadingLayout } from "@/components/reading-layout";
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
    <ReadingLayout
      title={`#${story.number}`}
      breadcrumbs={<Breadcrumbs items={archiveCrumbs("travel-stories")} />}
      metadata={
        <>
          <p className="text-base/snug text-slate-950">{story.location}</p>
          <time
            dateTime={story.date}
            className="mt-2 block text-base/snug text-slate-600"
          >
            {formatLongDate(story.date)}
          </time>
        </>
      }
    >
      <LetterMarkdownContent source={story.body} />
    </ReadingLayout>
  );
}
