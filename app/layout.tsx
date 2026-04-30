import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next"
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";
import HeaderMenu from "@/components/HeaderMenu";
import EmailSignup from "@/components/EmailSignup";
import TrackedExternalLink from "@/components/TrackedExternalLink";

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
  title: {
    default: "Healthcare Reframed",
    template: "%s | Healthcare Reframed",
  },
  description:
    "Honest conversations with healthcare leaders, innovators, and trailblazers about building a stronger, more humane healthcare system.",
  metadataBase: new URL("https://healthcarereframed.org"),
  openGraph: {
    type: "website",
    siteName: "Healthcare Reframed",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Healthcare Reframed — honest conversations that change how we think about healthcare",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@healthcarereframd",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${edu.variable} ${univers.variable} antialiased`} lang="en">
      <body className="flex flex-col">
        {process.env.NODE_ENV === 'production' && <Analytics />}
        <HeaderMenu />
        <main>{children}</main>
        <footer className="bg-[#2F2C2C] text-[#FFFBF7]">

          {/* ── Newsletter + Social ─────────────────────────────────── */}
          <div className="border-b border-white/10 py-16 px-6 md:px-12">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-start md:justify-between gap-12">
              <div className="max-w-lg">
                <h3 className="font-mono text-sm uppercase tracking-widest text-[#FFFBF7] mb-2">Stay Connected</h3>
                <p className="font-sans text-sm text-[#FFFBF7]/50 leading-relaxed mb-8">
                  Subscribe to receive first access to new interviews, insights, and opportunities to transform healthcare.
                </p>
                <EmailSignup theme="dark" compact />
              </div>
              <div className="flex flex-col gap-4">
                <p className="font-mono text-xs uppercase tracking-widest text-[#FFFBF7]/40">Follow Us</p>
                <div className="flex flex-wrap gap-3">
                  <TrackedExternalLink href="https://www.youtube.com/@healthcarereframed" location="footer-social"
                    className="font-mono text-xs uppercase tracking-widest text-[#FFFBF7] border border-[#FFFBF7]/25 rounded-full px-4 py-2 hover:border-[#EC7A5B] hover:text-[#EC7A5B] transition-colors">
                    YouTube
                  </TrackedExternalLink>
                  <TrackedExternalLink href="https://open.spotify.com/show/healthcarereframed" location="footer-social"
                    className="font-mono text-xs uppercase tracking-widest text-[#FFFBF7] border border-[#FFFBF7]/25 rounded-full px-4 py-2 hover:border-[#EC7A5B] hover:text-[#EC7A5B] transition-colors">
                    Spotify
                  </TrackedExternalLink>
                  <TrackedExternalLink href="https://healthcarereframed.substack.com" location="footer-social"
                    className="font-mono text-xs uppercase tracking-widest text-[#FFFBF7] border border-[#FFFBF7]/25 rounded-full px-4 py-2 hover:border-[#EC7A5B] hover:text-[#EC7A5B] transition-colors">
                    Substack
                  </TrackedExternalLink>
                  <TrackedExternalLink href="https://www.instagram.com/healthcarereframed" location="footer-social"
                    className="font-mono text-xs uppercase tracking-widest text-[#FFFBF7] border border-[#FFFBF7]/25 rounded-full px-4 py-2 hover:border-[#EC7A5B] hover:text-[#EC7A5B] transition-colors">
                    Instagram
                  </TrackedExternalLink>
                </div>
              </div>
            </div>
          </div>

          {/* ── Nav Columns ─────────────────────────────────────────── */}
          <div className="border-b border-white/10 py-12 px-6 md:px-12">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-[#FFFBF7]/40 mb-5">About</p>
                <div className="flex flex-col gap-3">
                  <Link href="/about" className="font-sans text-sm text-[#FFFBF7]/70 hover:text-[#FFFBF7] transition-colors">About Us</Link>
                  <Link href="/about" className="font-sans text-sm text-[#FFFBF7]/70 hover:text-[#FFFBF7] transition-colors">Mission</Link>
                  <Link href="mailto:info@healthcarereframed.org" className="font-sans text-sm text-[#FFFBF7]/70 hover:text-[#FFFBF7] transition-colors">Contact</Link>
                </div>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-[#FFFBF7]/40 mb-5">Content</p>
                <div className="flex flex-col gap-3">
                  <Link href="/#episodes" className="font-sans text-sm text-[#FFFBF7]/70 hover:text-[#FFFBF7] transition-colors">Episodes</Link>
                  <TrackedExternalLink href="https://healthcarereframed.substack.com" location="footer-nav"
                    className="font-sans text-sm text-[#FFFBF7]/70 hover:text-[#FFFBF7] transition-colors">Newsletter</TrackedExternalLink>
                </div>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-[#FFFBF7]/40 mb-5">Get Involved</p>
                <div className="flex flex-col gap-3">
                  <Link href="https://www.zeffy.com/en-US/donation-form/keep-healthcare-reframed-spreading-going" target="_blank" rel="noopener noreferrer" className="font-sans text-sm text-[#FFFBF7]/70 hover:text-[#FFFBF7] transition-colors">Donate</Link>
                  <Link href="/contact" className="font-sans text-sm text-[#FFFBF7]/70 hover:text-[#FFFBF7] transition-colors">Partner With Us</Link>
                </div>
              </div>
              <div>
                <p className="font-mono text-sm uppercase tracking-widest text-[#FFFBF7] mb-2">Healthcare Reframed</p>
                <p className="font-sans text-xs text-[#FFFBF7]/40 leading-relaxed">A 501(c)3 nonprofit amplifying voices of change in healthcare.</p>
              </div>
            </div>
          </div>

          {/* ── Copyright ───────────────────────────────────────────── */}
          <div className="py-6 px-6 md:px-12">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <p className="font-mono text-xs uppercase tracking-widest text-[#FFFBF7]/30">©2025 Healthcare Reframed. All rights reserved.</p>
              <div className="flex gap-6">
                <span className="font-mono text-xs uppercase tracking-widest text-[#FFFBF7]/30">Privacy Policy</span>
                <span className="font-mono text-xs uppercase tracking-widest text-[#FFFBF7]/30">Terms</span>
                <TrackedExternalLink href="https://uiio.dev/" location="footer-credit"
                  className="font-mono text-xs uppercase tracking-widest text-[#FFFBF7]/30 hover:text-[#FFFBF7] transition-colors">
                  Site Credit
                </TrackedExternalLink>
              </div>
            </div>
          </div>

        </footer>
      </body>
    </html>
  );
}
