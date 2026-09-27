import type { Metadata } from "next";
import Link from "next/link";
import { getPosts } from "@/lib/posts";

export const metadata: Metadata = { title: "Writing" };

export default async function WritingPage() {
  const posts = await getPosts();

  return (
    <>
      <h1>Writing</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/posts/${post.slug}`}>{post.title}</Link>{" "}
            <time dateTime={post.date}>{post.date}</time>
          </li>
        ))}
      </ul>
    </>
  );
}
