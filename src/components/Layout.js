import React from 'react'
import Markdown from 'react-markdown'
import { rhythm, scale } from '../utils/typography'

export function BlogLayout({ children, credits }) {

  return (
    <div
      style={{
        marginLeft: `auto`,
        marginRight: `auto`,
        maxWidth: rhythm(24),
        padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
      }}
    >
      {children}
      <hr style={{ marginBottom: rhythm(1) }} />
      <footer>
        Built with <a href="https://www.gatsbyjs.org">Gatsby</a> - Banana icon by Freepik from <a href="https://www.flaticon.com/free-icon/banana_688828">FlatIcon</a>.
      </footer>
      <footer>
        {credits && credits.map(c => <Markdown>{c}</Markdown>)}
      </footer>
    </div>
  )
};