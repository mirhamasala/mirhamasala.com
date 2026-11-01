import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { archiveCrumbs, Breadcrumbs } from "@/components/breadcrumbs";
import { ReadingLayout } from "@/components/reading-layout";
import { formatLongDate } from "@/lib/format-date";
import { ReadingMarkdownContent } from "@/lib/markdown";
import { getTsopPost, getTsopPosts } from "@/lib/tsop";

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getTsopPosts();
  return posts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/tsop/posts/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getTsopPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/tsop/posts/${post.slug}` },
  };
}

export default async function SpinOffPostPage({
  params,
}: PageProps<"/tsop/posts/[slug]">) {
  const { slug } = await params;
  const post = await getTsopPost(slug);
  if (!post) notFound();

  return (
    <ReadingLayout
      title={post.title}
      breadcrumbs={<Breadcrumbs items={archiveCrumbs("tsop")} />}
      metadata={
        <time dateTime={post.date} className="text-base/snug text-slate-950">
          {formatLongDate(post.date)}
        </time>
      }
    >
      <ReadingMarkdownContent source={post.body} />
    </ReadingLayout>
  );
}
