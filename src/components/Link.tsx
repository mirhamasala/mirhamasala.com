import NextLink from "next/link";

type Props = {
  children: React.ReactNode;
  href: string;
};

const isInternalLink = (href: string) => {
  try {
    new URL(href);
    return false;
  } catch (e) {
    return true;
  }
};

export function Link({ children, href, ...rest }: Props) {
  const LinkComponent = isInternalLink(href) ? NextLink : "a";
  const linkProps = isInternalLink(href)
    ? rest
    : { target: "_blank", rel: "noopener noreferrer", ...rest };

  return (
    <LinkComponent href={href} {...linkProps}>
      {children}
    </LinkComponent>
  );
}
