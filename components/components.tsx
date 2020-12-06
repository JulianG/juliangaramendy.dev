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
      Written by Julian Garamendy (links)
    </footer>
  );
};
