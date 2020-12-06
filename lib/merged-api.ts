import { Post, PostSummary } from "./types";
import {
  getPostBySlug as getFSPostBySlug,
  getAllPosts as getAllFSPosts,
} from "./fs-api";
import {
  getPostBySlug as getDevPostBySlug,
  getAllPosts as getAllDevPosts,
} from "./dev-api";

export async function getAllPosts(): Promise<PostSummary[]> {
  const [fs, dev] = await Promise.all([getAllFSPosts(), getAllDevPosts()]);
  const allPosts = [...fs, ...dev].sort((post1, post2) =>
    post1.date > post2.date ? -1 : 1
  );
  return allPosts;
}

export async function getPostBySlug(slug: string): Promise<Post> {
  try {
    const post = await getFSPostBySlug(slug);
    return post;
  } catch (e) {
    const post = await getDevPostBySlug(slug);
    return post;
  }
}
