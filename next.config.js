
module.exports = {
  async redirects() {
    return [{ source: '/', destination: '/info', permanent: true },
    { source: '/hello', destination: '/blog/hello', permanent: true },
    {
      source: '/avoiding-non-null-assertions',
      destination: '/blog/avoiding-non-null-assertions',
      permanent: true
    },
    {
      source: '/introducing-banana-tabs',
      destination: '/blog/introducing-banana-tabs',
      permanent: true
    },
    {
      source: '/my-2020-dev-setup',
      destination: '/blog/my-2020-dev-setup',
      permanent: true
    },
    {
      source: '/no-implicit-any',
      destination: '/blog/catching-bugs-with-stricter-typescript',
      permanent: true
    },
    {
      source: '/null-checking',
      destination: '/blog/null-checking',
      permanent: true
    },
    {
      source: '/custom-open-graph-images-in-gatsby-blog',
      destination: '/blog/custom-open-graph-images-in-gatsby-blog',
      permanent: true
    },
    {
      source: '/how-swr-works',
      destination: '/blog/how-swr-works',
      permanent: true
    },
    {
      source: '/json-server-glitch',
      destination: '/blog/json-server-glitch',
      permanent: true
    },
    {
      source: '/minimal-state-management-react-1',
      destination: '/blog/loading-and-displaying-data-with-hooks',
      permanent: true
    },
    {
      source: '/minimal-state-management-react-2',
      destination: '/blog/changing-remote-data-with-hooks',
      permanent: true
    },
    {
      source: '/minimal-state-management-react-3',
      destination: '/blog/sharing-remote-data-with-react-context',
      permanent: true
    },
    {
      source: '/minimal-state-management-react-4',
      destination: '/blog/managing-remote-data-with-swr',
      permanent: true
    },
    {
      source: '/prettier-pre-commit-hook',
      destination: '/blog/prettier-pre-commit-hook',
      permanent: true
    },
    {
      source: '/react-state-management-2020',
      destination: '/blog/react-state-management-2020',
      permanent: true
    },
    {
      source: '/react-typescript-library-tsdx',
      destination: '/blog/react-typescript-library-tsdx',
      permanent: true
    },
    {
      source: '/readonly-and-errors',
      destination: '/blog/readonly-and-errors',
      permanent: true
    },
    {
      source: '/strict-react-context',
      destination: '/blog/strict-react-context',
      permanent: true
    },
    {
      source: '/testing-opinions',
      destination: '/blog/testing-opinions',
      permanent: true
    },
    {
      source: '/use-promise-subscription',
      destination: '/blog/use-promise-subscription',
      permanent: true
    },
    {
      source: '/when-ts-generics',
      destination: '/blog/when-ts-generics',
      permanent: true
    }]
  },
}
