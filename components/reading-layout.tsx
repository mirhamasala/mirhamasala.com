import type { ReactNode } from "react";
import { Container } from "@/components/container";
import { DisplayTitle } from "@/components/display-title";
import { ReadingColumn } from "@/components/reading-column";

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
    <Container as="article" className="overflow-x-clip pt-7 pb-8 md:pt-10">
      <header>
        {breadcrumbs}
        <DisplayTitle title={title} />

        <ReadingColumn className="mt-4 md:mt-6">{metadata}</ReadingColumn>
      </header>

      <ReadingColumn className="mt-10 md:mt-12">{children}</ReadingColumn>
    </Container>
  );
}
