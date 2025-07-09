import { BlogPost } from "@/types/types";
import { getPostBySlug, getPostSlugs } from "@/lib/posts";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";

export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

const PostPage = async ({ params }: { params: { slug: string } }) => {
  const post: BlogPost = await getPostBySlug(params.slug);

  console.log("Post data:", post);
  return (
    <div className="flex w-full h-full flex-col my-24">
      <div className="max-w-4xl mx-auto p-6 space-y-6 font-sans">
        <h1 className="text-4xl font-bold text-[#2F2C2C]">{post.title}</h1>
        <p className="text-lg text-gray-600">{post.description}</p>
        <Image src={post.imageUrl} alt={post.title} width={1920} height={1080} className="w-full my-12 rounded-lg shadow-md" style={{ objectFit: "cover" }} />
        <article className="prose prose-lg max-w-7xl text-[#2F2C2C]">
          <MDXRemote source={post.content} />
        </article>
        <a href={post.externalLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-700">
          Read more
        </a>
      </div>
    </div>
  );
};

export default PostPage;
