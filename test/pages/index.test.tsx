import React from "react";
import { render, fireEvent } from "../testUtils";
import { BlogPostPage } from "../../pages/blog/[slug]";

describe("Home page", () => {
  it("tests", () => {
    expect(true).toBeTruthy();
  });
  // it('matches snapshot', () => {
  //   const { asFragment } = render(<Home />, {})
  //   expect(asFragment()).toMatchSnapshot()
  // })

  // it('clicking button triggers alert', () => {
  //   const { getByText } = render(<Home />, {})
  //   window.alert = jest.fn()
  //   fireEvent.click(getByText('Test Button'))
  //   expect(window.alert).toHaveBeenCalledWith('With typescript and Jest')
  // })
});
