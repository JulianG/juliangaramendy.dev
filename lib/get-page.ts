// based on https://github.com/vercel/next.js/blob/fcf129d90dc611c4836bb148a6bb7ee77067d82c/examples/blog-starter/lib/api.js

import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import { markdownToHtml } from './markdownToHtml'

const pagesDirectory = join(process.cwd(), 'public/pages')

export async function getPage(slug: string) {
  const fullPath = join(pagesDirectory, slug, `index.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const parts = matter(content)

  const bodyMarkdown = parts.content.replace(
    /\(.\/(.+)\)/g,
    `(/pages/${slug}/$1)`
  )

  const bodyHtml = await markdownToHtml(bodyMarkdown)

  return {
    title: data.title || '',
    description: data.description || '',
    bodyHtml,
  }
}
