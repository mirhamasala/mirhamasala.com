import { Fragment } from "react";
import Link from "next/link";

const linkClassName =
  "underline decoration-transparent underline-offset-[0.18em] hover:decoration-current focus-visible:decoration-current";

export type Crumb = {
  label: string;
  href?: string;
};

const archiveSections = {
  letters: { href: "/letters", label: "Letters" },
  tsop: { href: "/tsop", label: "The Spin-Off Project" },
  "travel-stories": { href: "/travel-stories", label: "Travel Stories" },
} as const;

export type ArchiveSection = keyof typeof archiveSections;

export function archiveCrumbs(
  section: ArchiveSection = "letters",
  { current = false }: { current?: boolean } = {},
): Crumb[] {
  const item = archiveSections[section];

  return [
    { label: "Archive", href: "/archive" },
    current ? { label: item.label } : { label: item.label, href: item.href },
  ];
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    // The display title's line-height reaches up over this label.
    <nav aria-label="Breadcrumb" className="relative z-10 mb-4 md:mb-6">
      <ol className="flex items-baseline text-[1rem] leading-none font-medium tracking-[0.14em] text-slate-600 uppercase">
        {items.map((item, index) => (
          <Fragment key={item.label}>
            {index > 0 ? (
              <li aria-hidden="true" className="mx-2">
                /
              </li>
            ) : null}
            <li>
              {item.href ? (
                <Link href={item.href} className={linkClassName}>
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page">{item.label}</span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
