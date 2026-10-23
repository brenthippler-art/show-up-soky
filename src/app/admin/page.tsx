import type { Metadata } from 'next'
import { requireAdmin } from '@/lib/auth'
import { formatDate } from '@/lib/format'
import { approveEvent, rejectEvent, signOut } from './actions'

export const metadata: Metadata = {
  title: 'Review Queue | Show Up SOKY',
  robots: { index: false },
}

type PendingEvent = {
  id: string
  title: string
  description: string | null
  starts_at: string
  location_name: string | null
  address: string | null
  is_online: boolean
  online_url: string | null
  event_type: string
  rsvp_url: string | null
  submitted_org_name: string | null
  submitted_by_email: string | null
  created_at: string
  organizations: { name: string } | null
}

export default async function AdminPage() {
  const { supabase, user } = await requireAdmin()

  const { data, error } = await supabase
    .from('events')
    .select(`
      id, title, description, starts_at, location_name, address,
      is_online, online_url, event_type, rsvp_url,
      submitted_org_name, submitted_by_email, created_at,
      organizations ( name )
    `)
    .eq('status', 'pending')
    .order('starts_at', { ascending: true })

  const pending = (data ?? []) as unknown as PendingEvent[]

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Review queue</h1>
          <p className="mt-1 text-ink-soft">Signed in as {user.email}</p>
        </div>
        <form action={signOut}>
          <button className="rounded-full px-4 py-2 font-bold ring-2 ring-ink hover:bg-sunshine-light">
            Sign out
          </button>
        </form>
      </div>

      {error && (
        <p role="alert" className="mt-6 rounded-xl border-2 border-berry bg-berry-light p-4 font-bold">
          Couldn’t load submissions: {error.message}
        </p>
      )}

      <div className="mt-8 space-y-6">
        {pending.length === 0 ? (
          <div className="rounded-2xl bg-meadow-light p-8 text-center">
            <p className="text-xl font-bold">All caught up! 🎉</p>
            <p className="mt-1 text-ink-soft">No submissions waiting for review.</p>
          </div>
        ) : (
          pending.map((event) => (
            <article key={event.id} className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-ink/5">
              <p className="text-sm font-bold uppercase tracking-wide text-ink-soft">
                {event.event_type.replace('_', ' ')}
              </p>
              <h2 className="mt-1 text-2xl font-extrabold">{event.title}</h2>
              <p className="mt-2 font-bold text-ink-soft">{formatDate(event.starts_at)}</p>

              <dl className="mt-4 grid gap-x-4 gap-y-2 text-sm sm:grid-cols-[auto_1fr]">
                <dt className="font-bold">Group</dt>
                <dd>
                  {event.organizations?.name ?? (
                    <>
                      {event.submitted_org_name}{' '}
                      <span className="rounded-full bg-tangerine-light px-2 py-0.5 text-xs font-bold">
                        Not registered
                      </span>
                    </>
                  )}
                </dd>

                <dt className="font-bold">Where</dt>
                <dd>
                  {event.is_online
                    ? `Online${event.online_url ? ` (${event.online_url})` : ''}`
                    : [event.location_name, event.address].filter(Boolean).join(', ')}
                </dd>

                {event.rsvp_url && (
                  <>
                    <dt className="font-bold">Link</dt>
                    <dd className="break-all">{event.rsvp_url}</dd>
                  </>
                )}

                <dt className="font-bold">Submitted by</dt>
                <dd>{event.submitted_by_email}</dd>
              </dl>

              {event.description && <p className="mt-4 leading-relaxed">{event.description}</p>}

              <div className="mt-6 flex flex-wrap gap-3">
                <form action={approveEvent}>
                  <input type="hidden" name="id" value={event.id} />
                  <button className="rounded-full bg-meadow px-6 py-2 font-bold text-ink shadow-sm hover:brightness-95">
                    Approve<span className="sr-only"> {event.title}</span>
                  </button>
                </form>
                <form action={rejectEvent}>
                  <input type="hidden" name="id" value={event.id} />
                  <button className="rounded-full bg-white px-6 py-2 font-bold ring-2 ring-berry hover:bg-berry-light">
                    Reject<span className="sr-only"> {event.title}</span>
                  </button>
                </form>
              </div>
            </article>
          ))
        )}
      </div>
    </main>
  )
}