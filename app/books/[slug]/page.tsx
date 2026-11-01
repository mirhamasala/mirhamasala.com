import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { DisplayTitle } from "@/components/display-title";
import { ExternalLink } from "@/components/external-link";
import { ReadingColumn } from "@/components/reading-column";
import { getBook, getBooks, splitLeadQuote } from "@/lib/books";
import {
  BookLeadQuote,
  BookMarkdownContent,
  proseLinkClassName,
} from "@/lib/markdown";

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
    <Container as="article" className="overflow-x-clip pt-7 pb-8 md:pt-10">
      <header>
        <DisplayTitle title={book.title} />

        <ReadingColumn className="mt-4 md:mt-6">
          {book.subtitle ? (
            <p className="font-serif text-[1.2rem] leading-[1.35] text-slate-700 italic md:text-[1.35rem]">
              {book.subtitle}
            </p>
          ) : null}
          <p
            className={`text-base/snug text-slate-950 ${book.subtitle ? "mt-5" : ""}`}
          >
            {book.author}
          </p>
          {isHttpUrl(book.url) ? (
            <p className="mt-3">
              <ExternalLink
                href={book.url}
                className={`text-base/snug ${proseLinkClassName}`}
              >
                Find this book
              </ExternalLink>
            </p>
          ) : null}
        </ReadingColumn>
      </header>

      {quote ? (
        <div className="mt-16 md:mt-24 md:grid md:grid-cols-12 md:gap-8">
          <div className="max-w-248 md:col-span-8 md:col-start-3">
            <BookLeadQuote source={quote} />
          </div>
        </div>
      ) : null}

      {rest ? (
        <ReadingColumn className={quote ? "mt-12 md:mt-16" : "mt-10 md:mt-12"}>
          <BookMarkdownContent source={rest} />
        </ReadingColumn>
      ) : null}
    </Container>
  );
}
