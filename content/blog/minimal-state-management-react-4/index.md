---
title: Minimal State Management in React - 4. Managing Remote Data with SWR
date: '2020-02-26'
type: 'blog-post'
---

**In this series, instead of using a state-management library or proposing a one-size-fits-all solution, we start from the bare minimum and we build up our state management as we need it.**

----

* In the first article we described how we [load and display data with hooks](../minimal-state-management-react-1).  
* In the second article we learned how to [change remote data with hooks](../minimal-state-management-react-2).
* In the third article we learned how to [share data between components with React Context](../minimal-state-management-react-3) without using globals, singletons or resorting to state management libraries like MobX or Redux.
* **In this fourth article we'll see how to share data between components using [SWR](https://swr.now.sh/).**

In the previous articles we were storing the loaded data within React, in a `useState` hook. But since then SWR was released (Oct 2019).

I first learned about SWR thanks to a video tutorial by Leigh Halliday: "[React Data Fetching with Hooks using SWR](https://youtu.be/oWVW8IqpQ-A)", and I thought it was interesting enough that I could try it on a small internal project at work.

But a few weeks later [a Twitter thread](https://twitter.com/giuseppegurgone/status/1200381565773262851) took me to [this article](https://medium.com/better-programming/why-you-should-be-separating-your-server-cache-from-your-ui-state-1585a9ae8336); something clicked in my head and I realised I wasn't just looking for an excuse to try SWR. 

**No. I had been doing state management wrong all along!**

![The Scream, by Edvard Munch - National Gallery of Norway](./scream.jpg)

I was storing my remotely fetched data in `useReducer` or `useState` and manually mutating (or via a reducer), and then **maybe reloading** from the server in some cases, but not in others. And I was using React Context to make the data available to unrelated components in my app.

**SWR makes this easier and better.**

SWR stores the fetched data in a static cache. Therefore there's no need to use React Context to share the data with other components. And all components fetching the same data are updated when the data changes.

I refactored my SPA to use SWR and that resulted in a much simpler application logic. In addition, we now benefit from all the nice features that come with SWR such as "focus revalidation" and "refetch on interval".

**Let's refactor our example from the previous three articles to use SWR.**

## Before SWR

Our demo app before SWR is what we got after our [third article](../minimal-state-management-react-3). (*[see repo](https://github.com/JulianG/minimal-state-management-demo/blob/12-before-swr/src)*)

## Install SWR

```bash
yarn add swr
```

## Refactoring our custom hook

In our demo app we have a custom `useFetchedGames` hook that loads the games using the `useAsyncFunction` hook, and then stores them using `useState` to provida a way to locally mutate the data.

```ts
const useFetchedGames = () => {
  const [fetchedGames, error, isPending] = useAsyncFunction(getGames, emptyList);

  const [games, setGames] = React.useState(emptyList);
  React.useEffect(() => {
    setGames(fetchedGames);
  }, [fetchedGames]);

  return { games, setGames, error, isPending };
};
```

The problem with this approach is:

1. The list of games is stored twice: first in a `useState` hook inside `useAsyncFunction`, and then in a new `useState` hook.
2. If the list of games is updated on the server, we never reload it. Here's where SWR shines.

We're going to refactor `useFetchedGames` to use SWR instead of `useState`.

```ts
const useFetchedGames = () => {
  const { data, error, mutate } = useSWR('getGames', getGames); 

  const games = data || []
  const isPending = !data
  const setGames = mutate

  return { games, setGames, error, isPending };
};
```

The full diff can be found in [this git commit](https://github.com/JulianG/minimal-state-management-demo/commit/4b2f4c5a6ff01b6618e653fe0eb637bcda81cf1c).

Note the `"getGames"` string literal, just before the `getGames` function. This is a **key** to help SWR identify our request. In our case it can be anything as long as it is unique for this resource (the list of games). There's a even simpler way. You can [find it in the docs](https://swr.now.sh/#basic-data-loading).

## Removing React Context

Now that we're using `useSWR` we don't need a React context, its provider, nor the `useContext` hook.

In the demo project we make our components consume the `useGames` hook directly, instead of the `useGamesContext` one.

For example, **GameGrid.tsx**:

```diff
- import { useGamesContext } from '../GamesContext';
+ import { useGames } from '../useGames';

  export const GameGrid = () => {
-   const { games, error, isPending, markAsFinished } = useGamesContext();
+   const { games, error, isPending, markAsFinished } = useGames();

    return (
      <div className="gamegrid">
```

You can see the complete diff in [this git commit](https://github.com/JulianG/minimal-state-management-demo/commit/9a7e8eb52d6482858655dc3195ef05f9f4daf5a7).

## Conclusion

With this small refactoring, our app has less code to maintain and we benefit from other great SWR features:

* Revalidate on focus.
* Revalidate on interval. (optional)
* Revalidate on reconnect.
* Retry on error.

I think Zeit's [SWR](https://swr.now.sh/) (or a similar library) is a much better solution than storing fetched data in a React component using `useState` or `useReducer`.

I continue to store my application's UI state using custom hooks that use `useReducer` and `useState` but for remote data, I prefer to store it in a cache.

Please let me know what you think in the comments below.