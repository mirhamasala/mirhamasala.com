import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Places",
  description: "Spots Mirha keeps sending people to.",
  alternates: { canonical: "/places" },
};

export default function PlacesPage() {
  return (
    <article className="mx-auto max-w-[96rem] overflow-x-clip px-4 pt-7 pb-8 md:px-8 md:pt-10">
      <header>
        <p className="mb-4 text-[1rem] leading-none font-medium text-slate-600 md:mb-6">
          Places
        </p>
        <h1 className="font-display text-[clamp(5.7rem,21vw,20rem)] leading-[0.76] tracking-[-0.045em] text-slate-950 md:text-[clamp(10rem,17.4vw,20rem)] md:tracking-[-0.055em]">
          Places I’d recommend.
        </h1>
        <p className="mt-6 max-w-[34rem] font-serif text-[1.2rem] leading-[1.45] text-slate-600 md:mt-8 md:text-[1.3rem]">
          Spots I keep sending people to.
        </p>
      </header>
    </article>
  );
}
