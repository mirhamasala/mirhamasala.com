import type { ReactNode } from "react";

type SectionLabelProps = {
  children: ReactNode;
  level?: "h2" | "h3";
  id?: string;
};

export function SectionLabel({
  children,
  level = "h2",
  id,
}: SectionLabelProps) {
  const Heading = level;

  return (
    <Heading
      id={id}
      className="font-sans text-[1rem] font-medium tracking-[0.14em] text-slate-600 uppercase"
    >
      {children}
    </Heading>
  );
}
