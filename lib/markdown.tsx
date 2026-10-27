import GithubSlugger from "github-slugger";
import Link from "next/link";
import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

function isExternalHref(href: string): href is `http${string}` {
  return href.startsWith("http://") || href.startsWith("https://");
}

export const proseLinkClassName =
  "not-italic underline decoration-1 decoration-slate-500 underline-offset-[0.22em] hover:decoration-current motion-safe:transition-[text-decoration-color] motion-safe:duration-150";

const components: Components = {
  a: ({ node, href = "", ...props }) => {
    void node;
    // Content still links to sections that have not returned. Prefetching
    // those URLs logs a 404 on every page that renders the link.
    if (href.startsWith("/")) {
      return <Link href={href} {...props} prefetch={false} />;
    }
    if (isExternalHref(href)) {
      return <a href={href} {...props} />;
    }

    return <a href={href} {...props} />;
  },
};

export function MarkdownContent({ source }: { source: string }) {
  return (
    <Markdown remarkPlugins={[remarkGfm]} components={components}>
      {source}
    </Markdown>
  );
}

const recipeComponents: Components = {
  ...components,
  h2: ({ node, ...props }) => {
    void node;
    return (
      <h2
        className="mt-14 font-display text-[3rem] leading-none tracking-[-0.02em] md:mt-16 [&:first-of-type:not(:first-child)]:border-t [&:first-of-type:not(:first-child)]:border-slate-300 [&:first-of-type:not(:first-child)]:pt-10"
        {...props}
      />
    );
  },
  p: ({ node, ...props }) => {
    void node;
    return (
      <p
        className="mt-5 font-serif text-[1.25rem] leading-[1.5] first:mt-0"
        {...props}
      />
    );
  },
  table: ({ node, children, ...props }) => {
    void node;
    return (
      <table
        className="mt-6 w-full border-collapse font-serif text-[1.25rem] leading-[1.45]"
        {...props}
      >
        {children}
      </table>
    );
  },
  thead: ({ node, ...props }) => {
    void node;
    return <thead className="sr-only text-[1rem]" {...props} />;
  },
  th: ({ node, ...props }) => {
    void node;
    return <th className="text-left font-normal" {...props} />;
  },
  td: ({ node, ...props }) => {
    void node;
    return (
      <td
        className="py-2 align-top first:w-[1%] first:pr-4 first:font-sans first:text-[1rem] first:font-medium first:whitespace-nowrap md:first:text-[1.125rem] [&_em]:mt-1 [&_em]:block [&_em]:text-[1.125rem] [&_em]:text-slate-500"
        {...props}
      />
    );
  },
  ol: ({ node, ...props }) => {
    void node;
    return (
      <ol
        className="mt-6 list-decimal space-y-3 pl-7 font-serif text-[1.25rem] leading-[1.5] marker:font-sans marker:text-slate-600"
        {...props}
      />
    );
  },
  a: ({ node, href = "", ...props }) => {
    void node;
    if (href.startsWith("/")) {
      return (
        <Link
          href={href}
          prefetch={false}
          className={proseLinkClassName}
          {...props}
        />
      );
    }
    if (isExternalHref(href)) {
      return <a href={href} className={proseLinkClassName} {...props} />;
    }

    return <a href={href} className={proseLinkClassName} {...props} />;
  },
};

export function RecipeMarkdownContent({ source }: { source: string }) {
  return (
    <Markdown remarkPlugins={[remarkGfm]} components={recipeComponents}>
      {source}
    </Markdown>
  );
}

const bookComponents: Components = {
  ...components,
  a: ({ node, href = "", ...props }) => {
    void node;
    if (href.startsWith("/")) {
      return (
        <Link
          href={href}
          prefetch={false}
          className={proseLinkClassName}
          {...props}
        />
      );
    }
    if (isExternalHref(href)) {
      return <a href={href} className={proseLinkClassName} {...props} />;
    }

    return <a href={href} className={proseLinkClassName} {...props} />;
  },
  h2: ({ node, className, ...props }) => {
    void node;
    return (
      <h2
        className={
          className === "sr-only"
            ? "sr-only"
            : "mt-16 font-sans text-[1rem] font-medium tracking-[0.14em] text-slate-600 uppercase first:mt-0"
        }
        {...props}
      />
    );
  },
  p: ({ node, ...props }) => {
    void node;
    return (
      <p
        className="mt-5 font-serif text-[1.2rem] leading-[1.55] first:mt-0 md:text-[1.25rem]"
        {...props}
      />
    );
  },
  blockquote: ({ node, ...props }) => {
    void node;
    return (
      <blockquote
        className="mt-6 border-l border-slate-300 pl-5 font-serif text-[1.25rem] leading-[1.45] text-slate-800 italic"
        {...props}
      />
    );
  },
  ul: ({ node, ...props }) => {
    void node;
    return (
      <ul
        className="mt-5 list-disc space-y-2 pl-6 font-serif text-[1.2rem] leading-[1.5] md:text-[1.25rem]"
        {...props}
      />
    );
  },
  ol: ({ node, ...props }) => {
    void node;
    return (
      <ol
        className="mt-5 list-decimal space-y-2 pl-6 font-serif text-[1.2rem] leading-[1.5] marker:font-sans marker:text-slate-600 md:text-[1.25rem]"
        {...props}
      />
    );
  },
  table: ({ node, children, ...props }) => {
    void node;
    return (
      <div className="mt-6 overflow-x-auto">
        <table
          className="w-full border-collapse font-serif text-[1.125rem] leading-[1.45]"
          {...props}
        >
          {children}
        </table>
      </div>
    );
  },
  th: ({ node, ...props }) => {
    void node;
    return (
      <th
        className="border-b border-slate-300 py-2 pr-4 text-left font-sans text-[1rem] font-medium text-slate-600"
        {...props}
      />
    );
  },
  td: ({ node, ...props }) => {
    void node;
    return (
      <td
        className="border-b border-slate-200 py-2 pr-4 align-top"
        {...props}
      />
    );
  },
  code: ({ node, ...props }) => {
    void node;
    return (
      <code
        className="font-sans text-[1rem] text-slate-800 before:content-none after:content-none"
        {...props}
      />
    );
  },
};

export function BookMarkdownContent({ source }: { source: string }) {
  return (
    <Markdown remarkPlugins={[remarkGfm]} components={bookComponents}>
      {source}
    </Markdown>
  );
}

/** A paragraph whose only content is a link to an mp4 is that video. */
function standaloneVideoHref(node: HastNode | undefined): string | undefined {
  const children = node?.children ?? [];
  const meaningful = children.filter((child) => {
    if (child.type === "text") return Boolean(child.value?.trim());
    return child.type === "element";
  });
  const link = meaningful[0];
  if (meaningful.length !== 1 || link?.tagName !== "a") return;

  const href = link.properties?.href;
  if (typeof href !== "string" || !href.endsWith(".mp4")) return;
  return href;
}

function standaloneVideoLabel(node: HastNode | undefined): string | undefined {
  const link = node?.children?.find((child) => child.tagName === "a");
  const label = link?.children
    ?.filter((child) => child.type === "text")
    .map((child) => child.value ?? "")
    .join("")
    .trim();
  return label || undefined;
}

const letterComponents: Components = {
  ...bookComponents,
  p: ({ node, children, ...props }) => {
    const href = standaloneVideoHref(node as HastNode | undefined);
    if (href) {
      return (
        <video
          className="mt-8 w-full"
          controls
          preload="metadata"
          aria-label={standaloneVideoLabel(node as HastNode | undefined)}
        >
          <source src={href} type="video/mp4" />
        </video>
      );
    }

    return (
      <p
        className="mt-5 font-serif text-[1.2rem] leading-[1.55] first:mt-0 md:text-[1.25rem]"
        {...props}
      >
        {children}
      </p>
    );
  },
  h3: ({ node, ...props }) => {
    void node;
    return (
      <h3
        className="mt-8 font-serif text-[1.35rem] leading-snug md:text-[1.5rem]"
        {...props}
      />
    );
  },
  h4: ({ node, ...props }) => {
    void node;
    return (
      <h4
        className="mt-8 font-serif text-[1.2rem] leading-snug md:text-[1.3rem]"
        {...props}
      />
    );
  },
  hr: ({ node, ...props }) => {
    void node;
    return (
      <hr
        className="my-12 border-0 border-t border-slate-300 md:my-16"
        {...props}
      />
    );
  },
};

type MarkdownTree = {
  type: string;
  value?: string;
  children?: MarkdownTree[];
  data?: { hProperties?: { id?: string } };
};

function markdownText(node: MarkdownTree): string {
  if (node.type === "text" || node.type === "inlineCode") {
    return node.value ?? "";
  }
  return (node.children ?? []).map(markdownText).join("");
}

type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: {
    className?: string | Array<string | number>;
    dataFootnotes?: boolean | string;
    href?: unknown;
  };
  children?: HastNode[];
};

function hastText(node: HastNode): string {
  if (node.type === "text") return node.value ?? "";
  return (node.children ?? []).map(hastText).join("");
}

function isHastElement(node: HastNode, tagName: string): boolean {
  return node.type === "element" && node.tagName === tagName;
}

function isFootnotesSection(node: HastNode): boolean {
  if (!isHastElement(node, "section")) return false;
  const properties = node.properties;
  if (properties?.dataFootnotes === true || properties?.dataFootnotes === "") {
    return true;
  }
  const className = properties?.className;
  const classes = Array.isArray(className)
    ? className
    : typeof className === "string"
      ? className.split(" ")
      : [];
  return classes.includes("footnotes");
}

function isRelatedHeading(node: HastNode): boolean {
  return (
    (isHastElement(node, "h2") || isHastElement(node, "h3")) &&
    hastText(node).trim() === "You Might Also Like"
  );
}

function previousContentIndex(children: HastNode[], index: number): number {
  for (let cursor = index - 1; cursor >= 0; cursor -= 1) {
    const child = children[cursor];
    if (child && !(child.type === "text" && !child.value?.trim()))
      return cursor;
  }
  return -1;
}

/**
 * GFM prints footnote definitions at the end of the document, so a rule
 * written around them collapses onto the suggestion that follows. Keep the
 * notes with the piece, then the suggestion.
 */
function rehypeArticleEnding() {
  return (tree: HastNode) => {
    const children = tree.children;
    if (!children) return;

    const footnotesIndex = children.findIndex(isFootnotesSection);
    if (footnotesIndex === -1) return;

    const relatedIndex = children.findIndex(
      (node, index) => index < footnotesIndex && isRelatedHeading(node),
    );
    const hasLaterHeading =
      relatedIndex !== -1 &&
      children
        .slice(relatedIndex + 1, footnotesIndex)
        .some((node) => isHastElement(node, "h2") || isHastElement(node, "h3"));

    if (relatedIndex !== -1 && !hasLaterHeading) {
      let start = relatedIndex;
      const before = previousContentIndex(children, relatedIndex);
      const preceding = before === -1 ? undefined : children[before];
      if (preceding && isHastElement(preceding, "hr")) start = before;

      const block = children.splice(start, footnotesIndex - start);
      const notesAt = children.findIndex(isFootnotesSection);
      children.splice(notesAt + 1, 0, ...block);
    }

    let notesAt = children.findIndex(isFootnotesSection);
    let beforeNotes = previousContentIndex(children, notesAt);
    while (beforeNotes !== -1) {
      const preceding = children[beforeNotes];
      if (!preceding || !isHastElement(preceding, "hr")) break;
      children.splice(beforeNotes, 1);
      notesAt = children.findIndex(isFootnotesSection);
      beforeNotes = previousContentIndex(children, notesAt);
    }
  };
}

/** Heading ids match the legacy site, so existing in-article links still land. */
function remarkHeadingIds() {
  return (tree: MarkdownTree) => {
    const slugger = new GithubSlugger();

    const walk = (node: MarkdownTree) => {
      if (node.type === "heading") {
        const explicit = markdownText(node).match(/ \{#([A-Za-z0-9-]+)\}$/);
        let id: string;
        if (explicit?.[1]) {
          id = explicit[1];
          const children = node.children ?? [];
          for (let index = children.length - 1; index >= 0; index -= 1) {
            const child = children[index];
            if (child?.type === "text" && child.value) {
              child.value = child.value.replace(/ \{#[A-Za-z0-9-]+\}$/, "");
              break;
            }
          }
          slugger.occurrences[id] = 0;
        } else {
          id = slugger.slug(markdownText(node));
        }
        node.data ??= {};
        node.data.hProperties ??= {};
        node.data.hProperties.id = id;
      }

      for (const child of node.children ?? []) walk(child);
    };

    walk(tree);
  };
}

export function LetterMarkdownContent({ source }: { source: string }) {
  return (
    <div className="[&_.footnotes]:mt-16 [&_.footnotes]:border-t [&_.footnotes]:border-slate-300 [&_.footnotes]:pt-8 [&_hr+*]:mt-0 [&_img]:h-auto [&_img]:w-full [&_sup]:text-[1rem]">
      <Markdown
        remarkPlugins={[remarkGfm, remarkHeadingIds]}
        rehypePlugins={[rehypeArticleEnding]}
        components={letterComponents}
      >
        {source}
      </Markdown>
    </div>
  );
}

const quoteComponents: Components = {
  ...bookComponents,
  p: ({ node, ...props }) => {
    void node;
    return (
      <p
        className="font-display text-[clamp(2.25rem,3.6vw,3.35rem)] leading-[1.12] font-normal tracking-[-0.02em] text-slate-950 before:text-slate-500 before:content-['“'] after:text-slate-500 after:content-['”']"
        {...props}
      />
    );
  },
  strong: ({ node, ...props }) => {
    void node;
    return <strong className="font-medium text-inherit" {...props} />;
  },
  code: ({ node, ...props }) => {
    void node;
    return (
      <code
        className="font-sans text-[1em] text-inherit before:content-none after:content-none"
        {...props}
      />
    );
  },
};

export function BookLeadQuote({ source }: { source: string }) {
  return (
    <blockquote>
      <Markdown remarkPlugins={[remarkGfm]} components={quoteComponents}>
        {source}
      </Markdown>
    </blockquote>
  );
}
