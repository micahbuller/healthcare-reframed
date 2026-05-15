import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { BlogPost } from "@/types/types";

const postsDirectory = path.join(process.cwd(), "app/content/posts");

function isPostLive(post: BlogPost): boolean {
  return post.date <= new Date();
}

export function getPostSlugs() {
  return fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""))
    .filter((slug) => {
      const post = getPostBySlug(slug);
      return isPostLive(post);
    });
}

export function getPostBySlug(slug: string): BlogPost {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    id: data.id || slug,
    slug,
    title: data.title,
    description: data.description,
    imageUrl: data.imageUrl,
    externalLink: data.externalLink || "",
    date: data.date ? new Date(data.date) : new Date(),
    youtubeLink: data.youtubeLink || "",
    spotifyLink: data.spotifyLink || "",
    appleMusicLink: data.appleMusicLink || "",
    tags: data.tags || [],
    episodeType: data.episodeType || "Full Episode",
    guestName: data.guestName || "",
    guestTitle: data.guestTitle || "",
    guestBio: data.guestBio || "",
    guestLinks: data.guestLinks || [],
    showNotes: data.showNotes || "",
    timestamps: data.timestamps || [],
    peopleMentioned: data.peopleMentioned || [],
    booksMentioned: data.booksMentioned || [],
    substackUrl: data.substackUrl || "",
    content,
  };
}

export function getAllPosts(showAll = false) {
  const slugs = fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));

  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post) => showAll || isPostLive(post));

  return posts.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    if (isNaN(dateA.getTime())) return 1;
    if (isNaN(dateB.getTime())) return -1;
    return dateB.getTime() - dateA.getTime();
  });
}