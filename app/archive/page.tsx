import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArchiveLetterPick,
  type ArchiveLetter,
} from "@/components/archive-letter-pick";
import { PageHeader } from "@/components/page-header";
import { getLetters } from "@/lib/letters";
import { spinOffs } from "@/lib/tsop";

export const metadata: Metadata = {
  title: "Archive",
  description: "Earlier work that lives outside Writing.",
  alternates: { canonical: "/archive" },
};

const places = [
  {
    name: "Tel Aviv and Jerusalem",
    when: "June – July 2015",
    href: "/travel-stories#israel",
  },
  {
    name: "Sydney",
    when: "May 2016, August 2017",
    href: "/travel-stories#sydney",
  },
  {
    name: "Kalpitiya and Colombo, Sri Lanka",
    when: "June – August 2016",
    href: "/travel-stories#sri-lanka",
  },
  {
    name: "Sarajevo",
    when: "October – November 2016",
    href: "/travel-stories#sarajevo",
  },
  {
    name: "Tokyo",
    when: "November – December 2016",
    href: "/travel-stories#tokyo",
  },
  {
    name: "Rusutsu, Japan",
    when: "February 2017",
    href: "/travel-stories#japan",
  },
];

export default async function ArchivePage() {
  const letters = await getLetters();
  const archiveLetters: ArchiveLetter[] = letters.map(
    ({ title, slug, description }) => ({ title, slug, description }),
  );

  return (
    <article className="pt-7 pb-8 md:pt-10">
      <PageHeader
        title="Archive"
        lede="Earlier work that lives outside Writing."
      />

      <div className="mx-auto mt-16 max-w-[96rem] px-4 md:mt-24 md:px-8">
        <div className="flex flex-col">
          <ArchiveEntry years="2012 – 2017" titleId="tsop">
            <SectionTitle href="/tsop" id="tsop" published>
              The Spin-Off Project
            </SectionTitle>
            <p className="mt-6 max-w-[36rem] font-serif text-[1.3125rem] leading-[1.55] text-pretty text-slate-600">
              Twelve lifestyles in five years, to find out what I wanted to do
              for a living.
            </p>
            <p
              id="tsop-list"
              className="mt-10 font-sans text-[1rem] tracking-[0.08em] text-slate-600 uppercase md:mt-14"
            >
              The twelve spin-offs
            </p>
            <ol
              aria-labelledby="tsop-list"
              className="mt-4 grid max-w-[44rem] grid-cols-2 gap-x-8 min-[40rem]:grid-cols-3"
            >
              {spinOffs.map((spinOff, index) => (
                <li
                  key={spinOff.id}
                  className="flex items-baseline gap-3 py-[0.35rem] font-serif text-[1.25rem] text-slate-800"
                >
                  <span
                    aria-hidden="true"
                    className="min-w-6 font-sans text-[1rem] text-slate-600 tabular-nums"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <Link
                    href={`/tsop#${spinOff.id}`}
                    className="underline decoration-slate-300 decoration-[2px] underline-offset-[6px] hover:decoration-slate-950 focus-visible:decoration-slate-950"
                  >
                    {spinOff.title}
                  </Link>
                </li>
              ))}
            </ol>
          </ArchiveEntry>

          <ArchiveEntry years="2015 – 2017" titleId="travel">
            <SectionTitle href="/travel-stories" id="travel" published>
              Travel Stories
            </SectionTitle>
            <p className="mt-6 max-w-[36rem] font-serif text-[1.3125rem] leading-[1.55] text-pretty text-slate-600">
              Travel stories, photographs and recommendations originally
              published on Instagram.
            </p>
            <p
              id="travel-list"
              className="mt-10 font-sans text-[1rem] tracking-[0.08em] text-slate-600 uppercase md:mt-14"
            >
              Where they were posted from
            </p>
            <ul aria-labelledby="travel-list" className="mt-4 max-w-[44rem]">
              {places.map((place) => (
                <li key={place.href}>
                  <Link
                    href={place.href}
                    className="grid grid-cols-1 gap-x-6 py-[0.45rem] no-underline min-[30rem]:grid-cols-[minmax(0,1fr)_auto] min-[30rem]:items-baseline"
                  >
                    <span className="font-serif text-[1.375rem] text-slate-950 underline decoration-slate-300 decoration-[2px] underline-offset-[8px] hover:decoration-slate-950 focus-visible:decoration-slate-950">
                      {place.name}
                    </span>
                    <span className="font-sans text-[1rem] text-slate-600 tabular-nums min-[30rem]:text-right min-[30rem]:whitespace-nowrap">
                      {place.when}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </ArchiveEntry>

          <ArchiveEntry years="2018 – 2023" titleId="letters">
            <SectionTitle href="/letters" id="letters" published>
              Letters
            </SectionTitle>
            <p className="mt-6 max-w-[36rem] font-serif text-[1.3125rem] leading-[1.55] text-pretty text-slate-600">
              Letters I sent from 2018 to 2023.
            </p>
            <p
              id="letters-list"
              className="mt-10 font-sans text-[1rem] tracking-[0.08em] text-slate-600 uppercase md:mt-14"
            >
              A few of them
            </p>
            <ArchiveLetterPick letters={archiveLetters} />
          </ArchiveEntry>
        </div>
      </div>
    </article>
  );
}

function ArchiveEntry({
  years,
  titleId,
  children,
}: {
  years: string;
  titleId: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby={titleId}
      className="grid grid-cols-1 gap-4 border-t border-slate-300 py-12 last:pb-20 md:py-24 md:last:pb-32 min-[56rem]:grid-cols-[14rem_minmax(0,1fr)] min-[56rem]:gap-12"
    >
      <p className="pt-[0.6em] font-sans text-[1rem] tracking-[0.02em] text-slate-600 tabular-nums">
        {years}
      </p>
      <div className="flex min-w-0 flex-col">{children}</div>
    </section>
  );
}

function SectionTitle({
  href,
  id,
  published = false,
  children,
}: {
  href: string;
  id: string;
  published?: boolean;
  children: ReactNode;
}) {
  return (
    <h2
      id={id}
      className="font-display text-[clamp(2.75rem,6vw,4.75rem)] leading-none tracking-[-0.02em] text-balance text-slate-950"
    >
      <Link
        href={href}
        prefetch={published ? undefined : false}
        className="underline decoration-slate-300 decoration-[2px] underline-offset-[8px] hover:decoration-slate-950 focus-visible:decoration-slate-950"
      >
        {children}
      </Link>
    </h2>
  );
}
