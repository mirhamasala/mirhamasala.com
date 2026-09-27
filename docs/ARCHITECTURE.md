# Architecture

This is a greenfield build. The legacy implementation (tag `pre-redesign-2026`, branch `legacy`) is excluded as an architectural input. Nothing here exists because the old site did it, or to make migration easier.

## Compatibility

The only intentional compatibility requirement: articles are served at `/posts/[slug]`. The user-facing label is "Writing"; `posts` is the internal name for routes, folders, and code.

## Stack

- Next.js, current Active LTS major, with the App Router
- React Server Components by default. Client Components only where interaction requires them.
- TypeScript in strict mode
- Tailwind CSS v4 with CSS-first configuration in `app/globals.css` (no JS config file)
- `@tailwindcss/typography` for article prose
- Node.js Active LTS and pnpm
- ESLint via `eslint-config-next`. Prettier, with the Tailwind plugin, for formatting.
- Deployed on Vercel. `main` is production.

Exact versions live in `package.json` and the lockfile, not here.

TypeScript stays on 6.x for now. `typescript-eslint`, which `eslint-config-next` depends on, does not yet support TypeScript 7. Move to 7 when it does.

## Rendering

- Every page is generated at build time. Article routes use `generateStaticParams`, with `dynamicParams = false`.
- There is no runtime data fetching and no server-side state.
- Caching is not configured. Add it only if the implementation shows a need.



## Content

- Articles are plain Markdown at `content/posts/<slug>.md`. MDX is deliberately not used: articles don't need embedded components, and plain Markdown stays portable and avoids coupling article content to JSX or React components.
- The slug is the filename. It is never set in frontmatter.
- Frontmatter is YAML. It is parsed with `yaml` and validated with a `zod` schema at build time, and invalid content fails the build.
- Schema: `title`, `description`, `date`, optional `draft`, optional `featured`. Add fields only when a page needs them.
- `featured: true` marks an article for Featured writing. Selection is always explicit, never inferred from recency.
- `draft: true` articles are excluded from every generated page and from the sitemap.
- Markdown is rendered to React elements with `react-markdown` and `remark-gfm` (GFM, mainly for footnotes and tables). There is no HTML-string rendering, and raw HTML inside Markdown is not rendered.



## Metadata

Use the built-in Next.js features: the `metadata` export and `generateMetadata`, `app/sitemap.ts`, `app/robots.ts`, and `next/font`.

## Structure

```
app/
  layout.tsx
  page.tsx
  not-found.tsx
  globals.css
  sitemap.ts
  robots.ts
  posts/
    page.tsx          # Writing index
    [slug]/page.tsx   # article
content/
  posts/<slug>.md
lib/
  posts.ts            # read, parse, validate, sort, exclude drafts
  markdown.tsx        # Markdown rendering and element mapping
  site.ts             # site name, URL, navigation labels
public/
```

There is no `src/` folder. A `components/` folder gets added once a second page needs something shared.

## Dependencies

- Runtime: `next`, `react`, `react-dom`, `react-markdown`, `remark-gfm`, `yaml`, `zod`
- Dev: `typescript`, `@types/node`, `@types/react`, `@types/react-dom`, `tailwindcss`, `@tailwindcss/postcss`, `@tailwindcss/typography`, `eslint`, `eslint-config-next`, `prettier`, `prettier-plugin-tailwindcss`

Any new runtime dependency or significant tooling dependency should have a concrete requirement, with the decision and rationale recorded here in the same change.

## Deliberately excluded

- MDX and content-layer tooling
- CMSs and databases
- UI component libraries and class-name helpers
- Global state and data-fetching libraries
- Date, frontmatter, and reading-time libraries
- Syntax highlighting
- Middleware, the React Compiler, and Cache Components



## Undecided

Technical questions only. Product-level open questions live in `docs/PRODUCT.md` under "Not yet decided". Decide these against real pages and content, not in advance:

- Article images: where they live, how their dimensions are known, and whether to use `next/image` optimization or plain pre-sized images
- Whether the typography plugin stays or is replaced by custom styles
- How archived articles are represented and the Archive's URL. Links to an archived article's `/posts/<slug>` URL must keep working.
- How related writing and Collections are represented in content
- Feed format, URL, and full text or excerpts, if a feed is added
- Social preview images: static files or generated with `next/og`
- A test runner

