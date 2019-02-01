---
title: Avoiding the Non-null-assertion Operator in React + Mobx + Typescript Projects
date: '2019-02-01'
---

## Problem

When injecting MobX stores into React components in Typescript, MobX recommended approach involves declaring optional props. This requires the use of the [non-null assertion operator (!)](https://www.logicbig.com/tutorials/misc/typescript/non-null-assertion-operator.html)

**CounterViewA.tsx** declares the dependency in its props as optional (?).

```typescript
interface Props {
  label: string;
  bananaStore?: BananaStore;
}

...

// but then we need to use the non-null assertion operator. NOT COOL!

const count = this.props.bananaStore!.count;
```

This is far from ideal. Because we must allow these exclamation marks for injected props, we cannot enforce a linter rule like tslint no-non-null-assertion, and we'll soon start seeing (!) in other places.

## One Solution

**CounterViewB.tsx** declares the dependency in a separate type/interface that extends Props, as suggested in [this article](https://medium.com/@prashaantt/strongly-typing-injected-react-props-635a6828acaf) from December 2016, by Prashant Tiwari.

```typescript
interface InjectedProps extends Props {
  bananaStore: BananaStore;
}

...

get injected() {
  return this.props as InjectedProps;
}
...

// now the this.inject getter access all props and injected props.

const count = this.injected.bananaStore.count; 

// no need to use the non-null assertion operator! SUCCESS!
```

What I don't like from this solution is that it forces us to declare that InjectedProps extends Props.
Perhaps we can do better.

## An Even Better Solution

**CounterViewC.tsx** declares the dependency in a separate type/interface, without extending anything.

```typescript
interface InjectedProps {
  bananaStore: BananaStore;
}

...

get injected(): InjectedProps {
  return this.props as Props & InjectedProps;
}

...

// now this.inject getter gives access to only the injected stores

const count = this.injected.bananaStore.count; 

// no need to use the non-null assertion operator! SUCCESS!
```

Alternatively you could write a different getter without explicit return type:

```typescript
get allProps() {
  return this.props as Props & InjectedProps;
}
```

## Ok, but WHY!?

Once we get rid of the non-null assertion operator for injected props, we can enforce a linter rule like [tslint: no-non-null-assertion](https://palantir.github.io/tslint/rules/no-non-null-assertion/). This together with [strictPropertyInitialization](https://mariusschulz.com/blog/typescript-2-7-strict-property-initialization)allows us to rely on the static typing more to avoid run-time null pointer errors.