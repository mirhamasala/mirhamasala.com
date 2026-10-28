import type { ReactNode } from "react";

const asideClassName =
  "max-w-[23rem] text-[1rem] leading-snug text-slate-700 sm:max-w-[34rem] md:col-span-4";

const statementClassName =
  "max-w-[22rem] font-serif text-[1.18rem] leading-[1.22] text-slate-950 sm:max-w-[34rem] md:max-w-none md:text-[1.45rem] lg:text-[1.65rem]";

type SplitIntroProps = {
  aside: ReactNode;
  children: ReactNode;
  trailing?: ReactNode;
  className?: string;
};

export function SplitIntro({
  aside,
  children,
  trailing,
  className,
}: SplitIntroProps) {
  return (
    <div
      className={["md:grid md:grid-cols-12 md:gap-8", className]
        .filter(Boolean)
        .join(" ")}
    >
      <p className={asideClassName}>{aside}</p>
      <div className="mt-6 md:col-span-5 md:col-start-7 md:mt-0">
        <p className={statementClassName}>{children}</p>
        {trailing ? <div className="mt-5">{trailing}</div> : null}
      </div>
    </div>
  );
}
