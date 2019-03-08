import React from 'react'
import { Link } from 'gatsby'

export function Header() {

  return (
    <div>
      <h1 className="brand">Julian&#8203;Garamendy&#8203;.dev</h1>
      <h4 className="navigation">
        <Link to={`/info`}>Info</Link>
        |
        <Link to={`/blog`}>Banana Gists Blog</Link>
      </h4>
    </div >
  );
}

export function BlogHeader({ title, description }) {
  return (
    <>
      <h1 className="blog-title">{title}</h1>
      <h4 className="description">{description}</h4>
    </>
  );
}
