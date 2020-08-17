---
title: Why I never use React.useContext
date: '2020-08-13'
type: 'blog-post'
---

Instead of using `React.createContext` directly, we can use a utility function to ensure the consuming component is rendered within the correct Context Provider.

```ts
// JavaScript:
const [BananaProvider, useBanana] = createStrictContext()

// TypeScript:
const [BananaProvider, useBanana] = createStrictContext<Banana>()
```

Scroll down for the code, or find it in this [gist](https://gist.github.com/JulianG/9aa3e0d299e0eb35637cd9d69540d4f9).

## The Problem

We would normally create a React Context like this:

```ts
const BananaContext = React.createContext()

// ... later ...

const banana = React.useContext(BananaContext) // banana may be undefined
```

Our `banana` will be `undefined` if our component doesn't have a `BananaContext.Provider` up in the tree.

This has some drawbacks:

- Our component needs to check for `undefined`, or risk a run-time error at some point.
- If `banana` is some data we need to render, we now need to render **something else** when it's `undefined`.
- Basically, we cannot consider our `banana` an invariant within our component.

## Adding a custom hook

I learned this from a [blog post by Kent C. Dodds](https://kentcdodds.com/blog/how-to-use-react-context-effectively).

We can create a custom `useBanana` hook that asserts that the context is not undefined:

```ts
export function useBanana() {
  const context = React.useContext(BananaContext)
  if(context === undefined) {
    throw new Error('The useBanana hook must be used within a BananaContext.Provider')
  return context
}
```

If we use this, and never directly consume the `BananaContext` with `useContext(BananaContext)`, we can ensure `banana` isn't `undefined`, because if it was, we would throw with the error message above.

We can make this even "safer" by never exporting the `BananaContext`. Exporting only its provider, like this:

```ts
export const BananaProvider = BananaContext.Provider
```

## A generic solution

I used the previous approach for several months; writing a custom hook for each context in my app.

Until one day, I was looking through the source code of [Chakra UI](https://github.com/chakra-ui/chakra-ui/), and they have a [utility function](https://github.com/chakra-ui/chakra-ui/blob/c0f9c287df0397e2aa9bd90eb3d5c2f2c08aa0b1/packages/utils/src/react-helpers.ts#L27) that is much better.

This is my version of it:

```js
import React from 'react'

export function createStrictContext(options = {}) {
  const Context = React.createContext(undefined)
  Context.displayName = options.name // for DevTools

  function useContext() {
    const context = React.useContext(Context)
    if (context === undefined) {
      throw new Error(
        options.errorMessage || `${name || ''} Context Provider is missing`
      )
    }
    return context
  }

  return [Context.Provider, useContext]
}
```

This function returns a tuple with a provider and a custom hook. It's impossible to leak the Context, and therefore impossible to consume it directly, skipping the assertion.

We use it like this:

```ts
const [BananaProvider, useBanana] = createStrictContext()
```

Here's the TypeScript version:

```ts
import React from 'react'

export function createStrictContext<T>(
  options: {
    errorMessage?: string
    name?: string
  } = {}
) {
  const Context = React.createContext<T | undefined>(undefined)
  Context.displayName = options.name // for DevTools

  function useContext() {
    const context = React.useContext(Context)
    if (context === undefined) {
      throw new Error(
        options.errorMessage || `${name || ''} Context Provider is missing`
      )
    }
    return context
  }

  return [Context.Provider, useContext] as [React.Provider<T>, () => T]
}
```

We use it like this:

```ts
const [BananaProvider, useBanana] = createStrictContext<Banana>()
```

## Conclusion

We can make errors appear earlier (unfortunately still at runtime) when we render a component outside the required Context Provider by using a custom hook that throws when the context is undefined.

Instead of using React.createContext directly, we use a utility function to create providers and hooks automatically for all the contexts in our app.


### Comments?

- Do you use a similar "pattern"? No? Why not?
- In which cases would you NOT use something like this? 

----

### References:

- [How to use React Context effectively](https://kentcdodds.com/blog/how-to-use-react-context-effectively) by Kent C. Dodds
- [Original utility function](https://github.com/chakra-ui/chakra-ui/blob/c0f9c287df0397e2aa9bd90eb3d5c2f2c08aa0b1/packages/utils/src/react-helpers.ts#L27) in the Chakra UI repo.
- [Gist with both JS and TS versions of the function](https://gist.github.com/JulianG/9aa3e0d299e0eb35637cd9d69540d4f9)
- [React Context Documentation](https://reactjs.org/docs/context.html#reactcreatecontext)
