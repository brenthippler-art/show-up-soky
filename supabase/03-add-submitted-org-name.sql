-- Lets an event name a group that isn't registered yet. Safe to re-run.

alter table events add column if not exists submitted_org_name text;