import type { Metadata } from "next";
import { DisplayTitle } from "@/components/display-title";
import { formatLongDate } from "@/lib/format-date";
import { LetterMarkdownContent } from "@/lib/markdown";
import { getDropbox } from "@/lib/pages";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getDropbox();

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: "/dropbox" },
  };
}

export default async function DropboxPage() {
  const page = await getDropbox();

  return (
    <article className="mx-auto max-w-[96rem] overflow-x-clip px-4 pt-7 pb-8 md:px-8 md:pt-10">
      <header>
        <DisplayTitle title={page.title} />

        <div className="mt-4 md:mt-6 md:grid md:grid-cols-12 md:gap-8">
          <div className="max-w-[44rem] md:col-span-7 md:col-start-3">
            <time
              dateTime={page.date}
              className="text-[1rem] leading-snug text-slate-950"
            >
              {formatLongDate(page.date)}
            </time>
          </div>
        </div>
      </header>

      <div className="mt-10 md:mt-12 md:grid md:grid-cols-12 md:gap-8">
        <div className="max-w-[44rem] md:col-span-7 md:col-start-3">
          <LetterMarkdownContent source={page.body} />
        </div>
      </div>
    </article>
  );
}
