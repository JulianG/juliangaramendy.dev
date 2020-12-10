
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
      destination: '/blog/catching-bugs-with-stricter-typescript-13oa',
      permanent: true
    },
    {
      source: '/null-checking',
      destination: '/blog/null-checking',
      permanent: true
    },
    {
      source: '/custom-open-graph-images-in-gatsby-blog',
      destination: '/blog/adding-custom-opengraph-images-to-gatsby-starter-blog-66k',
      permanent: true
    },
    {
      source: '/how-swr-works',
      destination: '/blog/how-swr-works-4lkb',
      permanent: true
    },
    {
      source: '/json-server-glitch',
      destination: '/blog/persistent-rest-api-with-json-server-and-glitch-32kc',
      permanent: true
    },
    {
      source: '/minimal-state-management-react-1',
      destination: '/blog/loading-and-displaying-data-with-hooks-jlj',
      permanent: true
    },
    {
      source: '/minimal-state-management-react-2',
      destination: '/blog/changing-remote-data-with-hooks-565p',
      permanent: true
    },
    {
      source: '/minimal-state-management-react-3',
      destination: '/blog/sharing-remote-data-with-react-context-3859',
      permanent: true
    },
    {
      source: '/minimal-state-management-react-4',
      destination: '/blog/managing-remote-data-with-swr-7cf',
      permanent: true
    },
    {
      source: '/prettier-pre-commit-hook',
      destination: '/blog/configuring-prettier-and-typescript-compiler-as-a-pre-commit-hook-44jh',
      permanent: true
    },
    {
      source: '/react-state-management-2020',
      destination: '/blog/react-state-management-in-2020-3c58',
      permanent: true
    },
    {
      source: '/react-typescript-library-tsdx',
      destination: '/blog/publishing-a-react-hooks-library-using-typescript-and-tsdx-36cg',
      permanent: true
    },
    {
      source: '/readonly-and-errors',
      destination: '/blog/readonly-t-and-better-error-messages-3i9l',
      permanent: true
    },
    {
      source: '/strict-react-context',
      destination: '/blog/why-i-never-use-react-usecontext-4ddf',
      permanent: true
    },
    {
      source: '/testing-opinions',
      destination: '/blog/testing-opinions-3hlh',
      permanent: true
    },
    {
      source: '/use-promise-subscription',
      destination: '/blog/cancelling-a-promise-with-react-useeffect-3062',
      permanent: true
    },
    {
      source: '/when-ts-generics',
      destination: '/blog/a-use-case-for-generics-in-typescript-20j7',
      permanent: true
    }]
  },
}
