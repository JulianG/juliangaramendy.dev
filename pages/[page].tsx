import React from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { CommonHead, Footer, Navigation } from '../components'
import { getPage } from '../lib/fs-api'

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
    return { props: { title, description: '', bodyHtml }, revalidate: 1 }
  } catch (e) {
    return { notFound: true }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: ['info', 'work'].map((page) => ({ params: { page } })),
    fallback: true,
  }
}

export default Page
