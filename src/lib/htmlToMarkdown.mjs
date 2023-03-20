import { fromParse5 } from "hast-util-from-parse5";
import { parseFragment } from "parse5";
import { toMarkdown } from "mdast-util-to-markdown";
import { toMdast } from "hast-util-to-mdast";

export function htmlToMarkdown(html) {
  const parse5 = parseFragment(html); // ast
  const hast = fromParse5(parse5);
  const mdast = toMdast(hast);

  return toMarkdown(mdast);
}

// iterate over each entry and check the node, if it's an image, I download it with axios get
// or fetch // and then I change the src to the local path
// library URI is used to get the filename from the url > parser for links
