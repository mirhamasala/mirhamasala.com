import Link from "next/link";
import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const components: Components = {
  a: ({ node, href = "", ...props }) => {
    void node;
    return href.startsWith("/") ? (
      <Link href={href} {...props} />
    ) : (
      <a href={href} {...props} />
    );
  },
};

export function MarkdownContent({ source }: { source: string }) {
  return (
    <Markdown remarkPlugins={[remarkGfm]} components={components}>
      {source}
    </Markdown>
  );
}
