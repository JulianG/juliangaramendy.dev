---
title: React + TypeScript Monorepo Demo
date: '2019-08-01'
type: 'blog-post'
credits: [
  'Photo by [Matt Briney](https://unsplash.com/@mbriney) on [Unsplash](https://unsplash.com/search/photos/apothecary)'
]
---

![Photo by Matt Briney on Unsplash](./apothecary.jpg)

At work we have a project spanning across 4 repositories: 3 React apps + 1 TS library (used by the 3 react apps).

**We're considering moving those to a monorepo as we think it will simplify the developer workflow and the release process.**

However, the project has a nice way to run any of the 3 apps in **watch mode** (using [Webpack DevServer](https://webpack.js.org/configuration/dev-server/) and [yarn link](https://yarnpkg.com/lang/en/docs/cli/link/)) and make it reload when changes are made to either the app or to the library. **We don't want to lose that functionality.**

I failed to find an article explaining how to do this with all our requirements so I made a [demo repository](https://github.com/JulianG/monorepo-demo) and I wrote this article. 

Here are the steps:

1. Plan the monorepo
2. Create a new repo and package for the monorepo
3. Create the "app" package
4. Create the "math-functions" package
5. Configure dependencies
6. Configure watch
7. Watch all the things!

## Step 1. Plan the monorepo

My monorepo structure will be like this:

```yaml
root
  - packages
    - app
      - src
      - package.json
      - tsconfig.json
    - math-functions
      - src
      - package.json
      - tsconfig.json
  - package.json
  - yarn.lock
```

There are two packages: "app" and "math-functions". The first one will have a dependency on the second one.

## Step 2. Create a new repo and package for the monorepo

I'm calling my root package **typescript-monorepo-demo**:

```log
> mkdir typescript-monorepo-demo
> cd typescript-monorepo-demo
> git init
> npm init
... (accept default options)

```

The npm init command generates a default **package.json** file which looks like this:

```json
{
  "name": "typescript-monorepo-demo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}
```

I remove the `"main"` and` "test"` keys, and I add  `"private"` and `"workspaces"` keys:

```diff
{
  "name": "typescript-monorepo-demo",
  "version": "1.0.0",
  "description": "",
+ "private": true,
+ "workspaces": [
+   "packages/*"
+ ],
- "main": "index.js",
  "scripts": {
-   "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "JulianG",
  "license": "ISC"
}
```

I add a **.gitignore**:

```
node_modules
dist
```

## Step 3. Create the "app" package

I create a TypeScript React app using **create-react-app**:

```
> mkdir packages
> cd packages
> npx create-react-app app --typescript

```

## Step 4. Create the "math-functions" package

This is just an example. The functionality I'm extracting to a separate package is just a `sum()` function:

```ts
export const sum = (a: number, b: number) => {
  return a + b;
};
```

Starting from the **packages** directory, I create one for the new package:

```
> mkdir math-functions
> cd math-functions
```

I add a **.gitignore** file:

```
.DS_Store
node_modules
dist
```

and a **package.json**:

```json
{
  "name": "math-functions",
  "version": "0.1.0",
  "main": "./dist/index.js",
  "typings": "./dist/index.d.ts",
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "watch": "tsc -p tsconfig.json --watch"
  },
  "devDependencies": {
    "typescript": "^3.5.3"
  },
  "license": "ISC"
}
```

also a **tsconfig.json**

```json
{
  "compilerOptions": {
    "declaration": true,
    "sourceMap": true,
    "outDir": "dist",
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": false,
    "esModuleInterop": true,
    "strict": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "jsx": "preserve"
  },
  "include": [
    "src"
  ]
}
```

You can also boostrap this package with [tsdx](https://www.npmjs.com/package/tsdx).

Then the basic functionality will be in a **src** directory. These are the contents of **src/index.ts**:

```ts
export const sum = (a: number, b: number) => {
  return a + b;
};
```

I manually build the package once, to allow importing it later:

```
> yarn build
```



## Step 5. Configure dependencies

In the React app, I manually add a dependency to the "math-functions" package. That is, in **/packages/app/package.json**:

```json
"dependencies" {
  ...
  "math-functions": "0.1.0" 
  ...
}
```

Edit **/packages/app/src/App.tsx** to use the `sum` function from the our "math-functions" package.

```ts
import React from 'react';
import logo from './logo.svg';
import './App.css';

import { sum } from 'math-functions'

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>2 + 2 = {sum(2,2)}</p>
      </header>
    </div>
  );
}

export default App;
```



## Step 6. Configure watch

I was trying to avoid using [Lerna](https://lerna.js.org/) for as much as I could in favour of the basic functionality of [yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/), but I could not find any other way to concurrently run watchers on multiple projects.  
With Lerna I can add a script like so: `lerna run --parallel watch`.

I add a "watch" script in **/packages/app/package.json** which is identical to the existing identical to "start" script.

```json
"scripts": {
  "start": "react-scripts start",
  "watch": "react-scripts start",
  ...
},
```

I add a **lerna.json** to the root.

```json
{
  "packages": [
    "packages/*"
  ],
  "version": "0.0.0"
}
```

I install lerna on the root package:

```
> yarn add -D lerna --ignore-workspace-root-check
```

In the root **package.json**, I add a script to run "watch" in all packages in parallel using lerna.

```json
...
"scripts": {
  "watch": "lerna run --parallel watch"
}
...
```



## Step 7. Watch all the things!

Now we can run:

```
yarn watch
```

and changes to either the React "app" or the "math-functions" package will result in a hot-reload.



## Resources:

The demo repository is: [https://github.com/JulianG/monorepo-demo](https://github.com/JulianG/monorepo-demo)

Here are some articles I read while creating it:

- [Setting up a monorepo with Lerna for a TypeScript project](https://blog.logrocket.com/setting-up-a-monorepo-with-lerna-for-a-typescript-project-b6a81fe8e4f8/) (Sept 2018)
- [Typescript: Working with Paths, Packages and Yarn Workspaces](https://medium.com/@rossbulat/typescript-working-with-paths-packages-and-yarn-workspaces-6fbc7087b325) (June 2019)
- [How to setup a Yarn workspace with Typescript](https://www.youtube.com/watch?v=EoqzOEZIzhg) (video)

Yarn & Lerna documentation:

- [Yarn Workspaces](https://yarnpkg.com/lang/en/docs/workspaces/)
- [Lerna documentation](https://github.com/lerna/lerna/tree/master/commands/run#readme)

