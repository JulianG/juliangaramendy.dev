import React from 'react'
import { rhythm, scale } from '../utils/typography'

export function BlogLayout({ children }) {

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
      <footer>
        Built with <a href="https://www.gatsbyjs.org">Gatsby</a> - Banana icon by Freepik from <a href="https://www.flaticon.com/free-icon/banana_688828">FlatIcon</a>.
      </footer>
    </div>
  )
};