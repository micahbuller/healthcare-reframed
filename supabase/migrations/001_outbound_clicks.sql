-- Run this SQL in the Supabase SQL editor (Dashboard → SQL Editor → New query)
-- or use the Supabase CLI: supabase db push

create table if not exists outbound_clicks (
  id          uuid        primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  href        text        not null,
  page_path   text,
  link_text   text,
  platform    text,
  episode_title text,
  location    text,
  referrer    text,
  user_agent  text,
  ip_hash     text
);

create index if not exists outbound_clicks_created_at_idx
  on outbound_clicks (created_at desc);

create index if not exists outbound_clicks_platform_idx
  on outbound_clicks (platform);

create index if not exists outbound_clicks_href_idx
  on outbound_clicks (href);

-- Optional: enable Row Level Security (recommended for Supabase projects)
-- Since we only write via the service role key, no RLS policies are needed for reads.
alter table outbound_clicks enable row level security;
