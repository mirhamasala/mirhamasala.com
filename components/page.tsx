import type { ReactNode } from "react";

export function Page({ children }: { children: ReactNode }) {
  return <article className="pt-7 pb-8 md:pt-10">{children}</article>;
}
