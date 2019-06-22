---
title: Configuring Prettier and TypeScript Compiler as a Pre-commit Hook
date: '2019-06-21'
type: 'blog-post'
credits: [
  "Photo by [Simon Wilkes](https://unsplash.com/@simonfromengland) on [Unsplash](https://unsplash.com/search/photos/stream)"
]
---

![stream](./simon-wilkes-691856-unsplash.jpg)

We can easily improve our developer experience by:
* Preventing broken code being committed/pushed.
* Avoiding pointless arguments about formatting in our code reviews.

We decided to use [git pre-commit hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) to help prevent "broken" commits.

We've started from an existing TypeScript project, but here's a [demo repository](https://github.com/JulianG/precommit-hooks-demo) if you want to have a look.

## 1. Install [prettier](https://www.npmjs.com/package/prettier), [husky](https://www.npmjs.com/package/husky) and [lint-staged](https://www.npmjs.com/package/lint-staged)

```js
yarn add -D prettier husky lint-staged
```
None of these are required at run time so it's important to use `-D`, so that the dependencies are added to "devDependencies".

## 2. Configure prettier 

We need to create two files: 
### .prettierrc:

```js
{
  "printWidth": 120,
  "proseWrap": "preserve",
  "semi": false,
  "singleQuote": true,
  "useTabs": false,
  "tabWidth": 2,
  "arrowParens": "avoid",
  "trailingComma": "es5"
}
```

### .prettierignore:

```js
node_modules
build
dist
res
coverage
```
You can of course configure this in [any way you like](https://prettier.io/docs/en/configuration.html).

## 3. Create a lint-staged config file: .lintstagedrc:

```js
{
  "**/*.+(js|jsx|css|less|scss|ts|tsx|md)": [
    "prettier --write",
    "git add"
  ]
}
```
This is configured to run pretier and overwrite any **staged files** that match the pattern above, and then staging the new changes (if any). 

## 4. Create a husky config file: .huskyrc:

```js
{
  "hooks": {
    "pre-commit": "tsc && lint-staged"
  }
}
```

This is configuring the pre-commit hook. It will run **`tsc`** and then **`lint-staged`** using the configuration files discussed above.

## 5. Success!

Now every time I try to commit, the pre-commit hook will run.
If, for some reason, I my code doesn't compile, I'll get an error and a chance to fix it before committing.
And I don't have to worry about code formatting because **`prettier`** will format any staged files before committing.

## Demo Repository

I've setup a very basic [repository](https://github.com/JulianG/precommit-hooks-demo) on GitHub as a demo.