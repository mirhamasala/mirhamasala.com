import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReadingLayout } from "@/components/reading-layout";
import { formatLongDate } from "@/lib/format-date";
import { ReadingMarkdownContent } from "@/lib/markdown";
import { getPost, getPosts } from "@/lib/posts";

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/posts/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/posts/${post.slug}` },
  };
}

export default async function PostPage({ params }: PageProps<"/posts/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <ReadingLayout
      title={post.title}
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
