import glob from "fast-glob";
import * as path from "path";

async function importRecipe(fileName) {
  let { meta, default: component } = await import(
    `../pages/recipes/${fileName}`
  );
  return {
    slug: fileName.replace(/(\/index)?\.mdx$/, ""),
    ...meta,
    component,
  };
}

export async function getAllRecipes() {
  let fileNames = await glob(["*.mdx", "*/index.mdx"], {
    cwd: path.join(process.cwd(), "src/pages/recipes"),
  });

  let recipes = await Promise.all(fileNames.map(importRecipe));

  return recipes
    .filter((recipe) => recipe.status !== "draft")
    .sort((a, z) => new Date(z.date) - new Date(a.date));
}
