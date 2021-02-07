import sha from 'sha-1'
import UAParser from 'ua-parser-js'

const sessionId: string = sha(
  `${Math.random()}-${Math.random()}-${new Date().getTime()}`
)

const isBrowser =
  typeof window !== 'undefined' && typeof document !== 'undefined'

export function logPageView() {
  if (isBrowser) {
    postJson(`/api/pageview`, {
      ts: new Date(),
      title: document.title,
      host: new URL(document.URL).host,
      path: new URL(document.URL).pathname,
      sid: sessionId,
      referrer: document.referrer,
      ...getUserAgentProps(navigator.userAgent),
    })
  }
}

function getUserAgentProps(userAgent: string) {
  const { os, browser } = new UAParser(userAgent).getResult()

  return {
    os: os.name || '',
    browser: browser.name || '',
  }
}

function postJson(url: string, data: unknown) {
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}
