import type { HTMLAttributes } from "react";

type ContainerProps = HTMLAttributes<HTMLElement> & {
  as?: "div" | "section" | "article" | "header" | "footer" | "ul" | "ol";
};

export function Container({
  as: Element = "div",
  className = "",
  ...props
}: ContainerProps) {
  return (
    <Element
      {...props}
      className={`mx-auto max-w-384 px-4 md:px-8 ${className}`.trim()}
    />
  );
}
