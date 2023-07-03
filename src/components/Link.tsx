import NextLink from "next/link";

type Props = {
  children: React.ReactNode;
  href: string;
};

export function Link({ children, href, ...rest }: Props) {
  const isInternalLink = href.startsWith("/") || href.startsWith("#");
  const externalLinkAttributes = !isInternalLink && {
    target: "_blank",
    rel: "noopener noreferrer",
  };

  return (
    <NextLink href={href} {...externalLinkAttributes} {...rest}>
      {children}
    </NextLink>
  );
}
