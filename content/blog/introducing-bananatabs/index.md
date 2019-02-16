---
title: Drag and Drop in Banana Tabs
date: '2018-12-10'
---

Earlier this year, I made a Chrome extension during a "hack day" at work. **Banana Tabs** is a chrome extension that displays a list of your currently opened browser windows and the tabs contained in each of them. You can hide and show any tabs or entire windows, and reopen them later.

> You can install [Banana Tabs!](https://goo.gl/AyrUQL) from the Chrome Web Store.

![Banana Tabs extension while user drags a window group](./bananatabs-drag-drop.gif)

Soon after the first iteration I realised that I would need to be able to reorder windows using drag-and-drop. In the past I had coded drag-and-drop functionality many times, but I wasn’t sure **how to add drag-and-drop in React, in a declarative style**.


## Really trying not to reinvent the wheel

I did a bit of research and I tried some popular packages like ReactDnD, and even though they’re more versatile, the set up involved writing a lot of code.

I decided to code my own because I was sure there could be a much simpler API, especially if I constrained the drag and drop problem to sorting list items instead of creating very generic solution. In addition, I would not need to deal with touch events, because the target was the Chrome browser only.

**I wanted the equivalent of flipping a switch to make my list of windows draggable.**

My goal was that instead of rendering this:

```typescript
<div className="window-list">
  {items.map(this.renderSingleItem)}
</div>
```

I would render something like this:

```typescript
<DragAndDropList>
  {items.map(this.renderSingleItem)}
</DragAndDropList>
```

I was determined not to change the data structure, the logic of my app, or the way individual items were rendered because of the added functionality.

## Favouring Render Props over High Order Components

I think of of the reasons ReactDnD put me off was that I had to wrap my existing components in the HoC. With Render Props I can achieve the same in a much simpler way.

In the end the component was called RLDD, it takes 3 props, and one of them is a render prop function:

```typescript
<RLDD
  items={items}
  itemRenderer={this.itemRenderer}
  onChange={this.handleRLDDChange}
/>
```

`items` is an array of `Item` objects. `itemRenderer` is the render prop function that takes an `Item` and returns a `JSX.Element` and `onChange` is the callback function that handles change. It looks like this:

```typescript
handleRLDDChange(reorderedItems) {
  this.setState({ items: reorderedItems });
}
```

## Highly Decoupled Modules

The resulting drag-and-drop module is a generic solution and has no dependencies on the rest of the application. Therefore it was extracted and published as an npm package to be reused in other projects.

But more importantly, my application is not aware that RLDD is about drag and drop, or anything in particular. **Banana Tabs only knows that RLDD can trigger a callback with a new array of items.**

You can use [react-list-drag-and-drop](https://www.npmjs.com/package/react-list-drag-and-drop) in your project via npm. It works both with JavaScript and TypeScript.

```bash
npm install -s react-list-drag-and-drop
```
.

> TK // make this more about Banana Tabs!

Banana Tabs is on [GitHub](https://github.com/julianG/bananatabs)
and on the [Chrome Web Store](https://goo.gl/AyrUQL).