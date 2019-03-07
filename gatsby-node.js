const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = async ({ graphql, actions }) => {
  
  await metaCreatePagesOfType(graphql, actions.createPage, `blog-post`)
  await metaCreatePagesOfType(graphql, actions.createPage, `page`)
}

async function metaCreatePagesOfType(graphql, createPage, type) {
  const blogPosts = await getPagesOfType(graphql, type)
  const templatePath = `./src/templates/${type}.js`
  createPages(createPage, blogPosts.data.allMarkdownRemark.edges, templatePath)
}

function createPages(createPage, posts, blogPostPath) {
  const blogPost = path.resolve(blogPostPath)
  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node

    createPage({
      path: post.node.fields.slug,
      component: blogPost,
      context: {
        slug: post.node.fields.slug,
        previous,
        next,
      },
    })
  })  
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

async function getPagesOfType(graphql, type) {
  const pages = await graphql(getQueryForType(type))
  if(pages.errors) {
    throw pages.errors
  }
  return pages
}

function getQueryForType(type) {
  return `
  {
    allMarkdownRemark(
      filter: {frontmatter: {type: {eq: "${type}"}}}
      sort: { fields: [frontmatter___date], order: DESC }
      limit: 1000
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            type
          }
        }
      }
    }
  }
`
}
