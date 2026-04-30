import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
    // Use AVIF for ~50% smaller files vs WebP; WebP as fallback
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // Tree-shake large packages — only import what's actually used
    optimizePackageImports: ["gsap", "three", "resend"],
  },
};

export default nextConfig;
