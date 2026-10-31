import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { expect, test, type APIRequestContext } from "@playwright/test";
import { parse as parseYaml } from "yaml";
import { legacyRedirects } from "@/lib/redirects";
import { absoluteUrl, getIndexableRoutes } from "./routes";

const routes = await getIndexableRoutes();

// Read drafts independently of the published-content loader so a filtering
// regression cannot make both the site and its expected inventory agree.
const recipeFiles = (await readdir("content/recipes")).filter((file) =>
  file.endsWith(".md"),
);
const draftRecipePaths = (
  await Promise.all(
    recipeFiles.map(async (file) => {
      const source = await readFile(`content/recipes/${file}`, "utf8");
      const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source);
      if (!frontmatter) throw new Error(`${file}: missing YAML frontmatter`);
      return parseYaml(frontmatter[1]).draft === true
        ? `/recipes/${file.slice(0, -".md".length)}`
        : null;
    }),
  )
).filter((path) => path !== null);

const unpublishedPaths = [
  ...draftRecipePaths,
  "/posts/draft-fixture",
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

  test("draft recipes are absent from the recipe index", async ({ page }) => {
    await page.goto("/recipes");

    for (const path of draftRecipePaths) {
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
