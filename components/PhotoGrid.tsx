"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PhotoGrid: React.FC<{ images: string[] }> = ({ images }) => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rows = gridRef.current?.children;

    if (rows) {
      Array.from(rows).forEach((row, index) => {
        gsap.to(row, {
          x: [0, 1, 2].includes(index) || [6, 7, 8].includes(index) ? 50 : -50, // Shift right for indices 0,1,2 and 6,7,8; left for 3,4,5
          ease: "power2.out",
          scrollTrigger: {
            trigger: row,
            start: "top bottom", // Animation starts when the row enters the viewport
            end: "bottom top", // Animation ends when the row leaves the viewport
            scrub: true, // Smooth animation linked to scroll
          },
        });
      });
    }
  }, []);

  return (
    <div ref={gridRef} className="absolute inset-0 grid grid-cols-3 gap-2 opacity-50">
      {images.map((src, index) => (
        <div
          key={index}
          className={`relative w-full h-auto overflow-hidden rounded-lg ${
            [3, 4, 5].includes(index) ? "md:translate-x-24" : "" // Offset middle rows
          }`}
        >
          <Image src={src} alt={`Photo ${index + 1}`} layout="fill" objectFit="cover" />
        </div>
      ))}
    </div>
  );
};

export default PhotoGrid;
