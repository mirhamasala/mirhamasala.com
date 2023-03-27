import { fromParse5 } from "hast-util-from-parse5";
import { parseFragment } from "parse5";
import { toMarkdown } from "mdast-util-to-markdown";
import { toMdast } from "hast-util-to-mdast";
import { gfmToMarkdown } from "mdast-util-gfm";
import { getWPArticlesSlugs } from "./getWPArticlesSlugs.mjs";
import Fs from "fs";
import axios from "axios";
import Path from "path";

const { postSlugs, letterSlugs } = await getWPArticlesSlugs();

function transformUrls(value) {
  // Files to exclude from search: src/pages/posts/favorite-things-2022, src/pages/posts/the-story-of-us, src/pages/letters/heal-111222, src/pages/letters/courage-for-sale-1221, src/pages/letters/dead-time-010223, about.jsx, README.md, favorites_template.mdx, generateRssFeed.js, getWPArticlesSlugs.mjs, importWordPressContent.mjs,

  const pageSlugs = [
    "about",
    "all-posts",
    "beautiful-discoveries",
    "contact",
    "dropbox",
    "moments",
    // "paper-planes-packets",
    "portfolio",
    "resume",
    "travel-archives",
    "travel-moments",
  ];
  const siteRegex = /https?:\/\/w?w?w?\.?mirhamasala\.com/;
  const letterPageRegex =
    /https?:\/\/w?w?w?\.?mirhamasala\.com\/paper-planes-packets\/?/;
  const letterPageAnchorRegex =
    /https?:\/\/w?w?w?\.?mirhamasala\.com\/paper-planes-packets\/#.+/;

  let hrefValue = value;

  postSlugs.some((slug) => {
    if (hrefValue.includes(slug)) {
      hrefValue = hrefValue.replace(siteRegex, "/posts");
    }
  });

  letterSlugs.some((slug) => {
    if (hrefValue.includes(slug)) {
      hrefValue = hrefValue.replace(siteRegex, "/letters");
    }
  });

  pageSlugs.some((slug) => {
    if (
      hrefValue.includes(slug) ||
      letterPageAnchorRegex.test(hrefValue) ||
      letterPageRegex.test(hrefValue)
    ) {
      hrefValue = hrefValue.replace(siteRegex, "");
    }
  });

  return hrefValue;
}

function traverse(ast) {
  ast.childNodes.forEach((node) => {
    if (node.nodeName === "ul" || node.nodeName === "ol") {
      node.childNodes.forEach((childNode) => {
        if (childNode.nodeName === "li") {
          childNode.childNodes.forEach((grandChildNode) => {
            if (grandChildNode.nodeName === "a") {
              const href = grandChildNode.attrs.find(
                (attr) => attr.name === "href"
              );

              href.value = transformUrls(href.value);
            }
          });
        }
      });
    }

    if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(node.nodeName)) {
      node.childNodes.forEach((childNode) => {
        if (childNode.nodeName === "a") {
          const href = childNode.attrs.find((attr) => attr.name === "href");

          href.value = transformUrls(href.value);
        }
      });
    }

    if (node.nodeName === "p") {
      node.childNodes.forEach((childNode) => {
        ["strong", "em", "span"].map((nodeName) => {
          if (childNode.nodeName === nodeName) {
            childNode.childNodes.forEach((grandChildNode) => {
              if (grandChildNode.nodeName === "a") {
                const href = grandChildNode.attrs.find(
                  (attr) => attr.name === "href"
                );

                href.value = transformUrls(href.value);
              }
            });
          }
        });

        if (childNode.nodeName === "a") {
          const href = childNode.attrs.find((attr) => attr.name === "href");

          href.value = transformUrls(href.value);
        }
      });
    }

    if (node.nodeName === "blockquote") {
      node.childNodes.forEach((childNode) => {
        if (childNode.nodeName === "p") {
          childNode.childNodes.forEach((grandChildNode) => {
            ["strong", "em"].map((nodeName) => {
              if (grandChildNode.nodeName === nodeName) {
                grandChildNode.childNodes.forEach((greatGrandChildNode) => {
                  if (greatGrandChildNode.nodeName === "a") {
                    const href = greatGrandChildNode.attrs.find(
                      (attr) => attr.name === "href"
                    );

                    href.value = transformUrls(href.value);
                  }
                });
              }
            });

            if (grandChildNode.nodeName === "a") {
              const href = grandChildNode.attrs.find(
                (attr) => attr.name === "href"
              );

              href.value = transformUrls(href.value);
            }
          });
        }
      });
    }

    if (node.nodeName === "div") {
      node.childNodes.forEach((childNode) => {
        if (childNode.nodeName === "div") {
          childNode.childNodes.forEach((grandChildNode) => {
            if (grandChildNode.nodeName === "p") {
              grandChildNode.childNodes.forEach((greatGrandChildNode) => {
                if (greatGrandChildNode.nodeName === "em") {
                  greatGrandChildNode.childNodes.forEach(
                    (greatGreatGrandChildNode) => {
                      if (greatGreatGrandChildNode.nodeName === "a") {
                        const href = greatGreatGrandChildNode.attrs.find(
                          (attr) => attr.name === "href"
                        );

                        href.value = transformUrls(href.value);
                      }
                    }
                  );
                }
              });
            }
          });
        }
      });
    }
  });
}

function getDirPath(type, parentSlug) {
  if (type === "post") {
    return `public/pages/posts/${parentSlug}`;
  }

  if (type === "letter") {
    return `public/pages/letters/${parentSlug}`;
  }

  return `public/pages`;
}

let relPath = "";

async function downloadMedia(mediaUrl, parentSlug, type) {
  const regex = /\d{2}\/.+/;

  if (!mediaUrl || !mediaUrl.match(regex)) {
    console.log("❌❌❌", { mediaUrl, parentSlug });
    return;
  }

  const slug = mediaUrl.match(regex)[0].slice(6);
  const directory = Path.join(process.cwd(), getDirPath(type, parentSlug));
  relPath = getDirPath(type, parentSlug).replace(/public/, "") + "/" + slug;

  try {
    if (!Fs.existsSync(directory)) {
      Fs.mkdirSync(directory);
    }
  } catch (err) {
    console.error(err);
    return;
  }

  const path = `${directory}/${slug}`;
  const writer = Fs.createWriteStream(path);

  const response = await axios({
    url: mediaUrl,
    method: "GET",
    responseType: "stream",
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

export function htmlToMarkdown(html, slug, type) {
  const ast = parseFragment(html);
  traverse(ast);

  const hast = fromParse5(ast);
  const mdast = toMdast(hast);

  mdast.children.forEach((node) => {
    const regex = /-\d+x\d+/;

    if (slug === "the-making-of-slow-retreats") {
      if (node.type === "paragraph") {
        node.children.forEach((childNode) => {
          if (
            childNode.type === "link" &&
            childNode.children[0].type === "image"
          ) {
            childNode.children[0].url = childNode.children[0].url.replace(
              regex,
              ""
            );
            downloadMedia(childNode.children[0].url, slug, type);
            childNode.children[0].url = relPath;
            childNode.url = relPath;
          }
        });
      }
    }

    if (node.type === "paragraph") {
      node.children.forEach((childNode) => {
        if (
          childNode.type === "link" &&
          childNode.url.includes("mirha") &&
          (childNode.url.includes("pdf") || childNode.url.includes("mp4"))
        ) {
          childNode.url = childNode.url.replace(regex, "");

          downloadMedia(childNode.url, slug, type);

          childNode.url = relPath;
        }

        if (childNode.type === "image") {
          childNode.url = childNode.url.replace(regex, "");

          downloadMedia(childNode.url, slug, type);

          childNode.url = relPath;
        }
      });
    }
  });

  const markdown = toMarkdown(mdast, { extensions: [gfmToMarkdown()] });

  return markdown;
  // return toMarkdown(mdast);
}

// Iterate over each entry and check the node
// If it's an image, download it with Axios or Fetch
// Change the src to local path
// Library URI is used to get the filename from the url > parser for links
