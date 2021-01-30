import { Post, PostSummary } from './types'
import * as devApi from './dev-api'

export async function getAllPosts(): Promise<PostSummary[]> {
  const dev = await devApi.getAllPosts()
  const allPosts = [...dev].sort((post1, post2) =>
    post1.date > post2.date ? -1 : 1
  )
  return allPosts
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const relatedPosts = await getRelatedPosts(slug)
  const post = await devApi.getPostBySlug(slug)
  return { ...post, relatedPosts }
}

async function getRelatedPosts(slug: string): Promise<Post['relatedPosts']> {
  const allPosts = await getAllPosts()
  const index = allPosts.findIndex((p) => p.slug === slug)

  if (index > -1) {
    const prev = allPosts[index + 1]
    const next = allPosts[index - 1]
    return { ...(prev ? { prev } : {}), ...(next ? { next } : {}) }
  } else {
    return {}
  }
}
