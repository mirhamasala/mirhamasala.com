import fs from 'fs'
import path from 'path'
import renderPostTemplate from './renderPostTemplate.mjs'

const NEWSLETTER_CATEGORY_ID = 27

const importWordPressContent = async () => {
  // const content = await fetchContent('posts/?per_page=100')
  const content = await fetchContent('pages/?per_page=100')
  // const categories = await fetchContent('categories')

  const contentWithCustomProperties = extractProperties(content)
  writeContent(contentWithCustomProperties)
}

const fetchContent = async (endpoint) => {
  const url = `https://mirhamasala.com/wp-json/wp/v2/${endpoint}`
  const response = await fetch(url)
  return response.json()
}

// map categories

const extractProperties = (content) => {
  return content.map((entry) => {
    let {
      categories,
      content: { rendered: content },
      date_gmt,
      excerpt: { rendered: excerpt },
      modified_gmt,
      id,
      slug,
      status,
      tags,
      title: { rendered: title },
      type,
    } = entry

    return {
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
    }
  })
}

const writeContent = (content) => {
  content.forEach((entry) => {
    if (
      entry.id === 3142 ||
      entry.id === 2695 ||
      entry.id === 2443 ||
      entry.id === 2118 ||
      entry.id === 2297 // page
    )
      return

    if (isPost(entry)) {
      createDirectoryAndWriteToFile(
        `src/pages/posts/${entry.slug}`,
        'index.mdx',
        entry
      )
    }

    if (isLetter(entry)) {
      createDirectoryAndWriteToFile(
        `src/pages/letters/${entry.slug}`,
        'index.mdx',
        entry
      )
    }

    if (isPage(entry)) {
      createDirectoryAndWriteToFile('src/pages/', `${entry.slug}.mdx`, entry)
    }
  })
}

const isPost = (entry) =>
  entry.type === 'post' && !entry.categories.includes(NEWSLETTER_CATEGORY_ID)

const isLetter = (entry) =>
  entry.type === 'post' && entry.categories.includes(NEWSLETTER_CATEGORY_ID)

const isPage = (entry) => entry.type === 'page'

const createDirectoryAndWriteToFile = (dirSlug, fileSlug, entry) => {
  const directoryName = path.join(process.cwd(), dirSlug)
  const fileName = path.join(dirSlug, fileSlug)

  createDirectory(directoryName)
  createFile(fileName, entry)
}

const createDirectory = (name) => {
  try {
    if (!fs.existsSync(name)) {
      fs.mkdirSync(name)
    }
  } catch (err) {
    console.error(err)
    return
  }
}

const createFile = (name, entry) => {
  fs.writeFile(name, renderPostTemplate(entry), 'utf8', (err) => {
    if (err) console.log(err)
    else {
      console.log('File written successfully')
    }
  })
}

importWordPressContent()
