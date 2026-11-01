import type { ReactNode } from "react";
import { Container } from "@/components/container";

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
      <Container className="pt-9 pb-8">
        <div className="max-w-176">{children}</div>
      </Container>
    </section>
  );
}
