import type { Metadata } from "next";
import Link from "next/link";
import { ArchiveEyebrow } from "@/components/archive-eyebrow";
import { formatLongDate } from "@/lib/format-date";
import {
  getTsopPages,
  getTsopPosts,
  groupTsopPosts,
  type TsopPost,
} from "@/lib/tsop";

const description =
  "Twelve lifestyles in five years, to find out what I wanted to do for a living.";

export const metadata: Metadata = {
  title: "The Spin-Off Project",
  description,
  alternates: { canonical: "/tsop" },
};

export default async function SpinOffProjectPage() {
  const [pages, posts] = await Promise.all([getTsopPages(), getTsopPosts()]);
  const groups = groupTsopPosts(posts);

  return (
    <article className="pt-7 pb-8 md:pt-10">
      <header className="mx-auto max-w-[96rem] px-4 md:px-8">
        <ArchiveEyebrow section="tsop" current />
        <h1 className="max-w-[18ch] pb-[0.12em] font-display text-[clamp(3.5rem,10vw,8.75rem)] leading-[0.88] tracking-[-0.035em] text-balance text-slate-950">
          The Spin-Off Project
        </h1>
        <p className="mt-6 max-w-[34rem] font-serif text-[1.2rem] leading-[1.45] text-slate-600 md:mt-8 md:text-[1.3rem]">
          {description}
        </p>
        <ul className="mt-8 max-w-[34rem] md:mt-10">
          {pages.map((page) => (
            <li key={page.slug}>
              <Link
                href={`/tsop/${page.slug}`}
                className="font-serif text-[1.2rem] leading-[1.6] text-slate-950 underline decoration-slate-300 decoration-[2px] underline-offset-[6px] hover:decoration-slate-950 focus-visible:decoration-slate-950 md:text-[1.3rem]"
              >
                {page.title}
              </Link>
            </li>
          ))}
        </ul>
      </header>

      <div className="mt-16 md:mt-24">
        {groups.map((group, index) => (
          <section
            key={group.id}
            aria-labelledby={group.id}
            className={index === 0 ? undefined : "border-t border-slate-300"}
          >
            <div className="mx-auto max-w-[96rem] px-4 pt-9 pb-8 md:px-8">
              <div className="max-w-[44rem]">
                {group.number ? (
                  <p className="font-sans text-[1rem] font-medium tracking-[0.14em] text-slate-600 tabular-nums">
                    {String(group.number).padStart(2, "0")}
                  </p>
                ) : null}
                <h2
                  id={group.id}
                  className={`font-display text-[clamp(2.75rem,6vw,4.5rem)] leading-none tracking-[-0.02em] text-slate-950 ${group.number ? "mt-3" : ""}`}
                >
                  {group.title}
                </h2>
                <ul className="mt-8 space-y-10 md:mt-10 md:space-y-12">
                  {group.posts.map((post) => (
                    <PostItem key={post.slug} post={post} />
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

function PostItem({ post }: { post: TsopPost }) {
  return (
    <li>
      <Link
        href={`/tsop/posts/${post.slug}`}
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
  );
}
