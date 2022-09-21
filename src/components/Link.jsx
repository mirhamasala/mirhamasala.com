import NextLink from 'next/link'

export function Link({ href, children }) {
  const isInternalLink = href.startsWith('/')

  if (!isInternalLink) {
    return (
      <a href={href} rel="noopener noreferrer">
        {children}
      </a>
    )
  }

  return <NextLink href={href}>{children}</NextLink>
}
