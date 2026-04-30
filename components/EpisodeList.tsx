"use client";
import { useState } from "react";
import { BlogPost } from "@/types/types";
import EpisodeCard from "./EpisodeCard";

const INITIAL_LIMIT = 6;

export default function EpisodeList({ posts }: { posts: BlogPost[] }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? posts : posts.slice(0, INITIAL_LIMIT);

  return (
    <div className="relative flex flex-col w-full mb-24">
      <p className="font-mono text-xs uppercase tracking-widest text-[#EC7A5B] mb-4 px-1">Healthcare Reframed</p>
      <h2 className="font-mono uppercase text-4xl md:text-5xl text-[#2F2C2C] mb-10 px-1">All Episodes</h2>
      <div className="flex flex-col gap-5">
        {visible.map((post, index) => (
          <EpisodeCard key={post.slug} episode={post} index={index} />
        ))}
      </div>
      {!showAll && posts.length > INITIAL_LIMIT && (
        <div className="flex justify-center pt-8">
          <button
            onClick={() => setShowAll(true)}
            className="font-mono uppercase text-sm px-8 py-4 border-2 border-[#2F2C2C] text-[#2F2C2C] rounded-full hover:bg-[#2F2C2C] hover:text-background transition-all duration-300"
          >
            Show All Episodes
          </button>
        </div>
      )}
    </div>
  );
}
