-- Optional sample data for a fresh development database.
-- Dates are relative to "now", so events are always upcoming.

insert into organizations (name, slug, description, status)
values ('Test Org', 'test-org', 'A placeholder organization for development.', 'approved')
on conflict (slug) do nothing;

insert into events (org_id, title, description, starts_at, ends_at, location_name, address, event_type, status)
values
  ((select id from organizations where slug = 'test-org'),
   'Community Meeting', 'Monthly meeting to plan upcoming actions.',
   now() + interval '3 days', now() + interval '3 days 2 hours',
   'Warren County Public Library', '1225 State St, Bowling Green, KY', 'meeting', 'approved'),
  ((select id from organizations where slug = 'test-org'),
   'Park Cleanup', 'Bring gloves. Trash bags provided.',
   now() + interval '6 days', now() + interval '6 days 3 hours',
   'Riverfront Park', null, 'volunteer', 'approved'),
  ((select id from organizations where slug = 'test-org'),
   'Pending Event (should NOT show)', 'Tests that RLS hides unapproved events.',
   now() + interval '4 days', null,
   'Somewhere', null, 'other', 'pending');