type DisplayTitleVariant = "auto" | "default" | "compact";

type DisplayTitleProps = {
  title: string;
  variant?: DisplayTitleVariant;
  className?: string;
};

/**
 * Length above which a title uses the compact scale. Thirty sits between the
 * longest current short title (29) and the shortest long one (32).
 */
const compactTitleLength = 30;

const displayTitleClassName =
  "pb-[0.18em] font-display leading-[0.76] tracking-[-0.045em] text-balance text-slate-950 md:tracking-[-0.055em]";

const displayTitleSizeClassName = {
  default:
    "text-[clamp(5.7rem,21vw,20rem)] md:text-[clamp(10rem,17.4vw,20rem)]",
  compact: "text-[clamp(4rem,14.7vw,14rem)] md:text-[clamp(7rem,12.2vw,14rem)]",
} as const satisfies Record<Exclude<DisplayTitleVariant, "auto">, string>;

function resolveDisplayTitleVariant(
  title: string,
  variant: DisplayTitleVariant,
): Exclude<DisplayTitleVariant, "auto"> {
  if (variant !== "auto") return variant;

  const normalizedTitle = title.trim().replace(/\s+/g, " ");
  return normalizedTitle.length > compactTitleLength ? "compact" : "default";
}

export function DisplayTitle({
  title,
  variant = "auto",
  className,
}: DisplayTitleProps) {
  const resolvedVariant = resolveDisplayTitleVariant(title, variant);

  return (
    <h1
      className={[
        displayTitleClassName,
        displayTitleSizeClassName[resolvedVariant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {title}
    </h1>
  );
}
