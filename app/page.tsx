import HeroCarousel from "@/components/HeroCarousel";
import EpisodeCard from "@/components/EpisodeCard";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { getDevMode } from "@/lib/dev-mode";
import Link from "next/link";

const placeholderImages = [
  "https://res.cloudinary.com/mindflip/image/upload/v1751658633/healthcare%20reframed/PhotoGrid/BeckyPayneAtHealthcareReframedTable.jpg",
  "https://res.cloudinary.com/mindflip/image/upload/v1751658632/healthcare%20reframed/PhotoGrid/Becky_Payne.jpg",
  "https://res.cloudinary.com/mindflip/image/upload/v1751657839/healthcare%20reframed/PhotoGrid/Scott_Reiner.jpg",
  "https://res.cloudinary.com/mindflip/image/upload/v1751657837/healthcare%20reframed/PhotoGrid/Judson_Howe_With_TV_Background_In_Healthcare_Reframed.jpg",
  "https://res.cloudinary.com/mindflip/image/upload/v1751657835/healthcare%20reframed/PhotoGrid/Brandon_Alleman_With_Healthcare_Reframed.jpg",
  "https://res.cloudinary.com/mindflip/image/upload/v1751657835/healthcare%20reframed/PhotoGrid/Benjamin_Anderson_With_Healthcare_Reframed.jpg",
  "https://res.cloudinary.com/mindflip/image/upload/v1751657835/healthcare%20reframed/PhotoGrid/Somava_Saha_With_Healthcare_Reframed.jpg",
  "https://res.cloudinary.com/mindflip/image/upload/v1751657833/healthcare%20reframed/PhotoGrid/Judson_Howe_Healthcare_Reframed_Brick_Wall.jpg",
  "https://res.cloudinary.com/mindflip/image/upload/v1751657832/healthcare%20reframed/PhotoGrid/Judson_Howe_Healthcare_Reframed_Kitchen_Interview.jpg",
];

const FEATURED_SLUGS = [
  "Your_Local_Epidemiologist_Why_Science_Lost_Trust",
  "Nuka_Health_System_Putting_The_Patient_Back_In_The_Center",
  "Rick_Rawson_Mission_Drives_Margin",
];

export default async function Home() {
  const allPosts = getAllPosts(await getDevMode());
  const latestPosts = allPosts.slice(0, 3);
  const featuredPosts = FEATURED_SLUGS.map((slug) => getPostBySlug(slug));

  return (
    <div>
      <HeroCarousel latestEpisode={allPosts[0]} photoGridImages={placeholderImages} />

      {/* ── Latest Episodes ─────────────────────────────────────────── */}
      <section id="episodes" className="w-full bg-[#FFFBF7] py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <p className="font-mono text-xs uppercase tracking-widest text-[#EC7A5B] mb-3">Fresh Off the Mic</p>
          <h2 className="font-mono uppercase text-4xl md:text-5xl text-[#2F2C2C] leading-none mb-10">
            Latest Episodes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <EpisodeCard key={post.slug} episode={post} variant="grid" />
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Episodes ────────────────────────────────────────── */}
      <section className="w-full bg-[#F5F0EB] py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <p className="font-mono text-xs uppercase tracking-widest text-[#EC7A5B] mb-3">Don't Miss These</p>
          <h2 className="font-mono uppercase text-4xl md:text-5xl text-[#2F2C2C] leading-none mb-10">
            Featured Episodes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {featuredPosts.map((post) => (
              <EpisodeCard key={post.slug} episode={post} variant="grid" />
            ))}
          </div>
          <div className="flex justify-center">
            <Link
              href="/episodes"
              className="inline-flex items-center gap-3 font-mono uppercase text-sm px-10 py-4 bg-[#2F2C2C] text-[#FFFBF7] rounded-full hover:bg-[#EC7A5B] transition-colors duration-300"
            >
              Explore All Episodes
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
