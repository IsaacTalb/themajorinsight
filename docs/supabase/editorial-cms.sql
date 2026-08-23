-- Phase 6 editorial CMS migration. Run after schema.sql and admin-auth.sql.
-- Drafts may intentionally be incomplete; publication checks live in the CMS and
-- the database continues to enforce the final workflow dates.
alter table posts alter column category_id drop not null;
alter table posts alter column author_id drop not null;

create policy "staff insert revisions" on post_revisions for insert to authenticated with check(is_active_admin() and created_by=auth.uid());
create policy "staff read revisions" on post_revisions for select to authenticated using(is_active_admin());
create policy "staff insert sources" on post_sources for insert to authenticated with check(is_active_admin());
create policy "staff update sources" on post_sources for update to authenticated using(is_active_admin()) with check(is_active_admin());
create policy "staff delete sources" on post_sources for delete to authenticated using(is_active_admin());
create policy "staff insert post tags" on post_tags for insert to authenticated with check(is_active_admin());
create policy "staff delete post tags" on post_tags for delete to authenticated using(is_active_admin());
create policy "staff record audit logs" on audit_logs for insert to authenticated with check(actor_id=auth.uid() and is_active_admin());
create policy "editors read post audit logs" on audit_logs for select to authenticated using(admin_has_role(array['owner','admin','editor']::admin_role[]));
