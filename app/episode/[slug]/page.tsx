import { getPostBySlug, getPostSlugs } from "@/lib/posts";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import EpisodePageClient from "@/components/EpisodePageClient";
import { notFound } from "next/navigation";
import { getDevMode } from "@/lib/dev-mode";

// Fetch og:title and og:description from a Substack article URL
async function fetchSubstackPreview(url: string): Promise<{ title: string; description: string } | null> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { "User-Agent": "Mozilla/5.0 (compatible; healthcarereframed-bot/1.0)" },
    });
    if (!res.ok) return null;
    const html = await res.text();

    const extractMeta = (property: string): string => {
      const m =
        html.match(new RegExp(`<meta\\s[^>]*property="${property}"[^>]*content="([^"]+)"`)) ??
        html.match(new RegExp(`<meta\\s[^>]*content="([^"]+)"[^>]*property="${property}"`));
      return (m?.[1] ?? "")
        .replace(/&amp;/g, "&")
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
    };

    const title = extractMeta("og:title");
    const description = extractMeta("og:description");
    return title || description ? { title, description } : null;
  } catch {
    return null;
  }
}

// Revalidate every 5 minutes so scheduled posts go live without a redeploy
export const revalidate = 300;
// Allow on-demand rendering for slugs not pre-generated at build time
export const dynamicParams = true;

export function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug: string) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: post.imageUrl ? [{ url: post.imageUrl }] : [],
      type: "article",
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!await getDevMode() && post.date > new Date()) {
    notFound();
  }

  const hasTranscript = typeof post.content === "string" && post.content.trim().length > 0;

  const substackPreview = post.substackUrl
    ? await fetchSubstackPreview(post.substackUrl)
    : null;

  const transcript = hasTranscript ? (
    <article className="prose prose-lg max-w-none text-[#2F2C2C] prose-headings:font-mono prose-headings:uppercase prose-strong:text-[#2F2C2C] prose-p:text-[#2F2C2C]/80 prose-p:leading-relaxed">
      <MDXRemote source={post.content as string} />
    </article>
  ) : null;
  return <EpisodePageClient post={post} transcript={transcript} hasTranscript={hasTranscript} substackPreview={substackPreview} />;
}
