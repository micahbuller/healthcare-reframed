import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent Turbopack from bundling native Node addons — lightningcss ships a
  // platform-specific .node binary that must be loaded by Node's own require,
  // not inlined by the bundler.
  serverExternalPackages: ["lightningcss"],
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
