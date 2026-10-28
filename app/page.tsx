import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "@/components/external-link";
import { formatMonthYear } from "@/lib/format-date";
import { getPosts, type Post } from "@/lib/posts";

export const metadata: Metadata = {
  description:
    "Mirha Masala writes about the things she gets unusually interested in: what she learns, what works, what doesn’t, and what’s worth passing on.",
  alternates: { canonical: "/" },
};

const latestCount = 4;

const labelClassName =
  "font-sans text-[1rem] leading-none font-medium tracking-[0.14em] text-slate-600 uppercase";

const textLinkClassName =
  "underline decoration-transparent hover:decoration-current focus-visible:decoration-current motion-safe:transition";

const entryTitleClassName =
  "font-display leading-none tracking-[-0.02em] underline decoration-slate-300 decoration-[2px] underline-offset-[0.15em] hover:decoration-slate-950 focus-visible:decoration-slate-950 group-hover:decoration-slate-950 group-focus-visible:decoration-slate-950";

const proseLinkClassName =
  "underline decoration-slate-400 decoration-1 underline-offset-[0.18em] hover:decoration-slate-950 focus-visible:decoration-slate-950";

const alsoHere = [
  {
    href: "/books",
    title: "Books",
    description: (
      <>
        Quotes, notes, and ideas from books I’ve read. It started as{" "}
        <Link href="/posts/read-100-books" className={proseLinkClassName}>
          Read 100 Business Books
        </Link>{" "}
        in 2012.
      </>
    ),
  },
  {
    href: "/recipes",
    title: "Recipes",
    description: "The recipes I keep making.",
  },
  {
    href: "/places",
    title: "Places",
    description:
      "Places I’ve eaten, drunk, stayed or stopped, and would recommend to a friend.",
  },
  {
    href: "/archive",
    title: "Archive",
    description:
      "The Spin-Off Project, letters, travel stories, and the older lives of this site.",
  },
] as const;

export default async function HomePage() {
  const posts = await getPosts();
  const featured = posts.find((post) => post.featured);
  const latest = posts
    .filter((post) => post.slug !== featured?.slug)
    .slice(0, latestCount);

  return (
    <article className="pb-8">
      <div className="mx-auto max-w-[96rem] px-4 pt-7 md:px-8 md:pt-10">
        <h1 className="max-w-[9.5em] font-display text-[clamp(4.25rem,22vw,7.25rem)] leading-[0.96] tracking-[-0.03em] text-balance text-slate-950">
          I write about the things I get unusually interested in.
        </h1>

        <div className="mt-8 grid md:mt-12 md:grid-cols-12 md:gap-x-8">
          <p className="order-2 mt-6 max-w-[20rem] text-[1rem] leading-snug text-slate-700 md:order-1 md:col-span-4 md:mt-0 md:max-w-[18rem]">
            Hi, I’m Mirha, a front-end engineer and tech lead, writing again
            from Ericeira, Portugal.
          </p>
          <p className="order-1 max-w-[24rem] font-serif text-[1.15rem] leading-[1.4] text-slate-950 md:order-2 md:col-span-5 md:col-start-7 md:max-w-[28rem] md:text-[1.35rem]">
            What I’ve learned, what worked, what didn’t, and what I think is
            worth passing on.
          </p>
          <p className="order-3 mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[1rem] md:col-span-5 md:col-start-7">
            <Link href="/posts" className={textLinkClassName}>
              Read the writing
            </Link>
            <Link href="/about" className={textLinkClassName}>
              More about me
            </Link>
          </p>
        </div>

        <ExternalLink
          href="https://unsplash.com/photos/birds-eye-view-of-people-surfing-sea-waves-Eqjse2H-dak?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
          className="relative mt-14 block aspect-[8/5] overflow-hidden md:mt-20 md:aspect-[2/1]"
        >
          <Image
            src="/home/ericeira.jpg"
            alt=""
            fill
            priority
            sizes="(min-width: 96rem) 92rem, 100vw"
            className="object-cover"
          />
          <span className="sr-only">
            Photograph by João Ferreira on Unsplash
          </span>
        </ExternalLink>

        {featured ? <FeaturedPost post={featured} /> : null}

        {latest.length > 0 ? (
          <section className="mt-16 md:mt-28 lg:grid lg:grid-cols-12 lg:gap-8">
            <h2 className={`${labelClassName} lg:col-span-3`}>Latest</h2>
            <div className="mt-6 lg:col-span-7 lg:col-start-4 lg:mt-0">
              <ul className="space-y-8 md:space-y-10">
                {latest.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/posts/${post.slug}`}
                      className="group block w-fit max-w-[44rem] no-underline"
                    >
                      <h3
                        className={`${entryTitleClassName} text-[2rem] md:text-[2.35rem]`}
                      >
                        {post.title}
                      </h3>
                      <time
                        dateTime={post.date}
                        className="mt-2 block text-[1rem] leading-snug text-slate-600"
                      >
                        {formatMonthYear(post.date)}
                      </time>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-8">
                <Link href="/posts" className={textLinkClassName}>
                  All writing
                </Link>
              </p>
            </div>
          </section>
        ) : null}

        <section className="mt-16 md:mt-28">
          <h2 className={labelClassName}>Also here</h2>
          <ul className="mt-8 grid gap-10 lg:grid-cols-4 lg:gap-x-10">
            {alsoHere.map((item) => (
              <li key={item.href}>
                <h3>
                  <Link
                    href={item.href}
                    className={`${entryTitleClassName} text-[1.75rem] md:text-[2rem]`}
                  >
                    {item.title}
                  </Link>
                </h3>
                <p className="mt-3 max-w-[24rem] font-serif text-[1.05rem] leading-[1.45] text-slate-600 lg:max-w-none">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
}

function FeaturedPost({ post }: { post: Post }) {
  return (
    <section className="mt-12 md:mt-16">
      <h2 className={labelClassName}>Featured</h2>
      <h3 className="mt-4 md:mt-5">
        <Link
          href={`/posts/${post.slug}`}
          className={`${entryTitleClassName} text-[clamp(2.5rem,4.2vw,4.25rem)]`}
        >
          {post.title}
        </Link>
      </h3>
      <p className="mt-4 max-w-[36rem] font-serif text-[1.15rem] leading-[1.45] text-slate-600 md:mt-5 md:text-[1.25rem]">
        {post.description}
      </p>
    </section>
  );
}
