import PDFDocument from "pdfkit";
import type { PhrasingContent, RootContent } from "mdast";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { formatMonthYear } from "@/lib/format-date";
import type { StandalonePage } from "@/lib/pages";
import { site } from "@/lib/site";

// Downloaded documents must remain usable outside the preview that made them.
const publicSiteUrl = "https://www.mirhamasala.com";

const ink = "#0f172a";
const muted = "#475569";
const rule = "#cbd5e1";

const bodySize = 10.5;
const bodyLineGap = 2;
const sectionIndent = 18;
const bulletColumn = 12;

/**
 * PDF standard fonts encode WinAnsi. These punctuation marks are the extra
 * code points pdfkit maps into that encoding. Anything else fails the build.
 */
const winAnsiPunctuation = new Set([
  0x2013, // –
  0x2014, // —
  0x2018, // ‘
  0x2019, // ’
  0x201c, // “
  0x201d, // ”
  0x2022, // •
  0x2026, // …
]);

type Inline =
  | { type: "text"; value: string }
  | { type: "link"; label: string; href: string };

type Block =
  | { type: "heading"; level: 2 | 3 | 4; inlines: Inline[] }
  | { type: "paragraph"; inlines: Inline[] }
  | { type: "list"; items: Inline[][] };

type Pdf = PDFKit.PDFDocument;

function fail(detail: string): never {
  throw new Error(`content/pages/resume.md: ${detail}`);
}

function unsupported(node: RootContent | PhrasingContent): never {
  const position = node.position?.start;
  const location = position ? ` at ${position.line}:${position.column}` : "";
  fail(
    `unsupported Markdown ${node.type}${location} in the résumé Markdown body`,
  );
}

function assertWinAnsi(text: string): void {
  for (const char of text) {
    const code = char.codePointAt(0);
    if (code === undefined) continue;
    if (code >= 32 && code <= 126) continue;
    if (code >= 160 && code <= 255) continue;
    if (winAnsiPunctuation.has(code)) continue;
    fail(
      `character ${JSON.stringify(char)} is not supported in the résumé PDF`,
    );
  }
}

function resolveHref(href: string): string {
  if (href.startsWith("/") && !href.startsWith("//")) {
    return new URL(href, publicSiteUrl).href;
  }
  if (href.startsWith("https://") || href.startsWith("http://")) return href;
  fail(`unsupported link: ${href}`);
}

function parseInlines(nodes: PhrasingContent[]): Inline[] {
  return nodes.map((node): Inline => {
    if (node.type === "text") {
      const value = node.value.replace(/\r?\n/g, " ");
      assertWinAnsi(value);
      return { type: "text", value };
    }
    if (node.type === "link") {
      const label = node.children
        .map((child) => {
          if (child.type !== "text") return unsupported(child);
          return child.value.replace(/\r?\n/g, " ");
        })
        .join("");
      assertWinAnsi(label);
      return { type: "link", label, href: resolveHref(node.url) };
    }
    return unsupported(node);
  });
}

const resumeParser = unified().use(remarkParse).use(remarkGfm);

function parseResumeBody(body: string): Block[] {
  const tree = resumeParser.parse(body);
  const blocks = tree.children.map((node): Block => {
    if (node.type === "heading") {
      const level = node.depth;
      if (level !== 2 && level !== 3 && level !== 4) return unsupported(node);
      return {
        type: "heading",
        level,
        inlines: parseInlines(node.children),
      };
    }
    if (node.type === "paragraph") {
      return { type: "paragraph", inlines: parseInlines(node.children) };
    }
    if (node.type === "list") {
      if (node.ordered) return unsupported(node);
      const items = node.children.map((item) => {
        const paragraph = item.children[0];
        if (
          item.checked != null ||
          item.children.length !== 1 ||
          paragraph?.type !== "paragraph"
        ) {
          return unsupported(item);
        }
        return parseInlines(paragraph.children);
      });
      return { type: "list", items };
    }
    return unsupported(node);
  });

  if (blocks.length === 0) fail("the résumé is empty");
  return blocks;
}

/** Reject résumé Markdown the PDF renderer cannot represent. */
export function assertResumeMarkdown(body: string): void {
  parseResumeBody(body);
}

function plainText(inlines: Inline[]): string {
  return inlines
    .map((part) => (part.type === "text" ? part.value : part.label))
    .join("");
}

/** Standalone website links remain useful when the résumé is printed. */
function paragraphInlines(inlines: Inline[]): Inline[] {
  const link = inlines[0];
  if (inlines.length !== 1 || link?.type !== "link") return inlines;
  const address = link.href.replace(/^https?:\/\//, "").replace(/\/$/, "");
  assertWinAnsi(address);
  return [
    { type: "text", value: `${link.label}: ` },
    { ...link, label: address },
  ];
}

function displayInlines(inlines: Inline[], uppercase: boolean): Inline[] {
  if (!uppercase) return inlines;
  return inlines.map((part) =>
    part.type === "text"
      ? { type: "text", value: part.value.toLocaleUpperCase("en-US") }
      : {
          type: "link",
          label: part.label.toLocaleUpperCase("en-US"),
          href: part.href,
        },
  );
}

function contentWidth(doc: Pdf, indent: number): number {
  return (
    doc.page.width - doc.page.margins.left - doc.page.margins.right - indent
  );
}

type TextStyle = {
  font: "Helvetica" | "Helvetica-Bold";
  size: number;
  color: string;
  lineGap: number;
  characterSpacing: number;
};

const bodyStyle: TextStyle = {
  font: "Helvetica",
  size: bodySize,
  color: ink,
  lineGap: bodyLineGap,
  characterSpacing: 0,
};

const metaStyle: TextStyle = { ...bodyStyle, color: muted };

function headingStyle(level: 2 | 3 | 4): TextStyle {
  if (level === 2) {
    return {
      font: "Helvetica-Bold",
      size: 10.5,
      color: muted,
      lineGap: 0,
      characterSpacing: 1.15,
    };
  }

  return {
    font: "Helvetica-Bold",
    size: level === 3 ? 12 : 11,
    color: ink,
    lineGap: 0,
    characterSpacing: 0,
  };
}

function applyStyle(doc: Pdf, style: TextStyle): void {
  doc.font(style.font).fontSize(style.size).fillColor(style.color);
}

function ensureSpace(doc: Pdf, height: number, date: string): void {
  const bottom = doc.page.height - doc.page.margins.bottom;
  if (doc.y + height <= bottom) return;

  doc.addPage();
  const left = doc.page.margins.left;
  const width = contentWidth(doc, 0);
  const y = doc.page.margins.top;
  doc.font("Helvetica").fontSize(10).fillColor(muted);
  doc.text(site.name, left, y, { width, lineBreak: false });
  doc.text(formatMonthYear(date), left, y, {
    width,
    align: "right",
    lineBreak: false,
  });
  doc.strokeColor(rule).lineWidth(0.5);
  doc
    .moveTo(left, y + 16)
    .lineTo(left + width, y + 16)
    .stroke();
  doc.x = left;
  doc.y = y + 26;
}

function measureInlines(
  doc: Pdf,
  inlines: Inline[],
  width: number,
  style: TextStyle,
): number {
  applyStyle(doc, style);
  return doc.heightOfString(plainText(inlines), {
    width,
    lineGap: style.lineGap,
    characterSpacing: style.characterSpacing,
  });
}

function writeInlines(
  doc: Pdf,
  inlines: Inline[],
  x: number,
  y: number,
  width: number,
  style: TextStyle,
): void {
  applyStyle(doc, style);
  inlines.forEach((part, index) => {
    const continued = index < inlines.length - 1;
    const value = part.type === "text" ? part.value : part.label;
    const options = {
      width,
      lineGap: style.lineGap,
      characterSpacing: style.characterSpacing,
      continued,
      underline: part.type === "link",
      link: part.type === "link" ? part.href : null,
    };
    if (index === 0) doc.text(value, x, y, options);
    else doc.text(value, options);
  });
  doc.x = doc.page.margins.left;
}

function drawList(
  doc: Pdf,
  block: Extract<Block, { type: "list" }>,
  indent: number,
  date: string,
): void {
  const x = doc.page.margins.left + indent;
  const width = contentWidth(doc, indent) - bulletColumn;

  for (const [itemIndex, item] of block.items.entries()) {
    const height = measureInlines(doc, item, width, bodyStyle);
    ensureSpace(doc, height, date);
    const y = doc.y;
    applyStyle(doc, bodyStyle);
    doc.text("•", x, y, { width: bulletColumn, lineBreak: false });
    writeInlines(doc, item, x + bulletColumn, y, width, bodyStyle);
    if (itemIndex < block.items.length - 1) doc.y += 2;
  }
}

function gapBefore(blocks: Block[], index: number): number {
  const block = blocks[index];
  const previous = blocks[index - 1];
  if (!block || !previous) return 14;
  if (block.type === "heading" && block.level === 2) return 16;
  if (block.type === "heading" && block.level === 3) return 11;
  if (block.type === "heading" && block.level === 4) return 8;
  if (block.type === "list") return 3;
  if (previous.type === "heading") return 2;
  if (isRoleMeta(blocks, index) && previous.type === "paragraph") return 2;
  return 6;
}

/** The line under a role, and the date line under that, match the page's muted meta. */
function isRoleMeta(blocks: Block[], index: number): boolean {
  const block = blocks[index];
  if (block?.type !== "paragraph") return false;

  const previous = blocks[index - 1];
  if (
    previous?.type === "heading" &&
    (previous.level === 3 || previous.level === 4)
  ) {
    return true;
  }

  const earlier = blocks[index - 2];
  return (
    previous?.type === "paragraph" &&
    earlier?.type === "heading" &&
    earlier.level === 3
  );
}

function drawResume(doc: Pdf, date: string, blocks: Block[]): void {
  const left = doc.page.margins.left;
  const width = contentWidth(doc, 0);

  doc.font("Helvetica-Bold").fontSize(18).fillColor(ink);
  doc.text(site.name, left, doc.y, { width });
  doc.y += 3;
  doc.font("Helvetica").fontSize(11).fillColor(muted);
  doc.text(formatMonthYear(date), { width });
  doc.y += 8;
  doc.strokeColor(rule).lineWidth(0.5);
  doc
    .moveTo(left, doc.y)
    .lineTo(left + width, doc.y)
    .stroke();
  doc.y += 2;

  let indent = 0;

  for (const [index, block] of blocks.entries()) {
    if (block.type === "heading" && block.level < 4) indent = 0;

    doc.y += gapBefore(blocks, index);

    if (block.type === "heading") {
      const headingIndent = block.level === 4 ? sectionIndent : indent;
      const style = headingStyle(block.level);
      const inlines = displayInlines(block.inlines, block.level === 2);
      const width = contentWidth(doc, headingIndent);
      ensureSpace(doc, measureInlines(doc, inlines, width, style) + 36, date);
      writeInlines(
        doc,
        inlines,
        doc.page.margins.left + headingIndent,
        doc.y,
        width,
        style,
      );
      if (block.level === 4) indent = sectionIndent;
      continue;
    }

    if (block.type === "paragraph") {
      const style = isRoleMeta(blocks, index) ? metaStyle : bodyStyle;
      const width = contentWidth(doc, indent);
      const inlines = paragraphInlines(block.inlines);
      ensureSpace(doc, measureInlines(doc, inlines, width, style), date);
      writeInlines(
        doc,
        inlines,
        doc.page.margins.left + indent,
        doc.y,
        width,
        style,
      );
      continue;
    }

    drawList(doc, block, indent, date);
  }
}

/** A text PDF of the résumé page, using the same Markdown body. */
export function renderResumePdf(page: StandalonePage): Promise<Buffer> {
  const blocks = parseResumeBody(page.body);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 56,
      info: {
        Title: `${site.name} résumé`,
        Author: site.name,
      },
    });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    try {
      drawResume(doc, page.date, blocks);
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
