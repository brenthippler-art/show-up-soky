-- Image buckets for event flyers and group logos. Safe to re-run.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('event-images', 'event-images', true, 5242880,
   array['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('org-logos', 'org-logos', true, 2097152,
   array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

-- Anyone can upload a flyer, but only into "submissions"
drop policy if exists "Public can upload event flyers" on storage.objects;
create policy "Public can upload event flyers"
  on storage.objects for insert to anon, authenticated
  with check (
    bucket_id = 'event-images'
    and (storage.foldername(name))[1] = 'submissions'
  );

-- Admins can do anything with flyers
drop policy if exists "Admins manage event images" on storage.objects;
create policy "Admins manage event images"
  on storage.objects for all to authenticated
  using (bucket_id = 'event-images' and public.is_admin())
  with check (bucket_id = 'event-images' and public.is_admin());

-- Admins can do anything with logos
drop policy if exists "Admins manage org logos" on storage.objects;
create policy "Admins manage org logos"
  on storage.objects for all to authenticated
  using (bucket_id = 'org-logos' and public.is_admin())
  with check (bucket_id = 'org-logos' and public.is_admin());