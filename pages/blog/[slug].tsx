import { GetStaticProps, GetStaticPaths } from 'next'
import { getAllPosts, getPostBySlug } from '../../src/core/get-posts'
import { BlogPostPage, BlogPostProps } from '../../src/components/BlogPostPage'

export default BlogPostPage

export const getStaticProps: GetStaticProps<BlogPostProps> = async (
  context
) => {
  const slug = context.params?.slug
  try {
    const post = await getPostBySlug(`${slug}`)
    return { props: { post }, revalidate: 1 }
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
