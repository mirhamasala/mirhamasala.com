import type { Metadata } from "next";
import { ReadingLayout } from "@/components/reading-layout";
import { formatLongDate } from "@/lib/format-date";
import { ReadingMarkdownContent } from "@/lib/markdown";
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
    <ReadingLayout
      title={page.title}
      metadata={
        <time dateTime={page.date} className="text-base/snug text-slate-950">
          {formatLongDate(page.date)}
        </time>
      }
    >
      <ReadingMarkdownContent source={page.body} />
    </ReadingLayout>
  );
}
