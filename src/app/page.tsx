import { connection } from 'next/server'
import { Suspense } from 'react'
import SignupForm from '@/components/SignupForm'
import EventsPanel from '@/components/home/EventsPanel'
import MonthCalendar from '@/components/home/MonthCalendar'
import QuickPicks, { type QuickSection } from '@/components/home/QuickPicks'
import { homeHref, type Selection } from '@/components/home/links'
import { getUpcomingEvents } from '@/lib/events'
import { addDays, dayKey, isDayKey, isMonthKey, todayKey } from '@/lib/dates'
import type { Event } from '@/types/event'

type SearchParams = Promise<Record<string, string | string[] | undefined>>

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function groupByDay(events: Event[]) {
  const map = new Map<string, Event[]>()
  for (const event of events) {
    const key = dayKey(event.starts_at)
    const list = map.get(key) ?? []
    list.push(event)
    map.set(key, list)
  }
  return map
}

function SignupBox() {
  return (
    <section aria-labelledby="signup-heading" className="rounded-2xl bg-sunshine p-6 shadow-md">
      <h2 id="signup-heading" className="text-2xl font-extrabold">Never miss a chance to show up.</h2>
      <p className="mt-2">One email every Monday with the week’s events. Unsubscribe anytime.</p>
      <div className="mt-4">
        <SignupForm />
      </div>
    </section>
  )
}

async function HomeContent({ searchParams }: { searchParams: SearchParams }) {
  await connection()
  const params = await searchParams

  let events: Event[]
  try {
    events = await getUpcomingEvents()
  } catch (error) {
    console.error(error)
    return (
      <p className="rounded-2xl bg-berry-light p-6 font-bold">
        Couldn&apos;t load events right now. Please try again in a moment.
      </p>
    )
  }

  const today = todayKey()
  const tomorrow = addDays(today, 1)
  const weekKeys = Array.from({ length: 7 }, (_, i) => addDays(today, i))

  const byDay = groupByDay(events)
  const sortedDays = [...byDay.keys()].sort()
  const counts = Object.fromEntries([...byDay].map(([key, list]) => [key, list.length]))

  // Work out what the right-hand panel should show
  const dateParam = one(params.date)
  let selection: Selection

  if (one(params.view) === 'week') {
    selection = { kind: 'week' }
  } else if (isDayKey(dateParam)) {
    selection = { kind: 'day', key: dateParam }
  } else {
    const firstWithEvents = byDay.has(today) ? today : sortedDays.find((key) => key >= today)
    selection = firstWithEvents && firstWithEvents !== today
      ? { kind: 'day', key: firstWithEvents, fallbackFrom: today }
      : { kind: 'day', key: today }
  }

  const selectedKey = selection.kind === 'day' ? selection.key : null
  const explicitDate = selection.kind === 'day' && !selection.fallbackFrom ? selection.key : undefined

  const monthParam = one(params.month)
  const month = isMonthKey(monthParam) ? monthParam : (selectedKey ?? today).slice(0, 7)

  const keepParams = selection.kind === 'week' ? { view: 'week' as const } : { date: explicitDate }

  const sections: QuickSection[] = [
    {
      id: 'today',
      label: 'Today',
      href: homeHref({ date: today }),
      active: selectedKey === today,
      events: byDay.get(today) ?? [],
    },
    {
      id: 'tomorrow',
      label: 'Tomorrow',
      href: homeHref({ date: tomorrow }),
      active: selectedKey === tomorrow,
      events: byDay.get(tomorrow) ?? [],
    },
    {
      id: 'week',
      label: 'This Week',
      href: homeHref({ view: 'week' }),
      active: selection.kind === 'week',
      events: weekKeys.flatMap((key) => byDay.get(key) ?? []),
    },
  ]

  const calendar = (
    <MonthCalendar
      month={month}
      today={today}
      selectedKey={selectedKey}
      counts={counts}
      keepParams={keepParams}
    />
  )

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Sidebar: quick picks + calendar */}
      <aside aria-label="Choose dates" className="space-y-4 lg:col-start-1 lg:row-start-1">
        <QuickPicks sections={sections} />

        <details className="rounded-2xl bg-white shadow-sm ring-1 ring-ink/5 lg:hidden">
          <summary className="cursor-pointer px-5 py-3 font-bold">Pick a date</summary>
          <div className="px-2 pb-2">{calendar}</div>
        </details>

        <div className="hidden lg:block">{calendar}</div>
      </aside>

      {/* Main panel: the selected events */}
      <div id="events" className="scroll-mt-6 lg:col-span-2 lg:col-start-2 lg:row-span-2 lg:row-start-1">
        <EventsPanel
          selection={selection}
          today={today}
          byDay={byDay}
          sortedDays={sortedDays}
          weekKeys={weekKeys}
        />
      </div>

      {/* Signup: under the sidebar on desktop, after the events on phones */}
      <div className="lg:col-start-1 lg:row-start-2 lg:self-start">
        <SignupBox />
      </div>
    </div>
  )
}

export default function HomePage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <>
      <section className="bg-linear-to-br from-sunshine-light via-cream to-tangerine-light">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
            Show up for each other, <span className="bg-sunshine px-2">SOKY.</span>
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-ink-soft">
            Rallies, meetings, trainings and volunteer days moving rights and freedoms forward for
            every person in South Central Kentucky, all in one place.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <Suspense fallback={<p className="text-lg font-bold text-ink-soft">Loading events…</p>}>
          <HomeContent searchParams={searchParams} />
        </Suspense>
      </main>
    </>
  )
}