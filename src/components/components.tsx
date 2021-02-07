import * as React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Favicon } from './Favicon'
import { useRouter } from 'next/router'
import { logPageView } from '../logging/log-page-view'

type Props = { title: string; description?: string; openGraphImage?: string }

export function CommonHead(props: Props) {
  const {
    title,
    description = '',
    openGraphImage = 'https://juliangaramendy.dev/assets/opengraph-default.png',
  } = props

  useLogPageView()
  useRemoveGatsbyServiceWorker()

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="image" content={openGraphImage} />
        <Favicon />

        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400&family=Fira+Sans+Condensed:ital,wght@0,300;0,500;1,400&family=Fira+Sans+Extra+Condensed:wght@500;700&display=swap"
          rel="stylesheet"
        />
        <meta property="og:type" content={'article'} />
        <meta property="og:title" content={title} />
        <meta property="og:image" content={openGraphImage} />
        <meta property="og:description" content={description} />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:site" content="@JulianGWeb" />
        <meta name="twitter:image" content={openGraphImage} />
      </Head>
    </>
  )
}

export const Navigation: React.FC = () => {
  const r = useRouter()

  const sectionName = r.asPath.split('/').filter((p) => !!p)[0]

  return (
    <nav>
      <ul>
        <li>
          <Link href="/info">
            <a className={sectionName === 'info' ? 'selected' : ''}>Info</a>
          </Link>
        </li>

        <li>
          <Link href="/work">
            <a className={sectionName === 'work' ? 'selected' : ''}>Work</a>
          </Link>
        </li>

        <li>
          <Link href="/blog">
            <a className={sectionName === 'blog' ? 'selected' : ''}>Blog</a>
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export const Footer = () => {
  return (
    <footer>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          Written by <strong>Julian Garamendy</strong>&nbsp;
          <a href="https://dev.to/juliang">
            <img
              className="socialIcon"
              src="https://d2fltix0v2e0sb.cloudfront.net/dev-badge.svg"
              alt="Julian Garamendy's DEV Profile"
            />
          </a>
          &nbsp;
          <a href={`https://twitter.com/JulianGWeb`}>
            <img className="socialIcon" src="/assets/twitter-logo.svg" />
          </a>
          &nbsp;
          <a href={`https://github.com//JulianG`}>
            <img className="socialIcon" src="/assets/github-logo.svg" />
          </a>
        </div>
        <div>
          Banana icon by Freepik from{' '}
          <a href="https://www.flaticon.com/free-icon/banana_688828">
            FlatIcon
          </a>
          .
        </div>
      </div>
    </footer>
  )
}

function useRemoveGatsbyServiceWorker() {
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('serviceWorker' in window.navigator) {
        window.navigator.serviceWorker.ready.then((registration) => {
          registration.unregister()
        })
      }
    }
  }, [])
}

function useLogPageView() {
  const url = typeof window !== 'undefined' ? document.URL : ''
  React.useEffect(() => logPageView(), [url])
}
