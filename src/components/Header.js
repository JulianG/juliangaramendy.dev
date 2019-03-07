import React from 'react'
import { Link } from 'gatsby'

import { rhythm, scale } from '../utils/typography'

const linkStyle = {
};

const titleStyle = {
  ...scale(1.25),
  marginBottom: rhythm(0),
  marginTop: 0,
};

export function Header({ title, description, backLink }) {

  return (
    <div>
      <h1 style={titleStyle}>{title}</h1>
      <h4 className="description">
        <Link style={linkStyle} to={`/info`}>Info</Link>
        |
        <Link style={linkStyle} to={`/blog`}>Banana Gists Blog</Link>
      </h4>
    </div>
  );
}

export function BlogHeader({ title, description, backLink }) {
  return (
    <>
    <h2
      style={{
        fontFamily: `Montserrat, sans-serif`,
        marginTop: 0,
        marginBottom: 0,
      }}
    >
      <Link
        style={{
          boxShadow: `none`,
          textDecoration: `none`,
          color: `inherit`,
        }}
        to={backLink}
      >
        {title}
      </Link>
    </h2>
    {description && <h4 className="description">{description}</h4>}
    </>
  );
}
