import React from 'react'
import { GetStaticProps } from 'next'
import Link from 'next/link'
import dayjs from 'dayjs'
import { Navigation, CommonHead, Footer } from '../components'
import { getAllPosts } from '../lib/merged-api'
import { PostSummary } from '../lib/types'

export const BlogPage = ({
  posts,
}: {
  posts: Array<PostSummary>
}): JSX.Element => {
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

const PostListItem: React.FC<{ post: PostSummary }> = ({ post }) => {
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

export const getStaticProps: GetStaticProps = async (context) => {
  const posts = await getAllPosts()
  return { props: { posts } }
}

export default BlogPage
