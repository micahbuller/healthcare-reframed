import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
    <html lang="en">
      <body className={`${edu.variable} ${univers.variable} antialiased`}>{children}</body>
    </html>
  );
}
