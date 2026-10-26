"use client";

import { useRef } from "react";
import Link from "next/link";

type NavigationItem = {
  readonly href: string;
  readonly label: string;
};

type MobileNavigationProps = {
  navigation: readonly NavigationItem[];
};

export function MobileNavigation({ navigation }: MobileNavigationProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  function closeMenu() {
    dialogRef.current?.close();
  }

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label="Open main menu"
        className="grid size-11 place-items-center"
        onClick={() => dialogRef.current?.showModal()}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="size-7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M3 7.5h18M3 16.5h18" />
        </svg>
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Main navigation"
        className="m-0 h-dvh max-h-none w-full max-w-none border-0 bg-stone-50 p-0 text-slate-950 backdrop:bg-slate-950/20"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeMenu();
        }}
      >
        <div className="flex min-h-dvh flex-col px-4">
          <div className="flex h-28 items-center justify-between border-b border-slate-300">
            <Link
              href="/"
              aria-label="Mirha Masala home"
              className="font-display text-[3rem] leading-none tracking-[-0.035em] no-underline"
              onNavigate={closeMenu}
            >
              mirha masala<span className="text-slate-500">.</span>
            </Link>
            <button
              type="button"
              aria-label="Close main menu"
              className="grid size-11 place-items-center"
              onClick={closeMenu}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="size-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M5 5l14 14M19 5 5 19" />
              </svg>
            </button>
          </div>

          <nav aria-label="Mobile navigation" className="pt-10">
            <ul className="grid">
              {navigation.map(({ href, label }) => (
                <li key={href} className="border-b border-slate-300">
                  <Link
                    href={href}
                    className="block py-5 text-[1.75rem] leading-none no-underline"
                    onNavigate={closeMenu}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </dialog>
    </div>
  );
}
