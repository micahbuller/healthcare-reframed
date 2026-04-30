import { createServerClient } from "@/lib/supabase";

type Click = {
  id: string;
  created_at: string;
  href: string;
  page_path: string | null;
  link_text: string | null;
  platform: string | null;
  episode_title: string | null;
  location: string | null;
  referrer: string | null;
};

async function getAnalyticsData() {
  const supabase = createServerClient();

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [{ count: totalClicks }, { count: last7Days }, { data: allClicks }] =
    await Promise.all([
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

  const clicks = (allClicks ?? []) as Click[];

  // Aggregate by platform
  const platformMap: Record<string, number> = {};
  clicks.forEach((c) => {
    const p = c.platform ?? "Unknown";
    platformMap[p] = (platformMap[p] ?? 0) + 1;
  });
  const byPlatform = Object.entries(platformMap).sort((a, b) => b[1] - a[1]);

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

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-[#FFFBF7]/5 border border-[#FFFBF7]/10 rounded-2xl p-6">
      <p className="font-mono text-xs uppercase tracking-widest text-[#FFFBF7]/40 mb-2">{label}</p>
      <p className="font-mono text-4xl text-[#FFFBF7]">{value}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="font-mono uppercase text-xs tracking-widest text-[#EC7A5B] mb-4">{title}</h2>
      {children}
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  });
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

  const { totalClicks, last7Days, byPlatform, topLinks, topEpisodes, topLocations, recentClicks } = data;
  const maxPlatformCount = byPlatform[0]?.[1] ?? 1;

  return (
    <div className="min-h-screen bg-[#2F2C2C] px-4 md:px-10 py-16">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-[#EC7A5B] mb-2">Healthcare Reframed</p>
            <h1 className="font-mono uppercase text-4xl md:text-5xl text-[#FFFBF7] leading-none">
              Outbound Analytics
            </h1>
            <p className="font-sans text-sm text-[#FFFBF7]/40 mt-2">Internal dashboard — all times in local browser timezone</p>
          </div>
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="font-mono uppercase text-xs px-4 py-2 rounded-full border border-[#FFFBF7]/20 text-[#FFFBF7]/50 hover:border-[#FFFBF7]/50 hover:text-[#FFFBF7] transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>

        {/* Top stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <StatCard label="Total clicks" value={totalClicks.toLocaleString()} />
          <StatCard label="Last 7 days" value={last7Days.toLocaleString()} />
          <StatCard label="Platforms tracked" value={byPlatform.length} />
          <StatCard label="Unique links" value={topLinks.length < 10 ? topLinks.length : "10+"} />
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Clicks by platform */}
          <Section title="Clicks by Platform">
            <div className="flex flex-col gap-3">
              {byPlatform.length === 0 && (
                <p className="font-mono text-xs text-[#FFFBF7]/30">No data yet</p>
              )}
              {byPlatform.map(([platform, count]) => (
                <div key={platform} className="flex items-center gap-3">
                  <div className="w-28 shrink-0">
                    <p className="font-mono text-xs text-[#FFFBF7]/70 truncate">{platform}</p>
                  </div>
                  <div className="flex-1 bg-[#FFFBF7]/8 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-[#EC7A5B] rounded-full"
                      style={{ width: `${(count / maxPlatformCount) * 100}%` }}
                    />
                  </div>
                  <p className="font-mono text-xs text-[#FFFBF7]/50 w-8 text-right shrink-0">{count}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Top episodes */}
          <Section title="Top Episodes Clicked">
            <div className="flex flex-col gap-2">
              {topEpisodes.length === 0 && (
                <p className="font-mono text-xs text-[#FFFBF7]/30">No data yet</p>
              )}
              {topEpisodes.map(({ title, count }, i) => (
                <div key={title} className="flex items-center gap-3 py-2 border-b border-[#FFFBF7]/8 last:border-0">
                  <span className="font-mono text-xs text-[#FFFBF7]/20 w-5 shrink-0">{i + 1}</span>
                  <p className="font-mono text-xs text-[#FFFBF7]/70 flex-1 truncate">{title}</p>
                  <span className="font-mono text-xs text-[#EC7A5B] shrink-0">{count}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Top links */}
          <Section title="Top Clicked Links">
            <div className="flex flex-col gap-2">
              {topLinks.length === 0 && (
                <p className="font-mono text-xs text-[#FFFBF7]/30">No data yet</p>
              )}
              {topLinks.map(({ href, linkText, count }, i) => (
                <div key={href} className="flex items-start gap-3 py-2 border-b border-[#FFFBF7]/8 last:border-0">
                  <span className="font-mono text-xs text-[#FFFBF7]/20 w-5 shrink-0 mt-0.5">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs text-[#FFFBF7]/50 truncate">{linkText ?? "—"}</p>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-[#FFFBF7]/30 truncate block hover:text-[#EC7A5B] transition-colors"
                    >
                      {href}
                    </a>
                  </div>
                  <span className="font-mono text-xs text-[#EC7A5B] shrink-0">{count}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Clicks by location */}
          <Section title="Clicks by Page Location">
            <div className="flex flex-col gap-2">
              {topLocations.length === 0 && (
                <p className="font-mono text-xs text-[#FFFBF7]/30">No data yet — add <code className="text-[#EC7A5B]">location</code> prop to TrackedExternalLink</p>
              )}
              {topLocations.map(({ loc, count }, i) => (
                <div key={loc} className="flex items-center gap-3 py-2 border-b border-[#FFFBF7]/8 last:border-0">
                  <span className="font-mono text-xs text-[#FFFBF7]/20 w-5 shrink-0">{i + 1}</span>
                  <p className="font-mono text-xs text-[#FFFBF7]/70 flex-1">{loc}</p>
                  <span className="font-mono text-xs text-[#EC7A5B] shrink-0">{count}</span>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* Recent events table */}
        <Section title="Recent Click Events">
          <div className="overflow-x-auto rounded-2xl border border-[#FFFBF7]/8">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#FFFBF7]/8">
                  {["Time", "Platform", "Episode", "Location", "Link"].map((h) => (
                    <th key={h} className="font-mono text-xs uppercase tracking-widest text-[#FFFBF7]/30 px-4 py-3 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentClicks.length === 0 && (
                  <tr>
                    <td colSpan={5} className="font-mono text-xs text-[#FFFBF7]/30 px-4 py-6 text-center">
                      No clicks recorded yet
                    </td>
                  </tr>
                )}
                {recentClicks.map((click) => (
                  <tr key={click.id} className="border-b border-[#FFFBF7]/5 last:border-0 hover:bg-[#FFFBF7]/3 transition-colors">
                    <td className="font-mono text-xs text-[#FFFBF7]/40 px-4 py-3 whitespace-nowrap">
                      {formatDate(click.created_at)}
                    </td>
                    <td className="font-mono text-xs text-[#FFFBF7]/70 px-4 py-3 whitespace-nowrap">
                      {click.platform ?? "—"}
                    </td>
                    <td className="font-mono text-xs text-[#FFFBF7]/50 px-4 py-3 max-w-[200px] truncate">
                      {click.episode_title ?? "—"}
                    </td>
                    <td className="font-mono text-xs text-[#FFFBF7]/40 px-4 py-3 whitespace-nowrap">
                      {click.location ?? "—"}
                    </td>
                    <td className="font-mono text-xs text-[#FFFBF7]/30 px-4 py-3 max-w-[250px] truncate">
                      <a href={click.href} target="_blank" rel="noopener noreferrer" className="hover:text-[#EC7A5B] transition-colors">
                        {click.href}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </div>
    </div>
  );
}
