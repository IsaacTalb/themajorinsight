-- Phase 5: approved editorial accounts and least-privilege RLS.
-- Run after schema.sql. Add users through Supabase Auth, then insert their UUID
-- into admin_profiles explicitly; registration alone never grants admin access.
alter type admin_role rename value 'writer' to 'author';
alter type admin_role rename value 'administrator' to 'admin';
alter type admin_role add value if not exists 'owner';

create or replace function admin_has_role(allowed admin_role[]) returns boolean
language sql stable security definer set search_path=public as $$
  select exists(select 1 from admin_profiles where id=auth.uid() and active and role=any(allowed))
$$;
revoke all on function admin_has_role(admin_role[]) from public;
grant execute on function admin_has_role(admin_role[]) to authenticated;

-- Read access supports the dashboard. Mutation access is intentionally narrower.
create policy "admins read authors" on authors for select to authenticated using(is_active_admin());
create policy "admins read categories" on categories for select to authenticated using(is_active_admin());
create policy "admins read tags" on tags for select to authenticated using(is_active_admin());
create policy "admins read subscribers" on newsletter_subscribers for select to authenticated using(admin_has_role(array['owner','admin','editor']::admin_role[]));
create policy "admins read trends" on trend_topics for select to authenticated using(is_active_admin());
create policy "admins read audit logs" on audit_logs for select to authenticated using(admin_has_role(array['owner','admin']::admin_role[]));
create policy "admins manage authors" on authors for all to authenticated using(admin_has_role(array['owner','admin','editor']::admin_role[])) with check(admin_has_role(array['owner','admin','editor']::admin_role[]));
create policy "admins manage categories" on categories for all to authenticated using(admin_has_role(array['owner','admin','editor']::admin_role[])) with check(admin_has_role(array['owner','admin','editor']::admin_role[]));
create policy "admins manage tags" on tags for all to authenticated using(admin_has_role(array['owner','admin','editor']::admin_role[])) with check(admin_has_role(array['owner','admin','editor']::admin_role[]));
create policy "owners manage settings" on site_settings for all to authenticated using(admin_has_role(array['owner','admin']::admin_role[])) with check(admin_has_role(array['owner','admin']::admin_role[]));

drop policy if exists "admins manage posts" on posts;
create policy "staff read posts" on posts for select to authenticated using(is_active_admin());
create policy "staff create posts" on posts for insert to authenticated with check(
  admin_has_role(array['owner','admin','editor']::admin_role[]) or
  (admin_has_role(array['author']::admin_role[]) and created_by=auth.uid())
);
create policy "editors update posts" on posts for update to authenticated
  using(admin_has_role(array['owner','admin','editor']::admin_role[]) or created_by=auth.uid())
  with check(admin_has_role(array['owner','admin','editor']::admin_role[]) or (created_by=auth.uid() and status in ('draft','review')));
create policy "admins delete posts" on posts for delete to authenticated using(admin_has_role(array['owner','admin']::admin_role[]));

drop policy if exists "admins manage media" on media_assets;
create policy "staff read media" on media_assets for select to authenticated using(is_active_admin());
create policy "staff upload media" on media_assets for insert to authenticated with check(is_active_admin() and uploaded_by=auth.uid());
create policy "editors update media" on media_assets for update to authenticated using(admin_has_role(array['owner','admin','editor']::admin_role[]) or uploaded_by=auth.uid());
create policy "admins delete media" on media_assets for delete to authenticated using(admin_has_role(array['owner','admin']::admin_role[]));
