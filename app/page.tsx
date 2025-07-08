import Hero from "@/components/Hero";
import PostHero, { PostHeroProps } from "@/components/PostHero";
import PhotoGrid from "@/components/PhotoGrid";
// import { getAllPosts } from "@/lib/posts";

const episodes: PostHeroProps[] = [
  {
    imageSrc: "https://res.cloudinary.com/micahbuller/image/upload/v1738851234/healthcare-reframed/hero-1.jpg",
    imageAlt: "Judson Howe with healthcare leaders",
    scrollStory: "https://shorthand.com/",
    heading: "Episode 1: Judson Howe with Healthcare Leaders",
    paragraph: "Join Judson Howe as he sits down with global healthcare leaders to explore the challenges and opportunities in the healthcare system.",
    youtubeLink: "https://www.youtube.com/watch?v=example1",
    spotifyLink: "https://open.spotify.com/episode/example1",
    appleMusicLink: "https://music.apple.com/episode/example1",
  },
  {
    imageSrc: "https://res.cloudinary.com/micahbuller/image/upload/v1738851234/healthcare-reframed/hero-1.jpg",
    imageAlt: "Judson Howe with healthcare leaders",
    scrollStory: "https://shorthand.com/",
    heading: "Episode 1: Judson Howe with Healthcare Leaders",
    paragraph: "Join Judson Howe as he sits down with global healthcare leaders to explore the challenges and opportunities in the healthcare system.",
    youtubeLink: "https://www.youtube.com/watch?v=example1",
    spotifyLink: "https://open.spotify.com/episode/example1",
    appleMusicLink: "https://music.apple.com/episode/example1",
  },
  {
    imageSrc: "https://res.cloudinary.com/micahbuller/image/upload/v1738851234/healthcare-reframed/hero-1.jpg",
    imageAlt: "Judson Howe with healthcare leaders",
    scrollStory: "https://shorthand.com/",
    heading: "Episode 1: Judson Howe with Healthcare Leaders",
    paragraph: "Join Judson Howe as he sits down with global healthcare leaders to explore the challenges and opportunities in the healthcare system.",
    youtubeLink: "https://www.youtube.com/watch?v=example1",
    spotifyLink: "https://open.spotify.com/episode/example1",
    appleMusicLink: "https://music.apple.com/episode/example1",
  },
  // Add more episodes as needed
];

const placeholderImages = [
  "https://res.cloudinary.com/mindflip/image/upload/v1751658633/healthcare%20reframed/PhotoGrid/BeckyPayneAtHealthcareReframedTable.jpg",
  "https://res.cloudinary.com/mindflip/image/upload/v1751658632/healthcare%20reframed/PhotoGrid/Becky_Payne.jpg",
  "https://res.cloudinary.com/mindflip/image/upload/v1751657839/healthcare%20reframed/PhotoGrid/Scott_Reiner.jpg",
  "https://res.cloudinary.com/mindflip/image/upload/v1751657837/healthcare%20reframed/PhotoGrid/Judson_Howe_With_TV_Background_In_Healthcare_Reframed.jpg",
  "https://res.cloudinary.com/mindflip/image/upload/v1751657835/healthcare%20reframed/PhotoGrid/Brandon_Alleman_With_Healthcare_Reframed.jpg", // Replaced photo 5
  "https://res.cloudinary.com/mindflip/image/upload/v1751657835/healthcare%20reframed/PhotoGrid/Benjamin_Anderson_With_Healthcare_Reframed.jpg",
  "https://res.cloudinary.com/mindflip/image/upload/v1751657835/healthcare%20reframed/PhotoGrid/Somava_Saha_With_Healthcare_Reframed.jpg", // Replaced photo 7
  "https://res.cloudinary.com/mindflip/image/upload/v1751657833/healthcare%20reframed/PhotoGrid/Judson_Howe_Healthcare_Reframed_Brick_Wall.jpg",
  "https://res.cloudinary.com/mindflip/image/upload/v1751657832/healthcare%20reframed/PhotoGrid/Judson_Howe_Healthcare_Reframed_Kitchen_Interview.jpg",
];

export default function Home() {
  // const allPosts = getAllPosts()

  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <main>
        <Hero />
        <div id="mission" className="relative flex flex-col w-full">
          <div className="flex flex-col mx-auto w-full max-w-7xl p-3 md:p-6">
            <div className="max-w-2xl py-36 md:py-48">
              <h3 className="uppercase font-mono  md:max-w-none text-3xl text-[#2F2C2C]">
                <span className="text-[#EC7A5B]">JUDSON HOWE</span> SITS DOWN WITH GLOBAL HEALTHCARE LEADERS TO UNDERSTAND HOW our SYSTEMS NEED TO CHANGE.
              </h3>
              <p className="uppercase font-sans  md:max-w-none text-sm text-[#2F2C2C]">HEAR THE UNFILTERED EXPERIENCES OF THOSE WHO HAVE DEVOTED THEIR LIVES TO YOUR HEALTHCARE SYSTEM. Exploring the failures — and the visionaries striving to fix them.</p>
            </div>
          </div>
          {/* Image Background */}
          <div className="absolute inset-0 -z-10 py-12">
            <div className="flex flex-row w-full h-full justify-end ">
              <div className="relative h-full w-full flex max-w-2xl md:max-w-4xl -mr-12 overflow-hidden">
                <PhotoGrid images={placeholderImages} />
                <div className="absolute inset-0 bg-gradient-to-r from-[#ffffff] to-[#fffbf700] "></div>
              </div>
            </div>
          </div>
        </div>

        {/* Podcast List */}
        <div id="mission" className="relative flex flex-col w-full">
          <div className="flex flex-col mx-auto w-full max-w-7xl p-3 md:p-6">
            <div id="episodes" className="flex mb-12">
              <h2 className="text-md font-sans border-2 rounded-full py-2 px-4 border-[#2F2C2C] text-[#2F2C2C]">EPISODES COMING SOON</h2>
            </div>
            <div className="relative flex flex-col w-full space-y-12 mb-24">
              {episodes.map((episode, index) => (
                <PostHero key={index} episode={episode} />
              ))}
            </div>
          </div>
        </div>
      </main>
      
    </div>
  );
}
