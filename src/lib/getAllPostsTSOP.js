import glob from "fast-glob";
import * as path from "path";

async function importPost(postFilename) {
  let { meta, default: component } = await import(
    `../pages/tsop/posts/${postFilename}`
  );
  return {
    slug: postFilename.replace(/(\/index)?\.mdx$/, ""),
    ...meta,
    component,
  };
}

export async function getAllPosts() {
  let postFilenames = await glob(["*.mdx", "*/index.mdx"], {
    cwd: path.join(process.cwd(), "src/pages/tsop/posts"),
  });

  let posts = await Promise.all(postFilenames.map(importPost));

  let spinOffs = {};

  posts.map((post) => {
    post.categories.forEach((category) => {
      if (!category.includes("spin-off-")) {
        return;
      }

      if (spinOffs[category]) {
        spinOffs[category] = [...spinOffs[category], post];
      } else {
        spinOffs[category] = [];
        spinOffs[category] = [...spinOffs[category], post];
      }
    });
  });

  return Object.keys(spinOffs).reduce((acc, current) => {
    let posts = spinOffs[current];

    posts.sort((a, z) => new Date(a.date) - new Date(z.date));

    acc[current.replace("spin-off-", "")] = posts;
    return acc;
  }, {});
}
