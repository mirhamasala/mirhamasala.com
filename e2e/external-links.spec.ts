import { test, expect } from "@playwright/test";
import {
  collectLinks,
  makeReport,
  updateIssue,
  issueStart,
  issueEnd,
} from "../scripts/external-links.mjs";

test.skip(({ isMobile }) => isMobile, "Offline audit checks run once");

test("external inventory includes published references and frontmatter, with every source", () => {
  const links = collectLinks([
    {
      file: "content/recipes/example.md",
      metadata: {
        attribution: "Adapted from [Source](https://source.test/recipe)",
        date: "2020-01-01",
      },
      lineOffset: 7,
      body: [
        "[Original][source] and [section](https://source.test/recipe#method).",
        "![Photo](https://images.test/photo.jpg)",
        "",
        "[source]: https://source.test/recipe",
        "[Unused]: https://unused.test/",
        "",
        "[Internal](https://www.mirhamasala.com/posts/example)",
        "[Bare domain](https://mirhamasala.com/about)",
        "[Relative](/posts/example) and [Mail](mailto:hello@test.test)",
        "`https://code.test/`",
        "[Protocol relative](//remote.test/page)",
      ].join("\n"),
    },
    {
      file: "content/places/lisbon/example.md",
      metadata: {
        url: "https://source.test/recipe",
        map: "https://maps.test/place",
      },
      lineOffset: 5,
      body: "",
    },
    {
      file: "content/books/example.md",
      metadata: { url: "https://books.test/book" },
      lineOffset: 3,
      body: "",
    },
    {
      file: "content/travel-stories/1.md",
      metadata: { instagram: "https://instagram.test/post" },
      lineOffset: 3,
      body: "",
    },
    {
      file: "content/posts/draft.md",
      metadata: { draft: true, url: "https://private.test/" },
      lineOffset: 3,
      body: "[Draft](https://draft.test/)",
    },
  ]);
  expect(links.map((link: { url: string }) => link.url).sort()).toEqual([
    "https://books.test/book",
    "https://images.test/photo.jpg",
    "https://instagram.test/post",
    "https://maps.test/place",
    "https://remote.test/page",
    "https://source.test/recipe",
  ]);
  const source = links.find(
    (link: { url: string }) => link.url === "https://source.test/recipe",
  );
  expect(source.sources).toEqual([
    expect.objectContaining({
      file: "content/recipes/example.md",
      line: 8,
      area: "Recipes",
    }),
    expect.objectContaining({
      file: "content/recipes/example.md",
      field: "attribution",
    }),
    expect.objectContaining({
      file: "content/places/lisbon/example.md",
      field: "url",
      area: "Places",
    }),
  ]);
});

function fixture() {
  const codes = [404, 410, 403, 429, 500, undefined, undefined];
  const inventory = codes.map((_, i) => ({
    url: `https://destination.test/${i}`,
    sources: [
      { file: "content/tsop/resources.md", line: i + 1, area: "Resources" },
    ],
  }));
  const entries = codes.map((code, i) => ({
    url: inventory[i].url,
    status: { code, text: code ? `HTTP ${code}` : "Timeout or excluded" },
  }));
  const raw = {
    unique: 7,
    successful: 0,
    errors: 5,
    timeouts: 1,
    excludes: 1,
    error_map: { input: entries.slice(0, 5) },
    timeout_map: { input: [entries[5]] },
    excluded_map: { input: [entries[6]] },
  };
  return { inventory, raw };
}

test("report separates missing pages from access blocks and retains unchecked URLs", () => {
  const { inventory, raw } = fixture();
  const report = makeReport(
    inventory,
    raw,
    "https://github.com/owner/repo/blob/commit",
  );
  expect(
    report.findings.map((entry: { category: string }) => entry.category),
  ).toEqual([
    "Likely missing",
    "Likely missing",
    "Blocked or rate-limited",
    "Blocked or rate-limited",
    "Other failures — retry or inspect",
    "Other failures — retry or inspect",
    "Not checked",
  ]);
  expect(report.markdown).toContain("## Resources");
  expect(report.markdown).toContain(
    "https://github.com/owner/repo/blob/commit/content/tsop/resources.md#L1",
  );
  expect(() => makeReport(inventory, { ...raw, unique: 6 })).toThrow(
    "Incomplete",
  );
  expect(() => makeReport(inventory, { ...raw, timeout_map: {} })).toThrow(
    "counts",
  );
  expect(() => makeReport(inventory, { ...raw, successful: 1 })).toThrow(
    "counts",
  );
  inventory[0].url += "?";
  expect(makeReport(inventory, raw).findings).toHaveLength(7);
});

test("recurring report reuses its issue, preserves notes, closes and reopens without comments", async () => {
  const calls: { kind: string; data: Record<string, unknown> }[] = [];
  let issues: { number: number; body: string; state: string }[] = [];
  const github = {
    paginate: async () => issues,
    rest: {
      issues: {
        listForRepo: () => {},
        create: async (data: Record<string, unknown>) => {
          calls.push({ kind: "create", data });
          issues = [{ number: 123, body: String(data.body), state: "open" }];
        },
        update: async (data: Record<string, unknown>) => {
          calls.push({ kind: "update", data });
          issues[0] = {
            number: 123,
            body: String(data.body),
            state: String(data.state),
          };
        },
      },
    },
  };
  const repo = { owner: "owner", repo: "repo" };
  const empty = { findings: [], markdown: "No findings.\n" };
  const finding = {
    findings: [{ url: "https://source.test/" }],
    markdown: "Review this link.\n",
  };
  const run = "https://github.com/owner/repo/actions/runs/1";
  await updateIssue(github, repo, empty, run);
  expect(calls).toHaveLength(0);
  await updateIssue(github, repo, finding, run);
  issues[0].body += "\nHuman note: verified in browser.\n";
  await updateIssue(github, repo, finding, run);
  await updateIssue(github, repo, empty, run);
  expect(issues[0].state).toBe("closed");
  await updateIssue(github, repo, finding, run);
  expect(issues[0].state).toBe("open");
  expect(issues[0].body).toContain("Human note: verified in browser.");
  expect(calls.map((call) => call.kind)).toEqual([
    "create",
    "update",
    "update",
    "update",
  ]);
  expect(issues[0].body.split(issueStart)).toHaveLength(2);
  expect(issues[0].body.split(issueEnd)).toHaveLength(2);
  await updateIssue(
    github,
    repo,
    { ...finding, markdown: "Long report\n".repeat(10000) },
    run,
  );
  expect(issues[0].body.length).toBeLessThan(60000);
  expect(issues[0].body).toContain("Report excerpt");
  issues[0].body = issues[0].body.replace(issueEnd, "");
  await expect(updateIssue(github, repo, finding, run)).rejects.toThrow(
    "end marker",
  );
});
