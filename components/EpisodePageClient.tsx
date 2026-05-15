"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogPost, GuestLink } from "@/types/types";
import TrackedExternalLink from "@/components/TrackedExternalLink";

// -- Platform icons --

const YoutubeIcon = () => (
  <svg width="22" height="16" viewBox="0 0 59 42" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M57.77 6.56C57.09 3.98 55.1 1.95 52.55 1.25 47.95 0 29.5 0 29.5 0S11.05 0 6.45 1.25C3.91 1.95 1.91 3.98 1.23 6.56 0 11.24 0 21 0 21s0 9.76 1.23 14.44c.68 2.58 2.68 4.61 5.22 5.3C11.05 42 29.5 42 29.5 42s18.45 0 23.05-1.26c2.54-.69 4.54-2.72 5.22-5.3C59 30.76 59 21 59 21S59 11.24 57.77 6.56zM23.6 30V12l15.33 9L23.6 30z" fill="currentColor" />
  </svg>
);

const SpotifyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M20 0.64C36.46-.11 47.06 17.94 38.18 31.91 30.15 44.52 11.62 44.43 3.69 31.78-4.55 18.62 4.52 1.34 20 0.64zM14.69 11.97c-2 .2-4.29.22-6.23.76-1.57.43-1.99 2.46-.66 3.43.93.69 2 .22 3.03.07 7.33-1.08 14.28-.15 20.99 2.88.59.27 1.69.95 2.27.99 1.75.14 2.8-1.9 1.62-3.23-.36-.41-1.55-.93-2.08-1.18-4.81-2.26-10.09-3.49-15.41-3.76l-3.56.04zm1.16 7.01c-2.04.11-4.18.23-6.16.71-2.37.58-1.64 3.36.34 3.17.83-.09 1.78-.37 2.65-.48 5.62-.73 11.48.17 16.61 2.54.56.26 1.16.64 1.72.87 1.54.64 2.89-1.05 1.92-2.37-.36-.49-1.86-1.14-2.46-1.42-4.19-1.92-8.75-2.91-13.37-3.03l-1.24.01zm-.85 6.33c-1.31.06-3.76.32-4.96.77-1.27.47-.88 2.37.47 2.36 5.45-1.37 11.35-.8 16.44 1.58.51.24 1.71.99 2.16 1.05 1.04.14 1.75-1.05 1.15-1.9-.34-.48-2.41-1.4-3.03-1.67-3.87-1.67-8.01-2.37-12.24-2.16l-.01.01z" fill="currentColor" />
  </svg>
);

const SubstackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="3" y="4" width="18" height="2.5" rx="1" fill="currentColor" />
    <rect x="3" y="9.75" width="18" height="2.5" rx="1" fill="currentColor" />
    <path d="M3 15.5h18v5.25L12 18.5 3 20.75V15.5z" fill="currentColor" />
  </svg>
);

const AppleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 41 42" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M40.93 11.57c0-.41 0-.82-.01-1.23-.02-.9-.08-1.8-.24-2.69-.16-.9-.43-1.74-.84-2.56-.41-.8-.95-1.54-1.58-2.18-.64-.64-1.38-1.17-2.18-1.58-.82-.42-1.66-.69-2.55-.85-.89-.16-1.79-.21-2.69-.24-.41-.01-.83-.01-1.23-.01-.49 0-.98 0-1.47 0H12.8c-.49 0-.98 0-1.47 0-.41 0-.82 0-1.23.01-.9.02-1.8.08-2.69.24-.9.16-1.74.43-2.55.85-.81.41-1.54.95-2.18 1.58-.64.64-1.17 1.38-1.58 2.18-.42.82-.69 1.66-.85 2.56-.16.89-.21 1.8-.24 2.69-.01.41-.01.82-.01 1.23 0 .49 0 .98 0 1.47v15.32c0 .49 0 .98 0 1.47 0 .41 0 .82.01 1.23.02.9.08 1.8.24 2.69.16.9.43 1.74.84 2.56.41.8.95 1.54 1.58 2.18.64.64 1.38 1.17 2.18 1.58.82.42 1.66.69 2.55.85.89.16 1.79.21 2.69.24.41.01.83.01 1.23.01.49.01.98 0 1.47 0h15.32c.49 0 .98 0 1.47 0 .41 0 .82-.01 1.23-.01.9-.02 1.8-.08 2.69-.24.9-.16 1.74-.43 2.55-.85.8-.41 1.54-.95 2.18-1.58.64-.64 1.17-1.38 1.58-2.18.42-.82.69-1.66.85-2.56.16-.89.21-1.8.24-2.69.01-.41.01-.82.01-1.23.01-.49 0-.98 0-1.47V13.04c.01-.49.01-.98.01-1.47zM29.96 26.87c0 .52-.01.99-.11 1.51-.11.51-.3.98-.59 1.42-.29.43-.67.79-1.12 1.05-.45.27-.92.42-1.42.52-.94.19-1.58.23-2.19.11-.58-.12-1.08-.39-1.47-.75-.59-.54-.96-1.27-1.04-2.03-.09-.89.23-1.84.89-2.54.34-.35.79-.63 1.36-.85.59-.23 1.24-.37 2.25-.57.27-.05.53-.11.8-.16.35-.07.65-.16.89-.46.25-.3.25-.66.25-1.01V14.06c0-.69-.31-.88-.97-.75l-11.23 2.28c-.57.14-.76.32-.76 1.04v13.2c0 .52-.03.99-.13 1.51-.11.51-.3.98-.59 1.42-.29.43-.67.79-1.12 1.05-.45.27-.92.42-1.42.52-.94.19-1.58.23-2.19.11-.58-.12-1.08-.39-1.47-.75-.59-.54-.96-1.27-1.04-2.03-.09-.89.23-1.84.89-2.54.34-.35.79-.63 1.36-.85.59-.23 1.24-.37 2.25-.57.27-.05.53-.11.8-.16.35-.07.65-.16.89-.46.24-.3.27-.65.27-.99V10.68c0-.2.02-.34.03-.41.05-.32.18-.6.42-.79.19-.16.44-.27.76-.34l12.18-2.47c.11-.02.97-.15 1.07-.16.66-.06 1.03.37 1.03 1.07l-.01 19.31z" fill="currentColor" />
  </svg>
);

// -- YouTube helpers --

function extractVideoId(url?: string): string | null {
  if (!url) return null;
  const patterns = [
    /[?&]v=([^&#]+)/,
    /youtu\.be\/([^?&#]+)/,
    /embed\/([^?&#]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function timeToSeconds(time: string): number {
  const parts = time.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return 0;
}

// -- Embedded YouTube player (IFrame API) --

const YouTubePlayerEmbed: React.FC<{
  videoId: string;
  playerRef: React.MutableRefObject<any>;
}> = ({ videoId, playerRef }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let player: any;

    const createPlayer = () => {
      if (!containerRef.current) return;
      player = new (window as any).YT.Player(containerRef.current, {
        videoId,
        width: "100%",
        height: "100%",
        playerVars: { autoplay: 0, rel: 0, modestbranding: 1 },
        events: {
          onReady: () => { playerRef.current = player; },
        },
      });
    };

    if (typeof (window as any).YT !== "undefined" && (window as any).YT.Player) {
      createPlayer();
    } else {
      const prev = (window as any).onYouTubeIframeAPIReady;
      (window as any).onYouTubeIframeAPIReady = () => {
        if (typeof prev === "function") prev();
        createPlayer();
      };
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
    }

    return () => {
      playerRef.current = null;
      try { player?.destroy?.(); } catch (_) {}
    };
  }, [videoId]);

  return (
    <div
      style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}
      className="rounded-2xl overflow-hidden bg-[#2F2C2C] w-full"
    >
      <div
        ref={containerRef}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
      />
    </div>
  );
};

// -- Substack article preview card --

const SubstackCard: React.FC<{
  url: string;
  title: string;
  description: string;
  episodeTitle: string;
}> = ({ url, title, description, episodeTitle }) => (
  <TrackedExternalLink
    href={url}
    episodeTitle={episodeTitle}
    location="substack-card"
    className="flex items-start gap-5 w-full rounded-2xl bg-[#FF6719] p-6 md:p-8 hover:opacity-95 active:opacity-90 transition-opacity group no-underline"
  >
    {/* Substack "S" badge */}
    <div className="shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mt-0.5">
      <SubstackIcon />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-mono text-xs uppercase tracking-widest text-white/60 mb-2">Read on Substack</p>
      {title && (
        <h3 className="font-mono uppercase text-white text-lg md:text-xl leading-tight mb-2">
          {title}
        </h3>
      )}
      {description && (
        <p className="font-sans text-sm md:text-base text-white/80 leading-relaxed line-clamp-3">
          {description}
        </p>
      )}
    </div>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white/60 shrink-0 mt-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
    </svg>
  </TrackedExternalLink>
);

// -- Tab types --

type Tab = "show-notes" | "timestamps" | "transcript";

// -- Guest profile card --

const GuestProfile: React.FC<{ name: string; title: string; bio: string; links: GuestLink[] }> = ({
  name, title, bio, links,
}) => (
  <div className="rounded-3xl bg-[#2F2C2C] p-8 md:p-10">
    <p className="font-mono text-xs uppercase tracking-widest text-[#EC7A5B] mb-2">About the Guest</p>
    <h3 className="font-mono text-2xl md:text-3xl uppercase text-background leading-tight mb-1">{name}</h3>
    {title && <p className="font-mono text-xs uppercase tracking-wider text-background/50 mb-5">{title}</p>}
    <p className="font-sans text-base text-background/75 leading-relaxed mb-6">{bio}</p>
    {links && links.length > 0 && (
      <div className="flex flex-wrap gap-3">
        {links.map((link) => (
          <TrackedExternalLink
            key={link.label}
            href={link.url}
            location="guest-profile"
            className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-background/60 border border-background/20 rounded-full px-4 py-2 hover:text-[#EC7A5B] hover:border-[#EC7A5B]/40 transition-colors"
          >
            {link.label}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-2.5 h-2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </TrackedExternalLink>
        ))}
      </div>
    )}
  </div>
);

// -- Show Notes tab --

const ShowNotesTab: React.FC<{ post: BlogPost }> = ({ post }) => (
  <div className="space-y-10">
    {/* Episode description */}
    {post.description && (
      <p className="font-sans text-base md:text-lg text-[#2F2C2C]/80 leading-relaxed max-w-3xl">
        {post.description}
      </p>
    )}

    {/* Episode summary */}
    {post.showNotes && (
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-[#EC7A5B] mb-4">Episode Summary</p>
        <p className="font-sans text-base md:text-lg text-[#2F2C2C]/80 leading-relaxed max-w-3xl">
          {post.showNotes}
        </p>
      </div>
    )}

    {/* People Mentioned */}
    {post.peopleMentioned && post.peopleMentioned.length > 0 && (
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-[#EC7A5B] mb-4">People Mentioned</p>
        <ul className="space-y-2">
          {post.peopleMentioned.map((person) => (
            <li key={person.label} className="flex items-start gap-2">
              <span className="text-[#2F2C2C]/30 shrink-0 mt-0.5">&bull;</span>
              {person.url ? (
                <TrackedExternalLink
                  href={person.url}
                  location="show-notes-people"
                  className="font-sans text-base text-[#2F2C2C]/80 hover:text-[#EC7A5B] transition-colors underline underline-offset-2"
                >
                  {person.label}
                </TrackedExternalLink>
              ) : (
                <span className="font-sans text-base text-[#2F2C2C]/80">{person.label}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* Books Mentioned */}
    {post.booksMentioned && post.booksMentioned.length > 0 && (
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-[#EC7A5B] mb-4">Books &amp; Resources Mentioned</p>
        <ul className="space-y-2">
          {post.booksMentioned.map((book) => (
            <li key={book.label} className="flex items-start gap-2">
              <span className="text-[#2F2C2C]/30 shrink-0 mt-0.5">&bull;</span>
              {book.url ? (
                <TrackedExternalLink
                  href={book.url}
                  location="show-notes-books"
                  className="font-sans text-base text-[#2F2C2C]/80 hover:text-[#EC7A5B] transition-colors underline underline-offset-2"
                >
                  {book.label}
                </TrackedExternalLink>
              ) : (
                <span className="font-sans text-base text-[#2F2C2C]/80">{book.label}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* Scroll story */}
    {post.externalLink && (
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-[#EC7A5B] mb-4">Go Deeper</p>
        <TrackedExternalLink
          href={post.externalLink!}
          episodeTitle={post.title}
          location="show-notes-scroll-story"
          className="inline-flex items-center gap-3 font-mono uppercase text-sm px-8 py-4 border-2 border-[#2F2C2C] text-[#2F2C2C] rounded-full hover:bg-[#2F2C2C] hover:text-background transition-all duration-300"
        >
          Experience the Scroll Story
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 rotate-45">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </TrackedExternalLink>
      </div>
    )}

    {/* Guest profile */}
    {post.guestName && (
      <GuestProfile
        name={post.guestName}
        title={post.guestTitle}
        bio={post.guestBio}
        links={post.guestLinks}
      />
    )}
  </div>
);

// -- Timestamps tab --

const TimestampsTab: React.FC<{ post: BlogPost; playerRef: React.MutableRefObject<any> }> = ({ post, playerRef }) => {
  const seekTo = (time: string) => {
    const seconds = timeToSeconds(time);
    const p = playerRef.current;
    if (p?.seekTo) {
      p.seekTo(seconds, true);
      p.playVideo();
    }
  };

  return (
    <div>
      {/* Timestamps - bulleted list */}
      {post.timestamps && post.timestamps.length > 0 ? (
        <ul className="space-y-0">
          {post.timestamps.map((ts, i) => (
            <li key={i} className="flex items-baseline gap-0">
              <button
                onClick={() => seekTo(ts.time)}
                className="flex items-baseline gap-4 py-3 w-full text-left group border-b border-[#2F2C2C]/8 hover:border-[#EC7A5B]/20 transition-colors"
              >
                <span className="text-[#2F2C2C]/30 shrink-0 select-none">&bull;</span>
                <span className="font-mono text-sm text-[#EC7A5B] shrink-0 w-14">{ts.time}</span>
                <span className="font-sans text-base text-[#2F2C2C]/80 group-hover:text-[#2F2C2C] transition-colors leading-snug">{ts.label}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="font-sans text-base text-[#2F2C2C]/60">No timestamps available for this episode.</p>
      )}
    </div>
  );
};

// -- Transcript tab --

const TranscriptTab: React.FC<{ transcript: React.ReactNode; hasTranscript: boolean }> = ({ transcript, hasTranscript }) => (
  hasTranscript
    ? <>{transcript}</>
    : <p className="font-sans text-base text-[#2F2C2C]/60">No transcript available for this episode.</p>
);

// -- Main client component --

const TABS: { id: Tab; label: string }[] = [
  { id: "show-notes", label: "Show Notes" },
  { id: "timestamps", label: "Timestamps" },
  { id: "transcript", label: "Transcript" },
];

export default function EpisodePageClient({
  post, transcript, hasTranscript = true, substackPreview,
}: {
  post: BlogPost;
  transcript: React.ReactNode;
  hasTranscript?: boolean;
  substackPreview?: { title: string; description: string } | null;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("show-notes");
  const playerRef = useRef<any>(null);

  const {
    title, imageUrl, youtubeLink, spotifyLink, appleMusicLink,
    date, tags,
  } = post;

  const videoId = extractVideoId(youtubeLink);

  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "";

  return (
    <div className="bg-background min-h-screen">
      {/* Episode header */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 pt-28 md:pt-32 pb-10">
        {/* Eyebrow */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="font-mono text-xs uppercase tracking-widest text-[#EC7A5B]">Guest Episode</span>
          {formattedDate && (
            <>
              <span className="text-[#2F2C2C]/30">·</span>
              <span className="font-mono text-xs uppercase tracking-widest text-[#2F2C2C]/50">{formattedDate}</span>
            </>
          )}
        </div>

        {/* Title */}
        <h1 className="font-mono uppercase text-3xl md:text-5xl lg:text-6xl text-[#2F2C2C] leading-tight mb-6 max-w-4xl">
          {title}
        </h1>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-xs uppercase tracking-wider px-3 py-1.5 rounded-full border border-[#2F2C2C]/20 text-[#2F2C2C]/60"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Platform links */}
        <div className="flex flex-wrap gap-3 mb-10">
          {youtubeLink && (
            <TrackedExternalLink
              href={youtubeLink}
              episodeTitle={title}
              location="episode-platform-links"
              className="inline-flex items-center gap-2.5 font-mono uppercase text-sm px-5 py-3 bg-[#2F2C2C] text-background rounded-full hover:bg-[#EC7A5B] transition-colors duration-200"
            >
              <YoutubeIcon />
              YouTube
            </TrackedExternalLink>
          )}
          {spotifyLink && spotifyLink !== "/" && (
            <TrackedExternalLink
              href={spotifyLink}
              episodeTitle={title}
              location="episode-platform-links"
              className="inline-flex items-center gap-2.5 font-mono uppercase text-sm px-5 py-3 border-2 border-[#2F2C2C]/20 text-[#2F2C2C] rounded-full hover:border-[#2F2C2C] transition-colors duration-200"
            >
              <SpotifyIcon />
              Spotify
            </TrackedExternalLink>
          )}
          {appleMusicLink && appleMusicLink !== "/" && (
            <TrackedExternalLink
              href={appleMusicLink}
              episodeTitle={title}
              location="episode-platform-links"
              className="inline-flex items-center gap-2.5 font-mono uppercase text-sm px-5 py-3 border-2 border-[#2F2C2C]/20 text-[#2F2C2C] rounded-full hover:border-[#2F2C2C] transition-colors duration-200"
            >
              <AppleIcon />
              Apple Podcasts
            </TrackedExternalLink>
          )}
          {post.substackUrl && (
            <TrackedExternalLink
              href={post.substackUrl}
              episodeTitle={title}
              location="episode-platform-links"
              className="inline-flex items-center gap-2.5 font-mono uppercase text-sm px-5 py-3 bg-[#FF6719] text-white rounded-full hover:opacity-90 transition-opacity duration-200"
            >
              <SubstackIcon />
              Read Article
            </TrackedExternalLink>
          )}
        </div>

        {/* YouTube embed — timestamps seek this player */}
        {videoId ? (
          <div className="mb-6">
            <YouTubePlayerEmbed videoId={videoId} playerRef={playerRef} />
          </div>
        ) : imageUrl ? (
          <div className="relative w-full rounded-3xl overflow-hidden bg-[#2F2C2C] mb-6" style={{ aspectRatio: "16/9" }}>
            <Image
              src={imageUrl}
              alt={`Thumbnail for ${title}`}
              fill
              priority
              style={{ objectFit: "cover" }}
              sizes="(max-width: 1024px) 100vw, 960px"
            />
          </div>
        ) : null}

        {/* Substack article card — shown directly below the video when available */}
        {post.substackUrl && substackPreview && (
          <div className="mb-10">
            <SubstackCard
              url={post.substackUrl}
              title={substackPreview.title}
              description={substackPreview.description}
              episodeTitle={title}
            />
          </div>
        )}
      </div>

      {/* Sticky tab nav */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-[#2F2C2C]/10">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <div className="flex gap-0 overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 font-mono text-sm uppercase tracking-widest py-4 px-6 border-b-2 transition-all duration-200 ${
                  activeTab === tab.id
                    ? "border-[#EC7A5B] text-[#EC7A5B]"
                    : "border-transparent text-[#2F2C2C]/40 hover:text-[#2F2C2C]/70"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-12">
        {activeTab === "show-notes" && <ShowNotesTab post={post} />}
        {activeTab === "timestamps" && <TimestampsTab post={post} playerRef={playerRef} />}
        {activeTab === "transcript" && <TranscriptTab transcript={transcript} hasTranscript={hasTranscript} />}
      </div>

      {/* Footer nav */}
      <div className="border-t border-[#2F2C2C]/10 py-10">
        <div className="max-w-5xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link
            href="/#episodes"
            className="font-mono text-xs uppercase tracking-widest text-[#2F2C2C]/40 hover:text-[#EC7A5B] transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            All Episodes
          </Link>
        </div>
      </div>
    </div>
  );
}
