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
