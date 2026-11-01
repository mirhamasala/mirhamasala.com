import Link from "next/link";
import { Container } from "@/components/container";
import { ExternalLink } from "@/components/external-link";
import { site } from "@/lib/site";

const linkClassName =
  "underline decoration-transparent hover:decoration-current focus-visible:decoration-current motion-safe:transition";

const labelClassName = "font-medium tracking-[0.14em] text-slate-600 uppercase";

const emailLinkClassName =
  "font-medium underline decoration-1 underline-offset-[0.18em]";

// Pages that are not built yet must not be prefetched. A prefetched 404
// logs a console error on every page that includes the footer.
const publishedPaths = new Set<string>([
  "/posts",
  "/about",
  "/archive",
  "/recipes",
  "/books",
  "/letters",
  "/tsop",
  "/travel-stories",
  "/places",
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
  href,
  links,
}: {
  id: string;
  label: string;
  href?: string;
  links: readonly { href: string; label: string }[];
}) {
  return (
    <div className="text-base/snug">
      {href ? (
        <Link
          id={id}
          href={href}
          prefetch={publishedPaths.has(href) ? undefined : false}
          className={`${labelClassName} ${linkClassName}`}
        >
          {label}
        </Link>
      ) : (
        <p id={id} className={labelClassName}>
          {label}
        </p>
      )}
      <ul aria-labelledby={id} className="mt-3 grid gap-3 text-slate-950">
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
    <Container as="footer" className="mt-16 w-full md:mt-20">
      <div className="grid border-t border-slate-300 pt-10 pb-8 md:pt-12 md:pb-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <p className="font-display text-[clamp(2.5rem,4.6vw,4rem)] leading-[0.96] tracking-[-0.03em] text-slate-950 lg:col-span-2 lg:row-start-1">
          <span className="block">From Ericeira,</span>
          <em className="mt-[0.06em] block font-normal text-slate-500 italic">
            with salt in the air.
          </em>
        </p>

        <p className="mt-12 text-base/snug text-slate-950 md:mt-16 lg:col-start-1 lg:row-start-2">
          38.96°&nbsp;N, 9.42°&nbsp;W
        </p>

        <nav
          aria-label="Footer"
          className="mt-12 md:mt-16 lg:col-span-2 lg:row-start-3 lg:mt-16"
        >
          <div className="grid grid-cols-1 items-start gap-y-10 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 md:grid-cols-4 md:gap-x-10 lg:flex lg:items-start lg:justify-between lg:gap-16">
            <div className="contents lg:flex lg:w-max lg:max-w-[70%] lg:shrink-0 lg:items-start lg:gap-x-16">
              <ul className="grid gap-3 text-base/snug text-slate-950">
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
                href="/archive"
                links={site.archive}
              />
            </div>
            <ul className="grid gap-3 text-base/snug text-slate-950 lg:shrink-0 lg:text-right">
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

        <div className="mt-14 max-w-md lg:col-start-2 lg:row-start-2 lg:mt-16 lg:max-w-none lg:justify-self-end lg:text-right">
          <a href={`mailto:${site.email}`} className={emailLinkClassName}>
            {site.email}
          </a>
          <p className="mt-1.5 text-base/snug text-slate-600">
            I read every email, even if replies take a while.
          </p>
        </div>

        <p className="mt-12 border-t border-slate-300 pt-6 text-base/snug text-slate-600 lg:col-span-2 lg:row-start-4 lg:mt-16">
          {site.name} · Est.{" "}
          <time dateTime={String(site.since)}>{site.since}</time>
        </p>
      </div>
    </Container>
  );
}
