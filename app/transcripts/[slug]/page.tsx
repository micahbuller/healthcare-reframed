import { use } from "react";
import { getPostBySlug, getPostSlugs } from "@/lib/posts";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import EpisodePageClient from "@/components/EpisodePageClient";

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

export default function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const post = getPostBySlug(slug);
  const transcript = (
    <article className="prose prose-lg max-w-none text-[#2F2C2C] prose-headings:font-mono prose-headings:uppercase prose-strong:text-[#2F2C2C] prose-p:text-[#2F2C2C]/80 prose-p:leading-relaxed">
      <MDXRemote source={post.content as string} />
    </article>
  );
  return <EpisodePageClient post={post} transcript={transcript} />;
}
