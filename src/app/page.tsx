import Link from "next/link";
import EventCard from "@/components/EventCard";
import { getUpcomingEvents } from "@/lib/events";
import SignupForm from "@/components/SignupForm";

export default async function HomePage() {
  let events;
  try {
    events = await getUpcomingEvents();
  } catch (error) {
    console.error(error);
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <p className="rounded-2xl bg-berry-light p-6 font-bold">
          Couldn&apos;t load events right now. Please try again in a moment.
        </p>
      </main>
    );
  }

  return (
    <>
      <section className="bg-linear-to-br from-sunshine-light via-cream to-tangerine-light">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
          <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.05] sm:text-6xl">
            Show up for each other,{" "}
            <span className="bg-sunshine px-2">SOKY.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-xl text-ink-soft">
            One calendar for the rallies, meetings, trainings and volunteer days
            moving rights and freedoms forward for every person in South Central
            Kentucky.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#events"
              className="rounded-full bg-ink px-6 py-3 font-bold text-cream shadow-md hover:bg-ink-soft"
            >
              See upcoming events
            </a>
            <Link
              href="/submit"
              className="rounded-full bg-white px-6 py-3 font-bold shadow-md ring-2 ring-ink hover:bg-sunshine-light"
            >
              Add your group&apos;s event
            </Link>
          </div>
        </div>
      </section>

      <main id="events" className="mx-auto max-w-3xl scroll-mt-6 px-4 py-12">
        <h2 className="text-3xl font-extrabold">Upcoming events</h2>

        <div className="mt-6 space-y-6">
          {events.length === 0 ? (
            <div className="rounded-2xl bg-sunshine-light p-8 text-center">
              <p className="text-xl font-bold">No upcoming events yet.</p>
              <p className="mt-2 text-ink-soft">
                Hosting something?{" "}
                <Link
                  href="/submit"
                  className="font-bold underline underline-offset-4"
                >
                  Share it with the community
                </Link>
                .
              </p>
            </div>
          ) : (
            events.map((event) => <EventCard key={event.id} event={event} />)
          )}
        </div>
        <section
          aria-labelledby="signup-heading"
          className="mt-16 rounded-3xl bg-sunshine p-8 shadow-md sm:p-10"
        >
          <h2 id="signup-heading" className="text-3xl font-extrabold">
            Never miss a chance to show up.
          </h2>
          <p className="mt-2 max-w-xl text-lg">
            One email every Monday with the week’s events. No spam, unsubscribe
            anytime.
          </p>
          <div className="mt-6">
            <SignupForm />
          </div>
        </section>
      </main>
    </>
  );
}
