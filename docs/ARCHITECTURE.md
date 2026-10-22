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
- Node.js Active LTS, declared in both `.node-version` and `engines` in `package.json`
- pnpm, pinned with `packageManager` and run through Corepack (`corepack enable pnpm`). Dependency install scripts are blocked unless allowed in `pnpm-workspace.yaml`.
- ESLint via `eslint-config-next`. Prettier, with the Tailwind plugin, for formatting.
- Deployed on Vercel. `main` is production.

Exact versions live in `package.json` and the lockfile, not here.

Temporary version holds, both caused by lint tooling lagging behind:

- TypeScript stays on 6.x. `typescript-eslint`, which `eslint-config-next` depends on, does not yet support TypeScript 7.
- ESLint stays on 9.x. Plugins bundled in `eslint-config-next` do not yet support ESLint 10.

Lift each hold when `eslint-config-next` supports the newer version.

## Rendering

- Every page is generated at build time. Article routes use `generateStaticParams`, with `dynamicParams = false`.
- There is no runtime data fetching and no server-side state.
- Caching is not configured. Add it only if the implementation shows a need.

## Content

- Articles are plain Markdown at `content/posts/<slug>.md`. MDX is deliberately not used: articles don't need embedded components, and plain Markdown stays portable and avoids coupling article content to JSX or React components.
- The slug is the filename. It is never set in frontmatter.
- Frontmatter is YAML. It is parsed with `yaml` and validated with a `zod` schema at build time, and invalid content fails the build.
- Schema: `title`, `description`, `date` (`YYYY-MM-DD`), optional `draft`, optional `featured`. Unknown fields fail the build. Add fields only when a page needs them.
- `featured: true` marks an article for Featured writing. Selection is always explicit, never inferred from recency.
- `draft: true` articles are excluded from every generated page and from the sitemap.
- Markdown is rendered to React elements with `react-markdown` and `remark-gfm` (GFM, mainly for footnotes and tables). There is no HTML-string rendering, and raw HTML inside Markdown is not rendered.
- `content/posts/pipeline-fixture.md` is a temporary fixture that only proves the pipeline and the `/posts/[slug]` route. Delete it in the same change that migrates the first real article, and point `e2e/smoke.spec.ts` at that article.

## Metadata

Use the built-in Next.js features: the `metadata` export and `generateMetadata`, `app/sitemap.ts`, `app/robots.ts`, and `next/font`.

Absolute URLs (canonical links, sitemap, robots) come from the `SITE_URL` environment variable, falling back to `http://localhost:3000`. The canonical domain is `www.mirhamasala.com`; the bare domain redirects to it. In Vercel's production environment, set `SITE_URL=https://www.mirhamasala.com` before launch. It is not hard-coded, so previews and local development don't claim to be production.

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
e2e/
  smoke.spec.ts       # Playwright smoke and axe checks
playwright.config.ts
```

There is no `src/` folder. A `components/` folder gets added once a second page needs something shared.

## Dependencies

- Runtime: `next`, `react`, `react-dom`, `react-markdown`, `remark-gfm`, `yaml`, `zod`
- Dev: `typescript`, `@types/node`, `@types/react`, `@types/react-dom`, `tailwindcss`, `@tailwindcss/postcss`, `@tailwindcss/typography`, `eslint`, `eslint-config-next`, `prettier`, `prettier-plugin-tailwindcss`, `@playwright/test`, `@axe-core/playwright`

Any new runtime dependency or significant tooling dependency should have a concrete requirement, with the decision and rationale recorded here in the same change.

## Verification

Playwright and axe check the rendered site so the verifier can test it after implementation. They are dev dependencies: they are not part of the published application. This is not a unit-test runner, a visual-regression suite, or a performance audit.

- `@playwright/test` drives Chromium. `pnpm test:e2e` builds the app and starts `next start` on `127.0.0.1:4173`, so the run does not depend on a dev server already listening on port 3000.
- Projects are desktop Chromium (`Desktop Chrome`) and mobile Chromium (`Pixel 5`). Add another browser only when there is a concrete need.
- `@axe-core/playwright` scans those same pages inside the Playwright suite. Serious and critical violations fail the run. Moderate and minor results do not.
- A failure keeps a screenshot and a trace under `test-results/`. Nothing compares screenshots.
- Chromium is installed with `pnpm exec playwright install chromium`. `pnpm install` does not download it, because dependency install scripts stay blocked.

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
- A unit-test runner. Browser and accessibility verification is Playwright and axe, recorded under Verification.
