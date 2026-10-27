import type { Metadata } from "next";
import Link from "next/link";
import {
  bookTopics,
  getBooks,
  getRecommendedBooks,
  type Book,
} from "@/lib/books";

export const metadata: Metadata = {
  title: "Books",
  description:
    "Quotes, notes, and ideas from books I’ve read. Not a complete list.",
  alternates: { canonical: "/books" },
};

export default async function BooksPage() {
  const books = await getBooks();
  const recommended = getRecommendedBooks(books);

  return (
    <article className="pt-7 pb-8 md:pt-10">
      <header className="mx-auto max-w-[96rem] px-4 md:px-8">
        <p className="mb-4 text-[1rem] leading-none font-medium text-slate-600 md:mb-6">
          Books
        </p>
        <h1 className="pb-[0.28em] font-display text-[clamp(5.7rem,21vw,20rem)] leading-[0.76] tracking-[-0.045em] text-slate-950 md:text-[clamp(10rem,17.4vw,20rem)] md:tracking-[-0.055em]">
          What I’ve taken from the pages.
        </h1>
        <p className="mt-6 max-w-[34rem] font-serif text-[1.2rem] leading-[1.45] text-slate-600 md:mt-8 md:text-[1.3rem]">
          Quotes, notes, and ideas from books I’ve read.
        </p>
      </header>

      <section className="mx-auto mt-16 max-w-[96rem] px-4 md:mt-24 md:px-8">
        <div className="max-w-[40rem]">
          <h2 className={sectionHeadingClassName}>Start with these</h2>
          <p className="mt-3 font-serif text-[1.15rem] leading-[1.45] text-slate-600">
            A few books I find myself recommending again and again.
          </p>
          <ul className="mt-8 space-y-10 md:mt-10">
            {recommended.map((book) => (
              <li key={book.slug}>
                <BookLink book={book} featured />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-20 md:mt-28">
        <div className="mx-auto max-w-[96rem] px-4 md:px-8">
          <div className="max-w-[44rem]">
            <h2 className={sectionHeadingClassName}>The rest</h2>
            <p className="mt-3 font-serif text-[1.15rem] leading-[1.45] text-slate-600">
              By topic, most recent first. Not a complete list.
            </p>
          </div>
        </div>
        <div className="mt-8">
          {bookTopics
            .flatMap((topic) => {
              const inTopic = books.filter((book) => book.topic === topic);
              return inTopic.length === 0 ? [] : [{ topic, inTopic }];
            })
            .map(({ topic, inTopic }, index) => {
              return (
                <section
                  key={topic}
                  className={
                    index === 0 ? undefined : "border-t border-slate-300"
                  }
                >
                  <div className="mx-auto max-w-[96rem] px-4 pt-9 pb-8 md:px-8">
                    <div className="max-w-[44rem]">
                      <h3 className="font-sans text-[1rem] font-medium tracking-[0.14em] text-slate-600 uppercase">
                        {topic}
                      </h3>
                      <ul className="mt-7 space-y-3">
                        {inTopic.map((book) => (
                          <li
                            key={book.slug}
                            className="flex flex-wrap items-baseline gap-x-3"
                          >
                            <BookLink book={book} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>
              );
            })}
        </div>
      </section>
    </article>
  );
}

const sectionHeadingClassName =
  "font-display text-[2rem] leading-none tracking-[-0.02em] md:text-[2.65rem]";

const bookTitleLinkClassName =
  "underline decoration-slate-300 decoration-[2px] underline-offset-[8px] hover:decoration-slate-950 focus-visible:decoration-slate-950";

function BookLink({
  book,
  featured = false,
}: {
  book: Book;
  featured?: boolean;
}) {
  if (featured) {
    return (
      <>
        <h3 className="font-serif text-[1.35rem] leading-snug md:text-[1.5rem]">
          <Link href={`/books/${book.slug}`} className={bookTitleLinkClassName}>
            {book.title}
          </Link>
        </h3>
        <p className="mt-1.5 text-[1rem] leading-snug text-slate-600">
          {book.author}
        </p>
        {book.why ? (
          <p className="mt-2 font-serif text-[1.15rem] leading-[1.45] text-slate-800">
            {book.why}
          </p>
        ) : null}
      </>
    );
  }

  return (
    <>
      <Link
        href={`/books/${book.slug}`}
        className={`font-serif text-[1.3rem] leading-snug ${bookTitleLinkClassName}`}
      >
        {book.title}
      </Link>
      <span className="text-[1rem] leading-snug text-slate-600">
        {book.author}
      </span>
    </>
  );
}
