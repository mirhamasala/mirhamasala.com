const pageTitleClassName = {
  poster:
    "pb-[0.28em] font-display text-[clamp(5.7rem,21vw,20rem)] leading-[0.76] tracking-[-0.045em] text-slate-950 md:text-[clamp(10rem,17.4vw,20rem)] md:tracking-[-0.055em]",
  name: "max-w-[18ch] pb-[0.12em] font-display text-[clamp(3.5rem,10vw,8.75rem)] leading-[0.88] tracking-[-0.035em] text-balance text-slate-950",
} as const;

export type PageTitleScale = keyof typeof pageTitleClassName;

export function PageTitle({
  children,
  scale = "poster",
}: {
  children: string;
  scale?: PageTitleScale;
}) {
  return <h1 className={pageTitleClassName[scale]}>{children}</h1>;
}
