-- Initial Supabase schema plan for The Major News.
-- Run after project creation, then add Row Level Security policies before production.

create table if not exists authors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  email text unique not null,
  position text not null,
  bio text default '',
  avatar_url text,
  category_focus text,
  is_ai_assisted boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text not null,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now()
);

create table if not exists tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text default ''
);

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text not null,
  content text not null,
  featured_image_url text,
  featured_image_alt text,
  category_id uuid references categories(id),
  author_id uuid references authors(id),
  status text not null default 'draft' check (status in ('draft', 'review', 'scheduled', 'published', 'archived')),
  published_at timestamptz,
  updated_at timestamptz not null default now(),
  seo_title text,
  seo_description text,
  canonical_url text,
  focus_keyword text,
  reading_time text,
  view_count bigint not null default 0,
  share_count bigint not null default 0,
  is_featured boolean not null default false,
  is_breaking boolean not null default false,
  source_urls jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists post_tags (
  post_id uuid references posts(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  status text not null default 'active' check (status in ('active', 'unsubscribed', 'bounced')),
  source text default 'website',
  interests text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists posts_status_published_at_idx on posts(status, published_at desc);
create index if not exists posts_category_id_idx on posts(category_id);
create index if not exists newsletter_subscribers_status_idx on newsletter_subscribers(status);

-- Public visitors can read published editorial data but cannot mutate it.
alter table authors enable row level security;
alter table categories enable row level security;
alter table tags enable row level security;
alter table posts enable row level security;
alter table post_tags enable row level security;
alter table newsletter_subscribers enable row level security;

create policy "Published posts are publicly readable" on posts
  for select using (status = 'published' and published_at <= now());
create policy "Categories are publicly readable" on categories for select using (true);
create policy "Tags are publicly readable" on tags for select using (true);
create policy "Authors are publicly readable" on authors for select using (true);
create policy "Published post tags are publicly readable" on post_tags for select using (
  exists (select 1 from posts where posts.id = post_tags.post_id and posts.status = 'published' and posts.published_at <= now())
);
create policy "Visitors can subscribe" on newsletter_subscribers
  for insert with check (status = 'active' and source = 'website');

create or replace function increment_post_view(post_slug text)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare updated_views bigint;
begin
  update posts set view_count = view_count + 1
  where slug = post_slug and status = 'published'
  returning view_count into updated_views;
  return updated_views;
end;
$$;

revoke all on function increment_post_view(text) from public;
grant execute on function increment_post_view(text) to service_role;
