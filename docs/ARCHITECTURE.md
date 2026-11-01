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
- ESLint via `eslint-config-next`. `eslint-plugin-better-tailwindcss` runs only `enforce-canonical-classes`, the same check as the Tailwind language server's `suggestCanonicalClasses`: an arbitrary class that already exists on the scale fails lint. Prettier, with the Tailwind plugin, still formats and sorts classes. The plugin's other rules stay off so order and wrapping are not checked twice.
- Deployed on Vercel. `main` is production.

Exact versions live in `package.json` and the lockfile, not here.

Temporary version holds, both caused by lint tooling lagging behind:

- TypeScript stays on 6.x. `typescript-eslint`, which `eslint-config-next` depends on, does not yet support TypeScript 7.
- ESLint stays on 9.x. Plugins bundled in `eslint-config-next` do not yet support ESLint 10.

Lift each hold when `eslint-config-next` supports the newer version.

The canonical-class rule reads `app/globals.css`. `rootFontSize` is 16 because `html` sets `font-size: 100%`, the browser default, so a pixel value such as `underline-offset-[8px]` can match the scale. The rule exists so `pnpm lint` enforces the same built-in-value preference as the design guide, which previously showed up only in the editor.

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
- The homepage shows the newest published article with `featured: true`. If several are featured, the newest is the feature and the others may appear in Latest. If none are featured, that section is omitted. Latest is up to four published articles, newest first, excluding the feature. The homepage photograph is `public/home/ericeira.jpg`, rendered with `next/image` at a known size. The image links to its Unsplash page, which is the credit; there is no visible caption. That does not decide article images.
- `draft: true` articles are excluded from every generated page and from the sitemap.
- Markdown is rendered to React elements with `react-markdown` and `remark-gfm` (GFM, mainly for footnotes and tables). There is no HTML-string rendering, and raw HTML inside Markdown is not rendered.
- GFM collects footnote definitions and renders them at the end of the document. The footnote section draws the rule above the notes, so a Markdown rule that only introduced those definitions is not rendered again. A closing "You Might Also Like" section is placed after the notes: the notes finish the piece, and the suggestion comes last.
- Article and letter headings get ids from `github-slugger` 2.0.0, the version the legacy site used, so existing in-article links still land.
- Article images and the knitting-club PDF are static files at `public/posts/<slug>/`, referenced from Markdown, the same way the letter photograph is. This does not decide image dimensions or whether articles use `next/image`.
- Place lists inside articles are Markdown. `/map` redirects to `/places`.
- Spots are plain Markdown at `content/places/<city>/<slug>.md`. The folder
  is the city id from `placeCities` in `lib/places.ts`, and the filename is
  the slug. Schema: `title`, `city`, `category`, optional `locality`,
  optional `url`, optional `map`, optional `latitude` and `longitude` (both or
  neither), and optional `draft`. `city` is one of the labels in `placeCities`
  in `lib/places.ts`, which is also the order of the city list. `category` is
  one of the labels in `placeCategories`, which is also the order of a city's
  category groups. Within a category, spots are alphabetical. `locality` is
  the town, for a spot grouped under a wider city. `url` is the place's own
  site. `map` is a Google Maps link. Coordinates are for the map pin. Unknown
  fields fail the build. `draft: true` spots stay in the files and off the
  page. The body is the note, and it may be empty. `/places?city=<id>` is the
  same page with that city selected. Its canonical URL remains `/places`.
  Reading that query renders the page on demand.
- A paragraph whose only content is a link to an `.mp4` renders as a video with controls. Dropbox uses this for the two bucket-list clips.
- `content/posts/draft-fixture.md` is a permanent `draft: true` fixture. It gives the browser suite a known draft to prove drafts stay unpublished.
- Recipes are plain Markdown at `content/recipes/<slug>.md`, with the filename
  as the slug. Their strict YAML schema is `title`, `description`, `date`
  (`YYYY-MM-DD`), `category`, optional `serves`, optional `attribution`, optional timing fields, and optional
  `draft` (a boolean, defaulting to `false`). `draft: true` recipes are excluded
  from the recipe index, generated recipe pages, and sitemap. Their URLs return
  404, including in development, just like draft articles.
  `category` is one of the groups in `recipeCategories` in `lib/recipes.ts`.
  Unknown fields fail the build. Ingredient tables use portable GFM table
  syntax; recipe prose does not contain JSX or raw HTML.
  Timing fields are `prepTime`, `cookTime`, `restTime`, `chillTime`, `soakTime`,
  and `totalTime`, all optional. A measured duration is a non-negative integer
  in minutes or a strict `{ min, max }` object in minutes, with `max >= min`.
  Waiting fields (`restTime`, `chillTime`, `soakTime`) also accept `overnight`;
  it is never converted to an invented number of minutes. Optional `timeNote`
  holds qualifications such as optional chilling or a total excluding an
  overnight soak. `totalTime` is explicitly authored, never calculated by
  adding stages that may overlap. `lib/recipes.ts` formats the durations for
  the recipe's cooking details during server rendering. This replaces the free-text
  `time` field so timing data has one validated representation.
  `attribution` is one optional, non-empty string, with self-contained inline
  Markdown for source links. `lib/markdown.tsx` renders it in the preface's
  horizontal-rule renderer, directly before that rule. It is not repeated in
  the body, and its wording has no effect on styling. The level-two heading
  renderer inserts `RecipeDetails` directly before `Ingredients`. Recipes have
  exactly one `Ingredients` heading and at most one rule, at that boundary.
  The recipe body is rendered as one Markdown document so its reference links
  keep their definitions. No recipe-specific remark plugin or client code is
  needed; the rendering logic stays in `lib/markdown.tsx`.
- Books are plain Markdown at `content/books/<slug>.md`, with the filename as
  the slug. Schema: `title`, `author`, `description`, `topic`, `number`,
  `url`, optional `subtitle`, optional `recommend`, optional `why`, and
  optional `format`. `topic` is one of the groups in `bookTopics` in
  `lib/books.ts`, which is also the order of the index. `number` is the
  book's place in the finished-reads list; a higher number is more recent.
  `recommend: true` marks a book for the opening "Start with these" list.
  `why`, when present, is one line on why it stuck. `format: audio` records an
  audiobook. Unknown fields fail the build. The body is the notes.
- Letters are plain Markdown at `content/letters/<slug>.md`, with the filename
  as the slug. Schema: `title`, `description`, and `date` (`YYYY-MM-DD`).
  Unknown fields fail the build. The body is the letter. One letter includes a
  static photograph at `public/letters/`; that does not decide how article
  images work.
- Spin-Off Project posts are plain Markdown at `content/tsop/posts/<slug>.md`,
  with the filename as the slug. Schema: `title`, `description`, `date`
  (`YYYY-MM-DD`), and `spinOff`. `spinOff` is one of the twelve ids in
  `spinOffs` in `lib/tsop.ts`, or `bucket-list`. Section pages are plain
  Markdown at `content/tsop/<slug>.md`, with `title`, `description`, and
  `date`, and no `spinOff`. Unknown fields fail the build. Images are static
  files at `public/tsop/`, referenced from Markdown. This does not decide
  image dimensions or whether those images use `next/image`.
- Travel stories are plain Markdown at `content/travel-stories/<number>.md`,
  with the filename as the number. Schema: `number`, `country`, `location`,
  `date` (`YYYY-MM-DD`), `instagram`, `description`, and optional `city`.
  `instagram` is the original post URL from the old page heading. `country`
  is one of the groups in `travelPlaces` in `lib/travel-stories.ts`, which is also
  the order of the place list. `city`, when present, is one of that country's city
  headings: Sydney, Sarajevo, Colombo, Tel Aviv, or Tokyo. Stories that sat
  directly under a country omit `city`. `number` is the story's name and its
  URL. `location` is the place line. Unknown fields fail the build. The body
  is the story and opens with its photograph, a static file at
  `public/travel-stories/<number>/photo.jpg` or `photo.jpeg`. The index reads
  that opening image. The default view is the place list and keeps the anchor
  ids. `?view=photographs` is the same index as a square grid ordered by story
  number, highest first. Reading that query renders the index on demand. Its
  canonical URL remains `/travel-stories`. This
  does not decide image dimensions or whether those images use `next/image`.
- The résumé and Dropbox are plain Markdown at `content/pages/resume.md` and
  `content/pages/dropbox.md`. Schema: `title`, `description`, and `date`
  (`YYYY-MM-DD`). Unknown fields fail the build. The current résumé PDF is
  generated from that Markdown at `/resume/mirha-masala.pdf`. Markdown the
  renderer does not understand fails the build. The 2020 résumé PDF remains a
  static file at `public/resume/cv_mirha_masala_2020.pdf`. Dropbox images and
  videos are static files at `public/dropbox/`.

## Metadata and indexing

Use the built-in Next.js features: the `metadata` export and `generateMetadata`, `metadataBase`, `app/sitemap.ts`, `app/robots.ts`, and `next/font`. No SEO libraries.

Every indexable route class (`/`, `/about`, `/resume`, `/dropbox`, `/posts`,
`/posts/[slug]`, `/recipes`, `/recipes/[slug]`, `/books`, `/books/[slug]`,
`/places`, `/archive`, `/letters`, `/letters/[slug]`, `/travel-stories`,
`/travel-stories/[slug]`, `/tsop`, `/tsop/posts/[slug]`, `/tsop/[slug]`)
provides:

- a meaningful title (the root layout's title template adds the site name)
- a description specific to that page and drawn from its content (articles use their frontmatter `description`)
- a self-referencing canonical URL, set with `alternates.canonical`
- exactly one visible `h1` naming the page's subject
- no `noindex` directive

The root layout sets no default description, so a page without one is caught by the browser suite rather than inheriting a duplicate.

Absolute URLs (`metadataBase`, canonical links, sitemap, robots) come from `site.url` in `lib/site.ts`, which is the origin of the `SITE_URL` environment variable, falling back to `http://localhost:3000`. The canonical domain is `www.mirhamasala.com`, which the legacy site also used; the bare domain redirects to it. In Vercel's production environment, set `SITE_URL=https://www.mirhamasala.com`. A production build (`VERCEL_ENV=production`) without `SITE_URL` fails, so production can never publish localhost canonicals. It is not hard-coded, so previews and local development don't claim to be production.

Vercel preview and development deployments (`VERCEL_ENV` other than `production`) render `noindex, nofollow` from the root layout. Keep Vercel deployment protection enabled for previews as the primary guard; the directive covers any preview that is publicly reachable. `robots.txt` stays permissive there so crawlers can see the directive.

## Sitemap and robots

- `sitemap.xml` lists every indexable canonical URL: the static pages and every published article, recipe, book, letter, travel story, and Spin-Off Project post and section page. That includes `/places`, `/resume`, and `/dropbox`.
- Drafts, unknown routes, redirects, and noncanonical URLs are never listed.
- Unknown and draft article slugs return 404. Next.js adds `noindex` to 404 responses.
- `robots.txt` allows all crawling and references the absolute sitemap URL.
- Omit sitemap `lastmod` for now. Content `date` means publication date, not
  the last significant edit; file modification times and build dates are not
  reliable substitutes. Editing a page therefore cannot leave a misleading
  publication date presented as its modification date. Add modification dates
  only alongside a reliable source and tests; no new authoring field is needed
  for the current contract.

## URL migration

Legacy URLs are preserved where the content returns. When a URL changes, it gets a permanent redirect (`permanent: true`, a 308) in `next.config.ts`, straight to the equivalent page with no chains. Nothing redirects indiscriminately to the home page.

Inventory of the legacy site's public URLs (tag `pre-redesign-2026`):

- `/`, `/about`, `/posts`, and `/posts/<slug>` keep their paths. The legacy Writing articles are at their original slugs.
- `/all-posts` redirects to `/posts`, as it did on the legacy site.
- Published articles restore their legacy root aliases (`/<slug>` → `/posts/<slug>`). Drafts are not given root aliases, including `/we-need-to-talk-about-me` and `/sarajevo-favorites`. `/ericeira-favorites` never had a root alias. `/amsterdam-favorites` has no article and is not redirected. Two published articles never had a root alias (`all-my-amsterdam-memories-gather-round-food`, `morphing-into-motherhood`) and still do not.
- The legacy slug `the-knitting-club-%c2%b7-the-ladies-we-need-to-talk-chapter` keeps that encoded middle dot. The article is a draft.
- Article files that were at `/pages/posts/<slug>/<file>` redirect to `/posts/<slug>/<file>`.
- Recipes keep their legacy `/recipes` and `/recipes/<slug>` URLs.
- `/books` and `/books/<slug>` are new. The reading-list essay stays at `/posts/read-100-books` when that article is migrated. It does not redirect to `/books`.
- Letters keep `/letters` and `/letters/<slug>`. `/paper-planes-packets` redirects to `/letters`. Each legacy root-level letter slug redirects to `/letters/<slug>`. Four letters never had a root alias (`here-comes-the-hulk-050623`, `jobless-but-balanced-070823`, `life-escaping-life-091023`, `lost-on-mars-111223`) and get none. The photograph that was at `/pages/letters/life-escaping-life-091023/parents-dylan-g-walking-beach-sunset.jpg` redirects to `/letters/life-escaping-life-091023/parents-dylan-g-walking-beach-sunset.jpg`.
- `/archive` presents The Spin-Off Project, Travel Stories, and Letters, in the order they began. Letters links to `/letters`, and a few letters link to `/letters/<slug>`. The Spin-Off Project links to `/tsop`, and each of the twelve names links to that spin-off on the index. Travel Stories links to `/travel-stories`, and the places link to that index's country and city ids.
- The Spin-Off Project keeps `/tsop`, `/tsop/posts/<slug>`, and the section pages `/tsop/about`, `/tsop/faqs`, and `/tsop/resources`. The introduction links to About. The index then lists the twelve spin-offs, then the bucket list essay. Frequently asked questions and resources are not listed on the index. `/tsop/posts/read-business-books` stays and is not listed under the bucket list. `/tsop/contact`, `/tsop/about-me`, and `/tsop/now` redirect to `/about`. `/pages/tsop/about-me` and `/pages/tsop/now` do too, so they do not stop at the removed pages. Removing or redirecting one of the remaining section pages is still open in `docs/PRODUCT.md`. Other images that were at `/pages/tsop/<path>` redirect to `/tsop/<path>`.
- `/travel-archives` redirects to `/travel-stories`. Each story is `/travel-stories/<number>`. Browsers keep the fragment across that redirect, and the index keeps the old ids (`australia`, `melbourne`, `sydney`, `bosnia-and-herzegovina`, `sarajevo`, `sri-lanka`, `colombo`, `israel`, `tel-aviv`, `japan`, `tokyo`, and each story number), so `/travel-archives#294` lands on `/travel-stories#294`. Photographs that were at `/pages/<number>_instagram_archive.jpg`, `/pages/<number>_instagram_archives.jpg`, or `/pages/<number>_instagram_archives.jpeg` redirect to `/travel-stories/<number>/photo.jpg` or `photo.jpeg`.
- `/map` redirects to `/places`. Places lists the spots at that URL. `?city=<id>` selects a city on the same page and is not a separate canonical URL.
- `/moments` redirects to `/posts`. The one published Moment is the article `/posts/when-we-were-young`, and `/moments/when-we-were-young` redirects there. It never had a root alias. The photograph that was at `/pages/moments/portugal-lisbon-musa-da-bica.jpeg` redirects to `/posts/when-we-were-young/portugal-lisbon-musa-da-bica.jpeg`.
- `/resume` and `/dropbox` keep their paths. The résumé PDF that was at `/pages/cv_mirha_masala_2020.pdf` redirects to `/resume/cv_mirha_masala_2020.pdf`. Dropbox files that were at `/pages/begin_again.png`, `/pages/coconut_flour_flatbreads_recipe.jpg`, `/pages/bucket_list_cartwheels.mp4`, `/pages/bucket_list_juggling.mp4`, and `/pages/mirha_masala_tokyo.jpg` redirect to `/dropbox/<file>`. Heading ids on Dropbox still match the old anchors (`bucket-list-18-learn-to-do-a-cartwheel`, `bucket-list-19-learn-to-juggle-limes`, `in-tokyo`).
- The old About photograph at `/pages/gm_seoul_about_mm_v3a.jpg` is retired and returns 404 because current pages and content do not use it. Its URL stays in the inventory with an explicit exception in `e2e/legacy-404s.json`.
- The previous design's `/favicon.ico` and six files under `/favicons/` are retired and return 404. Their URLs stay in the inventory with explicit exceptions in `e2e/legacy-404s.json`. The `/favicon.ico` exception is temporary: remove it when a new favicon serves that URL. The audit fails if an excepted URL starts returning 200, with instructions to remove the stale exception.
- The two legacy Markdown notes routes (`/letters/dead-time-010223/notes` and `/posts/favorite-things-2022/notes`) return 404: they are editorial working notes, not finished publications. Legacy article URLs whose files remain `draft: true` also return 404.
- The legacy feeds at `/rss/feed.xml` and `/rss/feed.json` return 404 until a feed is decided.

## Launch checks

These are operational checks, not Playwright tests. Before or immediately after the first production deployment:

- Confirm `SITE_URL` is set in Vercel's production environment, and that production metadata, canonical links, sitemap, and `robots.txt` use `https://www.mirhamasala.com`.
- Confirm the bare domain redirects permanently to `www`, and that deployment protection is enabled for preview deployments.
- Add the new design's favicon. When `/favicon.ico` is restored, remove its temporary entry from `e2e/legacy-404s.json` and run the crawling audit. The retired `/favicons/` files can remain intentional 404s.
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
  places/
    page.tsx          # Places collection and map
  resume/
    page.tsx
    mirha-masala.pdf/
      route.ts          # current résumé PDF
  dropbox/
    page.tsx
  posts/
    page.tsx          # Writing index
    [slug]/page.tsx   # article
  recipes/
    page.tsx          # recipe index
    [slug]/page.tsx   # recipe
  books/
    page.tsx          # book index
    [slug]/page.tsx   # book
  archive/
    page.tsx          # archive section index
  letters/
    page.tsx          # letter index
    [slug]/page.tsx   # letter
  travel-stories/
    page.tsx          # place list and photograph grid
    [slug]/page.tsx   # travel story
  tsop/
    page.tsx          # Spin-Off Project index
    [slug]/page.tsx   # section page
    posts/
      [slug]/page.tsx # spin-off post
components/
  breadcrumbs.tsx     # Archive trail
  eyebrow.tsx
  index-entry.tsx     # Linked title, date, and description on an index
  year-index.tsx      # Year sections for Letters and Writing
  page-header.tsx     # Index header for section pages
  page-lede.tsx
  page-title.tsx
  split-intro.tsx     # Two-column introduction under a page title
  places-map.tsx      # Google map for the selected city
  display-title.tsx
  recipe-details.tsx  # Optional serving and timing details at Ingredients
  external-link.tsx
  site-footer.tsx
  site-header.tsx
  mobile-navigation.tsx
content/
  posts/<slug>.md
  pages/resume.md
  pages/dropbox.md
  recipes/<slug>.md
  books/<slug>.md
  letters/<slug>.md
  travel-stories/<number>.md
  places/<city>/<slug>.md
  tsop/<slug>.md
  tsop/posts/<slug>.md
lib/
  posts.ts            # read, parse, validate, sort, exclude drafts
  pages.ts            # résumé and Dropbox
  resume-pdf.ts       # résumé Markdown to PDF
  recipes.ts          # read, parse, validate, sort
  books.ts            # read, parse, validate, sort
  letters.ts          # read, parse, validate, sort
  travel-stories.ts   # read, parse, validate, group, photograph order
  places.ts           # read, parse, validate, group spots by city
  tsop.ts             # read, parse, validate, sort, group by spin-off
  format-date.ts      # long calendar dates
  redirects.ts        # legacy URLs that permanently redirect
  markdown.tsx        # Markdown rendering and element mapping
  site.ts             # site name, URL, indexability, navigation, profiles
public/
e2e/
  routes.ts           # indexable route inventory, including published articles
  smoke.spec.ts       # Playwright smoke and axe checks
  metadata.spec.ts    # per-page metadata, canonical, indexing, h1
  crawling.spec.ts    # sitemap, robots, unpublished routes, redirects
  discoverability.spec.ts # route coverage, server HTML, editorial report
  content.ts          # independent content inventory for audits and draft checks
  link-audit.ts       # published Markdown links and cached local HTTP/HTML checks
  legacy-urls.json    # frozen migration paths and preserved anchors
  legacy-404s.json    # intentional migration 404s, each with a reason
  resume.spec.ts      # résumé download, PDF text and links, Markdown regressions
next.config.ts        # redirects
playwright.config.ts
```

There is no `src/` folder. Shared chrome lives in `components/`.

## Dependencies

- Runtime: `next`, `react`, `react-dom`, `react-markdown`, `remark-gfm`, `remark-parse`, `unified`, `github-slugger`, `yaml`, `zod`, `@vis.gl/react-google-maps`, `pdfkit`
- Dev: `typescript`, `@types/node`, `@types/react`, `@types/react-dom`, `@types/google.maps`, `@types/mdast`, `@types/pdfkit`, `tailwindcss`, `@tailwindcss/postcss`, `@tailwindcss/typography`, `eslint`, `eslint-config-next`, `eslint-plugin-better-tailwindcss`, `prettier`, `prettier-plugin-tailwindcss`, `@playwright/test`, `@axe-core/playwright`, `unpdf`

`pdfkit` writes the current résumé PDF at `/resume/mirha-masala.pdf` from `content/pages/resume.md`. The page and the download share that file, so the PDF stays in step with the text. Standard PDF fonts keep the text selectable without embedding the site's webfonts or running a browser. `serverExternalPackages` includes `pdfkit` so Next leaves its font data for Node to load. `@types/pdfkit` types that renderer. The 2020 file at `public/resume/cv_mirha_masala_2020.pdf` stays, because `/pages/cv_mirha_masala_2020.pdf` still redirects there.

The PDF renderer parses Markdown with `unified`, `remark-parse`, and `remark-gfm`, the same parser stack used by `react-markdown`. `unified` and `remark-parse` are direct dependencies because the PDF needs the syntax tree independently of React; `@types/mdast` types that tree. This avoids treating URL punctuation as formatting or silently printing unsupported syntax. The renderer supports level 2–4 headings, paragraphs, flat unordered lists, plain text, and HTTP(S) or site-relative links. Other Markdown nodes fail with their type and position in the Markdown body. Text outside the standard fonts' supported character set also fails. Standalone website links include a readable address in the PDF and remain clickable; the web page keeps its ordinary link labels.

Site-relative links in the résumé PDF always resolve against `https://www.mirhamasala.com`, including when generated locally or on a preview deployment. The PDF is a portable document: its printed addresses and clickable destinations must point to the public website. This origin is local to the PDF renderer; page metadata, sitemap, and robots continue to use the environment's `SITE_URL`.

`unpdf` is a test-only PDF reader. Playwright uses it to compare the downloaded document's text with the résumé page, inspect link destinations and printed addresses, and exercise Markdown regressions through the renderer. Checking the actual PDF catches missing or stale content that a filename or `%PDF-` signature check cannot.

`@vis.gl/react-google-maps` draws the map on Places. Google's current Maps JavaScript API uses Advanced Markers, and this is the React library their docs point to for that. The map is a client island on `/places`. It loads only when `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set. Without a key, or if the script fails, the city notes still render and the map area says it isn't available. `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` is the Cloud Map ID Advanced Markers require. When it is unset, the map uses Google's `DEMO_MAP_ID`. The key is public by nature of the Maps JavaScript API. Restrict it by HTTP referrer. `@types/google.maps` is the type package for that map. `tsconfig.json` lists it beside `node` because `compilerOptions.types` does not include `@types/*` automatically.

Any new runtime dependency or significant tooling dependency should have a concrete requirement, with the decision and rationale recorded here in the same change.

Lychee 0.24.2 is an external audit tool, pinned in the separate scheduled workflow.
It supplies HTTP checking, retries, per-host pacing, and structured results without
adding a runtime or npm dependency. `scripts/external-links.mjs` uses Node 24,
the existing Markdown parser, YAML-backed content inventory, and explicit current
frontmatter link fields to collect published external resources. It maps Lychee
results back to every source location and rejects incomplete reports. No new
content schema or response cache is introduced. Local usage is `pnpm audit:links`;
reports live under ignored `test-results/external-links/`.

`.github/workflows/external-links.yml` runs weekly and on manual dispatch from the
default branch, independently of Verify and builds. It has issue-write permission
to maintain one review issue, preserving notes outside its generated block and
closing/reopening that issue as the queue clears or returns. It writes no content.
The issue body is bounded; full reports are artifacts retained for 30 days. A
checker failure leaves the previous issue untouched. Offline regression cases
for extraction, classification, report completeness, and issue updates run in
the existing Playwright suite; they never contact external sites. Editorial
decisions and operational details live in `docs/link-maintenance.md`.

## Verification

Playwright and axe check the rendered site so the verifier can test it after implementation. They are dev dependencies: they are not part of the published application. This is not a unit-test runner, a visual-regression suite, or a performance audit.

- `@playwright/test` drives Chromium. `pnpm test:e2e` builds the app and starts `next start` on `127.0.0.1:4173`, so the run does not depend on a dev server already listening on port 3000. The build gets `SITE_URL=http://127.0.0.1:4173`, so generated absolute URLs are deterministic.
- Set `PLAYWRIGHT_PORT` if 4173 is occupied. The build origin and test server
  use the same port; existing servers are never reused. CI uses two workers.
- Projects are desktop Chromium (`Desktop Chrome`) and mobile Chromium (`Pixel 5`). Add another browser only when there is a concrete need. `crawling.spec.ts` and `discoverability.spec.ts` don't depend on the viewport, so they run on desktop only.
- Discoverability checks cover the contract under "Metadata and indexing" and "Sitemap and robots": title, description, canonical, indexing directives, and a single visible `h1` for every indexable route; distinct descriptions; sitemap contents compared with the published inventory from all content loaders; `robots.txt`; 404 and `noindex` for every draft page and representative unknown slugs; and redirects. They don't assert description wording (except that articles use their frontmatter), character limits, keywords, rankings, or Lighthouse scores.
- `pnpm test:seo` runs metadata, crawling, and discoverability checks on
  desktop. It is a focused subset of `pnpm test:e2e`, not a second audit system.
  New or edited content in existing collections enters the inventory
  automatically. A filesystem check catches page templates and published
  Markdown files missing from the inventory, independently of the published
  loaders. New page types must be added to `e2e/routes.ts` and the sitemap, or
  given explicit exclusion coverage. Draft checks read frontmatter independently
  too; draft places are checked for absent ids in their city views.
- The server-HTML pass reads every canonical page, every configured Places city,
  and the Travel Stories photograph view without executing page scripts. It
  checks metadata, indexing, the base-page canonical for query views, one main
  `h1`, nonempty headings, and image alt attributes. Empty alt text is allowed:
  whether an image needs a description requires editorial judgment.
- That pass also writes `editorial-report.md` and `editorial-report.json` in
  its `test-results/` directory, with route-specific review prompts. Heading
  jumps, empty or filename-like alts, normalized duplicate titles/descriptions,
  description lengths outside 40–200 characters, titles outside 10–80, and
  referenced local image source files over 1 MiB are nonblocking heuristics,
  not SEO targets. The report counts missing Open Graph, Twitter cards, and
  JSON-LD separately as optional features. It never rewrites editorial content
  or fetches external links. The initial reviewed findings are in
  `docs/seo-audit.md`.
- `.github/workflows/verify.yml` runs lint, typecheck, and the full production
  browser suite on every pull request (including content-only changes), pushes
  to `main`, and manual dispatch. The suite includes the build. Editorial counts
  appear in the Actions job summary, and reports, failure screenshots, and
  traces are retained in the `verification-results` artifact for 14 days.
  The workflow has read-only repository permissions and does not deploy.
  Require the **Site verification** status check in the `main` branch rule
  after publishing the workflow. A workflow file alone does not enforce merge
  protection, and a check triggered by a direct push cannot stop that push's
  Vercel deployment. Publish through pull requests with the required check.
- The migration audit freezes 548 legacy paths in `e2e/legacy-urls.json`, with the source tag and commit: 162 page routes (including the two `.md` notes routes), 96 redirect sources, 288 public files, and two generated feeds. It is independent of `lib/redirects.ts`, and CI needs no legacy tag. Unlighthouse reports are excluded as tooling output; old map markers are excluded because current content and UI do not reference them. `e2e/legacy-404s.json` records each intentional 404 and its reason. Removing an exception when its content is published is an explicit change.
- `crawling.spec.ts` checks every inventoried URL for 200, one 308 directly to 200, or its recorded 404; redirects to home and redirect chains fail. Existing destination-specific redirect tests stay. The link audit parses published Markdown with the existing parser (including reference links, images, and recipe attribution), and extracts links and media URLs from the HTML of every indexable route and linked query views. Draft source files are excluded. Both production hostnames resolve against the local server; external URLs are never requested. Responses are cached by path and query, and decoded fragments are checked against actual HTML ids, including inherited fragments across redirects. The fixture also preserves 102 Travel Stories and Dropbox anchor links. An intentional legacy 404 is still a failure when linked from a published page.
- `@axe-core/playwright` scans those same pages inside the Playwright suite. Serious and critical violations fail the run. Moderate and minor results do not. The Places map region (`#places-map`) is excluded, because that markup belongs to Google's map widget.
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

- Article images: how their dimensions are known, and whether to use `next/image` optimization or plain pre-sized images. This migration uses static files at `public/posts/<slug>/`. The homepage photograph uses `next/image`; that choice stays local to that one file.
- Whether the typography plugin stays or is replaced by custom styles
- How an article moves out of Writing, and how that article is represented. `/archive` presents The Spin-Off Project, Travel Stories, and Letters. Links to an archived article's `/posts/<slug>` URL must keep working.
- How related writing is represented in content. Spots live in `content/places/`. `/places` is the page; `/map` redirects there.
- Feed format, URL, and full text or excerpts, if a feed is added
- Social preview images: static files or generated with `next/og`
- A unit-test runner. Browser and accessibility verification is Playwright and axe, recorded under Verification.
