import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
    <article>
      <header>
        <h1>{post.title}</h1>
        <time dateTime={post.date}>{post.date}</time>
      </header>
      <div className="prose">
        <MarkdownContent source={post.body} />
      </div>
    </article>
  );
}
