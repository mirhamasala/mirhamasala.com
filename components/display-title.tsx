import { Title } from "@/components/title";

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
    <Title
      scale={resolvedVariant === "compact" ? "compact" : "poster"}
      className={["pb-[0.18em] text-balance", className]
        .filter(Boolean)
        .join(" ")}
    >
      {title}
    </Title>
  );
}
