import Head from "next/head";
import Image from "next/image";

import { Link } from "@/components/Link";
import { SimpleLayout } from "@/components/SimpleLayout";

import { getAllContent } from "@/lib/getAllContent";
import { categorizeAndSortTSOPPosts } from "@/lib/categorizeAndSortTSOPPosts";

export default function postsIndex({ posts }) {
  let postsWithSpinOffDetails = categorizeAndSortTSOPPosts(posts);

  return (
    <>
      <Head>
        <title>The Spin-Off Project - Mirha Masala</title>
        <meta
          name="description"
          content="An archive of my posts from The Spin-Off Project."
        />
      </Head>
      <SimpleLayout
        title="The Spin-Off Project"
        intro={
          <>
            In 2012, I kicked off The Spin-Off Project, a personal lifestyle
            experiment, where I dove into twelve different pursuits for a month
            each. I shared my experiences on the now-defunct{" "}
            <a
              href="https://web.archive.org/web/20230130015454/http://www.thespinoffproject.com/"
              className="text-teal-500 transition hover:text-teal-600 dark:hover:text-teal-400"
            >
              thespinoffproject.com
            </a>
            , and you can read all my posts from that time below. To learn more
            about the project, have a peek at{" "}
            <Link
              href="/tsop/about"
              className="text-teal-500 transition hover:text-teal-600 dark:hover:text-teal-400"
            >
              About The Spin-Off Project
            </Link>
            .
          </>
        }
      >
        <div className="flex flex-col gap-y-20">
          {postsWithSpinOffDetails.map(({ category, img, number, posts }) => (
            <section
              key={category}
              id={category}
              className="relative isolate flex flex-col gap-6 lg:flex-row lg:gap-7"
            >
              <div className="relative aspect-[16/9] h-fit max-w-xl lg:aspect-square lg:w-60 lg:shrink-0">
                <Image
                  src={img.src}
                  priority
                  width={360}
                  height={240}
                  alt={img.alt}
                  className="absolute inset-0 h-full w-full rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
                />
              </div>
              <div className="ml-1 max-w-lg sm:ml-2 lg:mt-1 lg:ml-0">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  Spin-Off No. {number}
                </span>
                <h2 className="mt-3 text-xl font-semibold capitalize leading-6 text-zinc-800 dark:text-zinc-100">
                  {category}
                </h2>
                <ul className="mt-3 flex list-disc flex-col gap-2">
                  {posts.map((post) => (
                    <li className="prose ml-5 text-base" key={post.slug}>
                      <Link href={`/tsop/posts/${post.slug}`}>
                        {post.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
        </div>
      </SimpleLayout>
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {
      posts: (await getAllContent("tsop/posts")).map(
        ({ component, ...meta }) => meta
      ),
    },
  };
}
