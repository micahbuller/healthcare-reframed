import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { BlogPost } from "@/types/types";

const postsDirectory = path.join(process.cwd(), "app/content/posts");

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory).map((file) => file.replace(/\.mdx$/, ""));
}

export async function getPostBySlug(slug: string): Promise<BlogPost> {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    id: data.id || slug, // Use slug as fallback for id
    slug,
    title: data.title,
    description: data.description,
    imageUrl: data.imageUrl,
    externalLink: data.externalLink,
    date: data.date,
    youtubeLink: data.youtubeLink || "", // Provide default value if missing
    spotifyLink: data.spotifyLink || "", // Provide default value if missing
    appleMusicLink: data.appleMusicLink || "", // Provide default value if missing
    content,
  };
}

export async function getAllPosts() {
  const slugs = getPostSlugs();
  const posts = await Promise.all(slugs.map((slug) => getPostBySlug(slug)));
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}