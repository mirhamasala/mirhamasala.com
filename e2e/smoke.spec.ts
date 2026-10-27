import { AxeBuilder } from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { getBooks } from "@/lib/books";
import { getLetters } from "@/lib/letters";
import { getTsopPages, getTsopPosts } from "@/lib/tsop";
import { getPosts } from "@/lib/posts";
import { getRecipes } from "@/lib/recipes";

const recipes = await getRecipes();
const books = await getBooks();
const letters = await getLetters();
const posts = await getPosts();
const tsopPosts = await getTsopPosts();
const tsopPages = await getTsopPages();

const pages = [
  { path: "/", status: 200 },
  { path: "/about", status: 200, heading: /Hi, I’m Mirha\./ },
  { path: "/posts", status: 200, heading: "Writing" },
  ...posts.map((post) => ({
    path: `/posts/${post.slug}`,
    status: 200,
    heading: post.title,
  })),
  { path: "/recipes", status: 200, heading: "What I keep making." },
  ...recipes.map((recipe) => ({
    path: `/recipes/${recipe.slug}`,
    status: 200,
    heading: recipe.title,
  })),
  { path: "/books", status: 200, heading: "What I’ve taken from the pages." },
  ...books.map((book) => ({
    path: `/books/${book.slug}`,
    status: 200,
    heading: book.title,
  })),
  { path: "/archive", status: 200, heading: "Archive" },
  { path: "/letters", status: 200, heading: "Flying paper planes." },
  ...letters.map((letter) => ({
    path: `/letters/${letter.slug}`,
    status: 200,
    heading: letter.title,
  })),
  { path: "/tsop", status: 200, heading: "The Spin-Off Project" },
  ...tsopPosts.map((post) => ({
    path: `/tsop/posts/${post.slug}`,
    status: 200,
    heading: post.title,
  })),
  ...tsopPages.map((page) => ({
    path: `/tsop/${page.slug}`,
    status: 200,
    heading: page.title,
  })),
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
    await page.getByRole("link", { name: "Slow Coffee" }).click();
    await expect(page).toHaveURL(/\/posts\/slow-coffee$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Slow Coffee" }),
    ).toBeVisible();
    const externalLink = page.getByRole("link", {
      name: "The New Rules of Coffee",
    });
    await expect(externalLink).toHaveAttribute(
      "href",
      "https://www.amazon.com/dp/0399581626/",
    );
    await expect(externalLink).not.toContainText("↗");
    await expect(externalLink.locator('[aria-hidden="true"]')).toHaveCount(0);

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

test.describe("book pages", () => {
  for (const path of ["/books", "/books/four-thousand-weeks"]) {
    test(`${path} has no horizontal overflow or undersized text`, async ({
      page,
    }) => {
      await page.goto(path);

      await expectNoHorizontalOverflow(page);
      await expectNoTextBelowOneRem(page);
    });
  }

  test("the book index links to an individual book", async ({ page }) => {
    await page.goto("/books");
    await page
      .getByRole("link", { name: "Four Thousand Weeks" })
      .first()
      .click();

    await expect(page).toHaveURL(/\/books\/four-thousand-weeks$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Four Thousand Weeks" }),
    ).toBeVisible();
  });
});

test.describe("letter pages", () => {
  for (const path of [
    "/archive",
    "/letters",
    "/letters/courage-again-091022",
    "/letters/life-escaping-life-091023",
    "/tsop",
    "/tsop/posts/polyglot-month",
    "/tsop/posts/30-days-photography",
    "/tsop/posts/cuban-style-salsa-lessons",
    "/tsop/about",
    "/tsop/resources",
    "/tsop/contact",
  ]) {
    test(`${path} has no horizontal overflow or undersized text`, async ({
      page,
    }) => {
      await page.goto(path);

      await expectNoHorizontalOverflow(page);
      await expectNoTextBelowOneRem(page);
    });
  }

  test("the archive links to a spin-off", async ({ page }) => {
    await page.goto("/archive");
    await page
      .getByRole("main")
      .getByRole("link", { name: "The Spin-Off Project" })
      .click();

    await expect(page).toHaveURL(/\/tsop$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "The Spin-Off Project" }),
    ).toBeVisible();

    await page.goto("/archive");
    await page
      .getByRole("main")
      .getByRole("link", { name: "Polyglot", exact: true })
      .click();
    await expect(page).toHaveURL(/\/tsop#polyglot$/);
    await expect(
      page.getByRole("heading", { level: 2, name: "Polyglot" }),
    ).toBeVisible();

    await page.getByRole("link", { name: "Polyglot for a Month" }).click();
    await expect(page).toHaveURL(/\/tsop\/posts\/polyglot-month$/);
  });

  test("the archive links to a letter", async ({ page }) => {
    await page.goto("/archive");
    await page.getByRole("main").getByRole("link", { name: "Letters" }).click();

    await expect(page).toHaveURL(/\/letters$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Flying paper planes." }),
    ).toBeVisible();

    await page.getByRole("link", { name: /Courage Again/ }).click();
    await expect(page).toHaveURL(/\/letters\/courage-again-091022$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Courage Again" }),
    ).toBeVisible();
  });
});

test.describe("recipe pages", () => {
  for (const path of ["/recipes", "/recipes/rum-hot-toddy"]) {
    test(`${path} has no horizontal overflow or undersized text`, async ({
      page,
    }) => {
      await page.goto(path);

      await expectNoHorizontalOverflow(page);
      await expectNoTextBelowOneRem(page);
    });
  }

  test("the recipe index links to an individual recipe", async ({ page }) => {
    await page.goto("/recipes");
    await page.getByRole("link", { name: /Rum Hot Toddy/ }).click();

    await expect(page).toHaveURL(/\/recipes\/rum-hot-toddy$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Rum Hot Toddy" }),
    ).toBeVisible();
  });
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
    expect(["A", "BUTTON"]).toContain(focusedTagName);
  });

  test("mobile navigation opens, closes, and follows links", async ({
    page,
  }) => {
    await page.goto("/about");

    const openMenuButton = page.getByRole("button", {
      name: "Open main menu",
    });
    test.skip(
      !(await openMenuButton.isVisible()),
      "Mobile navigation is hidden at this viewport.",
    );

    await openMenuButton.click();
    const dialog = page.getByRole("dialog", { name: "Main navigation" });
    await expect(dialog).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();

    await openMenuButton.click();
    await dialog.getByRole("link", { name: "Writing" }).click();
    await expect(page).toHaveURL(/\/posts$/);
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
