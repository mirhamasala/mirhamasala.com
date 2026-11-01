import { Title } from "@/components/title";

export type PageTitleScale = "poster" | "name";

export function PageTitle({
  children,
  scale = "poster",
}: {
  children: string;
  scale?: PageTitleScale;
}) {
  return (
    <Title
      scale={scale}
      className={scale === "poster" ? "pb-[0.28em]" : "pb-[0.12em]"}
    >
      {children}
    </Title>
  );
}
