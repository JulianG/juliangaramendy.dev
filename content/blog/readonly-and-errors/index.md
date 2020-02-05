---
title: Readonly<T> and Better Error Messages
date: '2020-02-05'
type: 'blog-post'
credits: [
  "Photo by [v2osk](https://unsplash.com/@v2osk) on [Unsplash](https://unsplash.com/s/photos/dolomites)"
]
---

![The Dolomites, Italy](https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2110&q=80)

A few weeks ago I learned something about TypeScript errors and utility types.

**The following is true in TypeScript v3.7.5.** In my experience, error messages in TS improve a lot with each release, so this may soon be irrelevant.

Like it's usual, here's an example with **bananas**.

I had this `Banana` type:

```ts
type Banana = {
  id: number;
  name: string;
  color: number;
  weight?: number;
  length?: number;
  thumbnail?: string;
  pictures?: Array<string>;
};
```

I was trying to be clever and I thought I would make my type immutable by using the [Readonly<T>](https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlyt) utility type like this:

```ts
type Banana = Readonly<{
  id: number;
  name: string;
  color: number;
  weight?: number;
  length?: number;
  thumbnails?: string;
  pictures?: ReadonlyArray<string>;
}>;
```

**But this turned out not to be such a great idea.**

 I had made a (Readonly)Map with a few bananas:

```ts
const bananaMap: ReadonlyMap<number, Banana> = new Map([
  [1, { id: 1, name: "yellow banana", color: 0xffff00 }],
  [2, { id: 2, name: "red banana", color: 0xff0000 }],
  [3, { id: 3, name: "green banana", color: 0x00ff00 }]
]);
```

Then I tried to access an element in this way:

```ts
const banana: Banana = bananaMap.get(1);
```

And I got an error on the `banana` identifier which looked like this:

```
Type 'Readonly<{ id: number; name: string; color: number; weight?: number 
| undefined; length?: number | undefined; thumbnails?: string | undefined;
 pictures?: readonly string[] | undefined; }> | undefined' is not 
assignable to type 'Readonly<{ id: number; name: string; color: number; 
weight?: number | undefined; length?: number | undefined; thumbnails?: 
string | undefined; pictures?: readonly string[] | undefined; }>'.
  Type 'undefined' is not assignable to type 'Readonly<{ id: number; 
name: string; color: number; weight?: number | undefined; length?: 
number | undefined; thumbnails?: string | undefined; pictures?: 
readonly string[] | undefined; }>'.
```

It took me a while to understand what the problem was. The important part was on the second "paragraph" and I had to scroll down to find it, and still stare at it for a while.

> You can see this example in the [TypeScript Playground](https://www.typescriptlang.org/play/#code/FAFwngDgpgBAQgQwHbITAvDASlBATAeyQBswAeAb2BhgEs8AuGJAVwFsAjKAJwG5rmCNlCYBnEN1pIA5vxoBjAsQLcmrTjzkwA7lFrSAFiAD8a9lz4DiUGSAOnm5zQLvmUtYqIfjJMrRFp5EBZuKC8mHHwiUgBBbm4Ech8paQA+fgBfdOBgRSRxGA5UFABZBAgI3EISMDKIMnULABp4YoRUjGYobRg6gAoAbQEBgEYWijpGGDHBYSYAIjAoYmUeopQUeZbFZVUYAAYADwAzU+P9-ZgMgF0m4YAmccmmR9mRGHnQvEK2rZgdlRMI6nC4XK63YYAZie9CY0LeC2koRsPw2CD+AL2RwuIMuN2A1wAlPxckQCutUExEGjOhTSuUAHTSKAgPojYlAA)

**So I changed the type, marking each field as `readonly` instead:**

```ts
type Banana = {
  readonly id: number;
  readonly name: string;
  readonly color: number;
  readonly weight?: number;
  readonly length?: number;
  readonly thumbnails?: string;
  readonly pictures?: ReadonlyArray<string>;
};
```

Then the error message looked a bit better:

```
Type 'Banana | undefined' is not assignable to type 'Banana'.
  Type 'undefined' is not assignable to type 'Banana'.
```

**And the issue was evident!** The `get` method in the `Map` class [returns an element or `undefined`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/get#Return_value). That means we can't annotate `const banana` with the `Banana` type.

```ts
const banana: Banana = bananaMap.get(1); // ❌ error!
```

Some possible fixes:

```ts
// 1
const banana: Banana | undefined = bananaMap.get(1); // ✅ no error

// 2
const banana: Banana = bananaMap.get(1)!; // ⚠️ no error, but (*)
```

\* I would [avoid the non-null assertion operator](https://juliangaramendy.dev/null-checking/) when possible.

> You can see this new example in the [TypeScript Playground](https://www.typescriptlang.org/play/#code/FAFwngDgpgBAQgQwHbITAvDA3sGMBOUCAJgPZIA2YMAlsQFwxICuAtgEZT4DcuBRZStRSsojAM4h8NJAHNeeQiXJUYAY1IVS+Riw5cF-ZUJgB3KDVkALEAH5dbTjz5LBqilDkgr9po4MuAirU3o4oNBTivpLScoauwTAQNGogzIRRjABKQUIAgvj4CGAAPDEysgB8vAC+vMAaSJIw7KgoALIIENm5VJ0QJXpOADTwbQiVGExQpjD9ABQA2nyLAIyjWLQMMOtMCKKMAERgUBRas60oKIejGlo6MAAMAB4AZu+vj48wNQC6wysAEwbLaMYF7A4wQ6EYgtcY3dSabSMF7vL5fH7-FYAZhBdEYuIhYihskInjhVwQCLuyKezy+aO+f2AvwAlPVGs1LqhGIhKVNuR0ugA6WRQEDzVbsmAAehlMC4+G0wAa5GarGKnD5PLG-IAPjBmEhiFBXjIoLDMIKEP1ReLJdK5UxSArCsrVU0QDAEOJxFwQBbtSheeMBeNbWKJVKAITcWXypAuxXaIA).

