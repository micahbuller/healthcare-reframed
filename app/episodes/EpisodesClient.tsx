"use client";
import React, { useState, useMemo } from "react";
import EpisodeCard from "@/components/EpisodeCard";
import { BlogPost } from "@/types/types";

type SortOrder = "newest" | "oldest" | "a-z" | "z-a";

const SORT_LABELS: Record<SortOrder, string> = {
  newest: "Newest",
  oldest: "Oldest",
  "a-z": "A → Z",
  "z-a": "Z → A",
};

export default function EpisodesClient({ posts }: { posts: BlogPost[] }) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOrder>("newest");
  const [showFull, setShowFull] = useState(true);
  const [showEssentials, setShowEssentials] = useState(true);

  const filtered = useMemo(() => {
    const result = [...posts].filter((p) => {
      const type = p.episodeType ?? "Full Episode";
      if (!showFull && type === "Full Episode") return false;
      if (!showEssentials && type === "Essentials") return false;
      if (search.trim() && !p.title.toLowerCase().includes(search.toLowerCase().trim())) return false;
      return true;
    });

    switch (sort) {
      case "newest":
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case "a-z":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "z-a":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }
    return result;
  }, [posts, search, sort, showFull, showEssentials]);

  return (
    <div className="min-h-screen">

      {/* Dark hero section — header + search + controls */}
      <div className="bg-[#2F2C2C] pt-28 pb-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6">

          {/* Page header */}
          <div className="mb-8">
            <p className="font-mono text-xs uppercase tracking-widest text-[#EC7A5B] mb-3">Healthcare Reframed</p>
            <h1 className="font-mono uppercase text-5xl md:text-6xl lg:text-7xl text-[#FFFBF7] leading-none mb-4">
              All Episodes
            </h1>
            <p className="font-sans text-[#FFFBF7]/40 text-base max-w-xl leading-relaxed">
              Every conversation in the Healthcare Reframed archive — search, sort, and filter to find what speaks to you.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative mb-6">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FFFBF7]/30 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search episodes by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full font-sans text-sm bg-[#FFFBF7]/8 border border-[#FFFBF7]/12 rounded-full px-6 py-4 pl-11 text-[#FFFBF7] placeholder-[#FFFBF7]/30 focus:outline-none focus:border-[#EC7A5B]/50 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#FFFBF7]/30 hover:text-[#FFFBF7] transition-colors"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Controls row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Sort dropdown */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs uppercase text-[#FFFBF7]/35 shrink-0">Sort by</span>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOrder)}
                  className="appearance-none font-mono uppercase text-xs bg-[#FFFBF7]/8 border border-[#FFFBF7]/20 text-[#FFFBF7] rounded-full px-4 py-2 pr-8 focus:outline-none focus:border-[#EC7A5B]/50 transition-colors cursor-pointer"
                >
                  {(Object.keys(SORT_LABELS) as SortOrder[]).map((s) => (
                    <option key={s} value={s} className="bg-[#2F2C2C] text-[#FFFBF7]">
                      {SORT_LABELS[s]}
                    </option>
                  ))}
                </select>
                <svg
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#FFFBF7]/40"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Type filter checkboxes */}
            <div className="flex items-center gap-5">
              <span className="font-mono text-xs uppercase text-[#FFFBF7]/35">Filter:</span>
              {[
                { label: "Full Episode", checked: showFull, toggle: () => setShowFull((v) => !v) },
                { label: "Essentials", checked: showEssentials, toggle: () => setShowEssentials((v) => !v) },
              ].map(({ label, checked, toggle }) => (
                <label key={label} className="flex items-center gap-2 cursor-pointer group select-none">
                  <button
                    role="checkbox"
                    aria-checked={checked}
                    onClick={toggle}
                    className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all duration-200 ${
                      checked
                        ? "bg-[#EC7A5B] border-[#EC7A5B]"
                        : "border-[#FFFBF7]/30 group-hover:border-[#EC7A5B]/50"
                    }`}
                  >
                    {checked && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <span className="font-mono text-xs uppercase text-[#FFFBF7]/50 group-hover:text-[#FFFBF7] transition-colors">
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Light episodes grid section */}
      <div className="bg-[#FFFBF7] py-10 pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Result count */}
          <p className="font-mono text-xs uppercase tracking-widest text-[#2F2C2C]/30 mb-6">
            {filtered.length} episode{filtered.length !== 1 ? "s" : ""}
          </p>

          {/* Episode grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {filtered.map((post, i) => (
                <EpisodeCard key={post.slug} episode={post} index={i} variant="grid" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <svg className="w-10 h-10 text-[#2F2C2C]/15 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="font-mono uppercase text-lg text-[#2F2C2C]/25 mb-2">No episodes found</p>
              <p className="font-sans text-sm text-[#2F2C2C]/30">
                Try adjusting your search or filter settings
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
