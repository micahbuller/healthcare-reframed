"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThreeScene from "./ThreeScene";

function HeaderMenu() {
  const pathname = usePathname(); // Detect the current route
  const [isHomePage, setIsHomePage] = useState(true);

  useEffect(() => {
    setIsHomePage(pathname === "/"); // Check if the current route is the home page
  }, [pathname]);

  return (
    <div className="absolute top-0 left-0 right-0 z-50 ">
      <div
        className={`flex items-center justify-between w-full px-6 py-1 ${
          isHomePage ? "bg-transparent" : "bg-[#EC7A5B]"
        }`}
       
      >
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <h1 className="font-mono uppercase text-[#2F2C2C] text-lg mix-blend-difference">HR</h1>
          </Link>
        </div>

        {/* Links */}
        <div className="flex items-center space-x-6">
          <Link href="/about">
            <p className="font-mono uppercase text-[#2F2C2C] text-lg mix-blend-difference hover:underline">About</p>
          </Link>
          <Link href="/contact">
            <p className="font-mono uppercase text-[#2F2C2C] text-lg mix-blend-difference hover:underline">Contact</p>
          </Link>
        </div>

        {/* ThreeScene Background */}
        {!isHomePage && (
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <ThreeScene />
          </div>
        )}
      </div>
    </div>



);}

export default HeaderMenu;
