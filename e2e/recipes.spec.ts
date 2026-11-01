import { readdir, readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";
import type { Nodes } from "mdast";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { parse as parseYaml } from "yaml";
import { formatRecipeTime } from "@/lib/recipes";

test("recipe durations preserve minutes, ranges, and overnight waits", () => {
  const cases: Array<[Parameters<typeof formatRecipeTime>[0], string]> = [
    [0, "0 minutes"],
    [1, "1 minute"],
    [45, "45 minutes"],
    [60, "1 hour"],
    [90, "1 hour 30 minutes"],
    [120, "2 hours"],
    [{ min: 35, max: 40 }, "35 to 40 minutes"],
    [{ min: 240, max: 300 }, "4 to 5 hours"],
    [{ min: 90, max: 120 }, "1 hour 30 minutes to 2 hours"],
    [{ min: 45, max: 45 }, "45 minutes"],
    ["overnight", "overnight"],
  ];

  for (const [duration, expected] of cases) {
    expect(formatRecipeTime(duration)).toBe(expected);
  }
});

function plainText(node: Nodes): string {
  if ("value" in node) return node.value;
  if ("children" in node) {
    return node.children.map((child) => plainText(child)).join("");
  }
  return "";
}

test("recipe metadata has no duplicate credits and the body has one cooking boundary", async () => {
  const files = (await readdir("content/recipes")).filter((file) =>
    file.endsWith(".md"),
  );
  const parser = unified().use(remarkParse).use(remarkGfm);

  for (const file of files) {
    const source = await readFile(`content/recipes/${file}`, "utf8");
    const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(source);
    if (!frontmatter) throw new Error(`${file}: missing YAML frontmatter`);
    const metadata = parseYaml(frontmatter[1]);
    const body = source.slice(frontmatter[0].length);
    expect(body, file).not.toMatch(/^Prep(?: time)?:/m);
    expect(source, file).not.toMatch(/^time:/m);

    const tree = parser.parse(body);
    const blocks = tree.children.filter((node) => node.type !== "definition");
    const headings = blocks.filter(
      (node) =>
        node.type === "heading" &&
        node.depth === 2 &&
        plainText(node) === "Ingredients",
    );
    expect(headings, file).toHaveLength(1);
    const ingredientsAt = blocks.indexOf(headings[0]);
    const preface = blocks.slice(0, ingredientsAt);
    const introduction = preface.filter(
      (node) => node.type !== "thematicBreak",
    );
    const needsRule = Boolean(metadata.attribution || introduction.length);
    expect(
      preface.filter((node) => node.type === "thematicBreak"),
      file,
    ).toHaveLength(needsRule ? 1 : 0);
    if (needsRule) {
      expect(preface.at(-1)?.type, file).toBe("thematicBreak");
    }
    expect(
      blocks
        .slice(ingredientsAt)
        .filter((node) => node.type === "thematicBreak"),
      file,
    ).toHaveLength(0);
    if (metadata.attribution)
      expect(body, file).not.toContain(metadata.attribution);
  }
});

test("recipe cooking details sit below the preface rule and above Ingredients", async ({
  page,
}) => {
  await page.goto("/recipes/banana-bread");
  const header = page.getByRole("article").locator("header");
  await expect(header).not.toContainText("Cook");
  const details = page.locator('dl[aria-label="Recipe details"]');
  await expect(details.locator("dt")).toHaveText(["Cook", "Rest"]);
  await expect(details.locator("dd")).toHaveText([
    "45 to 55 minutes",
    "30 minutes",
  ]);
  expect(
    await details.evaluate((element) => ({
      before: element.parentElement?.previousElementSibling?.tagName,
      after: element.parentElement?.nextElementSibling?.textContent,
    })),
  ).toEqual({ before: "HR", after: "Ingredients" });
  // The duration stays beside the action as well as in the summary.
  await expect(page.getByRole("article").locator("ol")).toContainText(
    "Bake for 45 to 55 minutes",
  );
});

test("a recipe credit sits after the introduction and before ingredients", async ({
  page,
}) => {
  await page.goto("/recipes/folded-sweet-eggs");
  const credit = page
    .getByRole("article")
    .locator("p")
    .filter({ hasText: "Adapted from Sweet Breakfast Omelet" });
  await expect(credit).toBeVisible();
  await expect(credit.locator("em")).toHaveCount(0);
  await expect(credit).toHaveCSS("font-size", "16px");
  await expect(credit).toHaveCSS("font-style", "normal");
  await expect(credit.getByRole("link")).toHaveAttribute(
    "href",
    "https://www.amummytoo.co.uk/sweet-breakfast-omelette-yes-really-delicious/",
  );
  await expect(page.locator('dl[aria-label="Recipe details"]')).toHaveCount(0);
  const neighbors = await credit.evaluate((element) => ({
    before: element.previousElementSibling?.tagName,
    after: element.nextElementSibling?.tagName,
    section: element.nextElementSibling?.nextElementSibling?.textContent,
  }));
  expect(neighbors).toEqual({
    before: "P",
    after: "HR",
    section: "Ingredients",
  });
});

test("long recipe timing values wrap on each viewport", async ({ page }) => {
  await page.goto("/recipes/banana-bread");
  const details = page.locator('dl[aria-label="Recipe details"]');
  // Stress the actual rendered row styles without publishing a draft recipe
  // or changing any authoring files for a browser fixture.
  await details.evaluate(
    (element, values) => {
      const template = element.firstElementChild!;
      element.replaceChildren(
        ...values.map(([label, value]) => {
          const row = template.cloneNode(true) as HTMLElement;
          row.querySelector("dt")!.textContent = label;
          row.querySelector("dd")!.textContent = value;
          return row;
        }),
      );
    },
    [
      ["Serves", "4–6"],
      ["Prep", "1 hour 30 minutes"],
      ["Cook", "6 hours 30 minutes to 7 hours 30 minutes"],
      ["Rest", "overnight"],
      ["Chill", "1 hour 30 minutes to 2 hours 30 minutes"],
      ["Soak", "overnight"],
      ["Total", "8 to 10 hours"],
    ],
  );
  await expect(details.locator("dt")).toHaveCount(7);
  await expect(details.locator("dd").nth(2)).toHaveText(
    "6 hours 30 minutes to 7 hours 30 minutes",
  );
  expect(
    await details.evaluate(
      (element) => element.scrollWidth > element.clientWidth,
    ),
  ).toBe(false);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    ),
  ).toBe(false);
});
