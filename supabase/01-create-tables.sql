-- Tables for Show Up SOKY. Safe to re-run.

create table if not exists organizations (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text unique not null,
  description   text,
  website_url   text,
  logo_url      text,
  contact_email text,
  ical_url      text,
  status        text not null default 'pending'
                check (status in ('pending', 'approved')),
  created_at    timestamptz default now()
);

create table if not exists events (
  id                 uuid primary key default gen_random_uuid(),
  org_id             uuid references organizations(id) on delete set null,
  title              text not null,
  description        text,
  starts_at          timestamptz not null,
  ends_at            timestamptz,
  location_name      text,
  address            text,
  is_online          boolean default false,
  online_url         text,
  event_type         text not null default 'other'
                     check (event_type in ('rally','meeting','volunteer','town_hall','training','social','other')),
  is_free            boolean default true,
  rsvp_url           text,
  image_url          text,
  status             text not null default 'pending'
                     check (status in ('pending','approved','rejected')),
  source             text not null default 'form'
                     check (source in ('form','ical')),
  external_uid       text,
  submitted_by_email text,
  created_at         timestamptz default now(),
  updated_at         timestamptz default now(),
  unique (org_id, external_uid)
);

create index if not exists events_upcoming on events (status, starts_at);

create table if not exists subscribers (
  id                uuid primary key default gen_random_uuid(),
  email             text unique not null,
  confirmed         boolean default false,
  confirm_token     uuid default gen_random_uuid(),
  unsubscribe_token uuid default gen_random_uuid(),
  created_at        timestamptz default now()
);

create table if not exists admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  role       text not null default 'moderator'
             check (role in ('owner','moderator')),
  created_at timestamptz default now()
);