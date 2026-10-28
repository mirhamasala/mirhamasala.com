import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { formatLongDate } from "@/lib/format-date";
import { getPosts, type Post } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Everything Mirha Masala has published in Writing, newest first.",
  alternates: { canonical: "/posts" },
};

export default async function WritingPage() {
  const posts = await getPosts();
  const years = postsByYear(posts);

  return (
    <article className="pt-7 pb-8 md:pt-10">
      <PageHeader
        title="Writing"
        lede="Everything Mirha Masala has published in Writing, newest first."
      />

      <div className="mt-16 md:mt-24">
        {years.map(({ year, posts: inYear }, index) => (
          <section
            key={year}
            className={index === 0 ? undefined : "border-t border-slate-300"}
          >
            <div className="mx-auto max-w-[96rem] px-4 pt-9 pb-8 md:px-8">
              <div className="max-w-[44rem]">
                <h2 className="font-sans text-[1rem] font-medium tracking-[0.14em] text-slate-600 uppercase">
                  {year}
                </h2>
                <ul className="mt-7 space-y-10 md:space-y-12">
                  {inYear.map((post) => (
                    <li key={post.slug}>
                      <Link
                        href={`/posts/${post.slug}`}
                        className="group block w-fit max-w-[44rem] no-underline"
                      >
                        <h3 className="font-display text-[2rem] leading-none tracking-[-0.02em] underline decoration-slate-300 decoration-[2px] underline-offset-[8px] group-hover:decoration-slate-950 group-focus-visible:decoration-slate-950 md:text-[2.65rem]">
                          {post.title}
                        </h3>
                        <time
                          dateTime={post.date}
                          className="mt-3 block text-[1rem] leading-snug text-slate-600"
                        >
                          {formatLongDate(post.date)}
                        </time>
                        <p className="mt-3 font-serif text-[1.05rem] leading-[1.45] text-slate-600 md:mt-4 md:text-[1.15rem]">
                          {post.description}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}

function postsByYear(posts: Post[]) {
  const years: { year: string; posts: Post[] }[] = [];

  for (const post of posts) {
    const year = post.date.slice(0, 4);
    const group = years.find((item) => item.year === year);
    if (group) {
      group.posts.push(post);
      continue;
    }
    years.push({ year, posts: [post] });
  }

  return years;
}
