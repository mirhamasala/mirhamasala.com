import type { ReactNode } from "react";

type ReadingColumnProps = {
  children: ReactNode;
  className?: string;
};

export function ReadingColumn({
  children,
  className = "",
}: ReadingColumnProps) {
  return (
    <div className={`md:grid md:grid-cols-12 md:gap-8 ${className}`.trim()}>
      <div className="max-w-176 md:col-span-7 md:col-start-3">{children}</div>
    </div>
  );
}
