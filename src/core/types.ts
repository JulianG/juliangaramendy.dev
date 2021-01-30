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
  coverImageDimensions?: {
    width: number
    height: number
  }
  relatedPosts: {
    prev?: PostSummary
    next?: PostSummary
  }
  mirrors: Array<{ site: string; postUrl: string }>
}
