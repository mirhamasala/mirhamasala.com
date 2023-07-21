import Head from "next/head";

import { Card } from "@/components/Card";
import { Link } from "@/components/Link";
import { SimpleLayout } from "@/components/SimpleLayout";
import { getAllContent } from "@/lib/getAllContent";
import { formatDate } from "@/lib/formatDate";

function EverGreenPages() {
  const pages = [
    { title: "Read 100 Business Books", href: "/posts/read-100-books/" },
    { title: "Travel Moments", href: "/travel-moments/" },
    { title: "Travel Archives", href: "/travel-archives/" },
  ];

  return (
    <ol role="list" className="flex items-center space-x-4">
      <li>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5 flex-shrink-0 text-teal-600"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
            />
          </svg>
        </div>
      </li>
      {pages.map(({ title, href }) => (
        <li key={href}>
          <div className="flex items-center">
            <Link
              href={href}
              className="mr-4 text-sm font-medium text-zinc-600 hover:text-teal-500 dark:text-zinc-400 dark:hover:text-teal-400"
            >
              {title}
            </Link>
            {href !== pages[pages.length - 1].href && (
              <svg
                className="h-5 w-5 flex-shrink-0 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

function Post({ post }) {
  return (
    <article className="md:grid md:grid-cols-4 md:items-baseline">
      <Card className="md:col-span-3">
        <Card.Title href={`/posts/${post.slug}`}>{post.title}</Card.Title>
        <Card.Eyebrow
          as="time"
          dateTime={post.date}
          className="md:hidden"
          decorate
        >
          {formatDate(post.date)}
        </Card.Eyebrow>
        <Card.Description>{post.description}</Card.Description>
        <Card.Cta>Read post</Card.Cta>
      </Card>
      <Card.Eyebrow
        as="time"
        dateTime={post.date}
        className="mt-1 hidden md:block"
      >
        {formatDate(post.date)}
      </Card.Eyebrow>
    </article>
  );
}

export default function postsIndex({ posts }) {
  return (
    <>
      <Head>
        <title>Posts - Mirha Masala</title>
        <meta
          name="description"
          content="All of my posts on lifestyle experiments, creative projects, and favorite apps, books, travel recommendations, and more."
        />
      </Head>
      <SimpleLayout
        title="Writing about lifestyle experiments and creative projects."
        intro="And sharing my favorite apps, books, travel recommendations, and more."
        introExtra={<EverGreenPages />}
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
      posts: (await getAllContent("posts")).map(
        ({ component, ...meta }) => meta
      ),
    },
  };
}
