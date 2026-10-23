-- Group profile fields, public column permissions, and logo uploads
-- from the registration form. Safe to re-run.

-- ===== New profile columns =====
alter table organizations
  add column if not exists tagline          text,
  add column if not exists focus_areas      text[] not null default '{}',
  add column if not exists meeting_schedule text,
  add column if not exists meeting_location text,
  add column if not exists get_involved     text,
  add column if not exists public_email     text,
  add column if not exists phone            text,
  add column if not exists facebook_url     text,
  add column if not exists instagram_url    text,
  add column if not exists organizer_name   text,
  add column if not exists organizer_email  text;

-- Must match the list in src/lib/focus-area.ts
alter table organizations drop constraint if exists focus_areas_valid;
alter table organizations
  add constraint focus_areas_valid check (
    focus_areas <@ array[
      'voting_rights', 'racial_justice', 'lgbtq_rights', 'immigrant_rights',
      'workers_rights', 'housing', 'education', 'environment',
      'health_care', 'disability_rights', 'community_aid'
    ]::text[]
  );

-- ===== Privacy: the public (anon) can read only these columns =====
-- Not granted: contact_email, ical_url, organizer_name, organizer_email
revoke select on public.organizations from anon;
grant select (
  id, name, slug, description, website_url, logo_url, status, created_at,
  tagline, focus_areas, meeting_schedule, meeting_location, get_involved,
  public_email, phone, facebook_url, instagram_url
) on public.organizations to anon;

-- Not granted: submitted_by_email, submitted_org_name, external_uid, source
revoke select on public.events from anon;
grant select (
  id, org_id, title, description, starts_at, ends_at, location_name, address,
  is_online, online_url, event_type, is_free, rsvp_url, image_url,
  status, created_at, updated_at
) on public.events to anon;

-- ===== Logo uploads from the public registration form =====
drop policy if exists "Public can upload logos with registration" on storage.objects;
create policy "Public can upload logos with registration"
  on storage.objects for insert to anon, authenticated
  with check (
    bucket_id = 'org-logos'
    and (storage.foldername(name))[1] = 'submissions'
  );