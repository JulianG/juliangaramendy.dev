---
title: Cancelling a Promise with React.useEffect
date: '2019-04-07'
updated: '2019-04-27'
type: 'blog-post'
credits: [
  "Photo by [Alex](https://unsplash.com/photos/ZR48YvUpk04?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com)"
]
---

![Origami](./alex-581041-unsplash.jpg)

I've seen it done in complicated ways so I have to write this down.

## Quick Example

```js{1,3,5}
function BananaComponent() {

  const [bananas, setBananas] = React.useState([])
  
  React.useEffect(() => {
    let isSubscribed = true
    fetchBananas().then( bananas => {
      if (isSubscribed) {
        setBananas(bananas)
      }
    })
    return () => isSubscribed = false
  }, []);

  return (
    <ul>
    {bananas.map(banana => <li>{banana}</li>)}
    </ul>
  )
}
```

In the code above, the `fetchBananas` function returns a promise. We can "cancel" the promise by having a conditional in the scope of `useEffect`, preventing the app from setting state after the component has unmounted.

You can see an [example in codesandbox](https://codesandbox.io/s/pkk3xjn00m).

## Long Explanation

Imagine we have a REST API endpoint that gives us a list of bananas. We can get the list by [using fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) which returns a promise. We wrap the call in a nice async function which naturally returns a promise.

```js
async function fetchBananas() {

  return fetch('/api/bananas/')
    .then(res => {
      if (res.status >= 400) {
        throw new Error("Bad response from server")
      }
    })
    .then(res => {
      return res.data
    })

}
```
<br/>

Now we want to render some bananas in a React function component. In a traditional class component we would make the async call in `componentWillMount` or `componentDidMount`, but with function components we need to use the [`useEffect`](https://reactjs.org/docs/hooks-effect.html) hook.

> Mutations, subscriptions, timers, logging, and other side effects are not allowed inside the main body of a function component (referred to as React’s render phase). Doing so will lead to confusing bugs and inconsistencies in the UI. ([reacjs docs](https://reactjs.org/docs/hooks-reference.html#useeffect))

Our `BananaComponent` would look like this:

```js
function BananaComponent() {

  const [bananas, setBananas] = React.useState([])
  
  React.useEffect(() => {
    fetchBananas().then(setBananas)
  }, []);

  return (
    <ul>
    {bananas.map(banana => <li>{banana}</li>)}
    </ul>
  )
}
```

With `useState([])` we define an initial value of for `bananas` so we can render an empty list while the promise is pending. The `useEffect` function takes two arguments: the first one is the effect function, and the second is the "dependencies" or "inputs". Our effect function "subscribes" to the promise. For our second argument we pass an empty array so that the effect only runs once. Then, when the data is retrieved, the promise resolves, and our `useEffect` calls `setBananas`, which causes our function component to re-render, this time with some bananas in the array.

## Wait! Is that it?

**Unfortunately not.** Our component "subscribes" to the promise, but it never "unsubscribes" or cancels the request. If for any reason, our component is unmounted before the promise resolves, our code will try to "set state" (calling `setBananas`) on an unmounted component. This will throw a warning:

```log
Warning: Can't perform a React state update on an unmounted component.
This is a no-op, but it indicates a memory leak in your application.
To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
```

We can fix this by cancelling our request when the component unmounts. In function components, this is done [in the cleanup function of `useEffect`](https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup).

```js
  ...

  React.useEffect(() => {
    fetchBananas().then(setBananas)
    return () => someHowCancelFetchBananas! <<<<<<
  }, []);

  ...

```
<br/>

**But we can't cancel a promise**. What we can do is prevent our code from setting state if the component has been unmounted.

In the past there was `isMounted`, but as it turns out, [it's an anti-pattern](https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html). With class components we could get away with implementing our own `this._isMounted`; but in function components there are no instance variables.

I've seen some implementations using `useRef` to keep a `mountedRef`.  
**But there's an easier way.**

Taking advantage of [closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) we can keep an `isSubscribed` boolean inside `useEffect`.

```js
function BananaComponent() {

  const [bananas, setBananas] = React.useState([])
  
  React.useEffect(() => {
    let isSubscribed = true
    fetchBananas().then( bananas => {
      if (isSubscribed) {
        setBananas(bananas)
      }
    })
    return () => isSubscribed = false
  }, []);

  ...

```

We start with `isSubscribed` set to `true`, then we add a conditional before calling `setBananas` and finally, we set `isSubscribed` to `false` in the cleanup function.

## Is that it?

**YES**; that's all we need.

We can improve the above code by handling the promise being pending, and when it's rejected.

```js
function BananaComponent() {

  const [bananas, setBananas] = React.useState(undefined);
  const [error, setError] = React.useState('');
  
  React.useEffect(() => {
    let isSubscribed = true;
    fetchBananas()
      .then(bananas => (isSubscribed ? setBananas(bananas) : null))
      .catch(error => (isSubscribed ? setError(error.toString()) : null));

    return () => (isSubscribed = false);
  }, []);

  render (
    <ul>
    {!error && !bananas && <li className="loading">loading...</li>)}
    {!error && bananas && bananas.map(banana => <li>{banana}</li>)}
    {error && <li className="error">{error}</li>}
    </ul>
  )
}
```
<br/>

## Or even better...

We can create a **custom hook** where we return a tuple like `[value, error, isPending]`.

In the implementation below, the consumer doesn't need to keep its own state, and the 'pending' state is explicit.

```js
export function usePromise(promiseOrFunction, defaultValue) {
  const [state, setState] = React.useState({ value: defaultValue, error: null, isPending: true })

  React.useEffect(() => {
    const promise = (typeof promiseOrFunction === 'function')
      ? promiseOrFunction()
      : promiseOrFunction

    let isSubscribed = true
    promise
      .then(value => isSubscribed ? setState({ value, error: null, isPending: false }) : null)
      .catch(error => isSubscribed ? setState({ value: defaultValue, error: error, isPending: false }) : null)

    return () => (isSubscribed = false)
  }, [promiseOrFunction, defaultValue])

  const { value, error, isPending } = state
  return [value, error, isPending]
}
```

Usage:

```js
function BananaComponent() {

  const [bananas, error, pending] = usePromise(fetchBananas, [], [])

  render (
    <ul>
    {pending && <li className="loading">loading...</li>)}
    {!pending && !error && bananas.map(banana => <li>{banana}</li>)}
    {error && <li className="error">{error}</li>}
    </ul>
  )
}
```
<br/>

## Why not make it a npm package then?

In the end I made a repo for my custom hooks, starting with this one, and I published it as an npm package: [npm](https://www.npmjs.com/package/bananahooks), [github](https://github.com/JulianG/hooks), [codesandbox example](https://codesandbox.io/s/pkk3xjn00m).

I hope this is useful.

## Questions? Comments?

I would love to hear your thoughts. 

* Can you see anything wrong with this approach?
* Is this better than what you were doing before? 
* Is it worse?