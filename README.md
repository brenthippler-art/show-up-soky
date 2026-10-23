# Show Up SOKY ☀️

**One community calendar for the events moving rights and freedoms forward across South Central Kentucky.**

🔗 **Live site:** [show-up-soky.vercel.app](https://show-up-soky.vercel.app)

---

## The problem

Every local group in South Central Kentucky has its own website, its own mailing list and its own calendar. Great events slip by, and people who would gladly show up never hear about them. Organizers end up promoting the same event in five places, and neighbors have to follow a dozen Facebook pages to keep up.

## The solution

Show Up SOKY is a shared clearinghouse:

- **For neighbors:** one calendar with every event, filters for what you care about, a profile page for each local group, and a weekly email every Monday.
- **For organizers:** a free listing for their group and events. Every event gets its own shareable page with directions, add-to-calendar buttons and a rich preview for Facebook and group texts.
- **For trust:** every event and group is reviewed by a person before it goes live.

## My contribution

Designed and built solo, end to end:

- Product concept, information architecture and visual design
- Database schema, row-level security and column-level privacy in Postgres
- All front-end pages and components, including a custom accessible calendar
- Admin moderation tools, image uploads, and the email pipeline (double opt-in signup, weekly digest, new-submission alerts)
- Deployment, scheduled jobs and environment configuration

## Stack

| Area | Tools |
|---|---|
| Framework | Next.js 16 (App Router, Cache Components, Server Actions), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (CSS-first theme, container queries) |
| Database & auth | Supabase (Postgres, Row-Level Security, Auth, Storage) |
| Email | Resend |
| Dates | date-fns, date-fns-tz |
| Hosting | Vercel (with Vercel Cron for the weekly digest) |


## Technical decisions

**Security lives in the database, not just the app.**
Every table uses Postgres row-level security. The public can read only approved events and groups, can submit only as "pending," and can never read the mailing list. Column-level grants go further: even on approved rows, private fields like submitter and organizer emails can't be read through the public API. Admin access is checked by an `is_admin()` function that the policies call, so the app and the database enforce the same rules. Full SQL is in [`supabase/`](supabase/).

**Moderation by default.**
Events and group registrations land as pending. Admins approve, edit or reject from a review queue, and get an email alert for every new submission.

**Caching that stays fresh.**
Public data is fetched through `'use cache'` functions tagged `events` and `orgs`. Admin actions call `updateTag()`, so an approved event appears on the site instantly instead of waiting for the cache to expire. Request-specific pieces (the current date, the logged-in admin) render inside `<Suspense>` so the rest of each page can be prerendered.

**URL-driven state.**
The calendar's selected day, week, month and filters all live in the URL (`/events?date=2026-11-01&type=volunteer`). The back button works, every view is shareable, and the calendar and filters are plain server-rendered links with no client-side state.

**Time zones handled once, in one place.**
Times are stored in UTC and shown in Central time. Calendar logic uses "day keys" (`2026-11-01` strings in Central time), which sort and compare correctly as plain text and avoid off-by-one-day bugs at midnight.

**Image uploads that bypass server limits.**
Flyers and logos upload directly from the browser to Supabase Storage. Only the resulting URL goes through the server, where it's verified to point at this project's own bucket. Bucket rules cap file size and allow only safe image types (SVG is excluded because it can carry scripts).

**Email that doesn't break forms.**
Admin alerts are sent with Next.js `after()`, which runs once the response has gone back to the user. A slow or failed email never delays or breaks a submission.

**Weekly digest.**
A Vercel Cron job calls a protected route every Monday. It sends each confirmed subscriber the week's events with a personal one-click unsubscribe link and a `List-Unsubscribe` header.

## Accessibility

- **Semantic HTML:** a real `<table>` for the calendar, `<fieldset>`/`<legend>` for grouped form fields, `<dl>` for event details, `<time>` for dates, and landmarks with labels.
- **Keyboard support:** visible focus rings site-wide, and a mobile menu that announces its state (`aria-expanded`), hides closed links from tab order, closes on Escape and returns focus to its button.
- **Screen readers:** calendar days announce the full date and event count, forms link errors to fields with `aria-describedby`, and live regions announce form results and calendar changes.
- **Reduced motion:** the animated header logo respects the operating system's "reduce motion" setting and stops after a few cycles otherwise.
- **Color:** brand colors are used as backgrounds behind dark text, never as low-contrast text, and filter states use a checkmark as well as color.
- **Readable type:** body text uses Atkinson Hyperlegible, a typeface designed by the Braille Institute for legibility.

## Testing

- TypeScript in strict mode and ESLint run clean across the codebase, and `npm run build` is run before every push.
- Manual test passes for each feature, including:
  - Row-level security, by querying as the anonymous role (`set role anon`) to confirm unapproved and private data stays hidden
  - Keyboard-only navigation and screen-reader labels
  - Phone, tablet and desktop layouts
  - The reduced-motion setting
  - Time zone conversion in both directions (submit, edit and display)
  - Email flows: confirm, unsubscribe, digest and admin alerts

## Run it locally

**1. Install**

```bash
git clone https://github.com/brenthippler-art/show-up-soky.git
cd show-up-soky
npm install
```

**2. Set up Supabase**

Create a Supabase project, then run the scripts in [`supabase/`](supabase/) in order in the SQL Editor. Create your user under Authentication → Users and run `seed-admin.sql` with your email.

**3. Add environment variables**

Copy `.env.example` to `.env.local` and fill in your values:

| Variable | What it's for |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable (public) key |
| `SUPABASE_SECRET_KEY` | Supabase secret key (server only) |
| `RESEND_API_KEY` | Resend API key |
| `EMAIL_FROM` | Sender, e.g. `"Show Up SOKY <hello@example.org>"` |
| `SITE_URL` | `http://localhost:3000` locally, your live URL in production |
| `CONTACT_EMAIL` | Where admin alerts and "update your group" emails go |
| `CRON_SECRET` | Random string that protects the digest route |

Also update the Supabase hostname under `images.remotePatterns` in `next.config.ts` to match your project.

**4. Run**

```bash
npm run dev
```

Open [localhost:3000](http://localhost:3000). Admin is at `/admin`.

## License

All rights reserved.