import type { Metadata } from "next";
import { Page } from "@/components/page";
import { PageHeader } from "@/components/page-header";
import { YearIndex } from "@/components/year-index";
import { getPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Everything Mirha Masala has published in Writing, newest first.",
  alternates: { canonical: "/posts" },
};

export default async function WritingPage() {
  const posts = await getPosts();

  return (
    <Page>
      <PageHeader
        title="Writing"
        lede="Everything Mirha Masala has published in Writing, newest first."
      />

      <YearIndex items={posts} href={(post) => `/posts/${post.slug}`} />
    </Page>
  );
}
