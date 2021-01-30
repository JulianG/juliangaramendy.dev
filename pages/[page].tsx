import React from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { CommonHead, Footer, Navigation } from '../src/components'
import { getPage, listPages } from '../src/core/get-page'

type Props = { title: string; description: string; bodyHtml: string }

export const Page = ({ title, description, bodyHtml }: Props): JSX.Element => {
  return (
    <article>
      <header>
        <CommonHead
          title={`${title} - Julian​Garamendy​.dev`}
          description={description}
        />
        <h1>Julian​Garamendy​.dev</h1>
        <Navigation />
      </header>
      <section>
        <div dangerouslySetInnerHTML={{ __html: bodyHtml }}></div>
      </section>
      <hr className="full" />
      <Footer />
    </article>
  )
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
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

export default Page
