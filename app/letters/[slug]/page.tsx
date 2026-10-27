import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArchiveEyebrow } from "@/components/archive-eyebrow";
import { DisplayTitle } from "@/components/display-title";
import { formatLongDate } from "@/lib/format-date";
import { getLetter, getLetters } from "@/lib/letters";
import { LetterMarkdownContent } from "@/lib/markdown";

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
    <article className="mx-auto max-w-[96rem] overflow-x-clip px-4 pt-7 pb-8 md:px-8 md:pt-10">
      <header>
        <ArchiveEyebrow />
        <DisplayTitle title={letter.title} />

        <div className="mt-4 md:mt-6 md:grid md:grid-cols-12 md:gap-8">
          <div className="max-w-[44rem] md:col-span-7 md:col-start-3">
            <time
              dateTime={letter.date}
              className="text-[1rem] leading-snug text-slate-950"
            >
              {formatLongDate(letter.date)}
            </time>
          </div>
        </div>
      </header>

      <div className="mt-10 md:mt-12 md:grid md:grid-cols-12 md:gap-8">
        <div className="max-w-[44rem] md:col-span-7 md:col-start-3">
          <LetterMarkdownContent source={letter.body} />
        </div>
      </div>
    </article>
  );
}
