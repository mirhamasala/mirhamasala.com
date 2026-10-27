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
    <a {...props} className={className}>
      {children}
    </a>
  );
}
