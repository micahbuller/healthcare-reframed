import { BlogPost } from "@/types/types";
import { getPostBySlug } from "@/lib/posts";
import Image from "next/image";

async function fetchPost(slug: string): Promise<BlogPost> {
  return getPostBySlug(slug); // Fetch the post data using your existing function
}

const PostPage = async ({ params }: { params: { slug: string } }) => {
  const post = await fetchPost(params.slug);

  return (
    <div className="flex w-full h-full flex-col my-24">
      <div className="max-w-4xl mx-auto p-6 space-y-6 font-sans">
        <h1 className="text-4xl font-bold text-[#2F2C2C]">{post.title}</h1>
        <p className="text-lg text-gray-600">{post.description}</p>
        <Image width={1920} height={1080} src={post.imageUrl} alt={post.title} className="w-full rounded-lg shadow-md" />
        <div className="prose prose-lg text-[#2F2C2C]">
          <p>{post.content}</p>
        </div>
        <a href={post.externalLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-700">
          Read more
        </a>
      </div>
    
    </div>
  );
};

export default PostPage;
