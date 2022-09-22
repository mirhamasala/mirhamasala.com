import { htmlToMarkdown } from './htmlToMarkdown.mjs'

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
  } = entry

  return `import { PostLayout } from '@/components/PostLayout'

export const meta = {
  author: 'Mirha Masala',
  categories: '${categories}',
  date: '${date_gmt}',
  description: '${htmlToMarkdown(excerpt).trim()}',
  modified_gmt: '${modified_gmt}',
  id: '${id}',
  slug: '${slug}',
  status: '${status}',
  tags: '${tags}',
  title: '${title}',
  type: '${type}'
}

export default (props) => <PostLayout meta={meta} {...props} />

${htmlToMarkdown(content, id)}
`
}
