"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

export type PlacePinFocus = {
  slug: string;
  request: number;
};

const PlacePinContext = createContext<{
  focus: PlacePinFocus | null;
  showPin: (slug: string) => void;
} | null>(null);

export function PlacePins({ children }: { children: ReactNode }) {
  const [focus, setFocus] = useState<PlacePinFocus | null>(null);
  const showPin = useCallback((slug: string) => {
    setFocus({ slug, request: Date.now() });
  }, []);

  return (
    <PlacePinContext.Provider value={{ focus, showPin }}>
      {children}
    </PlacePinContext.Provider>
  );
}

export function usePlacePin() {
  return useContext(PlacePinContext);
}

const titleClassName =
  "cursor-pointer bg-transparent p-0 text-left font-serif text-[1.35rem] leading-snug text-slate-950 underline decoration-1 underline-offset-[0.18em] hover:decoration-slate-950 focus-visible:decoration-slate-950 md:text-[1.5rem]";

export function PlacePinButton({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  const pins = usePlacePin();
  const shown = pins?.focus?.slug === slug;

  return (
    <h4 className="font-serif text-[1.35rem] leading-snug md:text-[1.5rem]">
      <button
        type="button"
        className={
          shown
            ? `${titleClassName} decoration-slate-950`
            : `${titleClassName} decoration-slate-400`
        }
        aria-label={`${title}, show on the map`}
        onClick={() => {
          const reduce = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
          ).matches;
          document.getElementById("places-map")?.scrollIntoView({
            behavior: reduce ? "auto" : "smooth",
            block: "center",
          });
          pins?.showPin(slug);
        }}
      >
        {title}
      </button>
    </h4>
  );
}
