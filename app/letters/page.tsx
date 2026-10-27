import type { Metadata } from "next";
import Link from "next/link";
import { ArchiveEyebrow } from "@/components/archive-eyebrow";
import { formatLongDate } from "@/lib/format-date";
import { getLetters, type Letter } from "@/lib/letters";

export const metadata: Metadata = {
  title: "Letters",
  description: "Letters I sent between 2018 and 2023, kept here as they were.",
  alternates: { canonical: "/letters" },
};

export default async function LettersPage() {
  const letters = await getLetters();
  const years = lettersByYear(letters);

  return (
    <article className="pt-7 pb-8 md:pt-10">
      <header className="mx-auto max-w-[96rem] px-4 md:px-8">
        <ArchiveEyebrow current />
        <h1 className="pb-[0.28em] font-display text-[clamp(5.7rem,21vw,20rem)] leading-[0.76] tracking-[-0.045em] text-slate-950 md:text-[clamp(10rem,17.4vw,20rem)] md:tracking-[-0.055em]">
          Flying paper planes.
        </h1>
        <p className="mt-6 max-w-[34rem] font-serif text-[1.2rem] leading-[1.45] text-slate-600 md:mt-8 md:text-[1.3rem]">
          Letters I sent between 2018 and 2023, kept here as they were.
        </p>
      </header>

      <div className="mt-16 md:mt-24">
        {years.map(({ year, letters: inYear }, index) => (
          <section
            key={year}
            className={index === 0 ? undefined : "border-t border-slate-300"}
          >
            <div className="mx-auto max-w-[96rem] px-4 pt-9 pb-8 md:px-8">
              <div className="max-w-[44rem]">
                <h2 className="font-sans text-[1rem] font-medium tracking-[0.14em] text-slate-600 uppercase">
                  {year}
                </h2>
                <ul className="mt-7 space-y-10 md:space-y-12">
                  {inYear.map((letter) => (
                    <li key={letter.slug}>
                      <Link
                        href={`/letters/${letter.slug}`}
                        className="group block w-fit max-w-[44rem] no-underline"
                      >
                        <h3 className="font-display text-[2rem] leading-none tracking-[-0.02em] underline decoration-slate-300 decoration-[2px] underline-offset-[8px] group-hover:decoration-slate-950 group-focus-visible:decoration-slate-950 md:text-[2.65rem]">
                          {letter.title}
                        </h3>
                        <time
                          dateTime={letter.date}
                          className="mt-3 block text-[1rem] leading-snug text-slate-600"
                        >
                          {formatLongDate(letter.date)}
                        </time>
                        <p className="mt-3 font-serif text-[1.05rem] leading-[1.45] text-slate-600 md:mt-4 md:text-[1.15rem]">
                          {letter.description}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}

function lettersByYear(letters: Letter[]) {
  const years: { year: string; letters: Letter[] }[] = [];

  for (const letter of letters) {
    const year = letter.date.slice(0, 4);
    const group = years.find((item) => item.year === year);
    if (group) {
      group.letters.push(letter);
      continue;
    }
    years.push({ year, letters: [letter] });
  }

  return years;
}
