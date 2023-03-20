import { htmlToMarkdown } from "./htmlToMarkdown.mjs";

export default function renderPostTemplate(entry) {
  const {
    categories,
    content,
    date_gmt,
    excerpt,
    modified_gmt,
    id,
    slug,
    status,
    tags,
    title,
    type,
  } = entry;

  return `import { PostLayout } from '@/components/PostLayout'

export const meta = {
  categories: ${JSON.stringify(categories)},
  date: '${date_gmt}',
  date_modified: '${modified_gmt}',
  description: '${htmlToMarkdown(excerpt).trim()}',
  id: '${id}',
  slug: '${slug}',
  status: '${status}',
  tags:  ${JSON.stringify(tags)},
  title: '${title}',
  type: '${type}'
}

export default (props) => <PostLayout meta={meta} {...props} />

${htmlToMarkdown(content, id)}
`;
}
