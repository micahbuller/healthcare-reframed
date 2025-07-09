"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";

function HeaderMenu() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isMobileMenuOpen) {
      // Animate menu sliding in from the left
      gsap.fromTo(
        menuRef.current,
        { x: "-100%", opacity: 0 },
        { x: "0%", opacity: 1, duration: 0.5, ease: "power2.out" }
      );

      // Animate menu items sliding in one by one
      if (menuItemsRef.current?.children) {
        gsap.fromTo(
          Array.from(menuItemsRef.current.children), // Convert HTMLCollection to an array
          { x: "-100%", opacity: 0 },
          {
            x: "0%",
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.2,
          }
        );
      }
    } else {
      // Animate menu sliding out to the left
      gsap.to(menuRef.current, { x: "-100%", opacity: 0, duration: 0.5, ease: "power2.in" });

      // Animate menu items sliding out one by one
      if (menuItemsRef.current?.children) {
        gsap.to(
          Array.from(menuItemsRef.current.children), // Convert HTMLCollection to an array
          {
            x: "-100%",
            opacity: 0,
            duration: 0.5,
            ease: "power2.in",
            stagger: 0.2,
          }
        );
      }
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Desktop Header */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center">
          {/* <Link href="/">
            <h1 className="font-mono uppercase text-lg text-[#2F2C2C]">HR</h1>
          </Link> */}
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/about">
            <div className="group bg-[#2F2C2C] text-white bg-opacity-25 space-x-2 flex flex-row items-center hover:bg-opacity-25 hover:bg-white hover:text-[#2F2C2C] transition-all duration-300 px-8 py-[2px] rounded-lg">
              <span className="w-2 h-2 border border-white group-hover:border-[#2F2C2C] rounded-full transition-all duration-300"></span> {/* Circle outline */}
              <p className="font-sans uppercase text-md transition-all duration-300">About</p>
            </div>
          </Link>
          <Link href="/contact">
            <div className="group bg-[#2F2C2C] text-white bg-opacity-25 space-x-2 flex flex-row items-center hover:bg-opacity-25 hover:bg-white hover:text-[#2F2C2C] transition-all duration-300 px-8 py-[2px] rounded-lg">
              <span className="w-2 h-2 border border-white group-hover:border-[#2F2C2C] rounded-full transition-all duration-300"></span> {/* Circle outline */}
              <p className="font-sans uppercase text-md transition-all duration-300">Contact</p>
            </div>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden group bg-[#2F2C2C] text-white bg-opacity-25 space-x-2 flex flex-row items-center hover:bg-opacity-25 hover:bg-white hover:text-[#2F2C2C] transition-all duration-300 px-8 py-[2px] rounded-lg"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`fixed md:hidden top-0 left-0 w-full h-full z-40 bg-[#2F2C2C] bg-opacity-25 backdrop-blur-xl py-4 px-6 ${
          isMobileMenuOpen ? "flex" : "hidden"
        }`}
      >
        <div ref={menuItemsRef} className="flex flex-col justify-start space-y-6 mt-24">
          <Link href="/about">
            <p className="font-sans uppercase text-6xl text-white hover:text-[#2F2C2C] transition-all duration-300">About</p>
          </Link>
          <Link href="/contact">
            <p className="font-sans uppercase text-6xl text-white hover:text-[#2F2C2C] transition-all duration-300">Contact</p>
          </Link>
        </div>
      </div>
    </>
  );
}

export default HeaderMenu;
