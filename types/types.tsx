import { MDXRemoteSerializeResult } from "next-mdx-remote/rsc";

export interface BlogPost {
  slug: string;
  content: string | MDXRemoteSerializeResult; // Raw MDX string or serialized MDX content
  id: string;
  title: string; // Title of the blog post
  description: string; // Short description of the blog post
  imageUrl: string; // Link to the picture for the blog post
  externalLink: string; // Link for further reading outside the website
  date: Date; // Date of the blog post as a JavaScript Date object
  youtubeLink: string;
  spotifyLink: string;
  appleMusicLink: string;
}
