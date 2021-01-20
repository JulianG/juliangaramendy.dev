import { markdownToHtml } from './markdownToHtml'
import matter from 'gray-matter'
import { Post, PostSummary } from './types'
import { getCached } from './cache'

async function fetchArticles(): Promise<Article[]> {
  console.log('fetching articles from dev.to...')
  const r = await fetch('https://dev.to/api/articles/me/published', {
    headers: { 'api-key': process.env.DEVTO_API_KEY || '' },
  })

  if (r.status < 200 || r.status >= 300) {
    throw new Error(
      `Error fetching... Status code: ${r.status}, ${r.statusText}`
    )
  }
  return r.json()
}

const ONE_MINUTE = 1000 * 60 * 1

export async function getAllPosts(): Promise<PostSummary[]> {
  return (await getAllDevArticles()).map(articleToPostSummary)
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const articles = await getAllDevArticles()

  const article = articles.find((a) => {
    return getSlug(a.canonical_url || '') === slug
  })

  assert(article)

  const parts = matter(article.body_markdown || '')

  const bodyHtml = await markdownToHtml(parts.content)
  return {
    slug,
    title: article.title || '',
    description: article.description || '',
    date: article.published_timestamp || '1970-01-01',
    openGraphImage: parts.data.ogimage || '',
    coverImage: article.cover_image || '',
    coverImageDimensions: {
      width: 840,
      height: 353,
    },
    bodyHtml,
    relatedPosts: {},
  }
}

async function getAllDevArticles() {
  const articles = await getCached('dev.to.articles', fetchArticles, ONE_MINUTE)
  return articles.filter(hasCanonicalUrl)
}

function hasCanonicalUrl(article: Article) {
  return !!article.canonical_url
}

function articleToPostSummary(article: Article): PostSummary {
  return {
    slug: getSlug(article.canonical_url || ''),
    title: article.title,
    date: article.published_timestamp,
    description: article.description,
  }
}

function getSlug(url: string) {
  const parts = url.split('/').filter((part) => !!part)
  const slug = parts.pop() || ''
  return slug
}

function assert<T>(value: T | null | undefined): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error('Assertion failed. value is null or undefined')
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
  canonical_url?: string
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
