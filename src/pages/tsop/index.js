import Head from "next/head";

import { Link } from "@/components/Link";
import { SimpleLayout } from "@/components/SimpleLayout";

import { getAllContent } from "@/lib/getAllContent";
import { categorizeAndSortTSOPPosts } from "@/lib/categorizeAndSortTSOPPosts";

export default function postsIndex({ posts }) {
  posts = categorizeAndSortTSOPPosts(posts);

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
            In 2012, I started a lifestyle experiment called The Spin-Off
            Project. I picked twelve things I wanted to do or learn and devoted
            a month to each. I wrote about my experiences on the now defunct{" "}
            <Link
              href="https://web.archive.org/web/20230130015454/http://www.thespinoffproject.com/"
              className="text-teal-500 transition hover:text-teal-600 dark:hover:text-teal-400"
            >
              thespinoffproject.com
            </Link>
            . Below is an archive of all the posts and pages I published.
          </>
        }
      >
        <div className="flex flex-col gap-y-16 md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
          {posts.map(({ spinoffNumber, spinOffName, posts }) => (
            <section key={spinOffName} id={spinOffName}>
              <h2 className="text-base font-semibold capitalize tracking-tight text-zinc-800 dark:text-zinc-100">
                {spinOffName} · spin-off no. {spinoffNumber}
              </h2>
              <ul className="prose">
                {posts.map((post) => (
                  <li className="prose" key={post.slug}>
                    <Link href={`/tsop/posts/${post.slug}`}>{post.title}</Link>
                  </li>
                ))}
              </ul>
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
