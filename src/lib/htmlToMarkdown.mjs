import { fromParse5 } from "hast-util-from-parse5";
import { parseFragment } from "parse5";
import { toMarkdown } from "mdast-util-to-markdown";
import { toMdast } from "hast-util-to-mdast";
import { getWPArticlesSlugs } from "./getWPArticlesSlugs.mjs";
import * as prettier from "prettier";

const { postSlugs, letterSlugs } = await getWPArticlesSlugs();

function transformUrls(value) {
  // Files to exclude from search: src/pages/posts/favorite-things-2022, src/pages/posts/the-story-of-us, src/pages/letters/heal-111222, src/pages/letters/courage-for-sale-1221, src/pages/letters/dead-time-010223, about.jsx, README.md, favorites_template.mdx, generateRssFeed.js, getWPArticlesSlugs.mjs, importWordPressContent.mjs,

  const pageSlugs = [
    "travel-moments",
    "resume",
    "beautiful-discoveries",
    "travel-archives",
    "dropbox",
    "all-posts",
    "contact",
    "about",
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
    if (node.nodeName === "ul") {
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
  });
}

export function htmlToMarkdown(html) {
  const ast = parseFragment(html);
  traverse(ast);

  const hast = fromParse5(ast);
  const mdast = toMdast(hast);
  const markdown = toMarkdown(mdast);

  return prettier.format(markdown, {
    parser: "babel",
    doubleQuote: true,
    semi: true,
  });
}

// iterate over each entry and check the node, if it's an image, I download it with axios get
// or fetch // and then I change the src to the local path
// library URI is used to get the filename from the url > parser for links
