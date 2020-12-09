import { markdownToHtml } from './markdownToHtml'
import matter from 'gray-matter'
import { Post, PostSummary } from './types'

export async function getAllPosts(): Promise<PostSummary[]> {
  return (await getAllDevArticles()).map(articleToPostSummary)
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const article = await getDevToArticleBySlug(slug, [
    'slug',
    'title',
    'body_markdown',
    'published_timestamp',
    'cover_image',
    'social_image',
  ])

  const parts = matter(article.body_markdown || '')

  const bodyHtml = await markdownToHtml(parts.content)
  return {
    slug: article.slug || slug,
    title: article.title || '',
    description: article.description || '',
    date: article.published_timestamp || '1970-01-01',
    coverImage: article.cover_image,
    socialImage: article.social_image,
    bodyHtml,
  }
}

async function getAllDevArticles() {
  const articles: Array<Article> = await fetch(
    'https://dev.to/api/articles/me/published',
    {
      headers: { 'api-key': process.env.DEVTO_API_KEY || '' },
    }
  ).then((r) => r.json())
  return articles
}

async function getDevToArticleBySlug(
  slug: string,
  fields: Array<keyof Article> = []
) {
  const article: Article = await fetch(
    `https://dev.to/api/articles/juliang/${slug}`
  ).then((r) => r.json())

  // we could validate `article` here with io-ts or something

  if (article.slug !== slug) {
    throw 'not found'
  }

  const partialArticle: Partial<Article> = {}
  fields.forEach((field) => (partialArticle[field] = article[field]))
  return partialArticle as Partial<Article>
}

function articleToPostSummary(a: Article): PostSummary {
  return {
    slug: a.slug,
    title: a.title,
    date: a.published_timestamp,
    description: a.description,
  }
}

///

export interface Article {
  type_of: string
  id: number
  title: string
  description: string
  readable_publish_date: string
  slug: string
  path: string
  url: string
  comments_count: number
  public_reactions_count: number
  positive_reactions_count: number
  collection_id?: number
  published_timestamp: string
  cover_image: string
  social_image: string
  canonical_url: string
  created_at: Date
  edited_at: Date
  crossposted_at?: any
  published_at: Date
  last_comment_at: Date
  tag_list: string
  tags: string[]
  body_html: string
  body_markdown: string
  user: User
}

interface User {
  name: string
  username: string
  twitter_username: string
  github_username: string
  website_url: string
  profile_image: string
  profile_image_90: string
}
