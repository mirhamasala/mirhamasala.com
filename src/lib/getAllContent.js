import glob from "fast-glob";
import * as path from "path";

export async function importContent(type, filename) {
  const { meta, default: component } = await import(
    `../pages/${type}/${filename}`
  );

  return {
    slug: filename.replace(/(\/index)?\.mdx$/, ""),
    ...meta,
    component,
  };
}

export async function getAllContent(type) {
  const filenames = await glob(["*.mdx", "*/index.mdx"], {
    cwd: path.join(process.cwd(), `src/pages/${type}`),
  });

  const content = await Promise.all(
    filenames.map((filename) => importContent(type, filename))
  );

  return content
    .filter((item) => item.published)
    .sort((a, z) => new Date(z.date).getTime() - new Date(a.date).getTime());
}
