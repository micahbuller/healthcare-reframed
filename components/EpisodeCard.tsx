"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/types/types";

const TAG_COLORS: Record<string, string> = {
  "System Reform": "bg-[#EC7A5B]/15 text-[#EC7A5B] border-[#EC7A5B]/30",
  "Primary Care": "bg-[#2F2C2C]/8 text-[#2F2C2C] border-[#2F2C2C]/20",
  "Health Equity": "bg-[#EC7A5B]/15 text-[#EC7A5B] border-[#EC7A5B]/30",
  "Leadership": "bg-[#2F2C2C]/8 text-[#2F2C2C] border-[#2F2C2C]/20",
  "Public Health": "bg-[#2F2C2C]/8 text-[#2F2C2C] border-[#2F2C2C]/20",
  "Patient-Centered Care": "bg-[#EC7A5B]/15 text-[#EC7A5B] border-[#EC7A5B]/30",
  "Innovation": "bg-[#2F2C2C]/8 text-[#2F2C2C] border-[#2F2C2C]/20",
  "International Models": "bg-[#2F2C2C]/8 text-[#2F2C2C] border-[#2F2C2C]/20",
  "Rural Health": "bg-[#2F2C2C]/8 text-[#2F2C2C] border-[#2F2C2C]/20",
  "Trust": "bg-[#EC7A5B]/15 text-[#EC7A5B] border-[#EC7A5B]/30",
  "Value-Based Care": "bg-[#2F2C2C]/8 text-[#2F2C2C] border-[#2F2C2C]/20",
  "Policy": "bg-[#2F2C2C]/8 text-[#2F2C2C] border-[#2F2C2C]/20",
  "Shared Decision Making": "bg-[#EC7A5B]/15 text-[#EC7A5B] border-[#EC7A5B]/30",
  "Quality Improvement": "bg-[#2F2C2C]/8 text-[#2F2C2C] border-[#2F2C2C]/20",
  "Mission-Driven": "bg-[#EC7A5B]/15 text-[#EC7A5B] border-[#EC7A5B]/30",
  "Community Health": "bg-[#2F2C2C]/8 text-[#2F2C2C] border-[#2F2C2C]/20",
  "Global Health": "bg-[#2F2C2C]/8 text-[#2F2C2C] border-[#2F2C2C]/20",
  "Science Communication": "bg-[#2F2C2C]/8 text-[#2F2C2C] border-[#2F2C2C]/20",
  "Healthcare Economics": "bg-[#2F2C2C]/8 text-[#2F2C2C] border-[#2F2C2C]/20",
};

const DEFAULT_TAG_COLOR = "bg-[#2F2C2C]/8 text-[#2F2C2C] border-[#2F2C2C]/20";

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const EpisodeCard: React.FC<{ episode: BlogPost; index?: number; variant?: "list" | "grid" }> = ({ episode, variant = "list" }) => {
  const { title, description, imageUrl, slug, date, tags, guestName } = episode;
  const isGrid = variant === "grid";

  if (isGrid) {
    return (
      <Link href={`/transcripts/${slug}`} className="block group" aria-label={`View episode: ${title}`}>
        <div className="flex flex-col rounded-2xl border border-[#2F2C2C]/10 hover:border-[#EC7A5B]/40 transition-all duration-300 overflow-hidden">
          {/* Thumbnail */}
          <div className="relative w-full aspect-video shrink-0 bg-[#2F2C2C]">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={`Thumbnail for ${title}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) calc(100vw - 2rem), (max-width: 1024px) 50vw, 33vw"
              />
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col flex-1 p-4">
            {/* Type tag + date */}
            <div className="flex items-center gap-2 mb-2">
              {tags && tags.length > 0 && (
                <span
                  className={`inline-block font-mono text-xs uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${TAG_COLORS[tags[0]] ?? DEFAULT_TAG_COLOR}`}
                >
                  {tags[0]}
                </span>
              )}
              {date && (
                <span className="font-mono text-xs text-[#2F2C2C]/40">{formatDate(date)}</span>
              )}
            </div>

            {/* Title */}
            <h3 className="font-mono uppercase text-[#2F2C2C] text-sm leading-snug mb-2 group-hover:text-[#EC7A5B] transition-colors duration-200 line-clamp-3">
              {title}
            </h3>

            {/* Guest */}
            {guestName && (
              <p className="font-mono text-xs uppercase tracking-widest text-[#2F2C2C]/40 mb-3">
                {guestName}
              </p>
            )}

            {/* Arrow CTA */}
            <div className="mt-auto flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-[#2F2C2C]/30 group-hover:text-[#EC7A5B] transition-colors duration-200">
              <span>Listen &amp; Read</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-200">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/transcripts/${slug}`} className="block group" aria-label={`View episode: ${title}`}>
      <div className="flex flex-col md:flex-row gap-5 md:gap-8 p-5 md:p-6 rounded-3xl border border-[#2F2C2C]/10 hover:border-[#EC7A5B]/40 transition-all duration-300 md:h-64 lg:h-72">
        {/* Thumbnail */}
        <div className="relative w-full aspect-video md:w-auto md:h-full shrink-0 rounded-2xl overflow-hidden bg-[#2F2C2C]">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={`Thumbnail for ${title}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) calc(100vw - 2.5rem), 35vw"
            />
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col justify-between flex-1 min-w-0 py-1">
          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className={`inline-block font-mono text-xs uppercase tracking-wider px-3 py-1 rounded-full border ${TAG_COLORS[tag] ?? DEFAULT_TAG_COLOR}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="font-mono uppercase text-[#2F2C2C] text-lg md:text-xl lg:text-2xl leading-tight mb-2 group-hover:text-[#EC7A5B] transition-colors duration-200">
            {title}
          </h3>

          {/* Guest + date */}
          {(guestName || date) && (
            <p className="font-mono text-xs uppercase tracking-widest text-[#2F2C2C]/50 mb-3">
              {guestName && <span>{guestName}</span>}
              {guestName && date && <span className="mx-2">·</span>}
              {date && <span>{formatDate(date)}</span>}
            </p>
          )}

          {/* Description */}
          <p className="font-sans text-sm text-[#2F2C2C]/70 leading-relaxed line-clamp-2 lg:line-clamp-3 mb-4">
            {description}
          </p>

          {/* Arrow CTA */}
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#2F2C2C]/40 group-hover:text-[#EC7A5B] transition-colors duration-200">
            <span>Listen &amp; Read</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EpisodeCard;
