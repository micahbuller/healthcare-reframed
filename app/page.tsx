import Hero from "@/components/Hero";
import PostHero from "@/components/PostHero";
import PhotoGrid from "@/components/PhotoGrid";
import EmailSignup from "@/components/EmailSignup";
import { getAllPosts } from "@/lib/posts";

const placeholderImages = [
  "https://res.cloudinary.com/mindflip/image/upload/v1751658633/healthcare%20reframed/PhotoGrid/BeckyPayneAtHealthcareReframedTable.jpg",
  "https://res.cloudinary.com/mindflip/image/upload/v1751658632/healthcare%20reframed/PhotoGrid/Becky_Payne.jpg",
  "https://res.cloudinary.com/mindflip/image/upload/v1751657839/healthcare%20reframed/PhotoGrid/Scott_Reiner.jpg",
  "https://res.cloudinary.com/mindflip/image/upload/v1751657837/healthcare-reframed/PhotoGrid/Judson_Howe_With_TV_Background_In_Healthcare_Reframed.jpg",
  "https://res.cloudinary.com/mindflip/image/upload/v1751657835/healthcare%20reframed/PhotoGrid/Brandon_Alleman_With_Healthcare_Reframed.jpg",
  "https://res.cloudinary.com/mindflip/image/upload/v1751657835/healthcare%20reframed/PhotoGrid/Benjamin_Anderson_With_Healthcare_Reframed.jpg",
  "https://res.cloudinary.com/mindflip/image/upload/v1751657835/healthcare%20reframed/PhotoGrid/Somava_Saha_With_Healthcare_Reframed.jpg",
  "https://res.cloudinary.com/mindflip/image/upload/v1751657833/healthcare%20reframed/PhotoGrid/Judson_Howe_Healthcare_Reframed_Brick_Wall.jpg",
  "https://res.cloudinary.com/mindflip/image/upload/v1751657832/healthcare%20reframed/PhotoGrid/Judson_Howe_Healthcare_Reframed_Kitchen_Interview.jpg",
];

export default function Home() {
  const allPosts =  getAllPosts(); 

  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <main>
        <Hero />
        <div id="mission" className="relative flex flex-col w-full">
          <div className="flex flex-col mx-auto w-full max-w-7xl p-3 md:p-6">
            <div className="py-36 md:py-48">
              <EmailSignup />
            </div>
          </div>
          {/* Image Background */}
          <div className="absolute inset-0 -z-10 py-12">
            <div className="flex flex-row w-full h-full justify-end">
              <div className="relative h-full w-full flex max-w-2xl md:max-w-4xl -mr-12 overflow-hidden">
                <PhotoGrid images={placeholderImages} />
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFFBF7] to-[#fffbf700]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Podcast List */}
        <div id="episodes" className="relative flex flex-col w-full">
          <div className="flex flex-col mx-auto w-full max-w-7xl p-3 md:p-6">
            <div className="relative flex flex-col w-full space-y-12 mb-24">
              {allPosts.map((post, index) => (
                <PostHero key={index} episode={post} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
