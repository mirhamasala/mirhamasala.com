"use client";

import Link from "next/link";
import { useState } from "react";

const initialSlugs = [
  "lost-on-mars-111223",
  "spike-it-070822",
  "paper-planes-packets-1020",
];

export type ArchiveLetter = {
  title: string;
  slug: string;
  description: string;
};

export function ArchiveLetterPick({ letters }: { letters: ArchiveLetter[] }) {
  const [shown, setShown] = useState(() =>
    initialSlugs.filter((slug) =>
      letters.some((letter) => letter.slug === slug),
    ),
  );
  const [isFresh, setIsFresh] = useState(false);
  const picked = shown.flatMap((slug) => {
    const letter = letters.find((item) => item.slug === slug);
    return letter ? [letter] : [];
  });

  function shuffle() {
    setShown((current) => {
      const pool = letters.filter((letter) => !current.includes(letter.slug));
      const copy = [...pool];

      for (let index = copy.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        const currentLetter = copy[index];
        copy[index] = copy[swapIndex];
        copy[swapIndex] = currentLetter;
      }

      return copy
        .slice(0, 3)
        .sort((a, b) => letters.indexOf(a) - letters.indexOf(b))
        .map((letter) => letter.slug);
    });
    setIsFresh(false);
    requestAnimationFrame(() => setIsFresh(true));
  }

  return (
    <>
      <ul
        aria-labelledby="letters-list"
        aria-live="polite"
        className="mt-5 flex max-w-[44rem] flex-col gap-7"
      >
        {picked.map((letter, index) => (
          <li
            key={letter.slug}
            className={
              isFresh
                ? "flex flex-col gap-[0.35rem] motion-safe:animate-archive-in"
                : "flex flex-col gap-[0.35rem]"
            }
            style={isFresh ? { animationDelay: `${index * 40}ms` } : undefined}
          >
            <Link
              href={`/letters/${letter.slug}`}
              className="w-fit font-serif text-[1.5rem] leading-[1.3] text-slate-950 italic underline decoration-slate-300 decoration-[2px] underline-offset-[8px] hover:decoration-slate-950 focus-visible:decoration-slate-950"
            >
              {letter.title}
            </Link>
            <p className="max-w-[36rem] font-serif text-[1.125rem] leading-[1.55] text-pretty text-slate-600">
              {letter.description}
            </p>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={shuffle}
        className="mt-7 inline-flex min-h-11 cursor-pointer items-center self-start border border-slate-300 bg-transparent px-[1.15rem] py-2 font-serif text-[1.1875rem] text-slate-950 hover:border-slate-950 motion-safe:transition-colors"
      >
        Three others, at random
      </button>
    </>
  );
}
