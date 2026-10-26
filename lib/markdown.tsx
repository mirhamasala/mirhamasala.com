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
        className="mt-14 font-display text-[2.8rem] leading-none tracking-[-0.02em] first-of-type:border-t first-of-type:border-slate-300 first-of-type:pt-10 md:mt-16 md:text-[3.25rem]"
        {...props}
      />
    );
  },
  p: ({ node, ...props }) => {
    void node;
    return (
      <p
        className="mt-5 font-serif text-[1.1rem] leading-[1.55] first:mt-0 md:text-[1.2rem]"
        {...props}
      />
    );
  },
  table: ({ node, children, ...props }) => {
    void node;
    return (
      <table
        className="mt-6 w-full table-fixed border-collapse font-serif text-[1.05rem] leading-[1.45] md:text-[1.15rem]"
        {...props}
      >
        <colgroup>
          <col className="w-[5rem] sm:w-[7.5rem]" />
          <col />
        </colgroup>
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
    return (
      <th
        className="text-left font-normal first:w-[5rem] sm:first:w-[7.5rem]"
        {...props}
      />
    );
  },
  td: ({ node, ...props }) => {
    void node;
    return (
      <td
        className="py-2 align-top first:w-[5rem] first:pr-4 first:font-sans first:font-medium sm:first:w-[7.5rem] [&_em]:mt-1 [&_em]:block [&_em]:text-slate-600"
        {...props}
      />
    );
  },
  ol: ({ node, ...props }) => {
    void node;
    return (
      <ol
        className="mt-6 list-decimal space-y-3 pl-7 font-serif text-[1.1rem] leading-[1.55] marker:font-sans marker:text-slate-600 md:text-[1.2rem]"
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
