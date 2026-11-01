import { existsSync } from "node:fs";
import { expect, test, type APIRequestContext } from "@playwright/test";
import { legacyRedirects } from "@/lib/redirects";
import legacyUrls from "./legacy-urls.json" with { type: "json" };
import legacy404s from "./legacy-404s.json" with { type: "json" };
import { getPublishedContentLinks, LinkAudit } from "./link-audit";
import { absoluteUrl, getIndexableRoutes } from "./routes";
import { getContentSources } from "./content";

const routes = await getIndexableRoutes();

const draftPaths = (await getContentSources())
  .filter(
    ({ metadata, file }) =>
      metadata.draft === true && !file.startsWith("content/places/"),
  )
  .map(({ pagePath }) => pagePath);

const unpublishedPaths = [
  ...draftPaths,
  "/not-a-real-page",
  "/posts/not-a-real-article",
  "/recipes/not-a-real-recipe",
  "/books/not-a-real-book",
  "/letters/not-a-real-letter",
  "/travel-stories/not-a-real-story",
  "/tsop/posts/not-a-real-post",
  "/tsop/not-a-real-page",
] as const;

/** Permanent redirects from legacy URLs to their equivalent pages. */
const redirects = legacyRedirects;

async function getSitemapUrls(request: APIRequestContext) {
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);

  const xml = await response.text();
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(([, url]) => url);
}

test.describe("crawling", () => {
  test("the link audit checks absolute production URLs and inherited fragments locally", async ({
    request,
    page,
    baseURL,
  }) => {
    if (!baseURL) throw new Error("Playwright baseURL is not configured");
    const audit = new LinkAudit(request, page, baseURL);
    const check = (href: string, pagePath = "/") =>
      audit.check({ href, pagePath, source: "Audit regression check" });

    expect(
      await check("https://mirhamasala.com/travel-archives#%32%39%34"),
    ).toBeUndefined();
    expect(
      await check("#74-designing-your-life", "/posts/read-100-books"),
    ).toBeUndefined();
    expect(
      await check("https://www.mirhamasala.com/posts/not-a-real-article"),
    ).toContain("404");
    expect(await check("/travel-archives#not-a-real-anchor")).toContain(
      "missing id",
    );
  });

  test("every inventoried legacy URL is kept, redirected once, or explicitly unpublished", async ({
    request,
    page,
    baseURL,
  }) => {
    test.setTimeout(90_000);
    if (!baseURL) throw new Error("Playwright baseURL is not configured");
    const audit = new LinkAudit(request, page, baseURL);
    const inventory = [
      ...legacyUrls.pages,
      ...legacyUrls.aliases,
      ...legacyUrls.assets,
      ...legacyUrls.feeds,
    ];
    expect(new Set(inventory).size).toBe(inventory.length);
    const intentional404s: Record<string, string> = legacy404s;
    for (const [path, reason] of Object.entries(intentional404s)) {
      expect(inventory, `Stale intentional-404 entry: ${path}`).toContain(path);
      expect(reason.trim(), path).not.toBe("");
    }

    const failures: string[] = [];
    for (const path of inventory) {
      const reason = intentional404s[path];
      if (reason) {
        const response = await audit.read(new URL(path, baseURL));
        if (response.status !== 404)
          failures.push(
            `${path}: ${response.status}, expected intentional 404 (${reason}). If this URL was intentionally restored, remove its entry from e2e/legacy-404s.json.`,
          );
      } else {
        const failure = await audit.check({
          href: path,
          pagePath: "/",
          source: legacyUrls.sourceTag,
        });
        if (failure) failures.push(failure);
      }
    }
    expect(failures, "Legacy URL migration gaps").toEqual([]);
  });

  test("published content and rendered internal links resolve, including fragments", async ({
    request,
    page,
    baseURL,
  }) => {
    test.setTimeout(90_000);
    if (!baseURL) throw new Error("Playwright baseURL is not configured");
    const audit = new LinkAudit(request, page, baseURL);
    const links = await getPublishedContentLinks();
    const canonicalPaths = new Set(routes.map(({ path }) => path));
    const renderedPaths = new Set(canonicalPaths);
    // City selections and the photograph view render different links/assets,
    // although they share their page's canonical URL.
    for (const path of renderedPaths) {
      const response = await audit.read(new URL(path, baseURL));
      expect(response.status, path).toBe(200);
      expect(response.document, `${path}: expected HTML`).toBeDefined();
      for (const href of response.document!.links) {
        links.push({ href, pagePath: path, source: `Rendered ${path}` });
        const url = audit.localUrl(href, path);
        if (url?.search && canonicalPaths.has(url.pathname))
          renderedPaths.add(url.pathname + url.search);
      }
    }
    for (const href of legacyUrls.anchors)
      links.push({ href, pagePath: "/", source: "Preserved legacy anchor" });

    const failures: string[] = [];
    const checked = new Map<string, string | undefined>();
    for (const link of links) {
      const url = audit.localUrl(link.href, link.pagePath);
      if (!url) continue;
      if (!checked.has(url.href))
        checked.set(url.href, await audit.check(link));
      const failure = checked.get(url.href);
      if (failure && !failures.includes(failure)) failures.push(failure);
    }
    expect(failures, "Broken published internal links or anchors").toEqual([]);
  });

  test("sitemap lists exactly the indexable canonical URLs", async ({
    request,
    baseURL,
  }) => {
    const urls = await getSitemapUrls(request);
    const expected = routes.map(({ path }) => absoluteUrl(path, baseURL));

    expect(urls.map((url) => new URL(url).href).toSorted()).toEqual(
      expected.toSorted(),
    );

    for (const url of urls) {
      const response = await request.get(url, { maxRedirects: 0 });
      expect(response.status(), url).toBe(200);
    }
  });

  test("robots.txt allows crawling and points to the sitemap", async ({
    request,
    baseURL,
  }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);

    const robots = await response.text();
    expect(robots).toMatch(/^User-Agent: \*$/m);
    expect(robots).toMatch(/^Allow: \/$/m);
    expect(robots).not.toMatch(/^Disallow: \/\s*$/m);
    expect(robots.split("\n")).toContain(
      `Sitemap: ${absoluteUrl("/sitemap.xml", baseURL)}`,
    );
  });

  test("descriptions are distinct across indexable pages", async ({ page }) => {
    const descriptions: string[] = [];

    for (const { path } of routes) {
      await page.goto(path);
      descriptions.push(
        (await page
          .locator('meta[name="description"]')
          .getAttribute("content")) ?? "",
      );
    }

    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  test("the draft fixture exists but is not published", async ({ page }) => {
    expect(existsSync("content/posts/draft-fixture.md")).toBe(true);
    expect(routes.map(({ path }) => path)).not.toContain(
      "/posts/draft-fixture",
    );

    await page.goto("/posts");
    await expect(page.locator('a[href="/posts/draft-fixture"]')).toHaveCount(0);
  });

  for (const path of unpublishedPaths) {
    test(`${path} returns 404, is noindex, and is not in the sitemap`, async ({
      page,
      request,
      baseURL,
    }) => {
      const response = await page.goto(path);
      if (!response) throw new Error(`No response for ${path}`);
      expect(response.status()).toBe(404);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        "content",
        /noindex/,
      );

      expect(await getSitemapUrls(request)).not.toContain(
        absoluteUrl(path, baseURL),
      );
    });
  }

  test("draft pages are absent from their indexes", async ({ page }) => {
    for (const path of draftPaths) {
      await page.goto(path.slice(0, path.lastIndexOf("/")) || "/");
      expect(routes.map((route) => route.path)).not.toContain(path);
      await expect(page.locator(`a[href="${path}"]`)).toHaveCount(0);
    }
  });

  test("/pages/tsop/posts/artist-month/memory-bytes_2b.jpg permanently redirects to /tsop/posts/artist-month/memory-bytes_2b.jpg", async ({
    request,
    baseURL,
  }) => {
    const source = "/pages/tsop/posts/artist-month/memory-bytes_2b.jpg";
    const destination = "/tsop/posts/artist-month/memory-bytes_2b.jpg";
    const response = await request.get(source, { maxRedirects: 0 });
    expect(response.status()).toBe(308);
    expect(absoluteUrl(response.headers().location, baseURL)).toBe(
      absoluteUrl(destination, baseURL),
    );

    const target = await request.get(destination, { maxRedirects: 0 });
    expect(target.status()).toBe(200);
  });

  for (const { source, destination } of redirects) {
    test(`${source} permanently redirects to ${destination}`, async ({
      request,
      baseURL,
    }) => {
      const response = await request.get(source, { maxRedirects: 0 });
      expect(response.status()).toBe(308);
      expect(absoluteUrl(response.headers().location, baseURL)).toBe(
        absoluteUrl(destination, baseURL),
      );

      const target = await request.get(destination, { maxRedirects: 0 });
      expect(target.status()).toBe(200);
    });
  }
});
