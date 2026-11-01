import type { ReactNode } from "react";

type IndexSectionProps = {
  children: ReactNode;
  "aria-labelledby"?: string;
};

export function IndexSection({
  children,
  "aria-labelledby": labelledBy,
}: IndexSectionProps) {
  return (
    <section
      aria-labelledby={labelledBy}
      className="border-t border-slate-300 first:border-t-0"
    >
      <div className="mx-auto max-w-384 px-4 pt-9 pb-8 md:px-8">
        <div className="max-w-176">{children}</div>
      </div>
    </section>
  );
}
