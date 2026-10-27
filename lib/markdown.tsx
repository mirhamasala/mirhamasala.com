import Link from "next/link";
import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { ExternalLink } from "@/components/external-link";

function isExternalHref(href: string): href is `http${string}` {
  return href.startsWith("http://") || href.startsWith("https://");
}

const components: Components = {
  a: ({ node, href = "", ...props }) => {
    void node;
    if (href.startsWith("/")) return <Link href={href} {...props} />;
    if (isExternalHref(href)) {
      return <ExternalLink href={href} {...props} />;
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
    const className =
      "underline decoration-slate-400 underline-offset-[0.18em] hover:decoration-current";

    if (href.startsWith("/")) {
      return <Link href={href} className={className} {...props} />;
    }
    if (isExternalHref(href)) {
      return <ExternalLink href={href} className={className} {...props} />;
    }

    return <a href={href} className={className} {...props} />;
  },
};

export function RecipeMarkdownContent({ source }: { source: string }) {
  return (
    <Markdown remarkPlugins={[remarkGfm]} components={recipeComponents}>
      {source}
    </Markdown>
  );
}

const bookLinkClassName =
  "underline decoration-slate-400 underline-offset-[0.18em] hover:decoration-current";

const bookComponents: Components = {
  ...components,
  a: ({ node, href = "", ...props }) => {
    void node;
    if (href.startsWith("/")) {
      return (
        <Link
          href={href}
          prefetch={false}
          className={bookLinkClassName}
          {...props}
        />
      );
    }
    if (isExternalHref(href)) {
      return (
        <ExternalLink href={href} className={bookLinkClassName} {...props} />
      );
    }

    return <a href={href} className={bookLinkClassName} {...props} />;
  },
  h2: ({ node, ...props }) => {
    void node;
    return (
      <h2
        className="mt-16 font-sans text-[1rem] font-medium tracking-[0.14em] text-slate-600 uppercase first:mt-0"
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
