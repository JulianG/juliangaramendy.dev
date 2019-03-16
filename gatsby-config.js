module.exports = {
  siteMetadata: {
    siteUrl: `https://juliangaramendy.dev/`,
    title: `JulianGaramendy.dev`,
    description: `JulianGaramendy.dev`,
    blogTitle: `I Have to Write This Down`,
    blogDescription: `A blog about React, TypeScript, and of course bananas.`,
    author: `Julian Garamendy`,
    social: {
      twitter: `juliangweb`,
      github: `JulianG`
    },
    keywords: [`blog`, `gatsby`, `javascript`, `react`]
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/pages`,
        name: `pages`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
              wrapperStyle: 'text-align: left',
              linkImagesToOriginal: false,
              showCaptions: true,
              quality: 90,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-136122892-1`,
        anonymize: true,
        respectDNT: true,
      },
    },
    `gatsby-plugin-feed`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `JulianGaramendy.dev`,
        short_name: `JulianGaramendy.dev`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#D6AB00`,
        display: `minimal-ui`,
        icon: `content/assets/banana-icon.png`,
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
    `gatsby-remark-prismjs`
  ],
}
