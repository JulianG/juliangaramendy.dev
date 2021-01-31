import { GetStaticPaths, GetStaticProps } from 'next'
import { getPage, listPages } from '../src/core/get-page'
import { MarkdownPageProps, MarkdownPage } from '../src/components/MarkdownPage'

export const getStaticProps: GetStaticProps<MarkdownPageProps> = async (
  context
) => {
  const page = context.params?.page

  try {
    const { title, bodyHtml } = await getPage(`${page}`)
    return {
      props: { title, description: '', bodyHtml },
    }
  } catch (e) {
    return { notFound: true }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: listPages().map((page) => ({ params: { page } })),
    fallback: true,
  }
}

export default MarkdownPage
