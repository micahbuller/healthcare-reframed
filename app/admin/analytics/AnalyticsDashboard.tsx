"use client";

import React, { useCallback, useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

// ── Shared types (exported so page.tsx and the API route can import them) ──

export type Click = {
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

export type AnalyticsData = {
  totalClicks: number;
  last7Days: number;
  byPlatform: [string, number][];
  topLinks: { href: string; count: number; linkText: string | null; episodeTitle: string | null }[];
  topEpisodes: { title: string; count: number }[];
  topLocations: { loc: string; count: number }[];
  recentClicks: Click[];
};

// ── Small UI helpers ──

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
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// ── Main dashboard component ──

export default function AnalyticsDashboard({ initialData }: { initialData: AnalyticsData }) {
  const [data, setData] = useState<AnalyticsData>(initialData);
  const [connected, setConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchLatest = useCallback(async () => {
    try {
      const res = await fetch("/api/analytics/dashboard");
      if (!res.ok) return;
      const fresh = (await res.json()) as AnalyticsData;
      setData(fresh);
      setLastUpdated(new Date());
    } catch {
      // Silently ignore — keep showing existing data
    }
  }, []);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    // Supabase Realtime: fires immediately when a new click is recorded.
    //
    // To enable postgres_changes, do the following once in Supabase Dashboard:
    //   1. Database → Replication → click "0 Tables" → toggle on `outbound_clicks`
    //   2. If RLS is enabled on the table, add a SELECT policy for the anon role:
    //      CREATE POLICY "realtime read" ON outbound_clicks FOR SELECT TO anon USING (true);
    //
    // If these aren't configured, the 30-second polling fallback below keeps the
    // dashboard up-to-date regardless.
    const channel = supabase
      .channel("analytics-realtime")
      .on<Click>(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "outbound_clicks" },
        () => {
          fetchLatest();
        }
      )
      .subscribe((status) => {
        setConnected(status === "SUBSCRIBED");
      });

    // Polling fallback — refreshes every 30 s even if realtime events don't fire
    const interval = setInterval(fetchLatest, 30_000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [fetchLatest]);

  const { totalClicks, last7Days, byPlatform, topLinks, topEpisodes, topLocations, recentClicks } =
    data;
  const maxPlatformCount = byPlatform[0]?.[1] ?? 1;

  return (
    <div className="min-h-screen bg-[#2F2C2C] px-4 md:px-10 py-16">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-[#EC7A5B] mb-2">
              Healthcare Reframed
            </p>
            <h1 className="font-mono uppercase text-4xl md:text-5xl text-[#FFFBF7] leading-none">
              Outbound Analytics
            </h1>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <p className="font-sans text-sm text-[#FFFBF7]/40">
                Internal dashboard — all times in local browser timezone
              </p>
              <div className="flex items-center gap-1.5">
                <span
                  className={`inline-block w-1.5 h-1.5 rounded-full ${
                    connected ? "bg-green-400 animate-pulse" : "bg-[#FFFBF7]/20"
                  }`}
                />
                <span className="font-mono text-xs text-[#FFFBF7]/30">
                  {connected
                    ? lastUpdated
                      ? `Live · updated ${formatDate(lastUpdated.toISOString())}`
                      : "Live"
                    : "Connecting…"}
                </span>
              </div>
            </div>
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
                  <p className="font-mono text-xs text-[#FFFBF7]/50 w-8 text-right shrink-0">
                    {count}
                  </p>
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
                <div
                  key={title}
                  className="flex items-center gap-3 py-2 border-b border-[#FFFBF7]/8 last:border-0"
                >
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
                <div
                  key={href}
                  className="flex items-start gap-3 py-2 border-b border-[#FFFBF7]/8 last:border-0"
                >
                  <span className="font-mono text-xs text-[#FFFBF7]/20 w-5 shrink-0 mt-0.5">
                    {i + 1}
                  </span>
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
                <p className="font-mono text-xs text-[#FFFBF7]/30">
                  No data yet — add{" "}
                  <code className="text-[#EC7A5B]">location</code> prop to TrackedExternalLink
                </p>
              )}
              {topLocations.map(({ loc, count }, i) => (
                <div
                  key={loc}
                  className="flex items-center gap-3 py-2 border-b border-[#FFFBF7]/8 last:border-0"
                >
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
                    <th
                      key={h}
                      className="font-mono text-xs uppercase tracking-widest text-[#FFFBF7]/30 px-4 py-3 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentClicks.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="font-mono text-xs text-[#FFFBF7]/30 px-4 py-6 text-center"
                    >
                      No clicks recorded yet
                    </td>
                  </tr>
                )}
                {recentClicks.map((click) => (
                  <tr
                    key={click.id}
                    className="border-b border-[#FFFBF7]/5 last:border-0 hover:bg-[#FFFBF7]/3 transition-colors"
                  >
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
                      <a
                        href={click.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#EC7A5B] transition-colors"
                      >
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
