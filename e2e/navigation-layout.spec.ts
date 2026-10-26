import { expect, test, type Locator } from "@playwright/test";

type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
};

async function getBox(locator: Locator): Promise<Box> {
  const box = await locator.boundingBox();
  if (!box) throw new Error("Expected element to have a bounding box.");

  return box;
}

function expectWithinTolerance(
  actual: number,
  expected: number,
  tolerance = 1,
) {
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tolerance);
}

function expectBoxWithinTolerance(
  actual: Box,
  expected: Box,
  fields: readonly (keyof Box)[],
  tolerance = 1,
) {
  for (const field of fields) {
    expectWithinTolerance(actual[field], expected[field], tolerance);
  }
}

test.describe("navigation layout", () => {
  test("desktop header follows the site chrome width", async ({ page }) => {
    await page.goto("/");

    const openMenuButton = page.getByRole("button", {
      name: "Open main menu",
    });
    test.skip(
      await openMenuButton.isVisible(),
      "Desktop navigation is hidden at this viewport.",
    );

    const header = await getBox(page.locator("header"));
    const headerBar = await getBox(page.locator("header > div"));
    const footer = await getBox(page.locator("footer"));

    expect(header.width).toBeGreaterThanOrEqual(1000);
    expectBoxWithinTolerance(header, footer, ["x", "width"]);
    expectWithinTolerance(headerBar.height, 112);
  });

  test("mobile menu opens and closes without shifting the header", async ({
    page,
  }) => {
    await page.goto("/");

    const openMenuButton = page.getByRole("button", {
      name: "Open main menu",
    });
    test.skip(
      !(await openMenuButton.isVisible()),
      "Mobile navigation is hidden at this viewport.",
    );

    const headerBar = page.locator("header > div");
    const headerLogo = page
      .locator("header")
      .getByRole("link", { name: "Mirha Masala home" });
    const closedHeader = await getBox(headerBar);
    const closedLogo = await getBox(headerLogo);
    const closedButton = await getBox(openMenuButton);

    await openMenuButton.click();

    const dialog = page.getByRole("dialog", { name: "Main navigation" });
    await expect(dialog).toBeVisible();

    const viewport = page.viewportSize();
    if (!viewport) throw new Error("Expected the page to have a viewport.");

    const dialogBox = await getBox(dialog);
    const dialogHeader = await getBox(
      dialog.locator(":scope > div > div").first(),
    );
    const dialogLogo = await getBox(
      dialog.getByRole("link", { name: "Mirha Masala home" }),
    );
    const closeMenuButton = dialog.getByRole("button", {
      name: "Close main menu",
    });
    const closeButton = await getBox(closeMenuButton);

    expectBoxWithinTolerance(
      dialogBox,
      {
        x: 0,
        y: 0,
        width: viewport.width,
        height: viewport.height,
      },
      ["x", "y", "width", "height"],
    );
    expectBoxWithinTolerance(dialogHeader, closedHeader, [
      "x",
      "y",
      "width",
      "height",
    ]);
    expectBoxWithinTolerance(dialogLogo, closedLogo, [
      "x",
      "y",
      "width",
      "height",
    ]);
    expectBoxWithinTolerance(closeButton, closedButton, [
      "x",
      "y",
      "width",
      "height",
    ]);

    await closeMenuButton.click();
    await expect(dialog).not.toBeVisible();

    expectBoxWithinTolerance(await getBox(headerBar), closedHeader, [
      "x",
      "y",
      "width",
      "height",
    ]);
    expectBoxWithinTolerance(await getBox(headerLogo), closedLogo, [
      "x",
      "y",
      "width",
      "height",
    ]);
    expectBoxWithinTolerance(await getBox(openMenuButton), closedButton, [
      "x",
      "y",
      "width",
      "height",
    ]);
  });
});
