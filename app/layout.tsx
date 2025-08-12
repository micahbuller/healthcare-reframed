import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next"
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";
import HeaderMenu from "@/components/HeaderMenu";

const edu = localFont({
  src: "../font/EduDiatypeMono-Regular.otf",
  display: "swap",
  variable: "--font-edu",
});

const univers = localFont({
  src: "../font/UniversNextPro-Bold.ttf",
  display: "swap",
  variable: "--font-univers",
});

export const metadata: Metadata = {
  title: "Healthcare Reframed Podcast",
  description: "Ask the right question.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${edu.variable} ${univers.variable} antialiased`} lang="en">
      <body className="flex flex-col">
        <Analytics />
        <HeaderMenu />
        <main>{children}</main>
        <footer className="flex flex-col bg-[#2F2C2C] text-[#FFFBF7] p-3 md:p-6 py-12 font-sans space-y-6 text-sm">
          <div className="flex flex-row w-full">
            <div className="flex flex-col space-y-2">
              <Link href={"#mission"}>
                <p>MISSION</p>
              </Link>
              <Link href={"#episodes"}>
                <p>EPISODES</p>
              </Link>
              <Link href={"mailto:info@healthcarereframed.org"}>
                <p>CONTACT</p>
              </Link>
            </div>
          </div>
          <div className="flex flex-row w-full justify-end md:justify-normal">
            <div className="flex flex-col text-right md:text-left md:flex-row-reverse w-full md:justify-between space-y-2 md:space-y-0">
              <Link href={"https://uiio.dev/"} rel="noopener noreferrer" target="_blank">
                <p>SITE CREDIT</p>
              </Link>
              <p>LEGAL * TERMS OF SERVICE</p>
              <p>©2025 HEALTHCARE REFRAMED</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
