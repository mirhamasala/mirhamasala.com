import type { Metadata } from "next";
import {
  Instrument_Sans,
  Instrument_Serif,
  Newsreader,
} from "next/font/google";
import Link from "next/link";
import { site } from "@/lib/site";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument-sans",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  weight: "400",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s · ${site.name}` },
  robots: site.isIndexable ? undefined : { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body
        className={`${instrumentSans.variable} ${instrumentSerif.variable} ${newsreader.variable} font-sans`}
      >
        <header className="relative z-10 flex min-h-12 items-start justify-between px-4 pt-4 text-[1rem] leading-none tracking-[0.02em] text-slate-950 md:px-8 md:pt-5">
          <Link
            href="/"
            className="group flex items-center gap-2 no-underline"
            aria-label={`${site.name} home`}
          >
            <span className="grid size-5 place-items-center rounded-full bg-slate-950 text-[1rem] leading-none text-stone-50">
              M
            </span>
            <span className="text-[1rem] font-semibold tracking-[0.16em] uppercase">
              {site.name}
            </span>
          </Link>
          <nav aria-label="Main navigation" className="hidden md:block">
            <ul className="flex items-center gap-7">
              {site.nav.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="underline decoration-transparent hover:decoration-current focus-visible:decoration-current motion-safe:transition"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <details className="group md:hidden">
            <summary className="cursor-pointer list-none marker:hidden">
              <span className="sr-only">Open navigation</span>
              <span
                aria-hidden="true"
                className="block h-4 w-5 bg-[linear-gradient(to_bottom,currentColor,currentColor_0.09375rem,transparent_0.09375rem,transparent_0.5625rem,currentColor_0.5625rem,currentColor_0.65625rem)]"
              />
            </summary>
            <ul className="absolute top-11 right-4 grid gap-3 bg-stone-50 py-3 pl-6 text-right shadow-[0_0_0_1px_theme(colors.slate.200)]">
              {site.nav.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="block px-4 py-1 underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        </header>
        <main>{children}</main>
        <footer className="mx-auto flex w-full max-w-[96rem] justify-between px-4 pt-16 pb-8 text-[1rem] leading-snug text-slate-600 md:px-8 md:pb-10">
          <p>{site.name}</p>
          <nav aria-label="Footer navigation">
            <ul className="flex gap-5">
              {site.nav.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </footer>
      </body>
    </html>
  );
}
