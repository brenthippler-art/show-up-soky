# Database setup

Run these in the Supabase SQL Editor, in order, on a fresh project:

1. `01-create-tables.sql`: tables and index
2. `02-rls-policies.sql`: row-level security and the `is_admin()` helper
3. `03-add-submitted-org-name.sql`: lets events name an unregistered group
4. `04-storage.sql`: image buckets and upload rules
5. `05-group-profiles.sql`: group profile fields and public column permissions
6. `06-focus-area-other.sql`: Adds a text area 'other' option focus area

Then:
- Create your user in Authentication → Users, and run `seed-admin.sql` with your email.
- Optional: `seed-test-data.sql` for sample events.

Every script is safe to re-run.