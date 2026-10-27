import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DisplayTitle } from "@/components/display-title";
import { MarkdownContent } from "@/lib/markdown";
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
    <article className="mx-auto max-w-[96rem] overflow-x-clip px-4 pt-7 pb-8 md:px-8 md:pt-10">
      <header>
        <DisplayTitle title={post.title} />
        <time dateTime={post.date}>{post.date}</time>
      </header>
      <div className="prose">
        <MarkdownContent source={post.body} />
      </div>
    </article>
  );
}
