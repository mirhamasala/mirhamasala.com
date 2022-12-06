import Head from "next/head";

import { Card } from "@/components/Card";
import { Link } from "@/components/Link";
import { SimpleLayout } from "@/components/SimpleLayout";
import { getAllLetters } from "@/lib/getAllLetters";
import { formatDate } from "@/lib/formatDate";

function Post({ post }) {
  return (
    <article className="md:grid md:grid-cols-4 md:items-baseline">
      <Card className="md:col-span-3">
        <Card.Title href={`/letters/${post.slug}`}>{post.title}</Card.Title>
        <Card.Eyebrow
          as="time"
          dateTime={post.date}
          className="md:hidden"
          decorate
        >
          {formatDate(post.date, false)}
        </Card.Eyebrow>
        <Card.Description>{post.description}</Card.Description>
        <Card.Cta>Read letter</Card.Cta>
      </Card>
      <Card.Eyebrow
        as="time"
        dateTime={post.date}
        className="mt-1 hidden md:block"
      >
        {formatDate(post.date, false)}
      </Card.Eyebrow>
    </article>
  );
}

export default function postsIndex({ posts }) {
  return (
    <>
      <Head>
        <title>Letters - Mirha Masala</title>
        <meta name="description" content="All my newsletters in one place." />
      </Head>
      <SimpleLayout
        title="Flying paper planes bimonthly."
        intro={
          <>
            Some say it's their favorite newsletter. Leave your e-mail
            address&nbsp;
            <Link href="https://mirhamasala.us3.list-manage.com/subscribe?u=b39d94447fc443788a5295725&id=f154788ae9">
              here
            </Link>
            , and find out for yourself.
          </>
        }
      >
        <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
          <div className="flex max-w-3xl flex-col space-y-16">
            {posts.map((post) => (
              <Post key={post.slug} post={post} />
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
      posts: (await getAllLetters()).map(({ component, ...meta }) => meta),
    },
  };
}
