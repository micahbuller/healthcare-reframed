"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";

function HeaderMenu() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<HTMLDivElement>(null);

  const closeMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      // Show, then slide in
      gsap.set(menuRef.current, { display: "flex" });
      gsap.fromTo(
        menuRef.current,
        { x: "-100%", opacity: 0 },
        { x: "0%", opacity: 1, duration: 0.5, ease: "power2.out" }
      );
      if (menuItemsRef.current?.children) {
        gsap.fromTo(
          Array.from(menuItemsRef.current.children),
          { x: "-100%", opacity: 0 },
          { x: "0%", opacity: 1, duration: 0.5, ease: "power2.out", stagger: 0.15 }
        );
      }
    } else {
      // Slide items out first, then slide the panel out and hide
      if (menuItemsRef.current?.children) {
        gsap.to(Array.from(menuItemsRef.current.children), {
          x: "-100%", opacity: 0, duration: 0.25, ease: "power2.in", stagger: 0.07,
        });
      }
      gsap.to(menuRef.current, {
        x: "-100%", opacity: 0, duration: 0.4, ease: "power2.in", delay: 0.1,
        onComplete: () => gsap.set(menuRef.current, { display: "none" }),
      });
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Header bar — always visible */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4">
        {/* Home */}
        <div className="flex items-center">
          <Link href="/">
            <div className="group bg-[#2F2C2C] text-white bg-opacity-25 space-x-2 flex flex-row items-center hover:bg-opacity-25 hover:bg-white hover:text-[#2F2C2C] transition-all duration-300 px-8 py-[2px] rounded-full">
              <span className="w-2 h-2 border border-white group-hover:border-[#2F2C2C] rounded-full transition-all duration-300"></span>
              <p className="font-sans uppercase text-md transition-all duration-300">Home</p>
            </div>
          </Link>
        </div>

        {/* Desktop links */}
        <div className="hidden xl:flex items-center space-x-6">
          <Link href="/episodes">
            <div className="group bg-[#2F2C2C] text-white bg-opacity-25 space-x-2 flex flex-row items-center hover:bg-opacity-25 hover:bg-white hover:text-[#2F2C2C] transition-all duration-300 px-8 py-[2px] rounded-full">
              <span className="w-2 h-2 border border-white group-hover:border-[#2F2C2C] rounded-full transition-all duration-300"></span>
              <p className="font-sans uppercase text-md transition-all duration-300">Episodes</p>
            </div>
          </Link>
          <Link href="/about">
            <div className="group bg-[#2F2C2C] text-white bg-opacity-25 space-x-2 flex flex-row items-center hover:bg-opacity-25 hover:bg-white hover:text-[#2F2C2C] transition-all duration-300 px-8 py-[2px] rounded-full">
              <span className="w-2 h-2 border border-white group-hover:border-[#2F2C2C] rounded-full transition-all duration-300"></span>
              <p className="font-sans uppercase text-md transition-all duration-300">About</p>
            </div>
          </Link>
          <a href="https://healthcarereframed.substack.com" target="_blank" rel="noopener noreferrer">
            <div className="group bg-[#2F2C2C] text-white bg-opacity-25 space-x-2 flex flex-row items-center hover:bg-opacity-25 hover:bg-white hover:text-[#2F2C2C] transition-all duration-300 px-8 py-[2px] rounded-full">
              <span className="w-2 h-2 border border-white group-hover:border-[#2F2C2C] rounded-full transition-all duration-300"></span>
              <p className="font-sans uppercase text-md transition-all duration-300">Newsletter</p>
            </div>
          </a>
          <Link href="/contact">
            <div className="group bg-[#2F2C2C] text-white bg-opacity-25 space-x-2 flex flex-row items-center hover:bg-opacity-25 hover:bg-white hover:text-[#2F2C2C] transition-all duration-300 px-8 py-[2px] rounded-full">
              <span className="w-2 h-2 border border-white group-hover:border-[#2F2C2C] rounded-full transition-all duration-300"></span>
              <p className="font-sans uppercase text-md transition-all duration-300">Contact</p>
            </div>
          </Link>
          <a href="https://www.zeffy.com/en-US/donation-form/keep-healthcare-reframed-spreading-going" target="_blank" rel="noopener noreferrer">
            <div className="bg-[#EC7A5B] text-[#2F2C2C] flex flex-row items-center hover:opacity-90 transition-all duration-300 px-8 py-[2px] rounded-full">
              <p className="font-sans uppercase text-md">Donate</p>
            </div>
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="xl:hidden group bg-[#2F2C2C] text-white bg-opacity-25 space-x-2 flex flex-row items-center hover:bg-opacity-25 hover:bg-white hover:text-[#2F2C2C] transition-all duration-300 px-8 py-[2px] rounded-full"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile drawer — display controlled entirely by GSAP, not React class toggling */}
      <div
        ref={menuRef}
        className="fixed xl:hidden top-0 left-0 w-full h-full z-40 bg-[#2F2C2C] bg-opacity-25 backdrop-blur-xl py-4 px-6"
        style={{ display: "none" }}
      >
        <div ref={menuItemsRef} className="flex flex-col justify-start space-y-6 mt-24">
          <Link href="/episodes" onClick={closeMenu}>
            <p className="font-sans uppercase text-6xl text-white hover:text-[#EC7A5B] transition-all duration-300">Episodes</p>
          </Link>
          <Link href="/about" onClick={closeMenu}>
            <p className="font-sans uppercase text-6xl text-white hover:text-[#EC7A5B] transition-all duration-300">About</p>
          </Link>
          <a href="https://healthcarereframed.substack.com" target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
            <p className="font-sans uppercase text-6xl text-white hover:text-[#EC7A5B] transition-all duration-300">Newsletter</p>
          </a>
          <Link href="/contact" onClick={closeMenu}>
            <p className="font-sans uppercase text-6xl text-white hover:text-[#EC7A5B] transition-all duration-300">Contact</p>
          </Link>
          <a href="https://www.zeffy.com/en-US/donation-form/keep-healthcare-reframed-spreading-going" target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
            <p className="font-sans uppercase text-6xl text-[#EC7A5B] hover:opacity-80 transition-all duration-300">Donate</p>
          </a>
        </div>
      </div>
    </>
  );
}

export default HeaderMenu;
