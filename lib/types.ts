export type PostSummary = {
  slug: string;
  title: string;
  date: string;
  description: string;
};

export type Post = {
  slug: string;
  title: string;
  date: string;
  bodyHtml: string;
  coverImage?: string;
  socialImage?: string;
};