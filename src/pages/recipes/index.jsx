import { Card } from "@/components/Card";
import { SimpleLayout } from "@/components/SimpleLayout";
import { getAllRecipes } from "@/lib/getAllRecipes";
import { formatDate } from "@/lib/formatDate";

function Post({ post }) {
  return (
    <article className="md:grid md:grid-cols-4 md:items-baseline">
      <Card className="md:col-span-3">
        <Card.Title href={`/recipes/${post.slug}`}>{post.title}</Card.Title>
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

export default function RecipesIndex({ recipes }) {
  return (
    <SimpleLayout title="Recipes" intro="A collection of my favorite recipes.">
      <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
        <div className="flex max-w-3xl flex-col space-y-16">
          {recipes.map((recipe) => (
            <Post key={recipe.slug} post={recipe} />
          ))}
        </div>
      </div>
    </SimpleLayout>
  );
}

export async function getStaticProps() {
  return {
    props: {
      recipes: (await getAllRecipes()).map(({ component, ...meta }) => meta),
    },
  };
}
