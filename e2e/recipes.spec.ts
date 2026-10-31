import { readdir, readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";
import type { Nodes, Paragraph } from "mdast";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";
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

function creditParagraphs(node: Nodes): Paragraph[] {
  if (
    node.type === "paragraph" &&
    /^(?:Adapted from|From |Recipe attributed to|Source:)/.test(plainText(node))
  ) {
    return [node];
  }
  return "children" in node ? node.children.flatMap(creditParagraphs) : [];
}

test("recipe timing summaries are metadata and credits precede the ingredients", async () => {
  const files = (await readdir("content/recipes")).filter((file) =>
    file.endsWith(".md"),
  );
  const parser = unified().use(remarkParse).use(remarkGfm);

  for (const file of files) {
    const source = await readFile(`content/recipes/${file}`, "utf8");
    const body = source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
    expect(body, file).not.toMatch(/^Prep(?: time)?:/m);
    expect(source, file).not.toMatch(/^time:/m);

    const tree = parser.parse(body);
    const blocks = tree.children;
    const credits = creditParagraphs(tree);
    expect(credits.length, file).toBeLessThanOrEqual(1);

    for (const credit of credits) {
      expect(credit.children, file).toHaveLength(1);
      expect(credit.children[0].type, file).toBe("emphasis");

      const index = blocks.indexOf(credit);
      expect(index, file).toBeGreaterThan(-1);
      expect(blocks[index + 1]?.type, file).toBe("thematicBreak");
      const ingredients = blocks[index + 2];
      expect(ingredients?.type, file).toBe("heading");
      expect(ingredients && plainText(ingredients), file).toBe("Ingredients");
      expect(
        blocks.slice(0, index).some((node) => node.type === "heading"),
        file,
      ).toBe(false);
    }
  }
});

test("recipe headers show cooking and resting times beside the recipe", async ({
  page,
}) => {
  await page.goto("/recipes/banana-bread");
  const header = page.getByRole("article").locator("header");
  await expect(header).toContainText("Cook: 45 to 55 minutes");
  await expect(header).toContainText("Rest: 30 minutes");
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
  await expect(credit.locator("em")).toHaveCount(1);
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
