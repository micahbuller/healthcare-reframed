import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import { getDevMode } from "@/lib/dev-mode";
import EpisodesClient from "./EpisodesClient";

// Revalidate every 5 minutes so scheduled posts go live without a redeploy
export const revalidate = 300;

export const metadata: Metadata = {
  title: "All Episodes",
  description:
    "Browse every Healthcare Reframed episode — honest conversations with healthcare leaders, innovators, and trailblazers building a stronger, more humane system.",
};

export default async function EpisodesPage() {
  const posts = getAllPosts(await getDevMode());
  return <EpisodesClient posts={posts} />;
}
