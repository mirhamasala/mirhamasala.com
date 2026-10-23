import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Mirha is a front-end engineer and tech lead in Ericeira, Portugal, writing again and following ideas simply because she’s curious about them.",
  alternates: { canonical: "/about" },
};

const currently = [
  ["Reading", "[Book title]"],
  ["Cooking", "[Something on repeat]"],
  ["Learning", "[A new skill or idea]"],
  ["Working on", "This site, again."],
] as const;

function PortraitPlaceholder() {
  return (
    <figure className="w-full max-w-[22rem] sm:max-w-[30rem] md:max-w-none">
      <div className="flex aspect-[4/5] items-end bg-slate-200 p-4 text-[1rem] leading-snug text-slate-700 md:p-5">
        (Your portrait — one strong image)
      </div>
      <figcaption className="mt-3 text-[1rem] leading-snug text-slate-700">
        Ericeira, Portugal
      </figcaption>
    </figure>
  );
}

function CurrentlyList() {
  return (
    <section
      aria-labelledby="currently-heading"
      className="mt-12 font-sans md:mt-14"
    >
      <div className="mb-3 flex items-baseline justify-between gap-6 border-b border-slate-300 pb-2">
        <h2
          id="currently-heading"
          className="text-[1rem] leading-none font-semibold tracking-[0.01em]"
        >
          Currently
        </h2>
        <p className="text-[1rem] leading-none text-slate-600">
          (November 2026)
        </p>
      </div>
      <dl className="divide-y divide-slate-300 border-b border-slate-300">
        {currently.map(([label, value]) => (
          <div
            key={label}
            className="grid grid-cols-[7.25rem_1fr] gap-4 py-3 md:grid-cols-[8rem_1fr]"
          >
            <dt className="text-[1rem] leading-snug font-semibold text-slate-700">
              {label}
            </dt>
            <dd className="font-display text-[1.55rem] leading-none text-slate-950 md:text-[1.75rem]">
              {value === "This site, again." ? (
                <>
                  This site, <em className="text-slate-600">again.</em>
                </>
              ) : (
                value
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default function AboutPage() {
  return (
    <article className="overflow-x-clip pb-8">
      <section className="mx-auto max-w-[96rem] px-4 pt-7 md:px-8 md:pt-10">
        <p className="mb-4 text-[1rem] leading-none font-medium text-slate-600 md:mb-6">
          About
        </p>
        <h1 className="font-display text-[clamp(5.7rem,21vw,20rem)] leading-[0.76] tracking-[-0.045em] text-slate-950 md:text-[clamp(10rem,17.4vw,20rem)] md:tracking-[-0.055em]">
          <span className="block md:inline">Hi, I’m </span>
          <em className="block font-normal text-slate-500 italic md:ml-[0.05em] md:inline">
            Mirha.
          </em>
        </h1>

        <div className="mt-6 border-t border-slate-300 pt-3 md:mt-10 md:grid md:grid-cols-12 md:gap-8 md:pt-5">
          <p className="max-w-[23rem] text-[1rem] leading-snug text-slate-700 sm:max-w-[34rem] md:col-span-4">
            Front-end engineer and tech lead.
            <br />
            Writing again from Ericeira, Portugal.
          </p>
          <p className="mt-6 max-w-[22rem] font-serif text-[1.18rem] leading-[1.22] text-slate-950 sm:max-w-[34rem] md:col-span-5 md:col-start-7 md:mt-0 md:max-w-none md:text-[1.45rem] lg:text-[1.65rem]">
            For a long time, this website followed whatever I was curious about.
            I wrote about learning new things, building projects, travelling,
            food, books, work, and eventually becoming a mother.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 grid max-w-[96rem] gap-12 px-4 md:mt-24 md:grid-cols-12 md:gap-8 md:px-8">
        <div className="md:col-span-5">
          <PortraitPlaceholder />
        </div>
        <div className="max-w-[22rem] font-serif text-[1.08rem] leading-[1.45] text-slate-950 sm:max-w-[34rem] md:col-span-5 md:col-start-7 md:max-w-none md:text-[1.18rem] md:leading-[1.46]">
          <p>
            Somewhere along the way, I stopped writing as much and built a
            career in technology instead. I’ve spent the last several years
            working as a front-end engineer and tech lead, building things for
            the web.
          </p>
          <p className="mt-7">
            Life changed too. I moved to Portugal, settled by the sea in
            Ericeira, and had two children. For a while, that was more than
            enough change.
          </p>
          <CurrentlyList />
        </div>
      </section>

      <section className="mt-24 bg-slate-900 py-12 text-stone-50 md:mt-28 md:py-28">
        <div className="mx-auto max-w-[96rem] px-4 md:px-8">
          <h2 className="max-w-[68rem] font-display text-[clamp(3.8rem,13vw,13rem)] leading-[0.9] tracking-[-0.02em] md:text-[clamp(6rem,8.7vw,10.5rem)] md:leading-[0.86] md:tracking-[-0.03em]">
            Lately I’ve found myself wondering{" "}
            <em className="block font-normal text-slate-400 italic md:inline">
              what comes next.
            </em>
          </h2>
        </div>
      </section>

      <section className="mx-auto grid max-w-[96rem] gap-16 px-4 pt-16 md:grid-cols-12 md:gap-8 md:px-8 md:pt-28">
        <p className="max-w-[22rem] font-serif text-[1.08rem] leading-[1.45] text-slate-950 sm:max-w-[34rem] md:col-span-4 md:col-start-7 md:max-w-none md:text-[1.18rem]">
          I’m not looking to abandon the life or career I’ve built.
        </p>

        <div className="max-w-[22rem] font-display text-[clamp(2.25rem,5.2vw,5rem)] leading-[1.08] tracking-normal text-slate-950 sm:max-w-[34rem] md:col-span-8 md:row-start-2 md:max-w-none md:text-[clamp(3.25rem,4.5vw,4.4rem)] md:leading-[1.02] md:tracking-[-0.015em]">
          <p>
            But I miss following an idea simply because I’m curious about it.
          </p>
          <p>
            I miss making things that are{" "}
            <em className="font-normal text-slate-500 italic">mine</em>.
          </p>
          <p>And I miss writing things down.</p>
        </div>

        <div className="max-w-[22rem] font-serif text-[1.08rem] leading-[1.45] text-slate-950 sm:max-w-[34rem] md:col-span-4 md:col-start-7 md:row-start-3 md:mt-8 md:max-w-none md:text-[1.18rem]">
          <h2 className="font-display text-[2rem] leading-[1] tracking-normal md:text-[3.2rem] md:tracking-[-0.02em]">
            So this is me picking that thread back up.
          </h2>
          <p className="mt-6">
            I don’t know exactly what MirhaMasala will become this time. That’s
            partly the point. I’ll write about the things I get unusually
            interested in — what I learn, what works, what doesn’t, and the
            things I think are worth passing on.
          </p>
          <p className="mt-5">
            Some of it will be personal. Some practical. Some probably quite
            niche.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[96rem] px-4 pt-20 md:px-8 md:pt-28">
        <p className="font-display text-[clamp(4.2rem,15vw,14rem)] leading-[0.82] tracking-[-0.04em] text-slate-950 md:tracking-[-0.045em]">
          We’ll see
          <br />
          <em className="font-normal text-slate-500 italic">where it goes.</em>
        </p>
      </section>
    </article>
  );
}
