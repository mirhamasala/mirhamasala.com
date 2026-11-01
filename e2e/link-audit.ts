import { readdir, readFile } from "node:fs/promises";
import { posix } from "node:path";
import type { Nodes } from "mdast";
import type { APIRequestContext, Page } from "@playwright/test";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import { parse as parseYaml } from "yaml";

export type SiteLink = { href: string; pagePath: string; source: string };
type HtmlDocument = { ids: string[]; links: string[] };
type ResponseInfo = {
  status: number;
  location?: string;
  document?: HtmlDocument;
};

function walk(node: Nodes, visit: (node: Nodes) => void) {
  visit(node);
  if ("children" in node) {
    for (const child of node.children) walk(child, visit);
  }
}

/** Parse actual Markdown syntax, including reference links and images. */
export async function getPublishedContentLinks(): Promise<SiteLink[]> {
  const links: SiteLink[] = [];
  const parser = unified().use(remarkParse).use(remarkGfm);

  async function scan(directory: string) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = posix.join(directory, entry.name);
      if (entry.isDirectory()) {
        await scan(file);
        continue;
      }
      if (!entry.name.endsWith(".md")) continue;
      const source = await readFile(file, "utf8");
      const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(source);
      if (!frontmatter) throw new Error(`${file}: missing YAML frontmatter`);
      const metadata = parseYaml(frontmatter[1]);
      if (metadata.draft === true) continue;

      const relative = file.slice("content/".length, -".md".length);
      const pagePath = relative.startsWith("places/")
        ? `/places?city=${relative.split("/")[1]}`
        : `/${relative.replace(/^pages\//, "")}`;
      const body = source.slice(frontmatter[0].length);
      const lineOffset = frontmatter[0].split("\n").length - 1;

      function collect(markdown: string, label: string, offset: number) {
        const tree = parser.parse(markdown);
        const definitions = new Map<string, string>();
        walk(tree, (node) => {
          if (node.type === "definition")
            definitions.set(node.identifier, node.url);
        });
        walk(tree, (node) => {
          let href: string | undefined;
          if (node.type === "link" || node.type === "image") href = node.url;
          if (node.type === "linkReference" || node.type === "imageReference")
            href = definitions.get(node.identifier);
          if (href !== undefined) {
            links.push({
              href,
              pagePath,
              source: `${label}:${offset + (node.position?.start.line ?? 1)}`,
            });
          }
        });
      }

      collect(body, file, lineOffset);
      if (typeof metadata.attribution === "string")
        collect(metadata.attribution, `${file} (attribution)`, 0);
    }
  }

  await scan("content");
  return links;
}

/** All HTTP requests stay on the local production server, including absolute
 * links authored with either production hostname. No external URLs are fetched.
 */
export class LinkAudit {
  private readonly responses = new Map<string, Promise<ResponseInfo>>();

  constructor(
    private readonly request: APIRequestContext,
    private readonly page: Page,
    private readonly baseURL: string,
  ) {}

  localUrl(href: string, pagePath: string): URL | undefined {
    const url = new URL(href, new URL(pagePath, this.baseURL));
    if (!["http:", "https:"].includes(url.protocol)) return;
    const origin = new URL(this.baseURL).origin;
    if (
      url.origin !== origin &&
      !["mirhamasala.com", "www.mirhamasala.com"].includes(url.hostname)
    )
      return;
    return new URL(url.pathname + url.search + url.hash, origin);
  }

  async read(url: URL): Promise<ResponseInfo> {
    const resource = new URL(url);
    resource.hash = "";
    const key = resource.href;
    let pending = this.responses.get(key);
    if (!pending) {
      pending = this.fetch(resource);
      this.responses.set(key, pending);
    }
    return pending;
  }

  private async fetch(url: URL): Promise<ResponseInfo> {
    const response = await this.request.get(url.href, { maxRedirects: 0 });
    try {
      const result: ResponseInfo = {
        status: response.status(),
        location: response.headers().location,
      };
      if (
        result.status === 200 &&
        response.headers()["content-type"]?.includes("text/html")
      ) {
        // DOMParser handles entities and escaped attributes without executing
        // scripts, hydrating the app, or loading resources from this HTML.
        result.document = await this.page.evaluate(
          (html) => {
            const document = new DOMParser().parseFromString(html, "text/html");
            const links = [
              ...document.querySelectorAll(
                "a[href], img[src], video[src], audio[src], source[src], video[poster], object[data]",
              ),
            ].flatMap((element) =>
              ["href", "src", "poster", "data"].flatMap((attribute) => {
                const value = element.getAttribute(attribute);
                return value === null ? [] : [value];
              }),
            );
            return {
              ids: [...document.querySelectorAll("[id]")].map(
                (element) => element.id,
              ),
              links,
            };
          },
          await response.text(),
        );
      }
      return result;
    } finally {
      // Request contexts otherwise retain every image/video body until teardown.
      await response.dispose();
    }
  }

  async check(link: SiteLink): Promise<string | undefined> {
    const context = `${link.source}: ${link.href}`;
    try {
      let url = this.localUrl(link.href, link.pagePath);
      if (!url) return;
      let response = await this.read(url);
      if (response.status === 308) {
        const location = response.location;
        if (!location) return `${context}: 308 without Location`;
        const destination = this.localUrl(location, url.href);
        if (!destination)
          return `${context}: redirects off-site to ${location}`;
        if (destination.pathname === "/")
          return `${context}: redirects to home`;
        // Browsers inherit the original fragment unless Location supplies one
        // (even an explicitly empty '#'). Fragments never reach the HTTP server.
        if (!location.includes("#")) destination.hash = url.hash;
        url = destination;
        response = await this.read(url);
        if (response.status !== 200)
          return `${context}: 308 → ${url.pathname + url.search} → ${response.status} (expected 200 without another hop)`;
      } else if (response.status !== 200) {
        return `${context}: ${response.status} (expected 200 or one 308)`;
      }

      if (url.hash) {
        const id = decodeURIComponent(url.hash.slice(1));
        if (!response.document?.ids.includes(id))
          return `${context}: missing id ${JSON.stringify(id)} at ${url.pathname + url.search}`;
      }
    } catch (error) {
      return `${context}: ${error instanceof Error ? error.message : String(error)}`;
    }
  }
}
