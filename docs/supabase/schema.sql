-- Production schema for The Major Insight. Apply to a new Supabase project.
create extension if not exists pgcrypto;

do $$ begin create type post_status as enum ('draft','review','scheduled','published','archived'); exception when duplicate_object then null; end $$;
do $$ begin create type admin_role as enum ('writer','editor','administrator'); exception when duplicate_object then null; end $$;

create table if not exists admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null, role admin_role not null default 'writer', active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists authors (
  id uuid primary key default gen_random_uuid(), name text not null, slug text unique not null,
  email text unique, position text not null, bio text not null default '', avatar_url text,
  category_focus text, is_ai_assisted boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists categories (
  id uuid primary key default gen_random_uuid(), name text not null, slug text unique not null,
  description text not null default '', seo_title text, seo_description text, sort_order integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists tags (
  id uuid primary key default gen_random_uuid(), name text not null, slug text unique not null,
  description text not null default '', created_at timestamptz not null default now()
);
create table if not exists media_assets (
  id uuid primary key default gen_random_uuid(), storage_bucket text not null default 'media', storage_path text not null,
  public_url text, alt_text text not null, caption text, credit text, mime_type text, width integer, height integer,
  uploaded_by uuid references admin_profiles(id), created_at timestamptz not null default now(), unique(storage_bucket, storage_path)
);
create table if not exists posts (
  id uuid primary key default gen_random_uuid(), title text not null check (length(trim(title)) > 0), slug text unique not null,
  excerpt text not null default '', content jsonb not null default '{"paragraphs":[]}'::jsonb,
  content_type text not null default 'Analysis' check (content_type in ('Analysis','News','Explainer','Guide','Review','Comparison','Report','Opinion')),
  category_id uuid references categories(id), author_id uuid references authors(id), status post_status not null default 'draft',
  featured_image_id uuid references media_assets(id) on delete set null, featured_image_url text, featured_image_alt text,
  featured_image_caption text, featured_image_credit text, seo_title text, seo_description text, canonical_url text, focus_keyword text,
  published_at timestamptz, scheduled_at timestamptz, reading_time_minutes integer not null default 1 check (reading_time_minutes > 0),
  is_featured boolean not null default false, is_breaking boolean not null default false, is_editor_pick boolean not null default false,
  include_in_newsletter boolean not null default false, view_count bigint not null default 0 check (view_count >= 0), share_count bigint not null default 0,
  created_by uuid references admin_profiles(id), updated_by uuid references admin_profiles(id),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  constraint valid_publication_dates check (
    (status = 'scheduled' and scheduled_at is not null and published_at is null)
    or (status = 'published' and published_at is not null and published_at <= now())
    or status in ('draft','review','archived')
  )
);
create table if not exists post_tags (post_id uuid references posts(id) on delete cascade, tag_id uuid references tags(id) on delete cascade, primary key(post_id,tag_id));
create table if not exists post_sources (
  id uuid primary key default gen_random_uuid(), post_id uuid not null references posts(id) on delete cascade,
  label text not null, url text not null check (url ~ '^https?://'), publisher text, accessed_at date, sort_order integer not null default 0, created_at timestamptz not null default now()
);
create table if not exists post_revisions (
  id uuid primary key default gen_random_uuid(), post_id uuid not null references posts(id) on delete cascade,
  revision_number integer not null, title text not null, excerpt text not null, content jsonb not null,
  change_note text, created_by uuid references admin_profiles(id), created_at timestamptz not null default now(), unique(post_id, revision_number)
);
create table if not exists post_views (
  id bigint generated always as identity primary key, post_id uuid not null references posts(id) on delete cascade,
  viewed_on date not null default current_date, visitor_hash text, referrer_host text, created_at timestamptz not null default now()
);
create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(), email text unique not null check (email = lower(email)), name text,
  status text not null default 'active' check(status in ('active','unsubscribed','bounced')), source text not null default 'website',
  interests text[] not null default '{}', consented_at timestamptz not null default now(), unsubscribed_at timestamptz, created_at timestamptz not null default now()
);
create table if not exists redirects (
  id uuid primary key default gen_random_uuid(), source_path text unique not null check (source_path like '/%'), destination_url text not null,
  status_code integer not null default 301 check(status_code in (301,302,307,308)), active boolean not null default true, created_at timestamptz not null default now()
);
create table if not exists trend_topics (
  id uuid primary key default gen_random_uuid(), topic text not null, slug text not null, source text not null, score numeric not null default 0,
  metadata jsonb not null default '{}'::jsonb, discovered_at timestamptz not null default now(), expires_at timestamptz, reviewed_by uuid references admin_profiles(id)
);
create table if not exists site_settings (
  key text primary key, value jsonb not null, description text, is_public boolean not null default false,
  updated_by uuid references admin_profiles(id), updated_at timestamptz not null default now()
);
create table if not exists audit_logs (
  id bigint generated always as identity primary key, actor_id uuid references admin_profiles(id), action text not null,
  entity_type text not null, entity_id uuid, old_values jsonb, new_values jsonb, ip_hash text, created_at timestamptz not null default now()
);

create index if not exists posts_public_feed_idx on posts(published_at desc) where status = 'published';
create index if not exists posts_category_feed_idx on posts(category_id,published_at desc) where status = 'published';
create index if not exists posts_author_feed_idx on posts(author_id,published_at desc) where status = 'published';
create index if not exists posts_featured_idx on posts(is_featured,published_at desc) where status = 'published';
create index if not exists posts_views_idx on posts(view_count desc) where status = 'published';
create index if not exists posts_scheduled_idx on posts(scheduled_at) where status = 'scheduled';
create index if not exists post_tags_tag_idx on post_tags(tag_id,post_id);
create index if not exists post_sources_post_idx on post_sources(post_id,sort_order);
create index if not exists post_views_post_date_idx on post_views(post_id,viewed_on desc);
create index if not exists trend_topics_score_idx on trend_topics(score desc,discovered_at desc);
create index if not exists audit_logs_entity_idx on audit_logs(entity_type,entity_id,created_at desc);

create or replace function is_active_admin() returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from admin_profiles where id=auth.uid() and active)
$$;
create or replace function set_updated_at() returns trigger language plpgsql set search_path=public as $$ begin new.updated_at=now(); return new; end $$;
drop trigger if exists posts_updated_at on posts; create trigger posts_updated_at before update on posts for each row execute function set_updated_at();

alter table admin_profiles enable row level security; alter table authors enable row level security; alter table categories enable row level security;
alter table tags enable row level security; alter table media_assets enable row level security; alter table posts enable row level security;
alter table post_tags enable row level security; alter table post_sources enable row level security; alter table post_revisions enable row level security;
alter table post_views enable row level security; alter table newsletter_subscribers enable row level security; alter table redirects enable row level security;
alter table trend_topics enable row level security; alter table site_settings enable row level security; alter table audit_logs enable row level security;

create policy "public published posts" on posts for select using(status='published' and published_at is not null and published_at<=now());
create policy "public authors" on authors for select using(exists(select 1 from posts p where p.author_id=authors.id and p.status='published' and p.published_at<=now()));
create policy "public categories" on categories for select using(true);
create policy "public tags" on tags for select using(true);
create policy "public published post tags" on post_tags for select using(exists(select 1 from posts p where p.id=post_id and p.status='published' and p.published_at<=now()));
create policy "public published sources" on post_sources for select using(exists(select 1 from posts p where p.id=post_id and p.status='published' and p.published_at<=now()));
create policy "public referenced media" on media_assets for select using(exists(select 1 from posts p where p.featured_image_id=media_assets.id and p.status='published' and p.published_at<=now()));
create policy "public settings" on site_settings for select using(is_public);
create policy "admins manage profiles" on admin_profiles for select to authenticated using(is_active_admin());
-- Authenticated admin policies are intentionally explicit; service_role also bypasses RLS.
create policy "admins manage posts" on posts for all to authenticated using(is_active_admin()) with check(is_active_admin());
create policy "admins manage revisions" on post_revisions for all to authenticated using(is_active_admin()) with check(is_active_admin());
create policy "admins manage sources" on post_sources for all to authenticated using(is_active_admin()) with check(is_active_admin());
create policy "admins manage post tags" on post_tags for all to authenticated using(is_active_admin()) with check(is_active_admin());
create policy "admins manage media" on media_assets for all to authenticated using(is_active_admin()) with check(is_active_admin());

create or replace function increment_post_view(post_slug text) returns bigint language plpgsql security definer set search_path=public as $$
declare post_uuid uuid; updated_views bigint;
begin
  select id into post_uuid from posts where slug=post_slug and status='published' and published_at<=now();
  if post_uuid is null then return null; end if;
  insert into post_views(post_id) values(post_uuid);
  update posts set view_count=view_count+1 where id=post_uuid returning view_count into updated_views;
  return updated_views;
end $$;
revoke all on function increment_post_view(text) from public, anon, authenticated;
grant execute on function increment_post_view(text) to service_role;
