"use client";
import React, { useRef, useState, useEffect, useLayoutEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import ThreeScene from "./ThreeScene";
import { BlogPost } from "@/types/types";
import TrackedExternalLink from "@/components/TrackedExternalLink";

const TOTAL_CARDS = 3;

interface HeroCarouselProps {
  latestEpisode: BlogPost;
  photoGridImages?: string[];
}

export default function HeroCarousel({ latestEpisode, photoGridImages = [] }: HeroCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState(0);
  const [svh, setSvh] = useState<number | null>(null);
  const [carouselH, setCarouselH] = useState<number | null>(null);
  const [paddingTopDesktop, setPaddingTopDesktop] = useState(0);
  // Stays false during SSR and until after the mount jump — hides the carousel to
  // prevent the SSR scroll-position-0 (clone-last card) from flashing before hydration.
  const [ready, setReady] = useState(false);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragScrollStart = useRef(0);
  const dragMoved = useRef(false);
  // Prevents the scroll listener from firing during a programmatic instant jump
  const isJumping = useRef(false);
  // Tracks current DOM index synchronously — never stale, unlike React state
  const currentDOMIndex = useRef(1);

  useEffect(() => {
    const update = () => {
      const h = window.innerHeight;
      const w = window.innerWidth;
      if (w >= 768) {
        // Desktop: compute 88% of viewport with 620px cap via JS.
        const s = Math.round(h * 0.88);
        const cH = Math.min(s, 620);
        setSvh(s);
        setCarouselH(cH);
        // Center the carousel vertically when there's room.
        // MIN_TOP ensures the carousel never slides under the nav bar:
        //   ~56px nav bar height + 24px healthy gap = 80px floor.
        // ~52px accounts for mt-4 spacing + dots/arrows nav height below the carousel.
        // Any overflow always goes downward (bottom crops, never top crops).
        const MIN_TOP = 80;
        setPaddingTopDesktop(Math.max(MIN_TOP, Math.floor((s - cH - 52) / 2)));
      } else {
        // Mobile: reset to null so CSS svh units take over.
        // svh (small viewport height) is locked to the viewport size when the
        // browser chrome is fully visible — it never changes as the user scrolls
        // and the address/tab bar hides, so the card won't jump or glitch.
        setSvh(null);
        setCarouselH(null);
        setPaddingTopDesktop(0);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // ── DOM layout (5 cards for infinite wrap): ───────────────────────────────
  //   [clone-last(0)]  [card0(1)]  [card1(2)]  [card2(3)]  [clone-first(4)]
  // ─────────────────────────────────────────────────────────────────────────

  // Instant (no animation) scroll to a DOM slot
  const jumpToDOM = useCallback((domIndex: number) => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.children) as HTMLElement[];
    if (!cards[domIndex]) return;
    isJumping.current = true;
    currentDOMIndex.current = domIndex;
    track.scrollLeft = cards[domIndex].offsetLeft;
    // Double-rAF: outlasts browser scroll restoration which fires after first rAF
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { isJumping.current = false; });
    });
  }, []);

  // Smooth scroll to a DOM slot
  const scrollToDOM = useCallback((domIndex: number) => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.children) as HTMLElement[];
    if (!cards[domIndex]) return;
    currentDOMIndex.current = domIndex;
    track.scrollTo({ left: cards[domIndex].offsetLeft, behavior: "smooth" });
  }, []);

  // useLayoutEffect: jump to real card 0 before first paint so the SSR clone-last
  // position is never visible. Setting ready=true in the same effect causes a
  // synchronous re-render (before paint) that reveals the carousel at the correct slot.
  useLayoutEffect(() => {
    jumpToDOM(1);
    setReady(true);
  }, [jumpToDOM]);

  // Scroll listener — syncs activeCard state + handles infinite wrap teleport
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const handleSettle = () => {
      if (isJumping.current) return;
      const cards = Array.from(track.children) as HTMLElement[];
      let closest = 0, minDist = Infinity;
      cards.forEach((card, i) => {
        const dist = Math.abs(card.offsetLeft - track.scrollLeft);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      currentDOMIndex.current = closest;
      if (closest === 0) {
        jumpToDOM(TOTAL_CARDS);
        setActiveCard(TOTAL_CARDS - 1);
      } else if (closest === TOTAL_CARDS + 1) {
        jumpToDOM(1);
        setActiveCard(0);
      } else {
        setActiveCard(closest - 1);
      }
    };

    // Always register both — scrollend fires precisely once in modern browsers;
    // the debounced scroll handler acts as a fallback for browsers where
    // scrollend is unreliable (some Chrome versions with snap).
    let debounce: ReturnType<typeof setTimeout>;

    const updateParallax = () => {
      const viewCenter = track.scrollLeft + track.clientWidth / 2;
      track.querySelectorAll<HTMLElement>("[data-parallax]").forEach((grid) => {
        const card = grid.parentElement as HTMLElement;
        if (!card) return;
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const rawOffset = (cardCenter - viewCenter) * 0.06;
        const offset = Math.max(-80, Math.min(80, rawOffset));
        grid.style.transform = `scale(1.12) translateX(${offset}px)`;
      });
    };

    const onScroll = () => {
      updateParallax();
      if (isJumping.current) return;
      clearTimeout(debounce);
      debounce = setTimeout(handleSettle, 80);
    };

    track.addEventListener("scrollend", handleSettle, { passive: true });
    track.addEventListener("scroll", onScroll, { passive: true });
    // Seed parallax on mount before any scroll event fires.
    updateParallax();
    return () => {
      track.removeEventListener("scrollend", handleSettle);
      track.removeEventListener("scroll", onScroll);
      clearTimeout(debounce);
    };
  }, [jumpToDOM]);

  // ── Navigation ─────────────────────────────────────────────────────────────
  const goTo = useCallback((logical: number) => {
    scrollToDOM(logical + 1);
    setActiveCard(logical);
  }, [scrollToDOM]);

  const goNext = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const cur = currentDOMIndex.current;
    const cards = Array.from(track.children) as HTMLElement[];
    if (cur === TOTAL_CARDS) {
      // Guard isJumping BEFORE the instant scrollLeft change so the scrollend
      // that Chrome fires immediately does not trigger handleSettle mid-wrap.
      isJumping.current = true;
      track.scrollLeft = cards[0].offsetLeft;
      currentDOMIndex.current = 1;
      setActiveCard(0);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        isJumping.current = false;
        trackRef.current?.scrollTo({ left: cards[1].offsetLeft, behavior: "smooth" });
      }));
    } else {
      const next = Math.min(cur + 1, TOTAL_CARDS + 1);
      currentDOMIndex.current = next;
      track.scrollTo({ left: cards[next].offsetLeft, behavior: "smooth" });
      setActiveCard(next - 1);
    }
  }, []);

  const goPrev = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const cur = currentDOMIndex.current;
    const cards = Array.from(track.children) as HTMLElement[];
    if (cur === 1) {
      // Guard isJumping BEFORE the instant scrollLeft change so the scrollend
      // that Chrome fires immediately does not trigger handleSettle mid-wrap.
      isJumping.current = true;
      track.scrollLeft = cards[TOTAL_CARDS + 1].offsetLeft;
      currentDOMIndex.current = TOTAL_CARDS;
      setActiveCard(TOTAL_CARDS - 1);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        isJumping.current = false;
        trackRef.current?.scrollTo({ left: cards[TOTAL_CARDS].offsetLeft, behavior: "smooth" });
      }));
    } else {
      const prev = Math.max(cur - 1, 0);
      currentDOMIndex.current = prev;
      track.scrollTo({ left: cards[prev].offsetLeft, behavior: "smooth" });
      setActiveCard(prev - 1);
    }
  }, []);


  // ── Cross-browser touch handling ────────────────────────────────────────────
  // Intercepts horizontal swipes so Chrome's CSS-snap boundary cannot block the
  // infinite wrap — we drive scrollLeft ourselves and call goNext/goPrev.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let startX = 0, startY = 0, startScroll = 0;
    let isHorizontal: boolean | null = null;

    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startScroll = track.scrollLeft;
      isHorizontal = null;
      isJumping.current = true; // block handleSettle while finger is down
    };
    const onTouchMove = (e: TouchEvent) => {
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      if (isHorizontal === null && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
        isHorizontal = Math.abs(dx) >= Math.abs(dy);
      }
      if (isHorizontal) {
        e.preventDefault(); // prevent page scroll during horizontal swipe
        track.scrollLeft = startScroll - dx;
      }
    };
    const onTouchEnd = (e: TouchEvent) => {
      isJumping.current = false;
      if (!isHorizontal) return;
      const dx = startX - e.changedTouches[0].clientX;
      if (Math.abs(dx) > 50) {
        if (dx > 0) goNext();
        else goPrev();
      } else {
        scrollToDOM(currentDOMIndex.current);
      }
    };
    const onTouchCancel = () => {
      isJumping.current = false;
      scrollToDOM(currentDOMIndex.current);
    };

    track.addEventListener("touchstart", onTouchStart, { passive: true });
    track.addEventListener("touchmove", onTouchMove, { passive: false });
    track.addEventListener("touchend", onTouchEnd, { passive: true });
    track.addEventListener("touchcancel", onTouchCancel, { passive: true });
    return () => {
      track.removeEventListener("touchstart", onTouchStart);
      track.removeEventListener("touchmove", onTouchMove);
      track.removeEventListener("touchend", onTouchEnd);
      track.removeEventListener("touchcancel", onTouchCancel);
    };
  }, [goNext, goPrev, scrollToDOM]);

  // ── Desktop mouse drag ──────────────────────────────────────────────────────
  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragMoved.current = false;
    dragStartX.current = e.pageX;
    dragScrollStart.current = trackRef.current?.scrollLeft ?? 0;
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    const dx = e.pageX - dragStartX.current;
    if (Math.abs(dx) > 4) dragMoved.current = true;
    trackRef.current.scrollLeft = dragScrollStart.current - dx;
  };
  const onMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const track = trackRef.current;
    if (track) {
      const cards = Array.from(track.children) as HTMLElement[];
      let closest = 0, minDist = Infinity;
      cards.forEach((card, i) => {
        const dist = Math.abs(card.offsetLeft - track.scrollLeft);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      // Handle clone boundary cases immediately on drag release
      if (closest === 0) { jumpToDOM(TOTAL_CARDS); setActiveCard(TOTAL_CARDS - 1); }
      else if (closest === TOTAL_CARDS + 1) { jumpToDOM(1); setActiveCard(0); }
      else goTo(closest - 1);
    }
    if (dragMoved.current) e.stopPropagation();
  };

  const { title, description, imageUrl, youtubeLink, spotifyLink, appleMusicLink, slug } = latestEpisode;

  // ── Shared card class ───────────────────────────────────────────────────────
  const cardBase = "snap-start shrink-0 w-full h-full rounded-3xl overflow-hidden";

  // ── Card JSX (reused for real cards + clones) ───────────────────────────────
  const cardMission = (key: string, withScene = true) => (
    <div key={key} className={`${cardBase} relative bg-[#EC7A5B]`}>
      {withScene && <ThreeScene className="absolute inset-0 overflow-hidden rounded-3xl" />}
      <div className="absolute inset-0 flex flex-col justify-center items-center px-8 text-[#2F2C2C] will-change-transform pointer-events-none">
        <p className="font-sans uppercase text-xs tracking-widest mb-3 md:mb-6">HEALTHCARE REFRAMED</p>
        <h1 className="uppercase font-mono max-w-xl md:max-w-2xl text-xl sm:text-3xl md:text-4xl text-center leading-tight mb-3 md:mb-6">
          Rethinking the System,<br />One Conversation at a Time
        </h1>
        <p className="font-sans text-sm md:text-base text-center max-w-md leading-relaxed">
          A nonprofit podcast amplifying voices of change to build a stronger,
          more humane healthcare system.
        </p>
      </div>
    </div>
  );

  const cardEpisode = (key: string) => (
    <div key={key} className={`${cardBase} bg-[#2F2C2C]`}>
      {/* Mobile — thumbnail with margin on all sides, 16:9, rounded */}
      <div className="flex flex-col h-full md:hidden overflow-y-auto p-4 gap-4">
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shrink-0">
          <Image src={imageUrl} alt={title} fill priority sizes="(max-width: 768px) calc(100vw - 2rem), 50vw" style={{ objectFit: "cover" }} />
        </div>
        <div className="flex flex-col flex-1 min-h-0 pb-4">
          <span className="font-mono text-xs uppercase text-[#FFFBF7]/60 tracking-widest mb-2">Latest Episode</span>
          <h2 className="font-mono uppercase text-[#FFFBF7] text-base leading-tight mb-2">{title}</h2>
          <p className="font-sans text-[#FFFBF7]/70 text-sm mb-4 line-clamp-3">{description}</p>
          <div className="flex flex-wrap gap-2 mt-auto">
            <TrackedExternalLink href={youtubeLink} episodeTitle={title} location="hero-carousel-mobile"
              className="font-mono uppercase text-sm px-5 py-2.5 bg-[#FFFBF7] text-[#2F2C2C] hover:opacity-80 transition-opacity rounded-full">
              Watch on YouTube
            </TrackedExternalLink>
            <Link href={`/transcripts/${slug}`}
              className="font-mono uppercase text-sm px-5 py-2.5 border border-[#FFFBF7]/40 text-[#FFFBF7] hover:border-[#FFFBF7] transition-colors rounded-full">
              Read Transcript
            </Link>
          </div>
        </div>
      </div>
      {/* Desktop — text left (absolute), image fills right side with even padding, gradient blends left */}
      <div className="hidden md:block relative h-full">
        {/* Image: right side, padded evenly from all card edges, same corner radius as card */}
        <div className="absolute top-4 right-4 bottom-4 left-[42%] rounded-3xl overflow-hidden">
          <Image src={imageUrl} alt={title} fill priority sizes="50vw" style={{ objectFit: "cover", objectPosition: "right center" }} />
        </div>
        {/* Gradient overlay: solid card color on left → transparent on right */}
        <div className="absolute top-4 right-4 bottom-4 left-[42%] rounded-3xl overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-linear-to-r from-[#2F2C2C] via-[#2F2C2C]/70 to-transparent" />
        </div>
        {/* Text content: left 55% of card, z-index above image */}
        <div className="absolute top-0 left-0 bottom-0 w-[58%] flex flex-col justify-center p-10 lg:p-14 z-10">
          <span className="font-mono text-xs uppercase text-[#FFFBF7]/60 tracking-widest mb-4">Latest Episode</span>
          <h2 className="font-mono uppercase text-[#FFFBF7] text-2xl lg:text-3xl leading-tight mb-4">{title}</h2>
          <p className="font-sans text-[#FFFBF7]/70 text-sm lg:text-base mb-8 line-clamp-4">{description}</p>
          <div className="flex flex-wrap gap-3 items-center mb-5">
            <TrackedExternalLink href={youtubeLink} episodeTitle={title} location="hero-carousel-desktop"
              className="font-mono uppercase text-sm px-6 py-3 bg-[#FFFBF7] text-[#2F2C2C] hover:opacity-80 transition-opacity rounded-full">
              Watch on YouTube
            </TrackedExternalLink>
            <Link href={`/transcripts/${slug}`}
              className="font-mono uppercase text-sm px-6 py-3 border border-[#FFFBF7]/40 text-[#FFFBF7] hover:border-[#FFFBF7] transition-colors rounded-full">
              Read Transcript
            </Link>
          </div>
          <div className="flex items-center space-x-5">
            {spotifyLink && (
              <TrackedExternalLink href={spotifyLink} episodeTitle={title} location="hero-carousel-desktop"
                className="font-mono text-xs uppercase text-[#FFFBF7]/70 tracking-widest hover:text-[#FFFBF7] transition-colors">
                Spotify
              </TrackedExternalLink>
            )}
            {appleMusicLink && (
              <TrackedExternalLink href={appleMusicLink} episodeTitle={title} location="hero-carousel-desktop"
                className="font-mono text-xs uppercase text-[#FFFBF7]/70 tracking-widest hover:text-[#FFFBF7] transition-colors">
                Apple Podcasts
              </TrackedExternalLink>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const cardSupport = (key: string) => (
    <div key={key} className={`${cardBase} relative bg-[#2F2C2C] overflow-hidden`}>
      {/* Background photo collage — data-parallax receives transforms from updateParallax() */}
      {photoGridImages.length > 0 && (
        <div
          data-parallax
          className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-1.5 p-1.5 pointer-events-none"
          aria-hidden="true"
          style={{ transform: "scale(1.12)" }}
        >
          {photoGridImages.slice(0, 9).map((src, i) => (
            <div key={i} className="relative overflow-hidden rounded-xl">
              <Image src={src} alt="" fill style={{ objectFit: "cover" }} sizes="200px" />
            </div>
          ))}
        </div>
      )}
      {/* Coral gradient overlay: solid left (text area) → transparent right (reveals photos) */}
      <div className="absolute inset-0 bg-linear-to-r from-[#EC7A5B] from-30% via-[#EC7A5B]/85 via-60% to-[#EC7A5B]/10" />
      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center h-full p-6 md:p-14">
        <span className="font-mono text-xs uppercase text-[#2F2C2C]/70 tracking-widest mb-4 md:mb-8">Support the Mission</span>
        <h2 className="font-mono uppercase text-[#2F2C2C] text-2xl md:text-4xl max-w-lg leading-tight mb-4 md:mb-8">
          Help us keep the conversation going.
        </h2>
        <p className="font-sans text-[#2F2C2C]/80 text-sm md:text-lg mb-3 md:mb-4 max-w-lg leading-relaxed">
          Healthcare Reframed is a 501(c)3 nonprofit. No ads, corporate sponsors, or paywalls.
        </p>
        <p className="font-sans text-[#2F2C2C]/70 text-sm mb-6 md:mb-12 max-w-lg leading-relaxed">
          If you find our work valuable and would like to help us keep the conversation going, please consider making a donation. Your contribution is tax deductible.
        </p>
        <div className="flex flex-row gap-3">
          <a href="https://www.zeffy.com/en-US/donation-form/keep-healthcare-reframed-spreading-going" target="_blank" rel="noopener noreferrer"
            className="font-mono uppercase text-xs md:text-sm px-5 md:px-8 py-3 md:py-4 bg-[#2F2C2C] text-[#FFFBF7] text-center hover:opacity-80 transition-opacity rounded-full">
            Donate
          </a>
          <Link href="/about"
            className="font-mono uppercase text-xs md:text-sm px-5 md:px-8 py-3 md:py-4 border-2 border-[#2F2C2C]/40 text-[#2F2C2C] text-center hover:border-[#2F2C2C] transition-colors rounded-full">
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="relative w-full bg-[#FFFBF7] flex flex-col items-center pt-28 pb-6 md:pt-0 md:pb-0"
      style={{ minHeight: svh ? `${svh}px` : "100svh", paddingTop: svh ? `${paddingTopDesktop}px` : undefined }}
    >
      {/* ── Carousel viewport ── hidden until mount jump fires (prevents SSR clone-last flash) */}
      <div
        className="relative w-full overflow-hidden flex-none transition-opacity duration-300"
        style={{ height: carouselH ? `${carouselH}px` : "calc(100svh - 188px)", opacity: ready ? 1 : 0 }}
      >
        <div
          ref={trackRef}
          className="carousel-track flex h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{ cursor: isDragging.current ? "grabbing" : "grab" }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={(e) => { if (isDragging.current) onMouseUp(e as React.MouseEvent); }}
        >
          {/* DOM[0] clone-last  */ cardSupport("clone-last")}
          {/* DOM[1] real card 0 */ cardMission("card-0", true)}
          {/* DOM[2] real card 1 */ cardEpisode("card-1")}
          {/* DOM[3] real card 2 */ cardSupport("card-2")}
          {/* DOM[4] clone-first — full ThreeScene so wrap is seamless */}
          {cardMission("clone-first", true)}
        </div>
      </div>

      {/* ── Bottom nav: dots left, arrows right — matches Huberman layout ── */}
      <div className="w-full flex items-center justify-between mt-4 px-4 md:px-[152px]">
        {/* Dots */}
        <div className="flex items-center space-x-2">
          {Array.from({ length: TOTAL_CARDS }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                activeCard === i
                  ? "w-6 h-2 bg-[#2F2C2C]"
                  : "w-2 h-2 bg-[#2F2C2C]/30 hover:bg-[#2F2C2C]/60"
              }`}
            />
          ))}
        </div>
        {/* Prev / Next arrows */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => goPrev()}
            aria-label="Previous slide"
            className="w-9 h-9 rounded-full border border-[#2F2C2C]/30 flex items-center justify-center hover:border-[#2F2C2C] hover:bg-[#2F2C2C]/5 transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#2F2C2C" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={() => goNext()}
            aria-label="Next slide"
            className="w-9 h-9 rounded-full border border-[#2F2C2C]/30 flex items-center justify-center hover:border-[#2F2C2C] hover:bg-[#2F2C2C]/5 transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#2F2C2C" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
