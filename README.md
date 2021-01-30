# JulianGaramendy.dev

This is the source code for my personal site and blog.

- Pages like "Info" and "Work" are markdown files in the codebase and statically generated.
- Blog posts are fetched from Dev.to and statically regenerated after each request using NextJS's [Incremental Static Regeneration](https://nextjs.org/docs/basic-features/data-fetching#incremental-static-regeneration). [Here's how](https://juliangaramendy.dev/blog/devto-nextjs-blog).

### TODO:

- clean up code
- write long-overdue tests
- display collections? ❌

### Done:

- Favicon ✅
- open graph / social_image ✅
- fix slugs, using list of blog posts? use canonical_url ✅
- cannot have images taken from jg.dev ✅
- CSS for pre without specific language? or find what lang to use ✅
- credit icon artists! ✅
- deploy on Vercel ✅
- change DNS settings ✅
- link to prev nad next blog posts? ✅
- use next/link ✅
- remove gatsby service worker ✅
- openGraphImage ✅
- NextJS Image Component ✅
- bundle analizer ✅
- Fix flaky build ✅
- update to TS 4.1 so we can use --noUncheckedIndexedAccess ✅
- cover_images have predictable height ✅

# NextJS Typescript Boilerplate

Bootstrap a developer-friendly NextJS app configured with:

- [Typescript](https://www.typescriptlang.org/)
- Linting with [ESLint](https://eslint.org/)
- Formatting with [Prettier](https://prettier.io/)
- Linting, typechecking and formatting on by default using [`husky`](https://github.com/typicode/husky) for commit hooks
- Testing with [Jest](https://jestjs.io/) and [`react-testing-library`](https://testing-library.com/docs/react-testing-library/intro)

## Deploy your own

Deploy the example using [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/vercel/next.js/tree/canary/examples/with-typescript-eslint-jest)

## How to use

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example with-typescript-eslint-jest with-typescript-eslint-jest-app
# or
yarn create next-app --example with-typescript-eslint-jest with-typescript-eslint-jest-app
```

Deploy it to the cloud with [Vercel](https://vercel.com/import?filter=next.js&utm_source=github&utm_medium=readme&utm_campaign=next-example) ([Documentation](https://nextjs.org/docs/deployment)).
