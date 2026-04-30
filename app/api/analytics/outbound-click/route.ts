import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { detectPlatform } from "@/lib/detectPlatform";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { href, pagePath, linkText, platform, episodeTitle, location, referrer } = body;

    // Validate href — only allow http/https URLs
    if (!href || typeof href !== "string") {
      return NextResponse.json({ error: "href is required" }, { status: 400 });
    }
    try {
      const url = new URL(href);
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        return NextResponse.json({ error: "Only http/https URLs are allowed" }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: "Invalid href" }, { status: 400 });
    }

    // Hash the client IP (privacy-safe storage)
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ip = forwarded?.split(",")[0].trim() ?? realIp ?? "unknown";
    const ipHash = createHash("sha256").update(ip).digest("hex");

    const userAgent = request.headers.get("user-agent") ?? undefined;

    // Auto-detect platform if not provided by client
    const resolvedPlatform =
      typeof platform === "string" && platform ? platform : detectPlatform(href);

    const supabase = createServerClient();
    const { error } = await supabase.from("outbound_clicks").insert({
      href,
      page_path: pagePath ?? null,
      link_text: linkText ?? null,
      platform: resolvedPlatform,
      episode_title: episodeTitle ?? null,
      location: location ?? null,
      referrer: referrer ?? null,
      user_agent: userAgent ?? null,
      ip_hash: ipHash,
    });

    if (error) {
      console.error("[outbound-click] Supabase insert error:", error.message);
      return NextResponse.json({ error: "Failed to record click" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[outbound-click] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
