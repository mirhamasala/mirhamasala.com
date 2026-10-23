import Link from "next/link";
import { ExternalLink } from "@/components/external-link";
import { site } from "@/lib/site";

const linkClassName =
  "underline decoration-transparent hover:decoration-current focus-visible:decoration-current motion-safe:transition";

export function SiteFooter() {
  return (
    <footer className="mx-auto mt-16 w-full max-w-[96rem] px-4 md:mt-20 md:px-8">
      <div className="flex flex-col border-t border-slate-300 pt-10 pb-8 md:min-h-[19rem] md:pb-10">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-7">
            <p className="font-display text-[1.9rem] leading-[0.96] tracking-[-0.03em] text-slate-950 sm:text-[2.4rem] md:text-[2.85rem] lg:text-[3rem]">
              <span className="block">From Ericeira,</span>
              <em className="mt-[0.08em] block font-normal text-slate-500 italic">
                with salt in the air.
              </em>
            </p>
            <p className="mt-5 text-[1rem] leading-snug text-slate-600 md:mt-7">
              38.96°&nbsp;N, 9.42°&nbsp;W
            </p>
          </div>
          <nav
            aria-label="Footer"
            className="md:col-span-4 md:col-start-9 md:pt-1"
          >
            <div className="grid w-fit grid-cols-2 gap-x-14 sm:gap-x-16">
              <ul className="grid gap-3 text-[1rem] leading-snug text-slate-950">
                {site.nav.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className={linkClassName}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="grid gap-3 text-[1rem] leading-snug text-slate-950">
                {site.profiles.map(({ href, label }) => (
                  <li key={href}>
                    <ExternalLink href={href} className={linkClassName}>
                      {label}
                    </ExternalLink>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
        <p className="mt-auto pt-12 text-[1rem] leading-snug text-slate-600">
          {site.name} · since{" "}
          <time dateTime={String(site.since)}>{site.since}</time>
        </p>
      </div>
    </footer>
  );
}
