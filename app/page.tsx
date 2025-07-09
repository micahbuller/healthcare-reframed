import Hero from "@/components/Hero";
import PostHero from "@/components/PostHero";
import PhotoGrid from "@/components/PhotoGrid";
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

export default async function Home() {
  const allPosts = await getAllPosts(); // Await the result of the asynchronous function

  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <main>
        <Hero />
        <div id="mission" className="relative flex flex-col w-full">
          <div className="flex flex-col mx-auto w-full max-w-7xl p-3 md:p-6">
            <div className="max-w-2xl py-36 md:py-48">
              <h3 className="uppercase font-mono md:max-w-none text-3xl text-[#2F2C2C]">
                <span className="text-[#EC7A5B]">JUDSON HOWE</span> SITS DOWN WITH GLOBAL HEALTHCARE LEADERS TO UNDERSTAND HOW OUR SYSTEMS NEED TO CHANGE.
              </h3>
              <p className="uppercase font-sans md:max-w-none text-sm text-[#2F2C2C]">
                HEAR THE UNFILTERED EXPERIENCES OF THOSE WHO HAVE DEVOTED THEIR LIVES TO YOUR HEALTHCARE SYSTEM. Exploring the failures — and the visionaries striving to fix them.
              </p>
            </div>
          </div>
          {/* Image Background */}
          <div className="absolute inset-0 -z-10 py-12">
            <div className="flex flex-row w-full h-full justify-end">
              <div className="relative h-full w-full flex max-w-2xl md:max-w-4xl -mr-12 overflow-hidden">
                <PhotoGrid images={placeholderImages} />
                <div className="absolute inset-0 bg-gradient-to-r from-[#ffffff] to-[#fffbf700]"></div>
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
