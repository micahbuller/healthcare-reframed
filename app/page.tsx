import HeroCarousel from "@/components/HeroCarousel";
import EpisodeList from "@/components/EpisodeList";
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
  const allPosts = getAllPosts();

  return (
    <div>
      <HeroCarousel latestEpisode={allPosts[0]} photoGridImages={placeholderImages} />

      {/* Podcast List */}
      <div id="episodes" className="relative flex flex-col w-full">
        <div className="flex flex-col mx-auto w-full max-w-7xl px-3 md:px-6 pt-12 pb-6">
          <EpisodeList posts={allPosts} />
        </div>
      </div>
    </div>
  );
}
