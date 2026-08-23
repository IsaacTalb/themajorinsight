-- Phase 7: R2 stores image bytes; Supabase stores searchable editorial metadata only.
alter table media_assets rename column storage_path to object_key;
alter table media_assets add column if not exists filename text;
alter table media_assets add column if not exists file_size bigint check (file_size > 0 and file_size <= 15728640);
alter table media_assets add column if not exists r2_url text;
alter table media_assets add column if not exists creator text;
alter table media_assets add column if not exists original_source_url text;
alter table media_assets add column if not exists license text;
alter table media_assets add column if not exists attribution text;
alter table media_assets add column if not exists associated_post uuid references posts(id) on delete set null;
alter table media_assets add constraint media_assets_supported_mime check (mime_type in ('image/jpeg','image/png','image/webp','image/avif'));
alter table media_assets alter column object_key set not null;
alter table media_assets alter column filename set not null;
alter table media_assets alter column r2_url set not null;
create unique index if not exists media_assets_object_key_idx on media_assets(object_key);
create index if not exists media_assets_search_idx on media_assets using gin(to_tsvector('english',coalesce(filename,'')||' '||coalesce(alt_text,'')||' '||coalesce(creator,'')||' '||coalesce(license,'')));
