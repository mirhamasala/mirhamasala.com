import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DisplayTitle } from "@/components/display-title";
import { ExternalLink } from "@/components/external-link";
import { getBook, getBooks, splitLeadQuote } from "@/lib/books";
import { BookLeadQuote, BookMarkdownContent } from "@/lib/markdown";

export const dynamicParams = false;

export async function generateStaticParams() {
  const books = await getBooks();
  return books.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/books/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const book = await getBook(slug);
  if (!book) return {};

  return {
    title: book.title,
    description: book.description,
    alternates: { canonical: `/books/${book.slug}` },
  };
}

function isHttpUrl(url: string): url is `http${string}` {
  return url.startsWith("http://") || url.startsWith("https://");
}

export default async function BookPage({ params }: PageProps<"/books/[slug]">) {
  const { slug } = await params;
  const book = await getBook(slug);
  if (!book) notFound();

  const { quote, rest } = splitLeadQuote(book.body);

  return (
    <article className="mx-auto max-w-[96rem] overflow-x-clip px-4 pt-7 pb-8 md:px-8 md:pt-10">
      <header>
        <DisplayTitle title={book.title} />

        <div className="mt-4 md:mt-6 md:grid md:grid-cols-12 md:gap-8">
          <div className="max-w-[44rem] md:col-span-7 md:col-start-3">
            {book.subtitle ? (
              <p className="font-serif text-[1.2rem] leading-[1.35] text-slate-700 italic md:text-[1.35rem]">
                {book.subtitle}
              </p>
            ) : null}
            <p
              className={`text-[1rem] leading-snug text-slate-950 ${book.subtitle ? "mt-5" : ""}`}
            >
              {book.author}
            </p>
            {isHttpUrl(book.url) ? (
              <p className="mt-3">
                <ExternalLink
                  href={book.url}
                  className="text-[1rem] leading-snug underline decoration-slate-400 underline-offset-[0.15em] hover:decoration-slate-950"
                >
                  Find this book
                </ExternalLink>
              </p>
            ) : null}
          </div>
        </div>
      </header>

      {quote ? (
        <div className="mt-16 md:mt-24 md:grid md:grid-cols-12 md:gap-8">
          <div className="max-w-[62rem] md:col-span-8 md:col-start-3">
            <BookLeadQuote source={quote} />
          </div>
        </div>
      ) : null}

      {rest ? (
        <div
          className={`md:grid md:grid-cols-12 md:gap-8 ${quote ? "mt-12 md:mt-16" : "mt-10 md:mt-12"}`}
        >
          <div className="max-w-[44rem] md:col-span-7 md:col-start-3">
            <BookMarkdownContent source={rest} />
          </div>
        </div>
      ) : null}
    </article>
  );
}
