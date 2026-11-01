import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { archiveCrumbs, Breadcrumbs } from "@/components/breadcrumbs";
import { ReadingLayout } from "@/components/reading-layout";
import { formatLongDate } from "@/lib/format-date";
import { getLetter, getLetters } from "@/lib/letters";
import { ReadingMarkdownContent } from "@/lib/markdown";

export const dynamicParams = false;

export async function generateStaticParams() {
  const letters = await getLetters();
  return letters.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/letters/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const letter = await getLetter(slug);
  if (!letter) return {};

  return {
    title: letter.title,
    description: letter.description,
    alternates: { canonical: `/letters/${letter.slug}` },
  };
}

export default async function LetterPage({
  params,
}: PageProps<"/letters/[slug]">) {
  const { slug } = await params;
  const letter = await getLetter(slug);
  if (!letter) notFound();

  return (
    <ReadingLayout
      title={letter.title}
      breadcrumbs={<Breadcrumbs items={archiveCrumbs()} />}
      metadata={
        <time dateTime={letter.date} className="text-base/snug text-slate-950">
          {formatLongDate(letter.date)}
        </time>
      }
    >
      <ReadingMarkdownContent source={letter.body} />
    </ReadingLayout>
  );
}
