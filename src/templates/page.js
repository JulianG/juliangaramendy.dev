import React from 'react'
import { Link, graphql } from 'gatsby'

import Bio from '../components/Bio'
import { BlogLayout } from '../components/Layout'
import { Header, BlogHeader } from '../components/Header'
import SEO from '../components/seo'
import { rhythm, scale } from '../utils/typography'

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = this.props.data.site.siteMetadata.title
    const blogTitle = this.props.data.site.siteMetadata.blogTitle
    const blogDescription = this.props.data.site.siteMetadata.blogDescription
    const { previous, next } = this.props.pageContext
    const { ogimage } = post.frontmatter
    const ogImagePath = ogimage && ogimage.childImageSharp.fixed.src

    const pageTitle = post.frontmatter.title;

    return (
      <BlogLayout location={this.props.location} title={blogTitle}>
        <Header title={siteTitle} />
        <SEO
          title={post.frontmatter.title}
          description={post.excerpt}
          type="website"
          image={ogImagePath} />
        {pageTitle && <h1>{pageTitle}</h1>}
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
        <hr
          style={{
            marginBottom: rhythm(1),
          }}
        />
      </BlogLayout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query PageBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        blogTitle
        blogDescription
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        ogimage { 
          childImageSharp {
            fixed {
              src
            }
          }
        }
      }
    }
  }
`
