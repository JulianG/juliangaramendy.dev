import React from 'react'
import { Link } from 'gatsby'

export function Header() {

  return (
    <div>
      <h1 style={styles.brand}>Julian&#8203;Garamendy&#8203;.dev</h1>
      <div style={styles.navigation}>
        <Link to={`/info`}>Info</Link>
        &nbsp;&nbsp;|&nbsp;&nbsp;
        <Link to={`/work`}>Work</Link>
        &nbsp;&nbsp;|&nbsp;&nbsp;
        <Link to={`/blog`}>Blog</Link>
      </div>
    </div >
  );
}

export function BlogHeader({ title, description }) {
  return (
    <>
      <h1 style={styles.blogTitle}>{title}</h1>
      <h4 style={styles.blogDescription}>{description}<br />Some of these posts appear on <a href="https://dev.to/juliang">dev.to</a>.</h4>
    </>
  );
}

const styles = {
  brand: {
    fontFamily: 'Farsan, sans-serif',
    marginTop: 0,
    marginBottom: 0,
    fontWeight: 'bolder',
    fontSize: '300%',
  },
  navigation: {
    fontSize: '125%',
    fontWeight: '400',
    marginTop: '0.25rem',
  },
  blogTitle: {
  },
  blogDescription: {
    marginTop: '0.5rem',
    fontSize: '125%',
    fontWeight: 400,
  }
}