---
title: Minimal State Management in React - 1. Loading Data with Hooks
date: '2019-09-14'
type: 'blog-post'
---

**In this series, instead of using a state-management library or proposing a one-size-fits-all solution, we start from the bare minimum and we build up our state management as we need it.**

----

* **In this first article we'll describe how we load and display data with hooks.**
* In the second article we'll learn how to [change remote data with hooks](../minimal-state-management-react-2).
* In the third article we'll see how to [share data between components with React Context](../minimal-state-management-react-3) without using globals, singletons or resorting to state management libraries like MobX or Redux.

----

The final code can be found in this [GitHub repo](https://github.com/JulianG/minimal-state-management-demo). It's TypeScript, but the type annotations are minimal. **Also, please note this is not production code.** In order to focus on state management, many other aspects have not been considered (e.g. [Dependency Invertion](https://en.wikipedia.org/wiki/Dependency_inversion_principle), testing or optimisations).

## Loading Data with Hooks

Let's say we have a REST API with a list of [Commodore 64](https://en.wikipedia.org/wiki/Commodore_64) games. I mean, why not?

**Requirement:** We want to load the list and display the games.

![my favourite commodore 64 games](./game-list.png)

### 1. Basic Fetching

Here's how we retrieve our list of games from the server:

```js
const getGames = () => {
  return fetch('http://localhost:3001/games/').then(response => response.json());
};
```

We can use this in a React app. Our first iteration looks like this:

**App.tsx** (rendered by index.tsx) (*[see repo](https://github.com/JulianG/minimal-state-management-demo/tree/01-basic-fetching-2/src)*)

```tsx
import React from 'react';

const getGames = () => {
  return fetch('http://localhost:3001/games/').then(response => response.json());
};

export const App = () => {
  const [games, setGames] = React.useState([]);

  React.useEffect(() => {
    getGames().then(games => setGames(games));
  }, []);

  return <pre>{JSON.stringify(games, null, 2)}</pre>;
};
```

On the first render of our `App` component, the `games` array will be empty. Then when the promise returned by `getGames` resolves, the `games` array contains all our games, and they will be displayed in a very basic manner.

### 2. Custom React Hook

We can easily extract this to a custom React Hook in a separate file. 

**useGames.ts** (*[see repo](https://github.com/JulianG/minimal-state-management-demo/blob/02-custom-react-hook/src)*)

```js
import React from 'react';

const getGames = () => {
  return fetch('http://localhost:3001/games/').then(response => response.json());
};

export const useGames = () => {
  const [games, setGames] = React.useState([]);

  React.useEffect(() => {
    getGames().then(games => setGames(games));
  }, []);

  return games;
};
```

**App.tsx** (*[see repo](https://github.com/JulianG/minimal-state-management-demo/blob/02-custom-react-hook/src)*)

```tsx
import React from 'react';
import { useGames } from './useGames';

export const App = () => {
  const games = useGames();
  return <pre>{JSON.stringify(games, null, 2)}</pre>;
};
```

### 3. Handling errors and pending state

Our custom hook is not handling pending and error states. There is no visual feedback while the data is loading from the server, and even worse: there's no error message when it fails. **If the server is down, the list of games will remain empty, without errors.**

We can fix this. There are libraries for this, the most popular being [react-async](https://www.npmjs.com/package/react-async); but I don't want to add dependencies just yet. Let's see what's the minimum code needed to handle the  error and pending states.

#### useAsyncFunction

We write a custom hook that takes an async function (which returns a Promise) and a default value.

This hook returns a tuple with 3 elements: `[value, error, isPending]`. It calls the async function once*, and it updates the value when it resolves, unless there's an error, of course.

```ts
function useAsyncFunction<T>(asyncFunction: () => Promise<T>, defaultValue: T) {
  const [state, setState] = React.useState({
    value: defaultValue,
    error: null,
    isPending: true
  });

  React.useEffect(() => {
    asyncFunction()
      .then(value => setState({ value, error: null, isPending: false }))
      .catch(error => setState({ ...state, error: error.toString(), isPending: false }));
  }, [asyncFunction]); // *

  const { value, error, isPending } = state;
  return [value, error, isPending];
}
```

\* *The `useEffect` inside our `useAsyncFunction` will call the async function once and then every time the `asyncFunction` changes. For more details: [Using the State Hook](https://reactjs.org/docs/hooks-state.html), [Using the Effect Hook](https://reactjs.org/docs/hooks-effect.html), [Hooks API Reference](https://reactjs.org/docs/hooks-reference.html).*

Now in useGames.ts we can simply use this new custom hook, passing the `getGames` function and the initial value of an empty array as arguments.

```js
...
export const useGames = () => {
  const games = useAsyncFunction(getGames, []); // 🤔 new array on every render?
  return games;
};
```

There's a small problem, though. We're passing a new empty array every time `useGames` is called, which is every time our `App` component renders. This causes our data to be re-fetched on every render, but each fetch results in a new render so it results in an infinite loop.

We can avoid this by storing the initial value in a constant outside the hook:

```js
...
const emptyList = [];

export const useGames = () => {
  const [games] = useAsyncFunction(getGames, emptyList);
  return games;
};
```

#### Small TypeScript Interlude

**You can skip this section if you're using plain JavaScript.** 

If you're using strict TypeScript (and you should), the above code will not work because of the "noImplicitAny" compiler option. This is because `const emptyList = [];` is implicitly an array of `any`.

We can annotate it like `const emptyList: any[] = [];` and move on. **But we're using TypeScript for a reason.** That explicit `any` can (and should) be more specific. 

What are the elements of this list? **Games!** It's a list of games.

```ts
const emptyList: Game[] = [];
```

Of course, now we **have to** define a `Game` type. But do not despair! We have our JSON response from the server where each game object looks like this:

```json
{
  "id": 5,
  "title": "Kung-Fu Master",
  "year": 1984,
  "genre": "beat'em up",
  "url": "https://en.wikipedia.org/wiki/Kung-Fu_Master_(video_game)",
  "status": "in-progress",
  "img": "http://localhost:3001/img/kung-fu-master.gif"
}
```

We can use [transform.tools](https://transform.tools/json-to-typescript) to convert that to a TypeScript interface (or type).

```ts
type Game = {
  id: number;
  title: string;
  year: number;
  genre: string;
  url: string;
  status: 'not-started' | 'in-progress' | 'finished';
  img: string;
};
```

##### One more thing:

We said `useAsyncFunction` returned a tuple, but TypeScript's inference (@3.6.2) does not understand that. It inferes the return type as `Array<(boolean | Game[] | null)>`.  We can explicitly annotate the return type of the function to be `[T, string | null, boolean]` where `T` is the (generic) type of the `value`, `(string | null)` is the type of the `error` and `boolean` is `isPending`.

```ts
export function useAsyncFunction<T>(
  asyncFunction: () => Promise<T>,
  defaultValue: T
): [T, string | null, boolean] {
  ...
}
```

Now when we use the function, TypeScript suggests the proper types.

```ts
const [games] = useAsyncFunction(getGames, emptyList); // games is of type Game[]
```

End of TypeScript interlude.

#### Composing our custom hooks

**useAsyncFunction.ts** now looks like this:  (*[see repo](https://github.com/JulianG/minimal-state-management-demo/blob/03-handling-error-pending-1/src/useAsyncFunction.ts)*)

```typescript
import React from 'react';

export function useAsyncFunction<T>(
  asyncFunction: () => Promise<T>,
  defaultValue: T
): [T, string | null, boolean] {
  const [state, setState] = React.useState({
    value: defaultValue,
    error: null,
    isPending: true
  });

  React.useEffect(() => {
    asyncFunction()
      .then(value => setState({ value, error: null, isPending: false }))
      .catch(error =>
        setState({ value: defaultValue, error: error.toString(), isPending: false })
      );
  }, [asyncFunction, defaultValue]);

  const { value, error, isPending } = state;
  return [value, error, isPending];
}
```

And we use it in our `useGames` hook:

**useGames.ts** (*[see repo](https://github.com/JulianG/minimal-state-management-demo/blob/03-handling-error-pending-1/src/useGames.ts)*)

```ts
import { useAsyncFunction } from './useAsyncFunction';

const getGames = (): Promise<Game[]> => {
  return fetch('http://localhost:3001/games/').then(response => response.json());
};

type Game = {
  id: number;
  title: string;
  year: number;
  genre: string;
  url: string;
  status: 'not-started' | 'in-progress' | 'finished';
  img: string;
};

const emptyList: Game[] = [];

export const useGames = () => {
  const [games] = useAsyncFunction(getGames, emptyList);
  return games;
};
```

#### Changing UI to display errors and pending states

Great! But we're stil not handling the error and pending states. We need to change our `App` component:

```tsx
import React from 'react';
import { useGames } from './useGames';

export const App = () => {
  const { games, error, isPending } = useGames();

  return (
    <>
      {error && <pre>ERROR! {error}...</pre>}
      {isPending && <pre>LOADING...</pre>}
      <pre>{JSON.stringify(games, null, 2)}</pre>
    </>
  );
};
```

And our `useGames` hook should return an object with three keys: `games`, `error`, `isPending`.

```ts
export const useGames = () => {
  const [games, error, isPending] = useAsyncFunction(getGames, emptyList);
  return { games, error, isPending };
};
```

We're also improving our `getGames` function to handle HTTP status codes different from 200 as errors:

```ts
const getGames = (): Promise<Game[]> => {
  return fetch('http://localhost:3001/games/').then(response => {
    if (response.status !== 200) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    return response.json();
  });
};
```

Our code so far looks like this: (*[see repo](https://github.com/JulianG/minimal-state-management-demo/tree/03-handling-error-pending-2/src)*).

## Conclusion

We've seen how to load data from a REST API using React hooks.

In the next post we'll see how to change remote data using an HTTP `PATCH` request, and how to update our client-side data when the request is successful.

## Resources

Further reading:

* [Using the State Hook](https://reactjs.org/docs/hooks-state.html)
* [Using the Effect Hook](https://reactjs.org/docs/hooks-effect.html)
* [Hooks API Reference](https://reactjs.org/docs/hooks-reference.html)
* [When to useMemo and useCallback](https://kentcdodds.com/blog/usememo-and-usecallback/)
* [Cancelling a Promise with React.useEffect](https://juliangaramendy.dev/use-promise-subscription/)