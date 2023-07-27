import Head from "next/head";
import Image from "next/image";

import { Link } from "@/components/Link";
import { SimpleLayout } from "@/components/SimpleLayout";

import { getAllContent } from "@/lib/getAllContent";

export default function postsIndex({ posts }) {
  return (
    <>
      <Head>
        <title>Moments - Mirha Masala</title>
        <meta
          name="description"
          content="Everyday observations inspired by the good ol' Instagram times, mostly encountered when traveling."
        />
      </Head>
      <SimpleLayout
        title="Telling short stories, mainly drawn from days spent traveling."
        intro={
          <>
            Inspired by long dinner conversations during{" "}
            <Link
              href="/posts/the-making-of-slow-retreats"
              className="text-teal-500 transition hover:text-teal-600 dark:hover:text-teal-400"
            >
              the Reset retreat
            </Link>
            , a missing for Instagram as it used to be, to share, write, and
            connect with like-minded people, and a weekend away, alone, in
            Lisbon, words came flooding, and I decided to put them down.
          </>
        }
      >
        <div className="md:pl-6">
          <div className="grid max-w-3xl grid-cols-3 gap-1">
            {posts.map((post) => (
              <Link href={`/moments/${post.slug}`} key={post.slug}>
                <Image
                  src={`/pages/moments/${post.image.src}`}
                  priority={posts.slice(0, 9).includes(post) ? true : false}
                  width={312}
                  height={312}
                  alt={post.image.alt}
                  className="aspect-square rounded bg-zinc-100 object-cover dark:bg-zinc-800"
                />
              </Link>
            ))}
          </div>
        </div>
      </SimpleLayout>
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {
      posts: (await getAllContent("moments")).map(
        ({ component, ...meta }) => meta
      ),
    },
  };
}
