import React from 'react'
import { CommonHead, Footer, Navigation } from '.'

export type MarkdownPageProps = {
  title: string
  description: string
  bodyHtml: string
}

export const MarkdownPage = ({
  title,
  description,
  bodyHtml,
}: MarkdownPageProps) => {
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
