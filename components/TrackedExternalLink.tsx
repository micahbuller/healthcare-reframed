"use client";
/**
 * TrackedExternalLink — drop-in replacement for <a> tags on external links.
 *
 * Usage:
 *   import TrackedExternalLink from "@/components/TrackedExternalLink";
 *
 *   <TrackedExternalLink
 *     href="https://open.spotify.com/episode/..."
 *     episodeTitle="Dr. Elliott Fisher"
 *     location="episode-hero"
 *   >
 *     Listen on Spotify
 *   </TrackedExternalLink>
 *
 * Replace regular <a href="https://..."> or Next.js <Link> tags for any
 * outbound URL (YouTube, Spotify, Apple Podcasts, bookshop.org, etc.) with
 * this component to automatically track click events.
 */

import React from "react";
import { detectPlatform } from "@/lib/detectPlatform";

interface TrackedExternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  episodeTitle?: string;
  /** A short label for where on the page this link lives, e.g. "episode-hero", "show-notes", "footer" */
  location?: string;
  /** Override the auto-detected platform label */
  platformOverride?: string;
}

export default function TrackedExternalLink({
  href,
  children,
  className,
  episodeTitle,
  location,
  platformOverride,
}: TrackedExternalLinkProps) {
  const handleClick = () => {
    const linkText =
      typeof children === "string"
        ? children
        : (document.activeElement as HTMLElement)?.innerText ?? undefined;

    // Fire-and-forget — never block navigation
    fetch("/api/analytics/outbound-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true, // survives page unload
      body: JSON.stringify({
        href,
        pagePath: window.location.pathname,
        linkText,
        platform: platformOverride ?? detectPlatform(href),
        episodeTitle,
        location,
        referrer: document.referrer,
      }),
    }).catch(() => {
      // Silently ignore network errors — never disrupt the user
    });
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
