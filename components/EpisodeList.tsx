"use client";
import { useState } from "react";
import { BlogPost } from "@/types/types";
import PostHero from "./PostHero";

const INITIAL_LIMIT = 5;

export default function EpisodeList({ posts }: { posts: BlogPost[] }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? posts : posts.slice(0, INITIAL_LIMIT);

  return (
    <div className="relative flex flex-col w-full mb-24">
      <p className="font-mono text-xs uppercase tracking-widest text-[#EC7A5B] mb-4 px-1">Healthcare Reframed</p>
      <h2 className="font-mono uppercase text-4xl md:text-5xl text-[#2F2C2C] mb-10 px-1">Latest Episodes</h2>
      <div className="flex flex-col space-y-12">
      {visible.map((post, index) => (
        <PostHero key={index} episode={post} />
      ))}
      </div>
      {!showAll && posts.length > INITIAL_LIMIT && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => setShowAll(true)}
            className="font-mono uppercase text-sm px-8 py-4 border-2 border-[#2F2C2C] text-[#2F2C2C] rounded-full hover:bg-[#2F2C2C] hover:text-[#FFFBF7] transition-all duration-300"
          >
            Show More Episodes
          </button>
        </div>
      )}
    </div>
  );
}
