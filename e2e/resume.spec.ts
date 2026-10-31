import { expect, test } from "@playwright/test";
import { extractLinks, extractText, getDocumentProxy } from "unpdf";
import { getResume } from "@/lib/pages";
import { assertResumeMarkdown, renderResumePdf } from "@/lib/resume-pdf";
import { site } from "@/lib/site";

const publicSiteUrl = "https://www.mirhamasala.com";

function normalize(text: string): string {
  return text.replace(/\s+/g, " ").trim().toLowerCase();
}

async function inspectPdf(bytes: Uint8Array) {
  const pdf = await getDocumentProxy(bytes);
  try {
    const [{ text }, { links }] = await Promise.all([
      extractText(pdf, { mergePages: true }),
      extractLinks(pdf),
    ]);
    return { text: normalize(text), links: links.flat() };
  } finally {
    await pdf.loadingTask.destroy();
  }
}

test("the résumé download contains the page's current text and links", async ({
  page,
  request,
}) => {
  await page.goto("/resume");
  const article = page.getByRole("article");
  await expect(
    article.getByText("The Spin-Off Project", { exact: true }),
  ).toBeVisible();
  await expect(article.locator('a[href="/tsop"]')).toHaveCount(0);

  const link = page.getByRole("link", { name: "Download résumé (PDF)" });
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute("href", "/resume/mirha-masala.pdf");
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    link.click(),
  ]);
  expect(download.suggestedFilename()).toBe("mirha-masala-resume.pdf");
  expect(await download.failure()).toBeNull();

  const response = await request.get("/resume/mirha-masala.pdf");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/pdf");
  expect(response.headers()["content-disposition"]).toContain(
    'filename="mirha-masala-resume.pdf"',
  );
  const body = await response.body();
  expect(body.subarray(0, 5).toString("utf8")).toBe("%PDF-");

  const pdf = await inspectPdf(new Uint8Array(body));
  expect(pdf.text).toContain(normalize(site.name));
  expect(pdf.text).toContain("blog: www.mirhamasala.com");
  expect(pdf.text).not.toMatch(/localhost|127\.0\.0\.1/);
  expect(pdf.links).toContain("https://www.mirhamasala.com/");
  // Compare every content block, including the final section, with the web page.
  const blocks = await article.locator("h2, h3, h4, p, li").allTextContents();
  expect(blocks.length).toBeGreaterThan(0);
  // PDF extraction can insert spaces between the tracked heading letters.
  const compactText = pdf.text.replace(/\s/g, "");
  for (const block of blocks) {
    expect(compactText).toContain(normalize(block).replace(/\s/g, ""));
  }

  const hrefs = await article
    .locator("p a, li a")
    .evaluateAll((links) => links.map((link) => link.getAttribute("href")!));
  expect(new Set(pdf.links)).toEqual(
    new Set(hrefs.map((href) => new URL(href, publicSiteUrl).href)),
  );
  for (const label of ["GitHub", "LinkedIn", "Blog"]) {
    const href = await article
      .getByRole("link", { name: label, exact: true })
      .getAttribute("href");
    const address = new URL(href!, publicSiteUrl).href
      .replace(/^https?:\/\//, "")
      .replace(/\/$/, "");
    expect(pdf.text).toContain(normalize(`${label}: ${address}`));
  }

  const legacy = await request.get("/resume/cv_mirha_masala_2020.pdf");
  expect(legacy.status()).toBe(200);
  expect(legacy.headers()["content-type"]).toContain("application/pdf");
});

test("the résumé PDF preserves Markdown text, wrapped bullets, and URL punctuation", async () => {
  const resume = await getResume();
  const href = "https://example.com/my_project_(2026)?a=1&b=2";
  const body = `## Profile
Literal my_project &amp; escaped \\*asterisks\\*.

- A wrapped
  bullet with [Project](${href}).

## Websites

[GitHub](https://github.com/mirhamasala)

[An article](/posts/example?topic=design#notes)
`;
  const pdf = await inspectPdf(
    new Uint8Array(await renderResumePdf({ ...resume, body })),
  );
  expect(pdf.text).toContain("literal my_project & escaped *asterisks*.");
  expect(pdf.text).toContain("a wrapped bullet with project.");
  expect(pdf.text).toContain("github: github.com/mirhamasala");
  expect(pdf.links).toContain(href);
  expect(pdf.links).toContain(
    "https://www.mirhamasala.com/posts/example?topic=design#notes",
  );
});

for (const [syntax, body] of [
  ["strikethrough", "Text with ~~strikethrough~~."],
  ["emphasis", "Text with *emphasis*."],
  ["nested lists", "- Item\n  - Nested item"],
  ["ordered lists", "1. Item"],
]) {
  test(`the résumé PDF rejects unsupported ${syntax} with a location`, () => {
    expect(() => assertResumeMarkdown(body)).toThrow(
      /content\/pages\/resume\.md: unsupported Markdown .+ at \d+:\d+/,
    );
  });
}
