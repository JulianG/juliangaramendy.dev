import { GetServerSideProps } from "next";
import React from 'react';
import { CommonHead, Footer, Navigation } from '../components';
import { getPage } from '../lib/fs-api';
import { legacyBlogPosts } from "../lib/legacy-blogposts";

export const Page = ({ title, bodyHtml }: { title: string, bodyHtml: string }): JSX.Element => {

  return (
    <article>
      <header>
        <CommonHead title={`${title} - Julian​Garamendy​.dev`} />
        <h1>Julian​Garamendy​.dev</h1>
        <Navigation />
      </header>
      <section>
        <h1>{title}</h1>
        <div dangerouslySetInnerHTML={{ __html: bodyHtml }}></div>
      </section>
      <Footer />
    </article>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { page } = context.query;

  const redirectPath = legacyBlogPosts[`${page}`];

  if (redirectPath) {
    context.res.statusCode = 301;
    context.res.setHeader("Location", redirectPath);
    context.res.end("");
    return;
  }

  const {title, bodyHtml} = await getPage(`${page}`)

  return { props: {title, bodyHtml} };
};

export default Page;
