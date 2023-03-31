import NextLink from "next/link";

export function Link({ href, className, children, ...props }) {
  const isFootNote = href.startsWith("#user-content");
  const isAnchor = href.startsWith("#") && !isFootNote;
  const isInternal = href.startsWith("/");

  if (isFootNote) {
    return (
      <NextLink href={href} {...props}>
        {children}
      </NextLink>
    );
  }

  if (isAnchor) {
    return <NextLink id={href.substring(1)} href={href} scroll={false} />;
  }

  if (isInternal) {
    return (
      <NextLink className={className} href={href}>
        {children}
      </NextLink>
    );
  }

  return (
    <a
      className="text-teal-500 hover:text-teal-600"
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
}
