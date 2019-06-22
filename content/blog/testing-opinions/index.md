---
title: Testing Opinions
date: '2019-02-22'
type: 'blog-post'
---

**⚠️ Warning! This article is highly opinionated.**

It happens often at work that my colleagues and I discuss the best way or the proper way to test a specific React component. **We don't always agree.**

> Testing the output of a function is not the same as testing its implementation details.

## Avoid Testing Implementation Details

(Almost) all of us agree that [testing implementation details](https://kentcdodds.com/blog/testing-implementation-details) should be avoided. The problem sometimes is to agree to a definition of implementation details.

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

Unit test purists would argue we need to test each component in isolation. For the `<Banana>` component isolation we need to either mock the children or do a shallow render and see how it sets the props in its children. More or less like this:

```js
  it("renders a banana properly", () => {
    const banana = { type: "Cavendish", color: "yellow", length: 12 };
    const wrapper = shallow(<Banana {...banana} />); // from 'enzyme'

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
### What's the problem here?

1. The test tries to find `BananaType`, `BananaColor` and `BananaLength` which are implementation dependencies of the subject.
2. The test expects certain props to be set on the internal children; again: implementation details.

### What can we do instead?

Our `<Banana>` component **owns** those three sub components, so the "subject under test" can be considered to be the entire thing: the component and its children. 

I prefer to "render" the component and inspect its output.

```js
  it("renders a banana properly", () => {
    const banana = { type: "Cavendish", color: "yellow", length: 12 };

    const {
      getByText
    } = render(<Banana {...banana} />); // from 'react-testing-library'
    
    getByText('Cavendish Banana');
    getByText('yellow');
    getByText('12cm');
  });
```
<br/>

In some cases a [snapshot](https://jestjs.io/docs/en/snapshot-testing.html) test may be better:

```js
  it("renders a banana properly", () => {
    const banana = { type: "Cavendish", color: "yellow", length: 12 };
    const result = render(<Banana {...banana} />); // from 'react-testing-library'
    expect(result.container).toMatchSnapshot();
  });
```

### Wait! Don't snapshot tests depend on implementation details?

Some argue that testing against the rendered output (i.e. snapshot test) is similar to testing implementation details. For instance suppose our `<Banana>` component changes its implementation and instead of rendering `<BananaLength>` it renders `<div class="banana-length">12 cm</div>` (notice the space between '12' and 'cm'). Then my tests above would fail.

But I consider the rendered markup to be the function's output, not it's implementation details. If the render changes, then the output of my module changes, then **the tests must break**. 


### About react-testing-library

I'm using [reac-testing-library](https://testing-library.com/react) in some projects. But the first example was using [Enzyme](https://airbnb.io/enzyme/) instead. Of course, you can avoid testing implementation details with Enzyme, but I think react-testing-library makes it easier to avoid those bad practices.

My opinions are probably biased because I've been following Kent C. Dodds' [testing javascript](https://testingjavascript.com/) course.

Feel free to disagree with me in the comments.