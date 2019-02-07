---
title: Null Checking in TypeScript
date: '2019-02-05'
---

Following up on the previous gist about [avoiding non-null-assertion operator](https://gist.github.com/JulianG/18af9b9ff582764a87639d61d4587da1/) I think it would be good to see some examples of null checking in TypeScript.

Assumming we're using TypeScript with `--strictNullChecks`, and that this is what a banana looks like:
```typescript
type Banana = {
  id: number,
  open: () => void
};
```
We have a list of bananas and we're trying to find bananas by id. 
```typescript
const bananas: Array<Banana> = [];

...

const banana = bananas.find(banana => banana.id === id);
```

## Problem

Our React + Typescript project has a get function like this:

```typescript
getBananaById(id: number): Banana {
  return bananas.find(banana => banana.id === id)!; // ! bang!
}

eatBanana(id: number) {
  const banana = getBananaById(id);
  banana.open();
}
```

We use the [non-null assertion operator](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html) (the exclamation mark a.k.a bang ) here because we assumed that the id provided to both functions would always be valid. After all, the user can only select a banana from the list, as opposed to the id being calculated or read from direct user input.  
Under this assumption, this code would never throw, because the `find` function will always find a banana and return it.

> "One day a banana will not be found"

## Throwing Errors

Depending of what we do, the program will throw or not when a banana is not found. The program will throw if we do any of the following:

### No null checking - using bang at the "source"

Just cheating the type checker with the [non-null assertion operator](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html).
```typescript
const bananas: Array<Banana> = [];

getBananaById(id: number): Banana {
  return bananas.find(banana => banana.id === id)!; // !
}

openBananaById(id: number) {
  const banana = getBananaById(id);
  banana.open(); // may throw an error here
}
```
**Result:** The program may throw `Uncaught TypeError: Cannot read property 'open' of undefined` when we "consume" the banana instance. This can happen anywhere we access a property of `banana`.

### No null checking - using bang before access

Just cheating the type checler with the non-null assertion operator, but in a different place.

```typescript
const bananas: Array<Banana> = [];

getBananaById(id: number): Banana | undefined {
  return bananas.find(banana => banana.id === id);
}

openBananaById(id: number) {
  const banana = getBananaById(id);
  banana!.open(); // may still throw an error here
}
```
**Result:** The program may throw `Uncaught TypeError: Cannot read property 'open' of undefined` when we "consume" the banana instance. This would tipically happen in multiple places.

### Null checking at the "source"

```typescript
const bananas: Array<Banana> = [];

getBananaById(id: number): Banana {
  const banana = bananas.find(banana => banana.id === id);
  if (!banana) {
    throw new Error(`Error. Could not find banana with id: ${id}.`);
  }
  return banana;
}

openBananaById(id: number) {
  const banana = getBananaById(id);
  banana.open(); // will never throw
}
```
**Result:** The program may throw a custom error "by design" when calling `getBananaById`.

## Supressing Errors

If we don't really need our function to throw when a banana is missing, we have two options:

### Null checking before each use

```typescript
const bananas: Array<Banana> = [];

getBananaById(id: number): Banana | undefined {
  return bananas.find(banana => banana.id === id);
}

openBananaById(id: number) {
  const banana = getBananaById(id);
  if (banana)
    banana.open();
  }
}
```
**Result:** The program will not throw. But we need to perform the same null check over and over.

### Null Object Pattern

*"Instead of using a null reference to convey absence of an object (for instance, a non-existent customer), one uses an object which implements the expected interface, but whose method body is empty. The advantage of this approach over a working default implementation is that a null object is very predictable and has no side effects: it does nothing."* ([source: Wikipedia](https://en.wikipedia.org/wiki/Null_object_pattern))

In our example it would look like this:
```typescript
const bananas: Array<Banana> = [];
const NullBanana: Banana = { id: 0, open: () => {} };

getBananaById(id: number): Banana {
  return bananas.find(banana => banana.id === id) || NullBanana;
}

openBananaById(id: number) {
  const banana = getBananaById(id);
  banana.open(); // will never throw
}
```
**Result:** The program will not throw. And we don't need to perform null checks before using the instance.

In the above code we declare and initialise a `NullBanana` constant, and then the `getBananaById` function returns either the result of the `find` function call or `NullBanana`.

## Conclusion

When not finding a banana is unexpected, we prefer to perform null-check and throw at the "source":

```typescript
getBananaById(id: number): Banana {
  const banana = bananas.find(banana => banana.id === id);
  if (!banana) {
    throw new Error(`Error. Could not find banana with id: ${id}.`);
  }
  return banana;
}
```

When not finding a banana is a valid case, we prefer to use null object pattern:

```typescript
const NullBanana: Banana = { id: 0, open: () => {} };

getBananaById(id: number): Banana {
  return bananas.find(banana => banana.id === id) || NullBanana;
}
```
<br/>

Can you think of other ways of handling null/undefined?