"use client";
import React from "react";
import { useEffect, useState } from "react";
import ThreeScene from "./ThreeScene";

function Hero() {
  const [svh, setSvh] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSvh(window.innerHeight);
    }
  }, []);

  return (
    <div style={{ height: svh ? `${svh}px` : "100vh" }} className="flex flex-col justify-between md:space-y-4 ">
      <div className="relative flex flex-col h-full overflow-hidden bg-[#EC7A5B]">
        <ThreeScene />
        <div className="absolute flex-col space-y-4 flex inset-0 text-[#2F2C2C] justify-center items-center mix-blend-difference will-change-transform">
          <h2 className="font-sans uppercase text-md">HEALTHCARE REFRAMED</h2>
          <h1 className="uppercase font-mono max-w-xl md:max-w-2xl text-xl sm:text-2xl md:text-4xl text-center">Rethinking the System, One Conversation at a Time</h1>
          <div className="absolute bottom-6 flex flex-1 flex-col justify-center space-y-2 items-center text-[#2F2C2C]">
            <h2 className="font-sans uppercase text-sm">SCROLL</h2>
            <div className="block h-6 w-6 relative fill-[#2F2C2C]">
              <svg id="Arrow" data-name="Arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21.83 20.41">
                <g id="Arrow_2" data-name="Arrow_2">
                  <path d="M20.41,8.09l-8.5,8.5V0h-2v16.59L1.41,8.09l-1.41,1.41,10.91,10.91,10.91-10.91-1.41-1.41Z" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
