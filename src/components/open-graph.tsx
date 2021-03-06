import React from 'react'

type Props = { title: string; description?: string; openGraphImage?: string }

export const TwitterMeta = (props: Props) => {
  const { title, description, openGraphImage } = props
  return (
    <>
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:site" content="@JulianGWeb" />
      <meta name="twitter:image" content={openGraphImage} />
    </>
  )
}

export const OpenGraphMeta = (props: Props) => {
  const { title, description, openGraphImage } = props
  return (
    <>
      <meta property="og:type" content={'article'} />
      <meta property="og:title" content={title} />
      <meta property="og:image" content={openGraphImage} />
      <meta property="og:description" content={description} />
    </>
  )
}
