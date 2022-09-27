import Head from 'next/head'

import { Card } from '@/components/Card'
import { SimpleLayout } from '@/components/SimpleLayout'
import { getAllPosts } from '@/lib/getAllPosts'
import { formatDate } from '@/lib/formatDate'

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
  )
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
  )
}

export async function getStaticProps() {
  return {
    props: {
      posts: (await getAllPosts()).map(({ component, ...meta }) => meta),
    },
  }
}
