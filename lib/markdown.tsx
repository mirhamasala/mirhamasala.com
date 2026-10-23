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
