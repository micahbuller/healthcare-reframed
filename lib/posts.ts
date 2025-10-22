import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { BlogPost } from "@/types/types";

const postsDirectory = path.join(process.cwd(), "app/content/posts");

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory).map((file) => file.replace(/\.mdx$/, ""));
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
    externalLink: data.externalLink,
    date: data.date ? new Date(data.date) : new Date(), // Fallback to current date if missing
    youtubeLink: data.youtubeLink || "",
    spotifyLink: data.spotifyLink || "",
    appleMusicLink: data.appleMusicLink || "",
    content,
  };
}

export function getAllPosts() {
  const slugs = getPostSlugs();
  const posts = slugs.map((slug) => getPostBySlug(slug));
  
  // Debug: Log all posts with their dates
  console.log('All posts with dates:');
  posts.forEach(post => {
    console.log(`${post.slug}: ${post.date} (${post.date instanceof Date ? 'Valid Date' : 'Invalid Date'})`);
  });
  
  const sortedPosts = posts.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    
    // Handle invalid dates
    if (isNaN(dateA.getTime())) return 1;
    if (isNaN(dateB.getTime())) return -1;
    
    return dateB.getTime() - dateA.getTime(); // Newest first
  });
  
  console.log('Sorted order:');
  sortedPosts.forEach((post, index) => {
    console.log(`${index + 1}. ${post.slug}: ${post.date}`);
  });
  
  return sortedPosts;
}