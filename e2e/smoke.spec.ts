import { AxeBuilder } from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const pages = [
  { path: "/", status: 200 },
  { path: "/about", status: 200, heading: /Hi, I’m Mirha\./ },
  { path: "/posts", status: 200, heading: "Writing" },
  {
    path: "/posts/pipeline-fixture",
    status: 200,
    heading: "Pipeline fixture",
  },
  {
    // Unknown slugs are not pre-rendered. Next logs NoFallbackError and still
    // responds with this not-found page.
    path: "/posts/not-a-real-article",
    status: 404,
    heading: "Page not found",
  },
] as const;

function collectUnexpectedConsoleErrors(page: Page, documentPath?: string) {
  const errors: string[] = [];

  page.on("console", (message) => {
    if (message.type() !== "error") return;

    const text = message.text();
    const url = message.location().url;
    // Chromium also logs the document's own 404. The status assertion covers it.
    if (
      documentPath &&
      url.endsWith(documentPath) &&
      text.includes("status of 404")
    ) {
      return;
    }

    errors.push(url ? `${text} (${url})` : text);
  });

  page.on("pageerror", (error) => {
    errors.push(error.message);
  });

  return errors;
}

async function expectNoSeriousAccessibilityViolations(page: Page) {
  const results = await new AxeBuilder({ page }).analyze();
  const violations = results.violations.filter(
    (violation) =>
      violation.impact === "serious" || violation.impact === "critical",
  );
  const summary = violations
    .map((violation) => {
      const targets = violation.nodes
        .map((node) => node.target.join(" "))
        .join(", ");
      return `${violation.impact} ${violation.id}: ${violation.help} [${targets}]`;
    })
    .join("\n");

  expect(violations, summary).toEqual([]);
}

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => ({
    body: document.body.scrollWidth - document.body.clientWidth,
    document:
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  }));

  expect(overflow.body).toBeLessThanOrEqual(1);
  expect(overflow.document).toBeLessThanOrEqual(1);
}

async function expectNoTextBelowOneRem(page: Page) {
  const offenders = await page.locator("body *").evaluateAll((elements) =>
    elements
      .map((element) => {
        const text = element.textContent?.replace(/\s+/g, " ").trim();
        const isVisible = element.getClientRects().length > 0;
        if (!text || !isVisible) return null;

        const { fontSize } = getComputedStyle(element);
        const size = Number.parseFloat(fontSize);
        if (size >= 16) return null;

        return {
          tag: element.tagName.toLowerCase(),
          text: text.slice(0, 80),
          fontSize,
        };
      })
      .filter(Boolean),
  );

  expect(offenders).toEqual([]);
}

test.describe("smoke", () => {
  for (const route of pages) {
    test(`${route.path} loads without unexpected console errors`, async ({
      page,
    }) => {
      const errors = collectUnexpectedConsoleErrors(
        page,
        route.status === 404 ? route.path : undefined,
      );
      const response = await page.goto(route.path);
      if (!response) throw new Error(`No response for ${route.path}`);

      expect(response.status()).toBe(route.status);
      await expect(page.locator("main")).toBeVisible();

      if ("heading" in route) {
        await expect(
          page.getByRole("heading", { level: 1, name: route.heading }),
        ).toBeVisible();
      }

      expect(errors).toEqual([]);
    });
  }

  test("navigation reaches Writing and an article", async ({ page }) => {
    const errors = collectUnexpectedConsoleErrors(page);

    await page.goto("/");
    await page.getByRole("link", { name: "Writing" }).last().click();
    await expect(page).toHaveURL(/\/posts$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Writing" }),
    ).toBeVisible();

    await page.getByRole("link", { name: "About" }).last().click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(
      page.getByRole("heading", { level: 1, name: /Hi, I’m Mirha\./ }),
    ).toBeVisible();

    await page.getByRole("link", { name: "Writing" }).last().click();
    await expect(page).toHaveURL(/\/posts$/);
    await page.getByRole("link", { name: "Pipeline fixture" }).click();
    await expect(page).toHaveURL(/\/posts\/pipeline-fixture$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Pipeline fixture" }),
    ).toBeVisible();
    const externalLink = page.getByRole("link", { name: "external link" });
    await expect(externalLink).toHaveAttribute("href", "https://nextjs.org");
    await expect(externalLink.locator('[aria-hidden="true"]')).toHaveText("↗");

    await page.getByRole("link", { name: "Mirha Masala" }).click();
    await expect(page).toHaveURL(/\/$/);

    expect(errors).toEqual([]);
  });
});

test.describe("accessibility", () => {
  for (const route of pages) {
    test(`${route.path} has no serious or critical violations`, async ({
      page,
    }) => {
      const response = await page.goto(route.path);
      if (!response) throw new Error(`No response for ${route.path}`);

      expect(response.status()).toBe(route.status);
      await expectNoSeriousAccessibilityViolations(page);
    });
  }
});

test.describe("about page constraints", () => {
  test("has no horizontal overflow or undersized text", async ({ page }) => {
    await page.goto("/about");

    await expectNoHorizontalOverflow(page);
    await expectNoTextBelowOneRem(page);
  });

  test("supports keyboard navigation", async ({ page }) => {
    await page.goto("/about");

    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("link", { name: "Mirha Masala home" }),
    ).toBeFocused();

    await page.keyboard.press("Tab");
    const focusedTagName = await page.evaluate(
      () => document.activeElement?.tagName,
    );
    expect(["A", "SUMMARY"]).toContain(focusedTagName);
  });

  test("renders with reduced motion preference", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/about");

    await expect(
      page.getByRole("heading", { level: 1, name: /Hi, I’m Mirha\./ }),
    ).toBeVisible();
  });

  test("captures desktop and mobile screenshots", async ({
    page,
  }, testInfo) => {
    await page.goto("/about");
    await page.screenshot({
      fullPage: true,
      path: `test-results/about-${testInfo.project.name}.png`,
    });
  });
});
