import Link from "next/link";

const linkClassName =
  "underline decoration-transparent underline-offset-[0.18em] hover:decoration-current focus-visible:decoration-current";

export function ArchiveEyebrow({ current }: { current?: "letters" }) {
  return (
    // The display title's line-height reaches up over this label.
    <nav aria-label="Breadcrumb" className="relative z-10 mb-4 md:mb-6">
      <ol className="flex items-baseline text-[1rem] leading-none font-medium tracking-[0.14em] text-slate-600 uppercase">
        <li>
          <Link href="/archive" className={linkClassName}>
            Archive
          </Link>
        </li>
        <li aria-hidden="true" className="mx-2">
          /
        </li>
        <li>
          {current === "letters" ? (
            <span aria-current="page">Letters</span>
          ) : (
            <Link href="/letters" className={linkClassName}>
              Letters
            </Link>
          )}
        </li>
      </ol>
    </nav>
  );
}
