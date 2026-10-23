import { expect, test } from "@playwright/test";
import { absoluteUrl, getIndexableRoutes } from "./routes";

const routes = await getIndexableRoutes();

test.describe("metadata", () => {
  for (const route of routes) {
    test(`${route.path} is described, canonical, and indexable`, async ({
      page,
      baseURL,
    }) => {
      const response = await page.goto(route.path);
      if (!response) throw new Error(`No response for ${route.path}`);
      expect(response.status()).toBe(200);
      expect(response.headers()["x-robots-tag"] ?? "").not.toContain("noindex");

      await expect(page).toHaveTitle(route.title);

      const description = await page
        .locator('meta[name="description"]')
        .getAttribute("content");
      expect(description?.trim()).toBeTruthy();
      if (route.description) expect(description).toBe(route.description);

      const canonical = await page
        .locator('link[rel="canonical"]')
        .getAttribute("href");
      if (!canonical) throw new Error(`${route.path} has no canonical link`);
      expect(new URL(canonical).href).toBe(absoluteUrl(route.path, baseURL));

      const robots = await page
        .locator('meta[name="robots"]')
        .evaluateAll((elements) =>
          elements.map((element) => element.getAttribute("content") ?? ""),
        );
      expect(robots.filter((content) => content.includes("noindex"))).toEqual(
        [],
      );

      await expect(page.locator("h1")).toHaveCount(1);
      await expect(
        page.getByRole("heading", { level: 1, name: route.heading }),
      ).toBeVisible();
    });
  }
});
