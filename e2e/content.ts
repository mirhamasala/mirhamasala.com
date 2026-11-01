import { readdir, readFile } from "node:fs/promises";
import { posix } from "node:path";
import { parse as parseYaml } from "yaml";

/** Independent of published loaders: their draft filters are under test. */
export async function getContentSources(directory = "content") {
  const sources: {
    file: string;
    pagePath: string;
    metadata: Record<string, unknown>;
    body: string;
    lineOffset: number;
  }[] = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = posix.join(directory, entry.name);
    if (entry.isDirectory()) {
      sources.push(...(await getContentSources(file)));
      continue;
    }
    if (!entry.name.endsWith(".md")) continue;
    const source = await readFile(file, "utf8");
    const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(source);
    if (!frontmatter) throw new Error(`${file}: missing YAML frontmatter`);
    const relative = file.slice("content/".length, -".md".length);
    sources.push({
      file,
      pagePath: relative.startsWith("places/")
        ? `/places?city=${relative.split("/")[1]}`
        : `/${relative.replace(/^pages\//, "")}`,
      metadata: parseYaml(frontmatter[1]),
      body: source.slice(frontmatter[0].length),
      lineOffset: frontmatter[0].split("\n").length - 1,
    });
  }
  return sources;
}
