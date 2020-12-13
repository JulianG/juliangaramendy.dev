import type { AppProps /*, AppContext */ } from 'next/app'
import '../components/styles.css'
import '../components/prism.css'
import '../components/prism-custom.css'

// This default export is required in a new `pages/_app.js` file.
function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
