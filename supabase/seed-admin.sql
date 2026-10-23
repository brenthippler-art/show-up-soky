-- Make a user an admin. First create the user in
-- Authentication → Users (with "Auto Confirm User" checked),
-- then replace the email below and run this.

insert into admins (user_id, role)
select id, 'owner' from auth.users where email = 'you@example.com'
on conflict (user_id) do nothing;