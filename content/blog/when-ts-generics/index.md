---
title: A use case for Generics in TypeScript
date: '2019-08-15'
type: 'blog-post'
credit: ['Photo by [Joshua Coleman](https://unsplash.com/@joshstyle) on [Unsplash](https://unsplash.com/)']
---

![duck typing](./joshua-coleman-ducks.jpg)

**The following may be a bit obvious for some.** But something just clicked in my head and I thought I'd write it down.

## When generics are a good idea

Imagine we write a function that returns the "oldest" item in a set/array:

```ts
function getOldest(items: Array<{ age: number }>) {
  return items.sort((a, b) => b.age - a.age)[0];
}
```
This function can be called with an array of any kind of objects as long as they contain an `age` property of type `number`.

To help reasoning about it, let's give this a name:

```ts
type HasAge = { age: number };
```

Now our function can be annotated like this:

```ts
function getOldest(items: HasAge[]): HasAge {
  return items.sort((a, b) => b.age - a.age)[0];
}
```

**Great!** Now we can use this function with any objects that conform to the `HasAge` interface:

```ts
const things = [{ age: 10 }, { age: 20 }, { age: 15 }];
const oldestThing = getOldest(things);

console.log(oldestThing.age); // 20 ✅
```
Because the type of `oldestThing` is inferred to be `HasAge`, we can access its `.age` property.

**But what if we have more complex types?**

```ts
type Person = { name: string, age: number};

const people: Person[] = [
  { name: 'Amir', age: 10 }, 
  { name: 'Betty', age: 20 }, 
  { name: 'Cecile', age: 15 }
 ];

const oldestPerson = getOldest(people); // 🙂 no type errors
```

**This works**, but now the inferred type of `oldestPerson` is `HasAge`. We've lost the `Person` type along the way. As a result we can't (safely) access it's `.name` property.

```ts
console.log(oldestPerson.name); // ❌ type error: Property 'name' does not exist on type 'HasAge'.
```

Annotating `oldestPerson:Person` won't work:

```ts
const oldestPerson: Person = getOldest(people); // ❌ type error
// Property 'name' is missing in type 'HasAge' but required in type 'Person'.
```

We could use [type assertions](https://www.typescriptlang.org/docs/handbook/basic-types.html#type-assertions), but it's not a good idea. ([why?](https://basarat.gitbooks.io/typescript/docs/types/type-assertion.html#assertion-considered-harmful))

```ts
const oldestPerson = getOldest(people) as Person; // 🚩
console.log(oldestPerson.name); // no type error
```

[You can try this in TypeScript Playground](https://www.typescriptlang.org/play/#code/PTAEHUEsBcAsHsCu1QHECmA7dAnSBjAZwChjoBPAB3VAAkBDQgQQHMaBeUAb1HrYC5QmRAFsARrlABfANykAZokz5okeJlBtoAeQA2AE3SFoAChjoRhQQ2ZsA2gF0AlNcasaXYqFA500RDga5pYAdITwOKYm9AA0oGJOoOwAfPEhfDQAtLzpbE52AAwOclKk+OrGoHCQmCyESaB2PBmCAIwF0nHNAqAATB1SXbw9rQCs0sXE5ZiV8AZG0AAqsDUsDVp6hsYm1bWETnJTFXPoIbrwLCZzW0srtbnoB6AgfR2AoOSkFNSgAAq44RpODxMPQROhBMY8LUZMNwUJRBIcNJDtNKtR4JRdHC-jgAY4GnYvNwhKC4QAiJgiSA4MlxFqgdqdInA0mCMkAIT8FFpsME-SZ3hZYLZAGF0PhIFiefSxtJiJMjjMUNcFus-JsFiZ0ZjHjCXoBeDcAQntCeBVKg0XA4CL1MTIEL20gvVEnM4XK7zYwhEFgp4vQAy5L8rdRIuRQAByb3oMOgfTwIwmlDoAAekFmGi+NDD7noYixYZCjrAqOVHugOIBgnL6jVOlLWvQGKxvrAAYzoEtEWILx+QdwFHDkejqdAVMIhFWoBqZu+YZs7mjtpQvgAjohqeh9JP0+bw1XMPnC6AAKrj2rTmiMQh9tQzMoVEs3Pc1jXbbVN3j1Pd6sD6wCVewneE0eBN0oHB6BUAh0EVcIsVdS4VWMPcvVJZsTXPdscCtHA4kXNCWHgYDQFA8DVHwC0YFgXBiCAA).

## Using Generics

**We can do better.** We can turn this into a [generic](https://www.typescriptlang.org/docs/handbook/generics.html) function.

```ts
function getOldest<T extends HasAge>(items: T[]): T {
  return items.sort((a, b) => b.age - a.age)[0];
}

const oldestPerson = getOldest(people); // ✅ type Person
```

**Success!!** Now the inferred type of `oldestPerson` is `Person`!  
As a result we can access its `.name` property.

Here's another example with 2 different types:

```ts
type Person = {name: string, age: number};
const people: Person[] = [
  { name: 'Amir', age: 10 }, 
  { name: 'Betty', age: 20 }, 
  { name: 'Cecile', age: 15 }
 ];

type Bridge = {name: string, length: number, age: number};
const bridges = [
{ name: 'London Bridge', length: 269, age: 48 },
{ name: 'Tower Bridge', length: 244, age: 125 },
{ name: 'Westminster Bridge', length: 250, age: 269 }
]

const oldestPerson = getOldest(people); // type Person
const oldestBridge = getOldest(bridges); // type Bridge

console.log(oldestPerson.name); // 'Betty' ✅
console.log(oldestBridge.length); // '250' ✅
```

[You can try this in TypeScript Playground](https://www.typescriptlang.org/play/#code/PTAEFUGcEsDsHNQHECmsUCdoGNICg8AXATwAcVQAJAQ0gEF4KBeUAb1GsYC5RYBXALYAjTKAC+AbgIAzPrGyFoAe1ihGhAPIAbACYpIhADwAVUCgAehNDshVaDFAD4AFNCsDIPYwG0AugEovNjxQUAwUQj4MVTcUDwA6SCUMQmdnagAaUCF-UCZHbPjOCgBaDiLGf28ABl8pMQISclAABUwk1RZ2WGoBFB4DLAQJDm5eQREMcSlsFQNQciVSLX7W9pU-PNBvELZeXtWAIjoBaAxDrOKeAEZq8Qzd7oOeQ4AhCJIL0dWAJjuxB6hJ59F4AYRQ2GgKy+V1A1wArOI8HVGmQKK8sDpGFtgatBnB4CMVghCAALHj8YSYEawymTaZ4WaweZCTGMWwsHZA-Yg0CHAAyKh0KlAGOgWJQX2J8DJPB+ADYAJyXMYAFgAHPdHjyjsYlAB3URiiVStAy8mgH6q1Uq1bXH6IgHanq8w4AdX0hFOzKsU2NjFNJItDuqtrlSqRKMZc0IoCUuk9bQwHS26m0egMzkWyxQ-hGIFATQoSY60Z9cYTBn9zDUEXTnucrPF7LzoALRdFbJQBCZSRW8S0SngznjGcIJZU8RdufzYAA5O9CCQ56BAKDkZb7KAHQ5HlcI1YHZrJrYLc5DK-XQA)

## When generics are not needed

Even if your function takes objects conforming to the `HasAge` interface; as long as you don't mean to  return the same type you don't need generics.

```ts
function isFirstOlder<T extends HasAge>(a: T, b: T) {
  return a.age > b.age;
}
```

The function above doesn't need to be generic. We can simply write: 

```ts
function isFirstOlder(a: HasAge, b: HasAge) {
  return a.age > b.age;
}
```

## Resources

* [Generics](https://www.typescriptlang.org/docs/handbook/generics.html) (TypeScript Handbook)
* [Type Assertions](https://www.typescriptlang.org/docs/handbook/basic-types.html#type-assertions) (TypeScript Handbook)
* [Type Assertion](https://basarat.gitbooks.io/typescript/docs/types/type-assertion.html) (Basarat's TypeScript Deep Dive)
* [TypeScript Playground](https://www.typescriptlang.org/play/)