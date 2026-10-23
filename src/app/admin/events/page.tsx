import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import AdminNav from '@/components/AdminNav'
import ConfirmButton from '@/components/ConfirmButton'
import { requireAdmin } from '@/lib/auth'
import { formatDate } from '@/lib/format'
import { deleteEvent } from './actions'

export const metadata: Metadata = {
  title: 'Events | Show Up SOKY Admin',
  robots: { index: false },
}

type AdminEvent = {
  id: string
  title: string
  starts_at: string
  status: 'pending' | 'approved' | 'rejected'
  organizations: { name: string } | null
  submitted_org_name: string | null
}

const statusStyles = {
  approved: 'bg-meadow-light',
  pending: 'bg-tangerine-light',
  rejected: 'bg-berry-light',
}

function EventRow({ event }: { event: AdminEvent }) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink/5">
      <div>
        <p className="text-lg font-bold">
          {event.title}{' '}
          <span className={`rounded-full px-2 py-0.5 text-xs font-bold capitalize ${statusStyles[event.status]}`}>
            {event.status}
          </span>
        </p>
        <p className="text-sm text-ink-soft">
          {formatDate(event.starts_at)} · {event.organizations?.name ?? event.submitted_org_name ?? 'No group'}
        </p>
      </div>
      <div className="flex gap-2">
        <Link
          href={`/admin/events/${event.id}`}
          className="rounded-full px-4 py-2 text-sm font-bold ring-2 ring-ink hover:bg-sunshine-light"
        >
          Edit<span className="sr-only"> {event.title}</span>
        </Link>
        <form action={deleteEvent}>
          <input type="hidden" name="id" value={event.id} />
          <ConfirmButton
            message={`Delete “${event.title}”? This can’t be undone.`}
            className="rounded-full px-4 py-2 text-sm font-bold ring-2 ring-berry hover:bg-berry-light"
          >
            Delete<span className="sr-only"> {event.title}</span>
          </ConfirmButton>
        </form>
      </div>
    </li>
  )
}

async function EventsList() {
  const { supabase } = await requireAdmin()

  const { data, error } = await supabase
    .from('events')
    .select('id, title, starts_at, status, submitted_org_name, organizations ( name )')
    .order('starts_at', { ascending: true })
    .limit(300)

  if (error) {
    return (
      <p role="alert" className="rounded-xl border-2 border-berry bg-berry-light p-4 font-bold">
        Couldn’t load events: {error.message}
      </p>
    )
  }

  const events = (data ?? []) as unknown as AdminEvent[]
  const now = new Date()
  const upcoming = events.filter((e) => new Date(e.starts_at) >= now)
  const past = events.filter((e) => new Date(e.starts_at) < now).reverse()

  return (
    <>
      <section aria-labelledby="upcoming-heading">
        <h2 id="upcoming-heading" className="text-2xl font-extrabold">Upcoming ({upcoming.length})</h2>
        <ul className="mt-4 space-y-3">
          {upcoming.map((event) => <EventRow key={event.id} event={event} />)}
        </ul>
      </section>

      <section aria-labelledby="past-heading" className="mt-12">
        <h2 id="past-heading" className="text-2xl font-extrabold">Past ({past.length})</h2>
        <ul className="mt-4 space-y-3">
          {past.map((event) => <EventRow key={event.id} event={event} />)}
        </ul>
      </section>
    </>
  )
}

export default function AdminEventsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <AdminNav />
      <h1 className="mb-8 text-3xl font-extrabold">All events</h1>
      <Suspense fallback={<p className="text-ink-soft">Loading events…</p>}>
        <EventsList />
      </Suspense>
    </main>
  )
}