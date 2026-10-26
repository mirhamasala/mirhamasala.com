import Link from "next/link";
import { MobileNavigation } from "@/components/mobile-navigation";
import { site } from "@/lib/site";

const navigationLinkClassName =
  "underline decoration-transparent hover:decoration-current focus-visible:decoration-current motion-safe:transition";

export function SiteHeader() {
  return (
    <header className="relative z-10 mx-auto w-full max-w-[96rem] px-4 md:px-8">
      <div className="flex h-28 items-center justify-between border-b border-slate-300">
        <Link
          href="/"
          aria-label={`${site.name} home`}
          className="font-display text-[3rem] leading-none tracking-[-0.035em] no-underline"
        >
          mirha masala<span className="text-slate-500">.</span>
        </Link>

        <nav aria-label="Main navigation" className="hidden md:block">
          <ul className="flex items-center gap-10 text-[1.125rem] leading-none">
            {site.nav.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className={navigationLinkClassName}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <MobileNavigation navigation={site.nav} />
      </div>
    </header>
  );
}
