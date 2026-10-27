import Link from "next/link";
import { ExternalLink } from "@/components/external-link";
import { site } from "@/lib/site";

const linkClassName =
  "underline decoration-transparent hover:decoration-current focus-visible:decoration-current motion-safe:transition";

// Pages that are not built yet must not be prefetched. A prefetched 404
// logs a console error on every page that includes the footer.
const publishedPaths = new Set<string>([
  "/posts",
  "/about",
  "/recipes",
  "/books",
  "/letters",
  "/tsop",
]);

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      prefetch={publishedPaths.has(href) ? undefined : false}
      className={linkClassName}
    >
      {label}
    </Link>
  );
}

function FooterGroup({
  id,
  label,
  links,
}: {
  id: string;
  label: string;
  links: readonly { href: string; label: string }[];
}) {
  return (
    <div className="shrink-0 text-[1rem] leading-snug">
      <p id={id} className="font-medium tracking-wide text-slate-600 uppercase">
        {label}
      </p>
      <ul aria-labelledby={id} className="mt-5 grid gap-3 text-slate-950">
        {links.map(({ href, label: linkLabel }) => (
          <li key={href}>
            <FooterLink href={href} label={linkLabel} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="mx-auto mt-16 w-full max-w-[96rem] px-4 md:mt-20 md:px-8">
      <div className="flex flex-col border-t border-slate-300 pt-10 pb-8 md:min-h-[19rem] md:pb-10">
        <div className="flex flex-col gap-10 xl:flex-row xl:items-start xl:justify-between xl:gap-16">
          <div>
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
          <nav aria-label="Footer" className="xl:pt-1">
            <div className="flex flex-col gap-10 md:flex-row md:items-start md:gap-x-14 lg:gap-x-16">
              <ul className="grid w-32 shrink-0 gap-3 text-[1rem] leading-snug text-slate-950">
                {site.nav.map(({ href, label }) => (
                  <li key={href}>
                    <FooterLink href={href} label={label} />
                  </li>
                ))}
              </ul>
              <FooterGroup
                id="footer-collections"
                label="Collections"
                links={site.collections}
              />
              <FooterGroup
                id="footer-archive"
                label="Archive"
                links={site.archive}
              />
              <ul className="grid w-32 shrink-0 gap-3 text-[1rem] leading-snug text-slate-950">
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
