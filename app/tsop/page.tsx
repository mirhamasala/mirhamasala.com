import type { Metadata } from "next";
import Link from "next/link";
import { archiveCrumbs } from "@/components/breadcrumbs";
import { IndexEntry } from "@/components/index-entry";
import { PageHeader } from "@/components/page-header";
import { getTsopPosts, groupTsopPosts } from "@/lib/tsop";

const contentLinkClassName =
  "underline decoration-slate-300 decoration-[2px] underline-offset-[6px] hover:decoration-slate-950 focus-visible:decoration-slate-950";

const description =
  "Twelve lifestyles in five years, to find out what I wanted to do for a living.";

export const metadata: Metadata = {
  title: "The Spin-Off Project",
  description,
  alternates: { canonical: "/tsop" },
};

export default async function SpinOffProjectPage() {
  const posts = await getTsopPosts();
  const groups = groupTsopPosts(posts);

  return (
    <article className="pt-7 pb-8 md:pt-10">
      <PageHeader
        breadcrumbs={archiveCrumbs("tsop", { current: true })}
        title="The Spin-Off Project"
        lede={
          <>
            {description}{" "}
            <Link href="/tsop/about" className={contentLinkClassName}>
              How it started
            </Link>
            .
          </>
        }
        scale="name"
      />

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
                    <IndexEntry
                      key={post.slug}
                      href={`/tsop/posts/${post.slug}`}
                      title={post.title}
                      description={post.description}
                      date={post.date}
                    />
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
