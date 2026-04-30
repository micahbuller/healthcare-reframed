import { createServerClient } from "@/lib/supabase";
import AnalyticsDashboard, { type AnalyticsData, type Click } from "./AnalyticsDashboard";

async function getAnalyticsData(): Promise<AnalyticsData> {
  const supabase = createServerClient();

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [
    { count: totalClicks, error: e1 },
    { count: last7Days, error: e2 },
    { data: allClicks, error: e3 },
  ] = await Promise.all([
    supabase
      .from("outbound_clicks")
      .select("*", { count: "exact", head: true }),
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
    console.error("[analytics] Supabase query error:", supabaseError);
    throw new Error(`Supabase query failed: ${supabaseError.message} (code: ${supabaseError.code})`);
  }

  const clicks = (allClicks ?? []) as Click[];

  // Aggregate by platform
  const platformMap: Record<string, number> = {};
  clicks.forEach((c) => {
    const p = c.platform ?? "Unknown";
    platformMap[p] = (platformMap[p] ?? 0) + 1;
  });
  const byPlatform = Object.entries(platformMap).sort((a, b) => b[1] - a[1]) as [string, number][];

  // Top links
  const hrefMap: Record<string, { count: number; linkText: string | null; episodeTitle: string | null }> = {};
  clicks.forEach((c) => {
    if (!hrefMap[c.href]) hrefMap[c.href] = { count: 0, linkText: c.link_text, episodeTitle: c.episode_title };
    hrefMap[c.href].count++;
  });
  const topLinks = Object.entries(hrefMap)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 10)
    .map(([href, v]) => ({ href, ...v }));

  // Top episodes
  const episodeMap: Record<string, number> = {};
  clicks.forEach((c) => {
    if (c.episode_title) episodeMap[c.episode_title] = (episodeMap[c.episode_title] ?? 0) + 1;
  });
  const topEpisodes = Object.entries(episodeMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([title, count]) => ({ title, count }));

  // Top locations
  const locationMap: Record<string, number> = {};
  clicks.forEach((c) => {
    if (c.location) locationMap[c.location] = (locationMap[c.location] ?? 0) + 1;
  });
  const topLocations = Object.entries(locationMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([loc, count]) => ({ loc, count }));

  // Recent events (already sorted desc)
  const recentClicks = clicks.slice(0, 50);

  return { totalClicks: totalClicks ?? 0, last7Days: last7Days ?? 0, byPlatform, topLinks, topEpisodes, topLocations, recentClicks };
}

export default async function AdminAnalyticsPage() {
  let data;
  try {
    data = await getAnalyticsData();
  } catch (err) {
    return (
      <div className="min-h-screen bg-[#2F2C2C] flex items-center justify-center px-4 text-center">
        <div>
          <p className="font-mono text-xs uppercase text-[#EC7A5B] mb-2">Error</p>
          <p className="font-mono text-[#FFFBF7]/60 text-sm">
            Could not connect to Supabase. Make sure your environment variables are set.
          </p>
          <p className="font-mono text-[#FFFBF7]/30 text-xs mt-2">
            {(err as Error).message}
          </p>
        </div>
      </div>
    );
  }

  return <AnalyticsDashboard initialData={data} />;
}
