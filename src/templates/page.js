import React from 'react'
import { graphql } from 'gatsby'
import { BlogLayout } from '../components/Layout'
import { Header } from '../components/Header'
import SEO from '../components/seo'

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.mdx
    const blogTitle = this.props.data.site.siteMetadata.blogTitle
    const { ogimage, credits } = post.frontmatter
    const ogImagePath = ogimage && ogimage.childImageSharp.fixed.src

    const pageTitle = post.frontmatter.title;

    return (
      <BlogLayout credits={credits}>
        <Header />
        <SEO
          title={post.frontmatter.title}
          description={post.excerpt}
          type="website"
          image={ogImagePath} />
        {pageTitle && <h1>{pageTitle}</h1>}
        <MDXRenderer>{post.code.body}</MDXRenderer>
      </BlogLayout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query PageBySlug($slug: String!) {
    site {
      siteMetadata {
        blogTitle
      }
    }
    mdx(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      code {
        body
      }
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
        credits
      }
    }
  }
`
