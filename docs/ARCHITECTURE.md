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
- `content/posts/draft-fixture.md` is a permanent `draft: true` fixture. It gives the browser suite a known draft to prove drafts stay unpublished.

## Metadata and indexing

Use the built-in Next.js features: the `metadata` export and `generateMetadata`, `metadataBase`, `app/sitemap.ts`, `app/robots.ts`, and `next/font`. No SEO libraries.

Every indexable route class (`/`, `/about`, `/posts`, `/posts/[slug]`) provides:

- a meaningful title (the root layout's title template adds the site name)
- a description specific to that page and drawn from its content (articles use their frontmatter `description`)
- a self-referencing canonical URL, set with `alternates.canonical`
- exactly one visible `h1` naming the page's subject
- no `noindex` directive

The root layout sets no default description, so a page without one is caught by the browser suite rather than inheriting a duplicate.

Absolute URLs (`metadataBase`, canonical links, sitemap, robots) come from `site.url` in `lib/site.ts`, which is the origin of the `SITE_URL` environment variable, falling back to `http://localhost:3000`. The canonical domain is `www.mirhamasala.com`, which the legacy site also used; the bare domain redirects to it. In Vercel's production environment, set `SITE_URL=https://www.mirhamasala.com`. A production build (`VERCEL_ENV=production`) without `SITE_URL` fails, so production can never publish localhost canonicals. It is not hard-coded, so previews and local development don't claim to be production.

Vercel preview and development deployments (`VERCEL_ENV` other than `production`) render `noindex, nofollow` from the root layout. Keep Vercel deployment protection enabled for previews as the primary guard; the directive covers any preview that is publicly reachable. `robots.txt` stays permissive there so crawlers can see the directive.

## Sitemap and robots

- `sitemap.xml` lists every indexable canonical URL: the static pages and every published article.
- Drafts, unknown routes, redirects, and noncanonical URLs are never listed.
- Unknown and draft article slugs return 404. Next.js adds `noindex` to 404 responses.
- `robots.txt` allows all crawling and references the absolute sitemap URL.

## URL migration

Legacy URLs are preserved where the content returns. When a URL changes, it gets a permanent redirect (`permanent: true`, a 308) in `next.config.ts`, straight to the equivalent page with no chains. Nothing redirects indiscriminately to the home page.

Inventory of the legacy site's public URLs (tag `pre-redesign-2026`):

- `/`, `/about`, `/posts`, and `/posts/<slug>` keep their paths. Legacy articles return at their original slug as they are migrated; until then they 404.
- `/all-posts` redirects to `/posts`, as it did on the legacy site.
- The legacy site redirected root-level article slugs (`/<slug>`) to `/posts/<slug>`. Restore each of these, pointing directly at `/posts/<slug>`, in the same change that migrates that article.
- One legacy slug, `the-knitting-club-%c2%b7-the-ladies-we-need-to-talk-chapter`, contains an encoded middle dot. Decide whether it keeps that slug when it is migrated.
- Letters (`/letters`, `/letters/<slug>`, `/paper-planes-packets`, and root-level letter slugs), TSOP (`/tsop/...`), Recipes (`/recipes/...`), Moments (`/moments/...`), `/map`, `/resume`, `/travel-archives`, and `/dropbox` return 404 until `docs/PRODUCT.md` decides whether each section returns.
- The legacy feeds at `/rss/feed.xml` and `/rss/feed.json` return 404 until a feed is decided.

## Launch checks

These are operational checks, not Playwright tests. Before or immediately after the first production deployment:

- Confirm `SITE_URL` is set in Vercel's production environment, and that production metadata, canonical links, sitemap, and `robots.txt` use `https://www.mirhamasala.com`.
- Confirm the bare domain redirects permanently to `www`, and that deployment protection is enabled for preview deployments.
- Verify Google Search Console ownership, submit the production sitemap, and inspect representative pages.
- Check representative legacy URLs and redirects, then monitor indexing and crawl issues after the migration.

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
components/
  external-link.tsx
  site-footer.tsx
  site-header.tsx
  mobile-navigation.tsx
content/
  posts/<slug>.md
lib/
  posts.ts            # read, parse, validate, sort, exclude drafts
  markdown.tsx        # Markdown rendering and element mapping
  site.ts             # site name, URL, indexability, navigation, profiles
public/
e2e/
  routes.ts           # indexable route inventory, including published articles
  smoke.spec.ts       # Playwright smoke and axe checks
  metadata.spec.ts    # per-page metadata, canonical, indexing, h1
  crawling.spec.ts    # sitemap, robots, unpublished routes, redirects
next.config.ts        # redirects
playwright.config.ts
```

There is no `src/` folder. Shared chrome lives in `components/`.

## Dependencies

- Runtime: `next`, `react`, `react-dom`, `react-markdown`, `remark-gfm`, `yaml`, `zod`
- Dev: `typescript`, `@types/node`, `@types/react`, `@types/react-dom`, `tailwindcss`, `@tailwindcss/postcss`, `@tailwindcss/typography`, `eslint`, `eslint-config-next`, `prettier`, `prettier-plugin-tailwindcss`, `@playwright/test`, `@axe-core/playwright`

Any new runtime dependency or significant tooling dependency should have a concrete requirement, with the decision and rationale recorded here in the same change.

## Verification

Playwright and axe check the rendered site so the verifier can test it after implementation. They are dev dependencies: they are not part of the published application. This is not a unit-test runner, a visual-regression suite, or a performance audit.

- `@playwright/test` drives Chromium. `pnpm test:e2e` builds the app and starts `next start` on `127.0.0.1:4173`, so the run does not depend on a dev server already listening on port 3000. The build gets `SITE_URL=http://127.0.0.1:4173`, so generated absolute URLs are deterministic.
- Projects are desktop Chromium (`Desktop Chrome`) and mobile Chromium (`Pixel 5`). Add another browser only when there is a concrete need. `crawling.spec.ts` doesn't depend on the viewport, so it runs on desktop only.
- Discoverability checks cover the contract under "Metadata and indexing" and "Sitemap and robots": title, description, canonical, indexing directives, and a single visible `h1` for every indexable route; distinct descriptions; sitemap contents compared with the published article inventory from `lib/posts.ts`; `robots.txt`; 404 and `noindex` for the draft fixture and an unknown slug; and redirects. They don't assert description wording (except that articles use their frontmatter), character limits, keywords, rankings, or Lighthouse scores.
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
