import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DisplayTitle } from "@/components/display-title";
import { formatLongDate } from "@/lib/format-date";
import { LetterMarkdownContent } from "@/lib/markdown";
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

        <div className="mt-4 md:mt-6 md:grid md:grid-cols-12 md:gap-8">
          <div className="max-w-[44rem] md:col-span-7 md:col-start-3">
            <time
              dateTime={post.date}
              className="text-[1rem] leading-snug text-slate-950"
            >
              {formatLongDate(post.date)}
            </time>
          </div>
        </div>
      </header>

      <div className="mt-10 md:mt-12 md:grid md:grid-cols-12 md:gap-8">
        <div className="max-w-[44rem] md:col-span-7 md:col-start-3">
          <LetterMarkdownContent source={post.body} />
        </div>
      </div>
    </article>
  );
}
