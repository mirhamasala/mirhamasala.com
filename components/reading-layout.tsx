import type { ReactNode } from "react";
import { DisplayTitle } from "@/components/display-title";

const readingColumnClassName = "max-w-176 md:col-span-7 md:col-start-3";

type ReadingLayoutProps = {
  title: string;
  metadata: ReactNode;
  breadcrumbs?: ReactNode;
  children: ReactNode;
};

export function ReadingLayout({
  title,
  metadata,
  breadcrumbs,
  children,
}: ReadingLayoutProps) {
  return (
    <article className="mx-auto max-w-384 overflow-x-clip px-4 pt-7 pb-8 md:px-8 md:pt-10">
      <header>
        {breadcrumbs}
        <DisplayTitle title={title} />

        <div className="mt-4 md:mt-6 md:grid md:grid-cols-12 md:gap-8">
          <div className={readingColumnClassName}>{metadata}</div>
        </div>
      </header>

      <div className="mt-10 md:mt-12 md:grid md:grid-cols-12 md:gap-8">
        <div className={readingColumnClassName}>{children}</div>
      </div>
    </article>
  );
}
