import { GetServerSideProps } from "next";
import React from "react";
import dayjs from "dayjs";
import { Navigation, CommonHead, Footer } from "../components";
import { getAllPosts } from "../lib/merged-api";
import { PostSummary } from '../lib/types';

export const BlogPage = ({
  posts,
}: {
  posts: Array<PostSummary>;
}): JSX.Element => {
  return (
    <article>
      <header>
        <CommonHead title="Blog - Julian​Garamendy​.dev" />
        <h1>Julian​Garamendy​.dev</h1>
        <Navigation />
      </header>
      <section>
        <h1>I have to write this down</h1>
        <h4>
          A blog about React, TypeScript, and of course bananas. Some of these
          posts appear on <a href="https://dev.to/juliang">dev.to.</a>
        </h4>

        <ul className="article-list">
          {posts.map((post) => (
            <PostListItem key={post.slug} post={post} />
          ))}
        </ul>
        <Footer />
      </section>
    </article>
  );
};

const PostListItem: React.FC<{ post: PostSummary }> = ({ post }) => {
  const publishDate = dayjs(post.date).format("D MMMM, YYYY");
  return (
    <li>
      <small><strong>{publishDate}</strong></small>
      <h2>
        <a href={`/blog/${post.slug}`} style={{ boxShadow: "none" }}>
          {post.title}
        </a>
      </h2>
      <p>
        This is the easiest way I know to get a public persistent REST API up
        and running in under 1 minute, without writing any code.
      </p>
    </li>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const posts = await getAllPosts();
  return { props: { posts } };
};

export default BlogPage;
