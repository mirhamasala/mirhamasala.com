import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { archiveCrumbs, Breadcrumbs } from "@/components/breadcrumbs";
import { ReadingLayout } from "@/components/reading-layout";
import { formatLongDate } from "@/lib/format-date";
import { LetterMarkdownContent } from "@/lib/markdown";
import { getTsopPage, getTsopPages } from "@/lib/tsop";

export const dynamicParams = false;

export async function generateStaticParams() {
  const pages = await getTsopPages();
  return pages.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/tsop/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = await getTsopPage(slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/tsop/${page.slug}` },
  };
}

export default async function SpinOffPage({
  params,
}: PageProps<"/tsop/[slug]">) {
  const { slug } = await params;
  const page = await getTsopPage(slug);
  if (!page) notFound();

  return (
    <ReadingLayout
      title={page.title}
      breadcrumbs={<Breadcrumbs items={archiveCrumbs("tsop")} />}
      metadata={
        <time dateTime={page.date} className="text-base/snug text-slate-950">
          {formatLongDate(page.date)}
        </time>
      }
    >
      <LetterMarkdownContent source={page.body} />
    </ReadingLayout>
  );
}
