import React from 'react'
import { Link, graphql } from 'gatsby'

import Bio from '../components/Bio'
import { BlogLayout } from '../components/Layout'
import { Header } from '../components/Header';
import SEO from '../components/seo'
import { rhythm } from '../utils/typography'

import './styles.css'

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const description = data.site.siteMetadata.description
    const keywords = data.site.siteMetadata.keywords
    const posts = data.allMarkdownRemark.edges

    const defaultPageSlug = `/info/`

    const defaultPage = posts.find(page => page.node.fields.slug === defaultPageSlug);

    console.log(defaultPage);
    console.log(defaultPage.html);

    return (
      <BlogLayout location={this.props.location} title={siteTitle} description={description}>
        <Header title={siteTitle} description={description} />
        <SEO
          title="All posts"
          keywords={keywords}
          type="website"
        />       
        <div dangerouslySetInnerHTML={{ __html: defaultPage.node.html }} /> 
        <hr
          style={{
            marginBottom: rhythm(1),
          }}
        />
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
        description
        keywords
      }
    }
    allMarkdownRemark(
      filter: {frontmatter: {defaultPage: {eq: true}}}
      sort: { fields: [frontmatter___date], order: DESC }
      ) {
      edges {
        node {
          excerpt
          html
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
