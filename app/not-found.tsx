import Link from "next/link";
import type { ReactNode } from "react";
import { PageHeader } from "@/components/page-header";

const contentLinkClassName =
  "underline decoration-slate-300 decoration-[2px] underline-offset-[6px] hover:decoration-slate-950 focus-visible:decoration-slate-950";

const titleClassName =
  "font-display text-[clamp(2rem,3.2vw,2.75rem)] leading-none tracking-[-0.02em] text-slate-950";

function ContentLink({
  href,
  children,
  prefetch,
}: {
  href: string;
  children: ReactNode;
  prefetch?: false;
}) {
  return (
    <Link href={href} prefetch={prefetch} className={contentLinkClassName}>
      {children}
    </Link>
  );
}

export default function NotFound() {
  return (
    <article className="pt-7 pb-8 md:pt-10">
      <PageHeader
        eyebrow="404 · Page not found"
        title="Nothing here."
        lede={
          <>
            That page isn’t here. It may have moved, or the link might be out of
            date. You can try one of the places below, or head back to the{" "}
            <ContentLink href="/">homepage</ContentLink>.
          </>
        }
      />

      <ol className="mx-auto mt-16 max-w-[96rem] list-none px-4 md:mt-24 md:px-8">
        <li className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-2 py-5 md:grid-cols-[3rem_minmax(0,1fr)] md:gap-x-4 md:py-7">
          <span
            aria-hidden="true"
            className="pt-[0.45em] font-sans text-[1rem] text-slate-500 tabular-nums"
          >
            01
          </span>
          <div className="min-w-0">
            <Link
              href="/posts"
              className={`${titleClassName} underline decoration-slate-300 decoration-[2px] underline-offset-[8px] hover:decoration-slate-950 focus-visible:decoration-slate-950`}
            >
              Writing
            </Link>
            <p className="mt-2 max-w-[34rem] font-serif text-[1.05rem] leading-[1.45] text-slate-600 md:text-[1.15rem]">
              Things I’ve learned, noticed and thought worth passing on.
            </p>
          </div>
        </li>

        <li className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-2 py-5 md:grid-cols-[3rem_minmax(0,1fr)] md:gap-x-4 md:py-7">
          <span
            aria-hidden="true"
            className="pt-[0.45em] font-sans text-[1rem] text-slate-500 tabular-nums"
          >
            02
          </span>
          <div className="min-w-0">
            <p className={titleClassName}>Collections</p>
            <p className="mt-2 max-w-[34rem] font-serif text-[1.05rem] leading-[1.45] text-slate-600 md:text-[1.15rem]">
              <ContentLink href="/books">Books I’ve read</ContentLink>,{" "}
              <ContentLink href="/recipes">recipes I make</ContentLink>, and{" "}
              <ContentLink href="/places">places I’d recommend</ContentLink>.
            </p>
          </div>
        </li>

        <li className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-2 py-5 md:grid-cols-[3rem_minmax(0,1fr)] md:gap-x-4 md:py-7">
          <span
            aria-hidden="true"
            className="pt-[0.45em] font-sans text-[1rem] text-slate-500 tabular-nums"
          >
            03
          </span>
          <div className="min-w-0">
            <p className={titleClassName}>Archive</p>
            <p className="mt-2 max-w-[34rem] font-serif text-[1.05rem] leading-[1.45] text-slate-600 md:text-[1.15rem]">
              Older projects and parts of the site, including{" "}
              <ContentLink href="/tsop">TSOP</ContentLink>,{" "}
              <ContentLink href="/letters">the letters</ContentLink>, and{" "}
              <ContentLink href="/travel-stories">travel stories</ContentLink>.
            </p>
          </div>
        </li>
      </ol>
    </article>
  );
}
