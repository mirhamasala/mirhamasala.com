import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Archive",
  description: "Earlier work that lives outside Writing.",
  alternates: { canonical: "/archive" },
};

export default function ArchivePage() {
  return (
    <article className="mx-auto max-w-[96rem] overflow-x-clip px-4 pt-7 pb-8 md:px-8 md:pt-10">
      <header>
        <h1 className="pb-[0.28em] font-display text-[clamp(5.7rem,21vw,20rem)] leading-[0.76] tracking-[-0.045em] text-slate-950 md:text-[clamp(10rem,17.4vw,20rem)] md:tracking-[-0.055em]">
          Archive
        </h1>
        <p className="mt-6 max-w-[34rem] font-serif text-[1.2rem] leading-[1.45] text-slate-600 md:mt-8 md:text-[1.3rem]">
          Earlier work that lives outside Writing.
        </p>
      </header>

      <ul className="mt-16 max-w-[44rem] md:mt-24">
        <li>
          <Link href="/letters" className="group block w-fit no-underline">
            <h2 className="font-display text-[2rem] leading-none tracking-[-0.02em] underline decoration-slate-300 decoration-[2px] underline-offset-[8px] group-hover:decoration-slate-950 group-focus-visible:decoration-slate-950 md:text-[2.65rem]">
              Letters
            </h2>
            <p className="mt-3 font-serif text-[1.05rem] leading-[1.45] text-slate-600 md:mt-4 md:text-[1.15rem]">
              Letters I sent between 2018 and 2023, kept here as they were.
            </p>
          </Link>
        </li>
      </ul>
    </article>
  );
}
