import NextLink from 'next/link'

export function Link({ href, children }) {
  const isAnchor = href.startsWith('#')
  const isInternal = href.startsWith('/')

  if (isAnchor) {
    return (
      <NextLink href={href} scroll={false}>
        {children}
      </NextLink>
    )
  }

  if (isInternal) {
    return <NextLink href={href}>{children}</NextLink>
  }

  return (
    <a href={href} rel="noopener noreferrer">
      {children}
    </a>
  )
}
