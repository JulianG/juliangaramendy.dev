import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import Image from 'gatsby-image'

import { rhythm } from '../utils/typography'

import GitHubLogo from '../../content/assets/github-logo.svg'
import TwitterLogo from '../../content/assets/twitter-logo.svg'

function Bio() {
  return (
    <StaticQuery
      query={bioQuery}
      render={data => {
        const { author, social } = data.site.siteMetadata
        return (
          <div>
            <Image
              fixed={data.avatar.childImageSharp.fixed}
              alt={author}
              style={styles.bioImageStyle}
              imgStyle={{ borderRadius: `50%` }}
            />
            <p style={styles.bioText}>
              Written by <strong>{author}</strong>&nbsp;
              <a style={styles.socialIconLink} href="https://dev.to/juliang">
                <img
                  style={styles.socialIcon}
                  src="https://d2fltix0v2e0sb.cloudfront.net/dev-badge.svg"
                  alt="Julian Garamendy's DEV Profile"
                />
              </a>
              &nbsp;
              <a
                style={styles.socialIconLink}
                href={`https://twitter.com/${social.twitter}`}
              >
                <img style={styles.socialIcon} src={TwitterLogo} />
              </a>
              &nbsp;
              <a
                style={styles.socialIconLink}
                href={`https://github.com//${social.github}/`}
              >
                <img style={styles.socialIcon} src={GitHubLogo} />
              </a>
            </p>
          </div>
        )
      }}
    />
  )
}

const bioQuery = graphql`
  query BioQuery {
    avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
      childImageSharp {
        fixed(width: 25, height: 25) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    site {
      siteMetadata {
        author
        social {
          twitter
          github
        }
      }
    }
  }
`

const styles = {
  socialIcon: {
    width: '1.25rem',
    height: '1.25rem',
    verticalAlign: 'bottom',
    marginBottom: '0.2rem',
  },
  socialIconLink: {
    boxShadow: 'none',
  },
  bioText: {
    marginTop: '1rem',
    marginBottom: '1rem',
  },
  bioImageStyle: {
    marginRight: rhythm(1 / 4),
    marginBottom: 0,
    minWidth: 25,
    borderRadius: `100%`,
    float: 'left',
  },
}

export default Bio
