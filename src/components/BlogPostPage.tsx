import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import dayjs from 'dayjs'
import { Navigation, CommonHead, Footer, RelatedPosts } from '.'
import { Post } from '../core/types'

export type BlogPostProps = { post?: Partial<Post> }

export const BlogPostPage = ({ post }: BlogPostProps) => {
  if (!post) {
    return null
  }

  const publishDate = dayjs(post.date).format('D MMMM, YYYY')

  return (
    <article>
      <header>
        <CommonHead
          title={`${post.title} - Julian​Garamendy​.dev`}
          description={post.description}
          openGraphImage={post.openGraphImage || post.coverImage}
        />
        <h1>Julian​Garamendy​.dev</h1>
        <Navigation />
      </header>
      <section>
        <h1>{post.title}</h1>
        <small>{publishDate}</small>
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            layout="responsive"
            width={840}
            height={353}
          />
        ) : null}
        <div dangerouslySetInnerHTML={{ __html: post.bodyHtml || '' }}></div>
      </section>
      <hr className="full" />
      <Mirrors mirrors={post.mirrors} />
      <hr />
      <RelatedPosts {...post.relatedPosts} />
      <hr className="full" />
      <Footer />
    </article>
  )
}

type MirrorsProps = { mirrors: Post['mirrors'] | undefined }

function Mirrors({ mirrors = [] }: MirrorsProps) {
  return (
    <section>
      {mirrors.map((mirror, i) => {
        return (
          <p key={i}>
            {mirror.site}: <Link href={mirror.postUrl}>{mirror.postUrl}</Link>
          </p>
        )
      })}
    </section>
  )
}
