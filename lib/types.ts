export type PostSummary = {
  slug: string
  title: string
  date: string
  description: string
}

export type Post = {
  slug: string
  title: string
  description: string
  date: string
  bodyHtml: string
  openGraphImage?: string
  coverImage?: string
  relatedPosts: {
    prev?: PostSummary
    next?: PostSummary
  }
}
