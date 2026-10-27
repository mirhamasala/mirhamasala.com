import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
    <>
      <article className="mx-auto max-w-[96rem] px-4 pt-7 md:px-8 md:pt-10">
        <header className="md:grid md:grid-cols-12 md:gap-8">
          <div className="max-w-[44rem] md:col-span-7 md:col-start-3">
            <h1 className="pb-[0.08em] font-display text-[clamp(3.8rem,10vw,7.5rem)] leading-[0.88] tracking-[-0.04em] text-slate-950 md:text-[clamp(4.75rem,6.5vw,7.5rem)]">
              {book.title}
            </h1>
            {book.subtitle ? (
              <p className="mt-4 font-serif text-[1.35rem] leading-[1.3] text-slate-700 italic md:mt-5 md:text-[1.6rem]">
                {book.subtitle}
              </p>
            ) : null}
            <p className="mt-5 text-[1rem] leading-snug text-slate-950">
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
        </header>
      </article>

      {quote ? (
        <div className="mt-14 bg-slate-900 md:mt-20">
          <div className="mx-auto max-w-[96rem] px-4 py-12 md:grid md:grid-cols-12 md:gap-8 md:px-8 md:py-16">
            <div className="max-w-[62rem] md:col-span-8 md:col-start-3">
              <BookLeadQuote source={quote} />
            </div>
          </div>
        </div>
      ) : null}

      {rest ? (
        <div
          className={`mx-auto max-w-[96rem] px-4 pb-8 md:grid md:grid-cols-12 md:gap-8 md:px-8 ${quote ? "pt-14 md:pt-20" : "pt-12 md:pt-16"}`}
        >
          <div className="max-w-[44rem] md:col-span-7 md:col-start-3">
            <BookMarkdownContent source={rest} />
          </div>
        </div>
      ) : null}
    </>
  );
}
