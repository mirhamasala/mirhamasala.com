import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import { getContentSources } from "../e2e/content.ts";

const output = "test-results/external-links";
const parser = unified().use(remarkParse).use(remarkGfm);
const areas = [
  "Places",
  "Recipes",
  "Books",
  "Resources",
  "Writing",
  "Other pages",
  "Letters",
  "Travel Stories",
  "The Spin-Off Project",
];
export const issueStart = "<!-- external-link-audit:start -->";
export const issueEnd = "<!-- external-link-audit:end -->";

function areaFor(file) {
  if (file === "content/tsop/resources.md") return "Resources";
  return (
    {
      places: "Places",
      recipes: "Recipes",
      books: "Books",
      posts: "Writing",
      pages: "Other pages",
      letters: "Letters",
      "travel-stories": "Travel Stories",
      tsop: "The Spin-Off Project",
    }[file.split("/")[1]] ?? "Other pages"
  );
}

function walk(node, visit) {
  visit(node);
  for (const child of node.children ?? []) walk(child, visit);
}

function resourceUrl(href) {
  const url = new URL(href.startsWith("//") ? `https:${href}` : href);
  url.hash = "";
  // Lychee omits an empty query delimiter when serializing its result URLs.
  if (!url.search) url.search = "";
  return url;
}

/** Only rendered Markdown links/media and current link-bearing frontmatter fields. */
export function collectLinks(sources) {
  const links = new Map();
  for (const { file, metadata, body, lineOffset } of sources) {
    if (metadata.draft === true) continue;
    function add(href, line, field) {
      if (!/^(https?:)?\/\//i.test(href)) return;
      const url = resourceUrl(href);
      if (["mirhamasala.com", "www.mirhamasala.com"].includes(url.hostname))
        return;
      // External fragment validity needs human review; check each resource once.
      const entry = links.get(url.href) ?? { url: url.href, sources: [] };
      const source = {
        file,
        line,
        field,
        area: areaFor(file),
        date: metadata.date,
      };
      if (
        !entry.sources.some(
          (item) =>
            item.file === file && item.line === line && item.field === field,
        )
      ) {
        entry.sources.push(source);
      }
      links.set(url.href, entry);
    }
    function markdown(text, offset, field) {
      const tree = parser.parse(text);
      const definitions = new Map();
      walk(tree, (node) => {
        if (node.type === "definition")
          definitions.set(node.identifier, node.url);
      });
      walk(tree, (node) => {
        const href =
          node.type === "link" || node.type === "image"
            ? node.url
            : node.type === "linkReference" || node.type === "imageReference"
              ? definitions.get(node.identifier)
              : undefined;
        if (href)
          add(href, field ? 1 : offset + node.position.start.line, field);
      });
    }
    markdown(body, lineOffset);
    if (typeof metadata.attribution === "string")
      markdown(metadata.attribution, 0, "attribution");
    for (const field of ["url", "map", "instagram"]) {
      if (typeof metadata[field] === "string") add(metadata[field], 1, field);
    }
  }
  return [...links.values()].sort((a, b) => a.url.localeCompare(b.url));
}

export function categoryFor(status, excluded = false) {
  if (excluded) return "Not checked";
  if ([404, 410].includes(status.code)) return "Likely missing";
  if ([401, 403, 429, 999].includes(status.code))
    return "Blocked or rate-limited";
  return "Other failures — retry or inspect";
}

const safe = (value) =>
  String(value)
    .replace(
      /[&<>]/g,
      (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[char],
    )
    .replace(/[\r\n]/g, " ");

export function makeReport(inventory, raw, sourceBase = "") {
  // Never replace the issue with a reassuring report from a partial/failed scan.
  if (
    !Number.isInteger(raw.unique) ||
    raw.unique !== inventory.length ||
    !raw.error_map ||
    !raw.timeout_map ||
    !raw.excluded_map
  ) {
    throw new Error(
      `Incomplete Lychee report: expected ${inventory.length} unique URLs, got ${raw.unique}`,
    );
  }
  const byUrl = new Map(
    inventory.map((entry) => [resourceUrl(entry.url).href, entry]),
  );
  const findings = new Map();
  for (const map of ["error_map", "timeout_map", "excluded_map"]) {
    for (const entries of Object.values(raw[map])) {
      for (const entry of entries) {
        const source = byUrl.get(resourceUrl(entry.url).href);
        if (!source)
          throw new Error(`Unexpected URL in Lychee report: ${entry.url}`);
        findings.set(entry.url, {
          ...source,
          status: entry.status,
          category: categoryFor(entry.status, map === "excluded_map"),
        });
      }
    }
  }
  if (
    raw.errors + raw.timeouts + raw.excludes !== findings.size ||
    raw.successful + findings.size !== raw.unique
  ) {
    throw new Error(
      "Lychee result counts do not match the findings; refusing to publish a partial report",
    );
  }
  const rows = [...findings.values()].sort((a, b) =>
    a.url.localeCompare(b.url),
  );
  const categories = [
    "Likely missing",
    "Blocked or rate-limited",
    "Other failures — retry or inspect",
    "Not checked",
  ];
  const lines = [
    "# External link review",
    "",
    `${inventory.length} unique external URLs; ${rows.length} need review.`,
    "",
    ...categories.map(
      (category) =>
        `- ${category}: ${rows.filter((row) => row.category === category).length}`,
    ),
    "",
    "This report is a queue, not a verdict. Confirm failures in a browser before editing. A successful response does not prove the destination still contains the intended material.",
    "",
    "Review practical recommendations and current Writing first. Dates below are publication dates. Frontmatter locations name the field; body locations name the line. External fragments are not checked.",
    "",
  ];
  for (const area of areas) {
    const entries = rows.filter((row) =>
      row.sources.some((source) => source.area === area),
    );
    if (!entries.length) continue;
    lines.push(`## ${area}`, "");
    for (const category of categories) {
      const group = entries.filter((row) => row.category === category);
      if (!group.length) continue;
      lines.push(`### ${category}`, "");
      for (const entry of group) {
        lines.push(`- <${entry.url}> — ${safe(entry.status.text)}`);
        const sources = entry.sources
          .filter((source) => source.area === area)
          .sort(
            (a, b) =>
              String(b.date ?? "").localeCompare(String(a.date ?? "")) ||
              a.file.localeCompare(b.file) ||
              a.line - b.line,
          );
        for (const source of sources) {
          const label = `${source.file}${source.field ? ` (${source.field})` : `:${source.line}`}`;
          const location = sourceBase
            ? `[${label}](${sourceBase}/${source.file}#L${source.line})`
            : label;
          lines.push(
            `  - ${location}${source.date ? ` — ${source.date}` : ""}`,
          );
        }
      }
      lines.push("");
    }
  }
  return { findings: rows, markdown: lines.join("\n") + "\n" };
}

/** Reuse one issue, retain human notes outside the generated block, add no comments. */
export async function updateIssue(github, repo, report, runUrl) {
  const issues = await github.paginate(github.rest.issues.listForRepo, {
    ...repo,
    state: "all",
    per_page: 100,
  });
  const matches = issues.filter(
    (issue) => !issue.pull_request && issue.body?.includes(issueStart),
  );
  if (matches.length > 1)
    throw new Error("More than one external audit issue found");
  const existing = matches[0];
  if (!existing && !report.findings.length) return;
  const footer = `\n\n[Full report and raw results in this run's external-link-report artifact](${runUrl}).\n`;
  // GitHub issue bodies have a size limit. The artifact always has every finding.
  let markdown = report.markdown;
  if (markdown.length > 45000) {
    markdown =
      markdown.slice(0, markdown.lastIndexOf("\n", 45000)) +
      "\n\nReport excerpt; download the artifact for all findings.\n";
  }
  const block = `${issueStart}\n${markdown}${footer}${issueEnd}`;
  const state = report.findings.length ? "open" : "closed";
  if (existing) {
    const end = existing.body.indexOf(
      issueEnd,
      existing.body.indexOf(issueStart),
    );
    if (end < 0)
      throw new Error(
        "Audit issue end marker is missing; refusing to overwrite human notes",
      );
    const body =
      existing.body.slice(0, existing.body.indexOf(issueStart)) +
      block +
      existing.body.slice(end + issueEnd.length);
    await github.rest.issues.update({
      ...repo,
      issue_number: existing.number,
      body,
      state,
    });
  } else {
    await github.rest.issues.create({
      ...repo,
      title: "External link review",
      body: `${block}\n\nKeep review notes below this line; the report above is refreshed automatically.\n`,
    });
  }
}

async function prepare() {
  const inventory = collectLinks(await getContentSources());
  if (!inventory.length) throw new Error("No published external links found");
  await mkdir(output, { recursive: true });
  await writeFile(
    `${output}/inventory.json`,
    JSON.stringify(inventory, null, 2) + "\n",
  );
  await writeFile(
    `${output}/urls.md`,
    inventory.map(({ url }) => `<${url}>`).join("\n") + "\n",
  );
  console.log(
    `Collected ${inventory.length} unique external URLs from published content.`,
  );
}

async function report() {
  const inventory = JSON.parse(
    await readFile(`${output}/inventory.json`, "utf8"),
  );
  const raw = JSON.parse(await readFile(`${output}/lychee.json`, "utf8"));
  const sourceBase =
    process.env.GITHUB_REPOSITORY && process.env.GITHUB_SHA
      ? `https://github.com/${process.env.GITHUB_REPOSITORY}/blob/${process.env.GITHUB_SHA}`
      : "";
  const result = makeReport(inventory, raw, sourceBase);
  await writeFile(`${output}/report.md`, result.markdown);
  await writeFile(
    `${output}/report.json`,
    JSON.stringify(result, null, 2) + "\n",
  );
  if (process.env.GITHUB_STEP_SUMMARY) {
    await appendFile(
      process.env.GITHUB_STEP_SUMMARY,
      result.markdown.split("## ")[0] +
        "\nDownload the external-link-report artifact for all source locations.\n",
    );
  }
  console.log(
    `${result.findings.length} URLs need human review. Report: ${output}/report.md`,
  );
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const mode = process.argv[2] ?? "run";
  if (!["prepare", "report", "run"].includes(mode))
    throw new Error(`Unknown mode: ${mode}`);
  if (mode !== "report") await prepare();
  if (mode === "run") {
    const result = spawnSync(
      process.env.LYCHEE_BIN ?? "lychee",
      [
        "--config",
        "lychee.toml",
        "--format",
        "json",
        "--output",
        `${output}/lychee.json`,
        `${output}/urls.md`,
      ],
      { stdio: "inherit" },
    );
    if (result.error) throw result.error;
    // 2 means link findings; 1 and signals mean the checker itself failed.
    if (![0, 2].includes(result.status))
      throw new Error(`Lychee failed: ${result.status ?? result.signal}`);
  }
  if (mode !== "prepare") await report();
}
