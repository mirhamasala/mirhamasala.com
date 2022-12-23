// npx ts-node ./src/lib/move-images.ts
import fs from 'fs'
import path from 'path'

const run = () => {
  const posts = fs.readdirSync(path.join(process.cwd(), 'src/pages/posts'))

  posts.forEach((post) => {
    if (path.extname(post) === '.jsx') return

    const oldImagePath = path.join(
      process.cwd(),
      'src/pages/posts/images',
      post
    )

    const newImagePath = path.join(
      process.cwd(),
      'public/images/pages/posts',
      post
    )

    if (fs.existsSync(oldImagePath)) {
      console.log(`Moving ${post} images...`)

      if (!fs.existsSync(newImagePath)) {
        fs.mkdirSync(newImagePath, { recursive: true })
      }

      fs.renameSync(oldImagePath, newImagePath)
    } else {
      console.log(`Skipping ${post} images, none exist.`)
    }
  })
}

run()
