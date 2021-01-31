import { GetStaticProps } from 'next'
import { getAllPosts } from '../src/core/get-posts'
import { BlogPage } from '../src/components/BlogPage'

export default BlogPage

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getAllPosts()
  return { props: { posts }, revalidate: 1 }
}
