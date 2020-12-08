// based on https://github.com/vercel/next.js/blob/fcf129d90dc611c4836bb148a6bb7ee77067d82c/examples/blog-starter/lib/api.js

import fs from "fs";
import { join } from "path";
import matter from "gray-matter";
import { Post, PostSummary } from "./types";
import { markdownToHtml } from "./markdownToHtml";

const postsDirectory = join(process.cwd(), "public/blog");


export async function getAllPosts(): Promise<PostSummary[]> {
  const slugs = fs
    .readdirSync(postsDirectory)
    .filter((slug) => slug[0] !== ".");
  return slugs
    .map((slug) => getPostSummary(slug))
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
}

function getPostSummary(slug: string): PostSummary {
  const fullPath = join(postsDirectory, slug, `index.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data } = matter(fileContents);

  return {
    slug,
    title: data.title,
    date: data.date,
    description: data.description || "",
  };
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const fullPath = join(postsDirectory, slug, `index.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const parts = matter(content);
  
  const bodyMarkdown = parts.content.replace(/\(.\/(.+)\)/g, `(/blog/${slug}/$1)`)

  const bodyHtml = await markdownToHtml(bodyMarkdown);

  return {
    slug,
    title: data.title || '',
    date: data.date || "1970-01-01",
    bodyHtml,
  };
}

const pagesDirectory = join(process.cwd(), "public/pages");

export async function getPage(slug: string) {
  
  const fullPath = join(pagesDirectory, slug, `index.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const parts = matter(content);
  
  const bodyMarkdown = parts.content.replace(/\(.\/(.+)\)/g, `(/pages/${slug}/$1)`)

  const bodyHtml = await markdownToHtml(bodyMarkdown);

  return {
    title: data.title || '',
    description: data.description || '',
    bodyHtml,
  };
}