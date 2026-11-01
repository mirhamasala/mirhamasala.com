import type { ReactNode } from "react";

const posterTypography =
  "leading-[0.76] tracking-[-0.045em] md:tracking-[-0.055em]";

const scales = {
  poster: `${posterTypography} text-[clamp(5.7rem,21vw,20rem)] md:text-[clamp(10rem,17.4vw,20rem)]`,
  compact: `${posterTypography} text-[clamp(4rem,14.7vw,14rem)] md:text-[clamp(7rem,12.2vw,14rem)]`,
  name: "max-w-[18ch] text-[clamp(3.5rem,10vw,8.75rem)] leading-[0.88] tracking-[-0.035em] text-balance",
};

type TitleProps = {
  children: ReactNode;
  scale?: keyof typeof scales;
  className?: string;
};

export function Title({ children, scale = "poster", className }: TitleProps) {
  return (
    <h1
      className={["font-display text-slate-950", scales[scale], className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </h1>
  );
}
