import { appendFile, readdir, stat, writeFile } from "node:fs/promises";
import { resolve, sep } from "node:path";
import { expect, test } from "@playwright/test";
import { placeCities } from "@/lib/places";
import { getContentSources } from "./content";
import { LinkAudit } from "./link-audit";
import { absoluteUrl, getIndexableRoutes } from "./routes";

const routes = await getIndexableRoutes();
const sources = await getContentSources();
const queryPaths = [
  ...placeCities.map(({ id }) => `/places?city=${id}`),
  "/travel-stories?view=photographs",
];

test("every page template and published content file is inventoried", async () => {
  const files = (await readdir("app", { recursive: true }))
    .filter((file) => /(^|\/)page\.(tsx?|jsx?)$/.test(file))
    .filter((file) => !file.split("/").some((part) => part.startsWith("_")));
  const patterns = files.map((file) => {
    const segments = file
      .split("/")
      .slice(0, -1)
      .filter((segment) => !/^\([^.)][^/]*\)$/.test(segment));
    // A new routing convention must be accounted for rather than silently skipped.
    expect(
      segments.some(
        (segment) => segment.startsWith("@") || segment.includes("..."),
      ),
      file,
    ).toBe(false);
    return {
      file,
      dynamicSegments: segments.filter((segment) => segment.startsWith("["))
        .length,
      pattern: new RegExp(
        `^/${segments.map((segment) => (segment.startsWith("[") ? "[^/]+" : RegExp.escape(segment))).join("/")}$`,
      ),
    };
  });
  // Static pages take precedence. Otherwise a new /[slug] template could
  // incorrectly claim that existing pages such as /about already cover it.
  patterns.sort((a, b) => a.dynamicSegments - b.dynamicSegments);
  const coveredFiles = new Set<string>();
  for (const { path } of routes) {
    const match = patterns.find(({ pattern }) => pattern.test(path));
    expect(match, `${path}: no page template`).toBeDefined();
    coveredFiles.add(match!.file);
  }
  for (const { file } of patterns) {
    expect(
      coveredFiles.has(file),
      `${file}: add this page type to e2e/routes.ts and the sitemap, or explicitly test its exclusion`,
    ).toBe(true);
  }
  const expectedPaths = new Set(routes.map(({ path }) => path));
  for (const source of sources.filter(
    ({ metadata }) => metadata.draft !== true,
  )) {
    const path = source.pagePath.split("?")[0];
    expect(
      expectedPaths.has(path),
      `${source.file}: published source missing from route inventory`,
    ).toBe(true);
  }
});

test("draft places are absent from their city pages", async ({
  request,
  page,
  baseURL,
}) => {
  if (!baseURL) throw new Error("Playwright baseURL is not configured");
  const audit = new LinkAudit(request, page, baseURL);
  for (const source of sources.filter(
    ({ file, metadata }) =>
      file.startsWith("content/places/") && metadata.draft === true,
  )) {
    const response = await audit.read(new URL(source.pagePath, baseURL));
    expect(response.status, source.file).toBe(200);
    expect(response.document?.ids, source.file).not.toContain(
      source.file.split("/").at(-1)!.slice(0, -3),
    );
  }
});

test("sitemap omits modification dates until they have a reliable source", async ({
  request,
}) => {
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  expect(await response.text()).not.toMatch(/<lastmod[\s>]/);
});

test("server HTML meets the contract and produces an editorial report", async ({
  request,
  page,
  baseURL,
}, testInfo) => {
  test.setTimeout(120_000);
  if (!baseURL) throw new Error("Playwright baseURL is not configured");
  const audit = new LinkAudit(request, page, baseURL);
  const failures: string[] = [];
  const warnings: { page: string; kind: string; detail: string }[] = [];
  const warn = (path: string, kind: string, detail: string) =>
    warnings.push({ page: path, kind, detail });
  const metadata: { path: string; title: string; description: string }[] = [];
  const images = new Map<string, Set<string>>();
  const missing = { openGraph: 0, twitterCard: 0, structuredData: 0 };
  const paths = [...routes.map(({ path }) => path), ...queryPaths];
  for (const path of paths) {
    const response = await audit.read(new URL(path, baseURL));
    const document = response.document;
    if (response.status !== 200 || !document) {
      failures.push(`${path}: expected HTML and 200, got ${response.status}`);
      continue;
    }
    const canonicalPath = path.split("?")[0];
    const expected = routes.find((route) => route.path === canonicalPath)!;
    if (document.title !== expected.title)
      failures.push(`${path}: incorrect server-rendered title`);
    if (document.descriptions.length !== 1 || !document.descriptions[0].trim())
      failures.push(`${path}: expected one nonempty description`);
    if (
      expected.description &&
      document.descriptions[0] !== expected.description
    )
      failures.push(`${path}: description differs from content`);
    if (
      document.canonicals.length !== 1 ||
      !URL.canParse(document.canonicals[0]) ||
      new URL(document.canonicals[0]).href !==
        absoluteUrl(canonicalPath, baseURL)
    )
      failures.push(
        `${path}: expected one canonical pointing to ${canonicalPath}`,
      );
    if (
      [...document.robots, response.robots ?? ""].some((value) =>
        /\b(noindex|none)\b/i.test(value),
      )
    )
      failures.push(`${path}: indexing is disabled`);
    if (document.headings.filter(({ level }) => level === 1).length !== 1)
      failures.push(`${path}: expected one h1 in main`);
    for (const [index, heading] of document.headings.entries()) {
      if (!heading.text) failures.push(`${path}: empty h${heading.level}`);
      const previous = document.headings[index - 1];
      if (previous && heading.level > previous.level + 1)
        warn(
          path,
          "heading-level",
          `h${previous.level} → h${heading.level}: ${heading.text}`,
        );
    }
    for (const [index, image] of document.images.entries()) {
      if (image.alt === null)
        failures.push(`${path}: image ${image.src} has no alt attribute`);
      else if (!image.alt.trim())
        warn(
          path,
          "image-alt",
          `Image ${index + 1}: ${image.src} has empty alt text; confirm it is decorative or already described.`,
        );
      else if (
        /\.(jpe?g|png|webp|gif|avif)$/i.test(image.alt) ||
        /^(IMG|DSC)[_-]?\d/i.test(image.alt)
      )
        warn(
          path,
          "image-alt",
          `${image.src}: filename-like alt ${JSON.stringify(image.alt)}`,
        );
      const local = audit.localUrl(image.src, path);
      if (!local) continue;
      const asset =
        local.pathname === "/_next/image"
          ? audit.localUrl(local.searchParams.get("url") ?? "", path)
          : local;
      if (!asset || !/\.(jpe?g|png|webp|gif|avif|svg)$/i.test(asset.pathname))
        continue;
      const file = resolve("public", `.${decodeURIComponent(asset.pathname)}`);
      if (!file.startsWith(resolve("public") + sep)) continue;
      if (!images.has(file)) images.set(file, new Set());
      images.get(file)!.add(path);
    }
    if (path.includes("?")) continue; // Compare canonical pages, not alternate views.
    if (!document.hasOpenGraph) missing.openGraph++;
    if (!document.hasTwitterCard) missing.twitterCard++;
    if (!document.hasStructuredData) missing.structuredData++;
    const description = document.descriptions[0] ?? "";
    metadata.push({ path, title: document.title, description });
    if (description.length < 40 || description.length > 200)
      warn(
        path,
        "description-length",
        `${description.length} characters: ${description}`,
      );
    if (document.title.length < 10 || document.title.length > 80)
      warn(
        path,
        "title-length",
        `${document.title.length} characters: ${document.title}`,
      );
  }

  const normalize = (value: string) =>
    value
      .toLowerCase()
      .normalize("NFKC")
      .replace(/[^\p{L}\p{N}]+/gu, " ")
      .trim();
  for (const field of ["title", "description"] as const) {
    const seen = new Map<string, string>();
    for (const item of metadata) {
      const value = normalize(item[field]);
      const previous = seen.get(value);
      if (previous)
        warn(
          item.path,
          `duplicate-${field}`,
          `Same ${field} as ${previous} after normalizing punctuation, case and spacing.`,
        );
      else seen.set(value, item.path);
    }
  }
  for (const [file, paths] of images) {
    try {
      const { size } = await stat(file);
      if (size > 1024 * 1024)
        warn(
          [...paths].join(", "),
          "image-size",
          `${file.slice(process.cwd().length + 1)}: ${(size / 1024 / 1024).toFixed(2)} MiB (source size, before any image optimization).`,
        );
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      // Redirected and missing assets are checked by the existing link audit.
    }
  }
  warnings.sort(
    (a, b) => a.kind.localeCompare(b.kind) || a.page.localeCompare(b.page),
  );
  const counts = Object.fromEntries(
    [...new Set(warnings.map(({ kind }) => kind))].map((kind) => [
      kind,
      warnings.filter((warning) => warning.kind === kind).length,
    ]),
  );
  const summary = [
    "# Discoverability report",
    "",
    `${routes.length} canonical pages and ${queryPaths.length} query views checked. ${failures.length} contract failures; ${warnings.length} editorial warnings.`,
    "",
    "Warnings are review prompts, not SEO targets or publishing failures. Empty alt text may be intentional. Description thresholds (40–200 characters), title thresholds (10–80), and image source sizes over 1 MiB are only triage heuristics.",
    "",
    `Missing optional features: Open Graph titles on ${missing.openGraph} pages; Twitter cards on ${missing.twitterCard}; JSON-LD on ${missing.structuredData}. These are not required by the current contract.`,
    "",
    ...Object.entries(counts).map(([kind, count]) => `- ${kind}: ${count}`),
  ].join("\n");
  const report = `${summary}\n\n## Contract failures\n\n${failures.length ? failures.map((failure) => `- ${failure}`).join("\n") : "None."}\n\n## Editorial review\n\n${warnings.map(({ page, kind, detail }) => `- **${kind}** — ${page}: ${detail}`).join("\n") || "None."}\n`;
  const reportPath = testInfo.outputPath("editorial-report.md");
  await writeFile(reportPath, report);
  await writeFile(
    testInfo.outputPath("editorial-report.json"),
    JSON.stringify(
      {
        pages: routes.length,
        queryViews: queryPaths.length,
        failures,
        missing,
        warnings,
        metadata,
      },
      null,
      2,
    ),
  );
  await testInfo.attach("editorial-report", {
    path: reportPath,
    contentType: "text/markdown",
  });
  if (process.env.GITHUB_STEP_SUMMARY)
    await appendFile(
      process.env.GITHUB_STEP_SUMMARY,
      `${summary}\n\nFull details are in the verification-results artifact.\n`,
    );
  console.log(
    `Editorial report: ${reportPath} (${warnings.length} nonblocking warnings)`,
  );
  expect(failures, "Server-rendered discoverability contract").toEqual([]);
});
