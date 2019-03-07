import React from 'react'
import { Link, graphql } from 'gatsby'

import Bio from '../components/Bio'
import { BlogLayout } from '../components/Layout'
import { Header, BlogHeader } from '../components/Header'
import SEO from '../components/seo'
import { rhythm } from '../utils/typography'

import './styles.css'

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const blogTitle = data.site.siteMetadata.blogTitle
    const blogDescription = data.site.siteMetadata.blogDescription
    const posts = data.allMarkdownRemark.edges
    const keywords = data.site.siteMetadata.keywords
    // const rootPath = `${__PATH_PREFIX__}/`

    return (
      <BlogLayout>
        <Header title={siteTitle} />
        <BlogHeader title={blogTitle} description={blogDescription} backLink={`/blog`} />
        <SEO
          title="All posts"
          keywords={keywords}
          type="website"
        />
        {posts.map(({ node }) => {
          const title = node.frontmatter.title || node.fields.slug
          return (
            <div key={node.fields.slug}>
              <h3
                style={{
                  marginBottom: rhythm(1 / 4),
                }}
              >
                <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
                  {title}
                </Link>
              </h3>
              <small>{node.frontmatter.date}</small>
              <p dangerouslySetInnerHTML={{ __html: node.excerpt }} />
            </div>
          )
        })}
        <hr
          style={{
            marginBottom: rhythm(1),
          }}
        />
        <Bio />
      </BlogLayout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        blogTitle
        blogDescription
        keywords
      }
    }
    allMarkdownRemark(
      filter: {frontmatter: {type: {eq: "blog-post"}}}
      sort: { fields: [frontmatter___date], order: DESC }
      ) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
          }
        }
      }
    }
  }
`
