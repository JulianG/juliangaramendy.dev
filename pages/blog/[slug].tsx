import { GetServerSideProps } from "next";
import React from "react";
import dayjs from "dayjs";
import { Navigation, CommonHead, Footer } from "../../components";
import { getPostBySlug } from "../../lib/merged-api";
import { Post } from '../../lib/types';

export const BlogPostPage = ({ post }: { post: Partial<Post> }): JSX.Element => {
  const publishDate = dayjs(post.date).format("D MMMM, YYYY");

  return (
    <article>
      <header>
        <CommonHead title={`${post.title} - Julian​Garamendy​.dev`} />
        <h1>Julian​Garamendy​.dev</h1>
        <Navigation />
      </header>
      <section>
        <h1>{post.title}</h1>
        <small>{publishDate}</small>
        {post.coverImage ? <img src={post.coverImage} /> : null}
        <div dangerouslySetInnerHTML={{ __html: post.bodyHtml }}></div>
      </section>
      <Footer />
    </article>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.query;
  try {
    const post = await getPostBySlug(`${slug}`);
    return { props: { post } };
  } catch (e) {
    context.res.statusCode = 404;
    context.res.end("Not found!!");
  }
};

export default BlogPostPage;
