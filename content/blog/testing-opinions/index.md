---
title: Testing Opinions
date: 2019-02-22
---

**⚠️ Warning! This article is highly opinionated.**

It happens often at work that my colleagues and I discuss the best way or the proper way to test a specific React component. **We don't always agree.**

## When should we test the props in a child component?

Imagine we have a `<Banana>` component (of course).

```js
export function Banana({ type, color, length }) {
  return (
    <div className="banana">
      <BananaType type={type} />
      <BananaColor color={color} />
      <BananaLength length={length} />
    </div>
  );
}
```

This component renders other banana-related components. In this example they are all very simple, but let's imagine there's a reason for these to be different.

```js
export function BananaType({ type }) {
  return <span className="banana-type">{type} Banana</span>;
}

export function BananaLength({ length }) {
  return <span className="banana-length">{length}cm</span>;
}

export function BananaColor({ color }) {
  return <span className="banana-color">[{color}]</span>;
}
```

## How do we test this?

Unit test purists would argue we need to test each component in isolation. That means testing `<BananaType>`, `<BananaLength>`, `<BananaColor>`, and of course, `<Banana>`. For the `<Banana>` component that means we need to pass it some props, and see how it sets the props in its children. More or less like this:

```js
  it("renders a banana properly", () => {
    
    const banana = { type: "Cavendish", color: "yellow", length: 12 };

    const wrapper = mount(<Banana {...banana} />); // from 'enzyme'

    const bananaType = wrapper.find(BananaType); // from 'enzyme'
    const bananaColor = wrapper.find(BananaColor);
    const bananaLength = wrapper.find(BananaLength);

    // make sure each child has the correct props
    expect(bananaType.props()).toHaveProperty("type", "Cavendish");
    expect(bananaColor.props()).toHaveProperty("color", "yellow");
    expect(bananaLength.props()).toHaveProperty("length", 12);
    // 🤔
  });
```
I disagree. 

I testing how a parent renders its children is [testing implementation details](https://kentcdodds.com/blog/testing-implementation-details) and thus should be avoided.

I think our `<Banana>` component renders those three components, so the "subject under test" can be considered to be the entire thing: the component and its children. 

I prefer to "render" the component and inspect its output.

```js
  it("renders a banana properly", () => {
    
    const banana = { type: "Cavendish", color: "yellow", length: 12 };

    const {
      getByText
    } = render(<Banana {...banana} />); // from 'react-testing-library'
    
    // no need to call expect
    // the test will fail if the below are not found
    getByText('Cavendish Banana');
    getByText('yellow');
    getByText('12cm');

  });
```
<br/>

Or in some cases a [snapshot](https://jestjs.io/docs/en/snapshot-testing.html) test may be better:

```js
  it("renders a banana properly", () => {
    
    const banana = { type: "Cavendish", color: "yellow", length: 12 };
    const result = render(<Banana {...banana} />); // from 'react-testing-library'
    expect(result.container).toMatchSnapshot();

  });
```

### Wait! Snapshot tests depend on implementation details, or do they?

Some argue that testing against the rendered output (i.e. snapshot test) is similar to testing implementation details. For instance suppose our `<BananaLength>` component changes its implementation and instead of rendering `<span class="banana-length">12cm</span>` it renders `<div class="banana-length">12 cm</div>` (notice the space between '12' and 'cm'). Then both my above tests would fail.

But I consider the rendered markup to be the function's output, not it's implementation details. If the render changes, then the output of my module changes, then **the tests must break**.


## About react-testing-library

I'm using [reac-testing-library](https://testing-library.com/react) in some projects. But the one testing the value of children props was using [Enzyme](https://airbnb.io/enzyme/) instead. Of course you can avoid testing implementation details with Enzyme, but I think react-testing-library makes it easier to avoid bad practices.

My opinions are probably biased because I've been following Kent C. Dodds' [testing javascript](https://testingjavascript.com/) course.

Feel free to disagree with me in the comments.