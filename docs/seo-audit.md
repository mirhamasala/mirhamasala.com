# Technical SEO audit — 1 November 2026

Reviewed the local production build across 303 canonical pages and nine query
views (eight Places cities and the Travel Stories photograph view). The
automated pass examines server-rendered HTML on every route. Manual outline
review also covered The Knitting Club, Read 100 Business Books, Goodbye Little
Red Dot, Slow Coffee, and 30 Days of Photography. This is a repository audit;
production indexing and Search Console were not inspected.

## Technical findings and ongoing protection

- **Modification dates were misleading.** `app/sitemap.ts` used publication
  dates for `lastmod`, including on content that can be edited. This change
  omits `lastmod` until a reliable modification-date source exists, with a
  regression check. Publication dates remain untouched. Google expects the
  last significant update, not the build date or necessarily the publication
  date. [Sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- **Checks needed an automatic trigger.** Added the `Verify` workflow for all
  pull requests, pushes to `main`, and manual runs. It runs lint, typecheck,
  the production build, and the complete browser suite. No content path filters
  can accidentally skip an editorial change. At audit time GitHub's `main`
  protection has no required status checks. After publishing this workflow,
  require **Site verification** before merging. The local workflow file does
  not itself change that repository setting or prevent direct-push deployment.
- **Coverage could drift.** New tests compare page templates and independently
  read published Markdown with the route inventory. All draft pages are read
  independently of the publication filters and checked for 404, noindex,
  sitemap exclusion, and absence from their indexes. Draft places are checked
  for absence from their city views. Query views now have explicit server-HTML
  canonical checks.
- **Existing discovery mechanics are sound in the local build.** Metadata,
  distinct descriptions, sitemap membership, robots, internal links and media,
  preserved anchors, and the frozen legacy URL inventory pass their checks.
  No redirect or content-link repairs were necessary. The new server-HTML pass
  also checks empty headings and missing image alt attributes.

## Editorial review, not publishing failures

The generated report currently contains 158 review prompts. These are not 158
SEO defects, and none is a reason to rewrite an article mechanically.

- **81 image-alt prompts on nine pages.** Review informative photographs and
  diagrams first, especially the photography series, The Knitting Club,
  Read 100 Business Books, and Slow Coffee. An empty alt is valid when an image
  is decorative or its information is already conveyed nearby; filenames are
  not useful descriptions. [W3C guidance](https://www.w3.org/WAI/tutorials/images/decorative/)
- **Five referenced image files exceed 1 MiB.** `congee_2.jpg` in The Knitting
  Club is 1.36 MiB. Travel Stories 417, 430, 431, and 465 have photographs of
  1.67, 1.08, 1.34, and 1.29 MiB respectively; the photograph view includes all
  four. Consider smaller exports in a separate image pass. This does not
  decide article image dimensions or `next/image` adoption.
- **One heading jump:** `/tsop/about` goes from `h1` to `h3` at “My Spin-Off
  List.” The five manually reviewed long articles have outlines that match
  their subjects: chapters, book entries, place categories, coffee resources,
  and photography days. No empty headings were found.
- **63 description-length and seven title-length prompts.** Examples include
  the 318-character photography description and the 411-character surfing
  description. Short descriptions such as the Recipes index's 31 characters
  can already be specific and sufficient. These counts use broad triage
  thresholds, not search-engine limits. Index descriptions explain their
  subjects; there is no need to insert an exact page name into every one.
- **One repeated title:** “Mastery” names both `/books/mastery` and
  `/letters/paper-planes-packets-0618`. Consider whether readers need more
  context in the letter's title. No description duplicates were found after
  normalizing case, punctuation, and whitespace. Semantic similarity still
  needs human judgment.

## Optional additions

All 303 canonical pages lack Open Graph title metadata, Twitter card metadata,
and JSON-LD. They are absent features, not violations of the current contract.

Page-specific social titles, descriptions, and URLs could follow existing
metadata without choosing social images. If implemented, derive them from the
same content fields and add assertions for every supported page type.

Structured data should follow actual page content and its supported search
feature, rather than being added everywhere:

| Page type                     | Candidate and practical effect                                                                                                                                                                                                                                                                                  |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Writing and archived articles | `Article` can clarify title, author, images, and dates for article presentation. [Article guidance](https://developers.google.com/search/docs/appearance/structured-data/article)                                                                                                                               |
| Recipes                       | `Recipe` can make pages eligible for recipe results when the required data exists. Current recipes have no photographs; Google's required image property is a concrete prerequisite, not a reason to invent one. [Recipe guidance](https://developers.google.com/search/docs/appearance/structured-data/recipe) |
| Archive trails                | `BreadcrumbList` can describe the visible hierarchy for breadcrumb presentation. [Breadcrumb guidance](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)                                                                                                                         |
| Home and author               | `WebSite` can express the preferred site name; `Person` can identify the author, without promising a special result. [Site-name guidance](https://developers.google.com/search/docs/appearance/site-names)                                                                                                      |
| Book notes                    | `Book` can describe the work discussed. It does not by itself make these notes eligible for review stars; no ratings should be invented. [Supported search features](https://developers.google.com/search/docs/appearance/structured-data/search-gallery)                                                       |

JSON-LD can be rendered directly without a schema library. Rich-result
appearance is never guaranteed. [Next.js JSON-LD guidance](https://nextjs.org/docs/app/guides/json-ld),
[Google's structured-data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)

## Deferred and operational work

Feed, social preview images, analytics, and article image strategy remain open.
The two retired feed URLs remain intentional 404s. The new favicon, production
origin and `www` redirects, preview protection, Search Console submission, and
live indexing checks remain the launch tasks in Architecture. No Lighthouse,
Core Web Vitals, keywords, or ranking gate was introduced.

## Running this again

Run `pnpm test:seo` for the focused checks or `pnpm test:e2e` for full browser
verification. If needed, use `PLAYWRIGHT_PORT=4175 pnpm test:seo` to avoid a
busy default test port. No external link requests are made by the SEO audit.

Each run writes `editorial-report.md` and `editorial-report.json` in the
discoverability test's directory under `test-results/`. CI publishes counts in
the job summary and retains full reports in `verification-results` for 14 days.
Review the warnings relevant to the page being edited. Existing collections
need no manual audit inventory updates when content is added or changed.
Adding a new route type requires explicit inventory and sitemap coverage.

This document is the initial reviewed snapshot. Generated reports are the
current evidence and are intentionally not committed after every edit.

Validation: `pnpm lint`, `pnpm typecheck`, and `pnpm build` passed. The full
desktop/mobile suite passed 2,197 tests, with three existing conditional skips.
The server-HTML report has zero contract failures. Temporary unlisted static
and dynamic page fixtures were each rejected by the inventory guard and then
removed; the normal inventory passed. Workflow YAML and changed-file formatting
were also checked. The GitHub-hosted workflow itself has not run yet.
