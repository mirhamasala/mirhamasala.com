import type { ReactNode } from "react";

export function PageLede({ children }: { children: ReactNode }) {
  return (
    <p className="mt-6 max-w-[34rem] font-serif text-[1.2rem] leading-[1.45] text-slate-600 md:mt-8 md:text-[1.3rem]">
      {children}
    </p>
  );
}
