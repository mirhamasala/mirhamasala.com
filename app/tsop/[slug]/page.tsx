import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { archiveCrumbs, Breadcrumbs } from "@/components/breadcrumbs";
import { DisplayTitle } from "@/components/display-title";
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
    <article className="mx-auto max-w-[96rem] overflow-x-clip px-4 pt-7 pb-8 md:px-8 md:pt-10">
      <header>
        <Breadcrumbs items={archiveCrumbs("tsop")} />
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
