import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import EpisodesClient from "./EpisodesClient";

export const metadata: Metadata = {
  title: "All Episodes",
  description:
    "Browse every Healthcare Reframed episode — honest conversations with healthcare leaders, innovators, and trailblazers building a stronger, more humane system.",
};

export default function EpisodesPage() {
  const posts = getAllPosts();
  return <EpisodesClient posts={posts} />;
}
