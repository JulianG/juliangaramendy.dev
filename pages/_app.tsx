import React from 'react'
import type { AppProps } from 'next/app'
import '../src/styles/styles.css'
import '../src/styles/prism.css'
import '../src/styles/prism-custom.css'

// This default export is required in a new `pages/_app.js` file.
function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
