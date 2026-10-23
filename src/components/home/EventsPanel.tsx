import Link from 'next/link'
import EventCard from '@/components/EventCard'
import type { Event } from '@/types/event'
import { addDays, labelForKey } from '@/lib/dates'
import { homeHref, type Selection } from './links'

type Props = {
  selection: Selection
  today: string
  byDay: Map<string, Event[]>
  sortedDays: string[]
  weekKeys: string[]
}

function dayTitle(key: string, today: string) {
  if (key === today) return 'Today'
  if (key === addDays(today, 1)) return 'Tomorrow'
  return labelForKey(key, { weekday: 'long' })
}

function NextDayLink({ after, sortedDays }: { after: string; sortedDays: string[] }) {
  const next = sortedDays.find((key) => key > after)
  if (!next) {
    return (
      <p className="mt-2 text-ink-soft">
        Nothing else is on the calendar yet.{' '}
        <Link href="/submit" className="font-bold underline underline-offset-4">Add an event</Link>
      </p>
    )
  }
  return (
    <Link
      href={homeHref({ date: next })}
      className="mt-4 inline-block rounded-full bg-white px-5 py-2 font-bold shadow-sm ring-2 ring-ink hover:bg-sunshine-light"
    >
      Next events: {labelForKey(next)} →
    </Link>
  )
}

function CardList({ events }: { events: Event[] }) {
  return (
    <div className="space-y-6">
      {events.map((event) => <EventCard key={event.id} event={event} />)}
    </div>
  )
}

export default function EventsPanel({ selection, today, byDay, sortedDays, weekKeys }: Props) {
  if (selection.kind === 'week') {
    const first = weekKeys[0]
    const last = weekKeys[weekKeys.length - 1]
    const daysWithEvents = weekKeys.filter((key) => byDay.has(key))
    const short: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' }

    return (
      <section aria-labelledby="panel-heading">
        <div aria-live="polite">
          <h2 id="panel-heading" className="text-4xl font-extrabold">This week</h2>
          <p className="mt-1 text-lg text-ink-soft">
            {labelForKey(first, short)} – {labelForKey(last, short)}
          </p>
        </div>

        {daysWithEvents.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-sunshine-light p-8">
            <p className="text-xl font-bold">Nothing scheduled this week.</p>
            <NextDayLink after={last} sortedDays={sortedDays} />
          </div>
        ) : (
          <div className="mt-6 space-y-10">
            {daysWithEvents.map((key) => (
              <section key={key} aria-labelledby={`day-${key}`}>
                <h3
                  id={`day-${key}`}
                  className="sticky top-0 z-10 mb-4 bg-cream/95 py-2 text-2xl font-extrabold backdrop-blur"
                >
                  {dayTitle(key, today)}
                  <span className="ml-2 text-lg font-bold text-ink-soft">
                    {labelForKey(key, { month: 'long', day: 'numeric' })}
                  </span>
                </h3>
                <CardList events={byDay.get(key) ?? []} />
              </section>
            ))}
          </div>
        )}
      </section>
    )
  }

  const { key, fallbackFrom } = selection
  const events = byDay.get(key) ?? []
  const isPast = key < today

  return (
    <section aria-labelledby="panel-heading">
      <div aria-live="polite">
        {fallbackFrom && (
          <p className="mb-4 inline-block rounded-full bg-tangerine-light px-4 py-1 text-sm font-bold">
            Nothing scheduled today, so here’s what’s next
          </p>
        )}
        <h2 id="panel-heading" className="text-4xl font-extrabold">{dayTitle(key, today)}</h2>
        <p className="mt-1 text-lg text-ink-soft">{labelForKey(key)}</p>
      </div>

      <div className="mt-6">
        {isPast ? (
          <div className="rounded-2xl bg-sunshine-light p-8">
            <p className="text-xl font-bold">That date has already passed.</p>
            <Link
              href={homeHref({ date: today })}
              className="mt-4 inline-block font-bold underline underline-offset-4"
            >
              See today’s events
            </Link>
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-2xl bg-sunshine-light p-8">
            <p className="text-xl font-bold">Nothing scheduled {key === today ? 'today' : 'that day'}.</p>
            <NextDayLink after={key} sortedDays={sortedDays} />
          </div>
        ) : (
          <CardList events={events} />
        )}
      </div>
    </section>
  )
}