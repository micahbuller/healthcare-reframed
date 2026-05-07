import { getPostBySlug, getPostSlugs } from "@/lib/posts";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import EpisodePageClient from "@/components/EpisodePageClient";
import { notFound } from "next/navigation";
import { getDevMode } from "@/lib/dev-mode";

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

  const transcript = hasTranscript ? (
    <article className="prose prose-lg max-w-none text-[#2F2C2C] prose-headings:font-mono prose-headings:uppercase prose-strong:text-[#2F2C2C] prose-p:text-[#2F2C2C]/80 prose-p:leading-relaxed">
      <MDXRemote source={post.content as string} />
    </article>
  ) : null;
  return <EpisodePageClient post={post} transcript={transcript} hasTranscript={hasTranscript} />;
}
