import React from 'react'
import Link from 'next/link'
import dayjs from 'dayjs'
import { Navigation, CommonHead, Footer } from '.'
import { PostSummary } from '../core/types'

type Props = { posts: Array<PostSummary> }

export const BlogPage = ({ posts }: Props): JSX.Element => {
  return (
    <article>
      <header>
        <CommonHead
          title="I have to write this down - Julian​Garamendy​.dev"
          description="A blog about React, TypeScript, and of course bananas."
        />
        <h1>Julian​Garamendy​.dev</h1>
        <Navigation />
      </header>
      <section>
        <h1>I have to write this down</h1>
        <h4>
          A blog about React, TypeScript, and of course bananas. Some of these
          posts appear on <a href="https://dev.to/juliang">dev.to</a>.
        </h4>

        <ul className="article-list">
          {posts.map((post) => (
            <PostListItem key={post.slug} post={post} />
          ))}
        </ul>
      </section>
      <hr className="full" />
      <Footer />
    </article>
  )
}

function PostListItem({ post }: { post: PostSummary }) {
  const publishDate = dayjs(post.date).format('D MMMM, YYYY')
  return (
    <li>
      <small>
        <strong>{publishDate}</strong>
      </small>
      <h2>
        <Link href={`/blog/${post.slug}`}>
          <a style={{ boxShadow: 'none' }}>{post.title}</a>
        </Link>
      </h2>
      <p>{post.description}</p>
    </li>
  )
}
