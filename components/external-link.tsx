import type { ComponentProps } from "react";

type ExternalLinkProps = Omit<ComponentProps<"a">, "href"> & {
  href: `http${string}`;
};

export function ExternalLink({
  children,
  className,
  ...props
}: ExternalLinkProps) {
  return (
    <a
      {...props}
      className={["inline-flex items-baseline gap-1", className]
        .filter(Boolean)
        .join(" ")}
    >
      <span>{children}</span>
      <span aria-hidden="true" className="text-slate-500">
        ↗
      </span>
    </a>
  );
}
