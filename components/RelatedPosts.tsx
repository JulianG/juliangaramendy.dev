import * as React from 'react'
import Link from 'next/link'
import dayjs from 'dayjs'
import { Post, PostSummary } from '../lib/types'

type Props = Post['relatedPosts']

export function RelatedPosts({ prev, next }: Props) {
  return (
    <div className="relatedPosts">
      {next && <RelatedBlogPostLink label="Next" post={next} />}
      {prev && <RelatedBlogPostLink label="Previous" post={prev} />}
    </div>
  )
}

function RelatedBlogPostLink({
  label,
  post,
}: {
  label: string
  post: PostSummary
}) {
  const publishDate = dayjs(post.date).format('D MMMM, YYYY')
  return (
    <>
      <div className="label">{label}:</div>
      <strong className="link">
        <Link href={`/blog/${post.slug}`}>
          <a>{post.title}</a>
        </Link>
      </strong>
      <small className="date">{publishDate}</small>
    </>
  )
}
