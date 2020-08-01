---
title: React State Management in 2020
date: '2020-08-01'
type: 'blog-post'
credits: [
  "Photo by [Oshin Khandelwal](https://unsplash.com/@thebloomintale?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText)"
]
ogimage: './pots.jpeg'
---

Every now and then I see a tweet poll asking what we do for state management in React. In many cases  the options are constrained to Redux, MobX and more recently React Context + Hooks.

Of course the only correct answer is **it depends**.

![pots](./pots.jpeg)

But here's what I do for medium-sized [CRUD](https://en.wikipedia.org/wiki/Create%2C_read%2C_update_and_delete)-like single-page React applications.

 - I don't use any state-management library. (no Redux, no MobX, no Recoil).
 - I try to manage most of the application state with routes. This means having different URLs for different parts of the application, even if it's a single-page application. I use React Router for this.
 - **I differentiate between application/UI state and remote data cache.** and use [SWR](https://swr.vercel.app/) or [React Query](https://react-query.tanstack.com/) to keep a cache of remote data.
 - The rest tends to be small UI state "details" such as which modal popup is open, or the state of a form before submitting it. For this, I prefer to use `useState` or `useReducer` hooks, keeping state close to where it's used.

### Application state in the URL

The application state must be kept **somewhere**. I can keep it hidden away in memory or I can expose it in the URL, so our users (and developers) can benefit from it.
 - **Better UX**: users can bookmark and share links and search results with others
 - **Better DX**: developers don't need to click around to get the app to a certain state every time they refresh the browser.
 - **Better documentation**: Help pages can point the user to the exact part of the application they describe.

**I try to keep most of the application state in the URL, and I use React Router to handle the routes.**

### Remote Data is not state: it belongs in a cache

**I cannot stress this enough.** Fortunately other people can explain this better than me:

> UI state should be separate from the server cache (often called "state" as well), and when you do that, you don't need anything more than React for state management.
> [Kent C. Dodds](https://twitter.com/kentcdodds/status/1198616792177889280)


Here's an excellent article: [Why You Should Be Storing Remote Data in a Cache (and Not in State)](https://medium.com/better-programming/why-you-should-be-separating-your-server-cache-from-your-ui-state-1585a9ae8336) by Jason Ankers.

 > "Remote data is read-only. It doesn’t belong in the same location as our UI state."

In [CRUD](https://en.wikipedia.org/wiki/Create%2C_read%2C_update_and_delete)-like web applications, where the server is authoritative, I don't want the client-side copy of the data to become stale.

Considering all this, in most cases I don't need to customise the way remote data is fetched and stored. I can delegate all that to a library like [SWR](https://swr.vercel.app/) or [React Query](https://react-query.tanstack.com/). 

These libraries store the fetched data in a static cache; and there’s no need to resort to React Context to "share" the data with other components because all components consuming the same data are automatically rerendered when the cache changes.

At work, earlier this year we refactored one of our SPAs to use SWR and the result was a much simpler application logic. In addition, we now benefit from all the nice features that come with SWR such as “focus revalidation” and “refetch on interval”. The app has been up and running for months and we haven't experienced any issues.

### Local UI state should be co-located

Almost everything that isn't caught by the above cases is local UI state such as the visibility of modal dialogs or the fields in a form before it's submitted.

For these cases I prefer to keep the state [close to where it's used]((https://kentcdodds.com/blog/colocation)). I usually find myself using `useState` and occasionally `useReducer`.


### References:

 - [SWR](https://swr.vercel.app/) by Vercel.
 - [React Query](https://react-query.tanstack.com/) by Tanner Linsley. 
 - [Why You Should Be Storing Remote Data in a Cache (and Not in State)](https://medium.com/better-programming/why-you-should-be-separating-your-server-cache-from-your-ui-state-1585a9ae8336) by Jason Ankers.
 - [State Management with React](https://kentcdodds.com/blog/application-state-management-with-react) by Kent C. Dodds.
 - [Lifting State Up](https://reactjs.org/docs/lifting-state-up.html). React Blog.
 - [Colocation](https://kentcdodds.com/blog/colocation) by Kent C. Dodds.
