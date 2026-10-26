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
