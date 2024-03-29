import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import renderPostTemplate from "./renderPostTemplate.mjs";

const NEWSLETTER_CATEGORY_ID = "paper-planes-packets";

const importWordPressContent = async () => {
  try {
    const [categories, tags, content] = await Promise.all([
      fetchContent("categories"),
      fetchContent("tags/?per_page=100"),
      fetchContent("posts/?per_page=100"),
      // fetchContent("pages/?per_page=20"),
    ]);

    const contentWithCustomProperties = extractProperties(
      categories,
      tags,
      content
    );

    writeContent(contentWithCustomProperties);
  } catch (err) {
    console.log(err);
  }
};

export const fetchContent = async (endpoint) => {
  const url = `https://mirhamasala.com/wp-json/wp/v2/${endpoint}`;
  const response = await fetch(url);
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body.message);
  }

  return body;
};

const extractProperties = (categoriesData, tagsData, content) =>
  content.map((entry) => {
    let {
      categories,
      content: { rendered: content },
      date_gmt,
      excerpt: { rendered: excerpt },
      modified_gmt,
      id,
      slug,
      status,
      tags,
      title: { rendered: title },
      type,
    } = entry;

    return {
      categories: convertIdsToSlugs(categories, categoriesData),
      content,
      date_gmt,
      excerpt,
      modified_gmt,
      id,
      slug,
      status,
      tags: convertIdsToSlugs(tags, tagsData),
      title,
      type,
    };
  });

const convertIdsToSlugs = (ids, data) => {
  if (!ids) return [];

  return ids.map((id) => data.find((data) => data.id === id).slug);
};

const writeContent = (content) => {
  content.forEach((entry) => {
    if (isPost(entry)) {
      createDirectoryAndWriteToFile(
        `src/pages/posts/${entry.slug}`,
        "index.mdx",
        entry
      );
    }

    if (isLetter(entry)) {
      createDirectoryAndWriteToFile(
        `src/pages/letters/${entry.slug}`,
        "index.mdx",
        entry
      );
    }

    if (isPage(entry)) {
      createDirectoryAndWriteToFile("src/pages/", `${entry.slug}.mdx`, entry);
    }
  });
};

const isPost = (entry) =>
  entry.type === "post" && !entry.categories.includes(NEWSLETTER_CATEGORY_ID);

const isLetter = (entry) =>
  entry.type === "post" && entry.categories.includes(NEWSLETTER_CATEGORY_ID);

const isPage = (entry) => entry.type === "page";

const createDirectoryAndWriteToFile = (dirSlug, fileSlug, entry) => {
  const directoryName = path.join(process.cwd(), dirSlug);
  const fileName = path.join(dirSlug, fileSlug);

  createDirectory(directoryName);
  createFile(fileName, entry);
};

const createDirectory = (name) => {
  try {
    if (!fs.existsSync(name)) {
      fs.mkdirSync(name);
    }
  } catch (err) {
    console.error(err);
    return;
  }
};

const createFile = (name, entry) => {
  fs.writeFile(name, renderPostTemplate(entry), "utf8", (err) => {
    if (err) console.log(err);
    else {
      console.log("File written successfully");
    }
  });
};

importWordPressContent();
