-- Row-level security for every table, plus the admin check. Safe to re-run.

alter table organizations enable row level security;
alter table events        enable row level security;
alter table subscribers   enable row level security;
alter table admins        enable row level security;

-- Is the logged-in user an admin?
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins
    where user_id = (select auth.uid())
  );
$$;

-- ===== Organizations =====
drop policy if exists "Public can read approved orgs" on organizations;
create policy "Public can read approved orgs"
  on organizations for select to anon, authenticated
  using (status = 'approved');

drop policy if exists "Public can submit orgs as pending" on organizations;
create policy "Public can submit orgs as pending"
  on organizations for insert to anon, authenticated
  with check (status = 'pending');

drop policy if exists "Admins manage orgs" on organizations;
create policy "Admins manage orgs"
  on organizations for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ===== Events =====
drop policy if exists "Public can read approved events" on events;
create policy "Public can read approved events"
  on events for select to anon, authenticated
  using (status = 'approved');

drop policy if exists "Public can submit events as pending" on events;
create policy "Public can submit events as pending"
  on events for insert to anon, authenticated
  with check (status = 'pending' and source = 'form');

drop policy if exists "Admins manage events" on events;
create policy "Admins manage events"
  on events for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ===== Subscribers (no public read, ever) =====
drop policy if exists "Public can sign up" on subscribers;
create policy "Public can sign up"
  on subscribers for insert to anon, authenticated
  with check (confirmed = false);

drop policy if exists "Admins manage subscribers" on subscribers;
create policy "Admins manage subscribers"
  on subscribers for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ===== Admins (added by hand in the dashboard, never by the app) =====
drop policy if exists "Admins can read admins" on admins;
create policy "Admins can read admins"
  on admins for select to authenticated
  using (public.is_admin());