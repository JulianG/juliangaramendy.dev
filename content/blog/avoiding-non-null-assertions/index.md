---
title: Avoiding the Non-null-assertion Operator in React + Mobx + Typescript Projects
date: '2019-02-01'
---

**Today I learned something at work.** I am new to MobX and I had to make changes to a **React + Typescript + MobX** project. I noticed the props of some React components were marked as optional, and I was told it was because of how the dependency injection worked.

## The Problem

When injecting MobX stores into React components in Typescript, [the recommended approach in MobX docs](https://github.com/mobxjs/mobx-react#strongly-typing-inject) involves declaring optional props (`?`). This results in having to perform null checks when accessing an injected store, and MobX recommendeds using the [non-null assertion operator (`!`)](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html).

```typescript
interface BananaProps {
  label: string;
  bananaStore?: BananaStore; // 👎 note the optional operator
}

@inject("bananaStore")
@observer
class BananaComponent extends Component<BananaProps> {

  render() {
    const bananas = this.props.bananaStore!.bananas; // 👎 note the non-null assertion operator
    return <p>{this.props.label}:{bananas}</p>
  }

}
```

This is far from ideal. We're declaring the store dependencies as optional (`?`). But they're required. Then, because we know it's not optional, and to avoid doing checking for null all the time, we resort to the non-null assertion operator (`!`).

What happens often when we allow the `!` operator, is that we start seeing it (or worse: not-seeing it) in other places, where its use is less justified.

So we believe it would be best to ban the use of `!` and enforce it with a linter rule like [tslint: no-non-null-assertion](https://palantir.github.io/tslint/rules/no-non-null-assertion/).

## One Solution

A colleague pointed out [this article](https://medium.com/@prashaantt/strongly-typing-injected-react-props-635a6828acaf) from December 2016, by Prashant Tiwari.

Here the author declares the dependency in a separate interface that extends `Props`, and then the injected props can be accessed using a getter function. 

```typescript
interface InjectedProps extends Props {
  bananaStore: BananaStore; // 👍 no question mark here
}

interface BananaProps {
  label: string;
}

@inject("bananaStore")
@observer
class BananaComponent extends Component<BananaProps> {

  get injected() {
    return this.props as InjectedProps;
  }

  render() {
    const bananas = this.injected.bananaStore.bananas; // 👍 no exclamation mark here
    return <p>{this.props.label}:{bananas}</p>
  }

}
```

This is great! More type safety.
But there are two things I don't like about this solution:
1. It forces us to declare that `InjectedProps` extends `BananaProps`.
2. When typing `this.injected.` IntelliSense will suggest any injected props and any 'normal' props.

Perhaps we can do better.

## A Slightly Better Solution

We played around with types for a while with a colleague and I think this solution is a bit better.

```typescript
interface InjectedProps {
  bananaStore: BananaStore; // 👍 no question mark here, and no interface inheritance
}

interface BananaProps {
  label: string;
}

@inject("bananaStore")
@observer
class BananaComponent extends Component<BananaProps> {

  get injected(): InjectedProps {
    return this.props as BananaProps & InjectedProps;
  }

  render() {
    const bananas = this.injected.bananaStore.bananas; // 👍 no exclamation mark here
    return <p>{this.props.label}:{bananas}</p>
  }

}
```
Now `InjectedProps` declares `bananaStore` as required and it doesn't extend `BananaProps`. And when accessing `this.injected` IntelliSense will only suggest members of `InjectedProps`, as expected.

If we still want to get "access" to all props, we could write a different getter without the explicit return type:

```typescript
get allProps() {
  return this.props as BananaProps & InjectedProps;
}
```
And that is exactly what `this.props` contains: properties from both interfaces; not because `InjectedProps` extends `BananaProps`, but because the run-time injection results in it.

## Ok, but WHY!?

Once we don't need the non-null assertion operator for injected props, we can enforce a linter rule like [tslint: no-non-null-assertion](https://palantir.github.io/tslint/rules/no-non-null-assertion/) in the entire codebase. This, along with [strictPropertyInitialization](https://mariusschulz.com/blog/typescript-2-7-strict-property-initialization) allows us to rely more on the static typing to avoid run-time null pointer errors.

----

Special thanks to [Albert Plana](https://github.com/aPlana) for his TypeScript wizzardry.

Original Gist: https://gist.github.com/JulianG/18af9b9ff582764a87639d61d4587da1/
