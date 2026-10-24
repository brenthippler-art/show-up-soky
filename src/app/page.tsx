import type { Metadata } from "next";
import Link from "next/link";
import SignupForm from "@/components/SignupForm";
import { getUpcomingEvents } from "@/lib/events";
import { formatDate } from "@/lib/format";
import { EVENT_TYPE_STYLES } from "@/lib/event-types";
import ComingSoon from "@/components/ComingSoon";
import { DIGEST_LIVE } from "@/lib/features";

export const metadata: Metadata = {
  title: "Show Up SOKY | Community events across South Central Kentucky",
  description:
    "One place to find rallies, meetings, trainings and volunteer days moving rights and freedoms forward in South Central Kentucky.",
};

const primaryButton =
  "inline-block rounded-full bg-ink px-6 py-3 font-bold text-cream shadow-md hover:bg-ink-soft";
const secondaryButton =
  "inline-block rounded-full bg-white px-6 py-3 font-bold shadow-md ring-2 ring-ink hover:bg-sunshine-light";

const STEPS = [
  {
    emoji: "📅",
    title: "Find something to show up for",
    body: "Browse the calendar by day or week, or filter for volunteer days, town halls, free events and more.",
    href: "/events",
    cta: "See the calendar",
    bg: "bg-sky-light",
  },
  {
    emoji: "🤝",
    title: "Meet the groups doing the work",
    body: "Learn what each local group is about, when they meet and how to get involved.",
    href: "/orgs",
    cta: "Browse groups",
    bg: "bg-meadow-light",
  },
  {
    emoji: "✉️",
    title: "Get the weekly list",
    body: DIGEST_LIVE
      ? "One email every Monday morning with the week’s events. No spam, unsubscribe anytime."
      : "A Monday email with the week’s events is coming soon. Join the list now and we’ll let you know when it launches.",
    href: "#signup",
    cta: DIGEST_LIVE ? "Sign up below" : "Join the list",
    bg: "bg-tangerine-light",
    comingSoon: !DIGEST_LIVE,
  },
];

async function ComingUp() {
  let events;
  try {
    events = (await getUpcomingEvents()).slice(0, 3);
  } catch {
    return null;
  }
  if (events.length === 0) return null;

  return (
    <section
      aria-labelledby="coming-up-heading"
      className="mx-auto max-w-6xl px-4 py-16"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2
          id="coming-up-heading"
          className="text-3xl font-extrabold sm:text-4xl"
        >
          Coming up
        </h2>
        <Link
          href="/events"
          className="font-bold underline decoration-sunshine-dark decoration-2 underline-offset-4"
        >
          See all events →
        </Link>
      </div>

      <ul className="mt-6 grid gap-6 md:grid-cols-3">
        {events.map((event) => {
          const style = EVENT_TYPE_STYLES[event.event_type];
          return (
            <li key={event.id}>
              <Link
                href={`/events/${event.id}`}
                className="block h-full overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-ink/5 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className={`h-2 ${style.bar}`} />
                <div className="p-5">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${style.pill}`}
                  >
                    {style.label}
                  </span>
                  <p className="mt-3 text-xl font-extrabold leading-snug">
                    {event.title}
                  </p>
                  <p className="mt-2 text-sm font-bold text-ink-soft">
                    {formatDate(event.starts_at)}
                  </p>
                  {event.organizations && (
                    <p className="mt-1 text-sm text-ink-soft">
                      {event.organizations.name}
                    </p>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default function HomePage() {
  const contactEmail = process.env.CONTACT_EMAIL;

  return (
    <>
      {/* Welcome */}
      <section className="bg-linear-to-br from-sunshine-light via-cream to-meadow-light">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.05] sm:text-6xl">
            Show up for each other,{" "}
            <span className="bg-sunshine px-2">SOKY.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-xl text-ink-soft">
            Show Up SOKY brings together the rallies, meetings, trainings and
            volunteer days moving rights and freedoms forward for every person
            in South Central Kentucky, all in one place.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/events" className={primaryButton}>
              See upcoming events
            </Link>
            <Link href="/orgs" className={secondaryButton}>
              Browse local groups
            </Link>
          </div>
        </div>
      </section>

      {/* Why */}
      <section
        aria-labelledby="why-heading"
        className="mx-auto max-w-6xl px-4 py-16"
      >
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2
              id="why-heading"
              className="text-3xl font-extrabold sm:text-4xl"
            >
              Good things are happening. They’re just hard to find.
            </h2>
            <p className="mt-4 text-lg leading-relaxed">
              Every local group has its own website, its own mailing list and
              its own calendar. So great events slip by, and people who would
              have gladly shown up never hear about them.
            </p>
            <p className="mt-4 text-lg leading-relaxed">
              Show Up SOKY is one shared calendar for all of it, so finding a
              way to get involved takes a minute instead of an afternoon of
              searching.
            </p>
          </div>
          <div className="rounded-3xl bg-sunshine p-8 shadow-md">
            <p className="font-display text-2xl font-extrabold leading-snug">
              Many groups. One calendar. Every neighbor welcome.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section aria-labelledby="how-heading" className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 id="how-heading" className="text-3xl font-extrabold sm:text-4xl">
            How it works
          </h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                className={`flex flex-col rounded-2xl p-6 ${step.bg}`}
              >
                <p className="text-sm font-bold uppercase tracking-wide text-ink-soft">
                  Step {i + 1}
                </p>
                <p className="mt-2 text-3xl" aria-hidden="true">
                  {step.emoji}
                </p>
                <h3 className="mt-2 text-xl font-extrabold">
                  {step.title}
                  {step.comingSoon && (
                    <ComingSoon className="ml-2 ring-1 ring-ink/20" />
                  )}
                </h3>
                <p className="mt-2 flex-1 leading-relaxed">{step.body}</p>
                <Link
                  href={step.href}
                  className="mt-4 font-bold underline decoration-ink decoration-2 underline-offset-4"
                >
                  {step.cta} →
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Coming up */}
      <ComingUp />

      {/* For organizers */}
      <section aria-labelledby="organizers-heading" className="bg-meadow-light">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 lg:grid-cols-2 lg:items-center">
          <div>
            <h2
              id="organizers-heading"
              className="text-3xl font-extrabold sm:text-4xl"
            >
              Organizing something?
            </h2>
            <p className="mt-4 text-lg leading-relaxed">
              Listing your group and events is free. Every event gets its own
              page with directions, add-to-calendar buttons and a share preview
              for Facebook and group texts
              {DIGEST_LIVE
                ? ", and it goes out in the Monday email."
                : ". Soon, events will also go out in a Monday email."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link href="/submit" className={primaryButton}>
              Submit an event
            </Link>
            <Link href="/register" className={secondaryButton}>
              Register your group
            </Link>
          </div>
        </div>
      </section>

      {/* How we review */}
      <section
        aria-labelledby="review-heading"
        className="mx-auto max-w-3xl px-4 py-16"
      >
        <h2 id="review-heading" className="text-3xl font-extrabold">
          How listings are reviewed
        </h2>
        <p className="mt-4 text-lg leading-relaxed">
          Show Up SOKY is an independent community project based in Bowling
          Green. Events and groups are submitted by the community, and every
          listing is reviewed by a person before it appears on the site.
        </p>
        {contactEmail && (
          <p className="mt-4 text-lg leading-relaxed">
            Questions, corrections or ideas?{" "}
            <a
              href={`mailto:${contactEmail}`}
              className="font-bold underline decoration-sunshine-dark decoration-2 underline-offset-4"
            >
              Get in touch
            </a>
            .
          </p>
        )}
      </section>

      {/* Signup */}
      <section
        id="signup"
        aria-labelledby="home-signup-heading"
        className="scroll-mt-6 px-4 pb-8"
      >
        <div className="mx-auto max-w-3xl rounded-3xl bg-sunshine p-8 shadow-md sm:p-10">
          <h2 id="home-signup-heading" className="text-3xl font-extrabold">
            Never miss a chance to show up.
            {!DIGEST_LIVE && <ComingSoon className="ml-2" />}
          </h2>
          <p className="mt-2 text-lg">
            {DIGEST_LIVE
              ? "One email every Monday with the week’s events. Unsubscribe anytime."
              : "A Monday email with the week’s events is on the way. Join the list and we’ll let you know when it launches."}
          </p>
          <div className="mt-6">
            <SignupForm idPrefix="home" />
          </div>
        </div>
      </section>
    </>
  );
}
