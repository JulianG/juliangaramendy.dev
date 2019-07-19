---
title: Catching bugs with stricter TypeScript
date: '2019-07-19'
type: 'blog-post'
credits: [
  'Photo by [Pete Hardie](https://unsplash.com/@pjhardie) on [Unsplash](https://unsplash.com/photos/Peyb6JQPGNU)'
]
---

![Photo by Pete Hardie on Unsplash](./fence.jpg)

We recently enabled `"noImplicitAny"` in a relatively old TypeScript project. It resulted in 269 new errors. Most of those were missing type annotations but in a few cases, we found problems with the code. These had been around for months and were not caught by our test suite.

### TL;DR;

We should prefer strict TypeScript configurations to catch issues, not just at compile-time, but (with a good IDE) **as we type**.

We should try to keep up-to-date with TypeScript versions to benefit from the ever-improving error messages; saving development time.

## The case of the message id

We had an object specifying one message for each key. This was working before "noImplicitAny", but now we get an error:

```ts
  const id = getMessageIdFromSomeObscureLogic();

  const messages = {
    success: "Everything is awesome!",
    warning: "Something is not entirely correct.",
    error: "An error was found. We can' go on.",
    bananas: "Do you like bananas?",
    example: "I'm running out of ideas for examples.",
    typescript: "Something to do with TypeScript",
    javascript: "Something to do with JavaScript"
  };
  const message = messages[id]; // ERROR! (see below)
}
```
The TS error reads:
<pre class="txt">
Element implicitly has an 'any' type because type '{ success: string; warning: string; error: string; example: string; typescript: string; javascrip...' has no index signature.
</pre>

The problem here is that the keys of the `messages` object must be either 'success' or 'warning' or 'error' or 'example', etc. It can't just be "any string". 

We can fix this in a few ways:

### Index signature "fix"

The error message mentions "index signature". We can explicitly expand the type declaration to accept any strings as keys, like this:

```ts
const messages: {[index: string]: string} = {
  success: "Everything is awesome!",
  warning: "Something is not entirely correct.",
  error: "An error was found. We can' go on.",
  bananas: "Do you like bananas?",
  example: "I'm running out of ideas for examples.",
  typescript: "Something to do with TypeScript",
  javascript: "Something to do with JavaScript"
};

const message = messages[id]; // no error
```

### Type-casting "fix"

We can turn the "implicit any" into an "explicit any" like this:

```ts
const message = (messages as any)[id]; // no error
```

That gets rid of the error, but the inferred type of `message` is `any`.

There's another way:

```ts
const message = (messages)[id as keyof typeof messages]; // no error
```

Now the inferred type of `message` is `string`. Much better, but only because we're telling TypeScript "trust me, this is a valid key".

**But... Are we sure it is valid?**

### The proper fix

We looked at the type of our `id`, and it wasn't `string` at all.

Remember that it was being obtained from some obscure logic.

```ts
  const id = getMessageIdFromSomeObscureLogic();
```

It turned out that the type of `id` was being inferred to a union type like this: `'success' | 'warning' | 'error' | 'example' | 'banana' | 'typescript' | 'javascript'`

So this was already strongly typed. Why are we getting an error?

It turns the `messages` object was missing the `banana` key.

**This was a bug!** Caught by making the TypeScript configuration a little bit stricter.

### Conclusion

Increasing the "strictness" of our TypeScript configuration can help us catch issues at compile time which otherwise would have happened live or (if we're lucky) in our tests.

Also, updating our TypeScript version can help a lot. For instance, the initial error we got with TypeScript 3.3 was:

<pre class="txt">
Element implicitly has an 'any' type because type '{ success: string; warning: string; error: string; example: string; typescript: string; javascrip...' has no index signature.
</pre>

But with TypeScript 3.5 it's a lot more helpful, especially the second paragraph where it mentions the `'banana'` property we were missing:

<pre class="txt">
Element implicitly has an 'any' type because expression of type '"success" | "warning" | "error" | "example" | "typescript" | "javascript" | "banana"' can't be used to index type '{ success: string; warning: string; error: string; example: string; typescript: string; javascript: string; }'.

Property 'banana' does not exist on type '{ success: string; warning: string; error: string; example: string; typescript: string; javascript: string; }'.
</pre>

That would have saved us quite some time.
