import Link from 'next/link'
import EventCard from '@/components/EventCard'
import type { Event } from '@/types/event'
import { addDays, labelForKey } from '@/lib/dates'
import type { HrefFn, Selection } from './links'

type Props = {
  selection: Selection
  today: string
  byDay: Map<string, Event[]>
  sortedDays: string[]
  weekKeys: string[]
  href: HrefFn
  filtered: boolean
  clearHref: string
}

function dayTitle(key: string, today: string) {
  if (key === today) return 'Today'
  if (key === addDays(today, 1)) return 'Tomorrow'
  return labelForKey(key, { weekday: 'long' })
}

function NextDayLink({ after, sortedDays, href }: { after: string; sortedDays: string[]; href: HrefFn }) {
  const next = sortedDays.find((key) => key > after)
  if (!next) return null
  return (
    <Link
      href={href({ date: next })}
      className="mt-4 inline-block rounded-full bg-white px-5 py-2 font-bold shadow-sm ring-2 ring-ink hover:bg-sunshine-light"
    >
      Next events: {labelForKey(next)} →
    </Link>
  )
}

function EmptyState({
  message,
  after,
  sortedDays,
  href,
  filtered,
  clearHref,
}: {
  message: string
  after: string
  sortedDays: string[]
  href: HrefFn
  filtered: boolean
  clearHref: string
}) {
  const hasNext = sortedDays.some((key) => key > after)

  return (
    <div className="rounded-2xl bg-sunshine-light p-8">
      <p className="text-xl font-bold">{filtered ? `${message} match your filters.` : `${message}.`}</p>
      <NextDayLink after={after} sortedDays={sortedDays} href={href} />
      {filtered && (
        <p className="mt-4">
          <Link href={clearHref} className="font-bold underline underline-offset-4">Clear filters</Link>{' '}
          to see everything.
        </p>
      )}
      {!hasNext && !filtered && (
        <p className="mt-2 text-ink-soft">
          Nothing else is on the calendar yet.{' '}
          <Link href="/submit" className="font-bold underline underline-offset-4">Add an event</Link>
        </p>
      )}
    </div>
  )
}

function CardList({ events }: { events: Event[] }) {
  return (
    <div className="space-y-6">
      {events.map((event) => <EventCard key={event.id} event={event} />)}
    </div>
  )
}

export default function EventsPanel({ selection, today, byDay, sortedDays, weekKeys, href, filtered, clearHref }: Props) {
  const emptyProps = { sortedDays, href, filtered, clearHref }

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

        <div className="mt-6">
          {daysWithEvents.length === 0 ? (
            <EmptyState message={filtered ? 'No events this week' : 'Nothing scheduled this week'} after={last} {...emptyProps} />
          ) : (
            <div className="space-y-10">
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
        </div>
      </section>
    )
  }

  const { key, fallbackFrom } = selection
  const events = byDay.get(key) ?? []
  const isPast = key < today
  const dayWord = key === today ? 'today' : 'that day'

  return (
    <section aria-labelledby="panel-heading">
      <div aria-live="polite">
        {fallbackFrom && (
          <p className="mb-4 inline-block rounded-full bg-tangerine-light px-4 py-1 text-sm font-bold">
            {filtered ? 'Nothing matching today, so here’s what’s next' : 'Nothing scheduled today, so here’s what’s next'}
          </p>
        )}
        <h2 id="panel-heading" className="text-4xl font-extrabold">{dayTitle(key, today)}</h2>
        <p className="mt-1 text-lg text-ink-soft">{labelForKey(key)}</p>
      </div>

      <div className="mt-6">
        {isPast ? (
          <div className="rounded-2xl bg-sunshine-light p-8">
            <p className="text-xl font-bold">That date has already passed.</p>
            <Link href={href({ date: today })} className="mt-4 inline-block font-bold underline underline-offset-4">
              See today’s events
            </Link>
          </div>
        ) : events.length === 0 ? (
          <EmptyState
            message={filtered ? `No events ${dayWord}` : `Nothing scheduled ${dayWord}`}
            after={key}
            {...emptyProps}
          />
        ) : (
          <CardList events={events} />
        )}
      </div>
    </section>
  )
}