import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import type { AnalyticsData, Click } from "@/app/admin/analytics/AnalyticsDashboard";

async function sha256Hex(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const buffer = await crypto.subtle.digest("SHA-256", encoder.encode(input));
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function GET(request: NextRequest) {
  // Verify admin cookie — mirrors middleware logic
  const cookie = request.cookies.get("admin_auth");
  const adminPassword = process.env.ADMIN_ANALYTICS_PASSWORD;

  if (!cookie?.value || !adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const expected = await sha256Hex(adminPassword);
  if (cookie.value !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createServerClient();
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [
      { count: totalClicks, error: e1 },
      { count: last7Days, error: e2 },
      { data: allClicks, error: e3 },
    ] = await Promise.all([
      supabase.from("outbound_clicks").select("*", { count: "exact", head: true }),
      supabase
        .from("outbound_clicks")
        .select("*", { count: "exact", head: true })
        .gte("created_at", sevenDaysAgo),
      supabase
        .from("outbound_clicks")
        .select("id, created_at, href, page_path, link_text, platform, episode_title, location, referrer")
        .order("created_at", { ascending: false })
        .limit(500),
    ]);

    const supabaseError = e1 ?? e2 ?? e3;
    if (supabaseError) {
      return NextResponse.json({ error: supabaseError.message }, { status: 500 });
    }

    const clicks = (allClicks ?? []) as Click[];

    const platformMap: Record<string, number> = {};
    clicks.forEach((c) => {
      const p = c.platform ?? "Unknown";
      platformMap[p] = (platformMap[p] ?? 0) + 1;
    });
    const byPlatform = Object.entries(platformMap).sort((a, b) => b[1] - a[1]) as [string, number][];

    const hrefMap: Record<string, { count: number; linkText: string | null; episodeTitle: string | null }> = {};
    clicks.forEach((c) => {
      if (!hrefMap[c.href]) hrefMap[c.href] = { count: 0, linkText: c.link_text, episodeTitle: c.episode_title };
      hrefMap[c.href].count++;
    });
    const topLinks = Object.entries(hrefMap)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 10)
      .map(([href, v]) => ({ href, ...v }));

    const episodeMap: Record<string, number> = {};
    clicks.forEach((c) => {
      if (c.episode_title) episodeMap[c.episode_title] = (episodeMap[c.episode_title] ?? 0) + 1;
    });
    const topEpisodes = Object.entries(episodeMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([title, count]) => ({ title, count }));

    const locationMap: Record<string, number> = {};
    clicks.forEach((c) => {
      if (c.location) locationMap[c.location] = (locationMap[c.location] ?? 0) + 1;
    });
    const topLocations = Object.entries(locationMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([loc, count]) => ({ loc, count }));

    const body: AnalyticsData = {
      totalClicks: totalClicks ?? 0,
      last7Days: last7Days ?? 0,
      byPlatform,
      topLinks,
      topEpisodes,
      topLocations,
      recentClicks: clicks.slice(0, 50),
    };

    return NextResponse.json(body);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
