/**
 * Detects the platform of an outbound link from its URL.
 * Pure function — safe to use in both server and client code.
 */
export function detectPlatform(href: string): string {
  try {
    const { hostname } = new URL(href);
    const h = hostname.toLowerCase();
    if (h.includes("youtube.com") || h.includes("youtu.be")) return "YouTube";
    if (h.includes("spotify.com")) return "Spotify";
    if (h.includes("podcasts.apple.com")) return "Apple Podcasts";
    if (h.includes("libsyn.com")) return "Libsyn";
    if (h.includes("linkedin.com")) return "LinkedIn";
    if (h.includes("instagram.com")) return "Instagram";
    if (h.includes("substack.com")) return "Substack";
    return "External";
  } catch {
    return "External";
  }
}
