import React from 'react'
import { Link, graphql } from 'gatsby'
import Bio from '../components/Bio'
import { BlogLayout } from '../components/Layout'
import { Header } from '../components/Header'
import SEO from '../components/seo'
import { rhythm, scale } from '../utils/typography'

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const blogTitle = this.props.data.site.siteMetadata.blogTitle
    const { previous, next } = this.props.pageContext
    const { ogimage, credits } = post.frontmatter
    const ogImagePath = ogimage && ogimage.childImageSharp.fixed.src

    return (
      <BlogLayout credits={credits}>
        <Header/>
        <SEO
          title={post.frontmatter.title}
          description={post.excerpt}
          type="article"
          image={ogImagePath} />
        <h1>{post.frontmatter.title}</h1>
        <p
          style={{
            ...scale(-1 / 5),
            display: `block`,
            marginBottom: rhythm(1),
            marginTop: rhythm(-1),
          }}
        >
          {post.frontmatter.date}
        </p>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
        <hr
          style={{
            marginBottom: rhythm(1),
          }}
        />
        <Bio />
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </BlogLayout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        blogTitle
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
        credits
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
