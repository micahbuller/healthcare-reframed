
import { use } from "react";
import { getPostBySlug, getPostSlugs } from "@/lib/posts";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import Link from "next/link";

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
         
        <Link href={post.youtubeLink} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
            <div className="relative aspect-video w-full h-auto  bg-black rounded-3xl shrink-0 overflow-hidden my-12">
              <div className="absolute flex inset-0 z-10  items-center justify-center">
                {/* Play Button */}
                <div className="flex items-center justify-center w-16 h-16 bg-opacity-50 backdrop-blur-lg bg-[#EC7A5B] rounded-full shadow-lg cursor-pointer transition-transform duration-300 hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" />
                  </svg>
                </div>
              </div>
              <Image layout="fill" src={post.imageUrl} alt={post.title}  priority />
            </div>
          </Link>
        )}
        {post.description && (
          <p className="text-md italic text-gray-600">{post.description}</p>
        )}
        <h2 className="text-2xl font-bold text-[#2F2C2C] underline">Transcript</h2>
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
