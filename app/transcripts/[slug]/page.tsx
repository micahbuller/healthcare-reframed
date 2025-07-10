
import { use } from "react";
import { getPostBySlug, getPostSlugs } from "@/lib/posts";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";

export function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug: string) => ({ slug }));
}

export default function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const post = getPostBySlug(slug);

  return (
    <div className="flex w-full h-full flex-col my-24">
      <div className="max-w-4xl mx-auto p-6 space-y-6 font-sans">
        <h1 className="text-4xl font-bold text-[#2F2C2C]">{post.title}</h1>
        {post.imageUrl && (
          <Image
            src={post.imageUrl}
            alt={post.title}
            width={1920}
            height={1080}
            className="w-full my-12 rounded-lg shadow-md object-cover"
            priority
          />
        )}
        {post.description && (
          <p className="text-md italic text-gray-600">{post.description}</p>
        )}
        <article className="prose prose-lg max-w-7xl text-[#2F2C2C]">
          <MDXRemote source={post.content} />
        </article>
        {post.externalLink && (
          <a
            href={post.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline hover:text-blue-700"
          >
            Read more
          </a>
        )}
      </div>
    </div>
  );
}
