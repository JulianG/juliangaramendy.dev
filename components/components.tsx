import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

type Props = { title: string };
export function CommonHead({ title }: Props) {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400&family=Fira+Sans+Condensed:ital,wght@0,300;0,500;1,400&family=Fira+Sans+Extra+Condensed:wght@500;700&display=swap"
          rel="stylesheet"
        />
        <link href="/styles.css" rel="stylesheet" type="text/css" />
        <link href="/prism.css" rel="stylesheet" type="text/css" />
        <title>{title}</title>
      </Head>
    </>
  );
}

export const Navigation: React.FC = () => {
  const r = useRouter();

  const sectionName = r.pathname.split("/").filter((p) => !!p)[0];

  return (
    <nav>
      <ul>
        <li>
          <a href="/info" className={sectionName === "info" ? "selected" : ""}>
            Info
          </a>
        </li>

        <li>
          <a href="/work" className={sectionName === "work" ? "selected" : ""}>
            Work
          </a>
        </li>

        <li>
          <a href="/blog" className={sectionName === "blog" ? "selected" : ""}>
            Blog
          </a>
        </li>
      </ul>
    </nav>
  );
};

export const ArticlePageLayout: React.FC = ({ children }) => {
  return (
    <article>
      <header>
        <CommonHead title={"aaaa"} />
        <h1>Julian​Garamendy​.dev</h1>
        <Navigation />
      </header>
      <section>{children}</section>
    </article>
  );
};

export const Footer = () => {
  return (
    <footer>
      <hr />
      <p style={styles.bioText}>
              Written by <strong>Julian Garamendy</strong>&nbsp;
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
                href={`https://twitter.com/JulianGWeb`}
              >
                <img style={styles.socialIcon} src='/assets/twitter-logo.svg' />
              </a>
              &nbsp;
              <a
                style={styles.socialIconLink}
                href={`https://github.com//JulianG`}
              >
                <img style={styles.socialIcon} src='/assets/github-logo.svg' />
              </a>
            </p>
    </footer>
  );
};


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
    marginRight: '0.25rem',
    marginBottom: 0,
    minWidth: 25,
    borderRadius: `100%`,
    float: 'left',
  },
}