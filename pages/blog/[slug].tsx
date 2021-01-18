import { GetStaticProps, GetStaticPaths } from 'next'
import Image from 'next/image'
import React from 'react'
import dayjs from 'dayjs'
import { Navigation, CommonHead, Footer, RelatedPosts } from '../../components'
import { getAllPosts, getPostBySlug } from '../../lib/merged-api'
import { Post } from '../../lib/types'

const TEN_MINUTES = 60 * 10

type Props = { post?: Partial<Post> }

export const BlogPostPage = ({ post }: Props): JSX.Element => {
  if (!post) {
    return <></>
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
      <RelatedPosts {...post.relatedPosts} />
      <hr className="full" />
      <Footer />
    </article>
  )
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const slug = context.params?.slug
  try {
    const post = await getPostBySlug(`${slug}`)
    return { props: { post }, revalidate: TEN_MINUTES }
  } catch (e) {
    console.error(`Failed to generate post for slug: ${slug}`)
    return { notFound: true }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getAllPosts()
  const paths = posts.map((post) => ({ params: { slug: post.slug } }))
  return { paths, fallback: true }
}

export default BlogPostPage
