import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import AdminNav from '@/components/AdminNav'
import ConfirmButton from '@/components/ConfirmButton'
import ImageUpload from '@/components/ImageUpload'
import { requireAdmin } from '@/lib/auth'
import { toChicagoInput } from '@/lib/format'
import { isUuid } from '@/lib/url'
import { updateEvent, deleteEvent } from '../actions'

export const metadata: Metadata = {
  title: 'Edit Event | Show Up SOKY Admin',
  robots: { index: false },
}

const inputClass =
  'mt-1 w-full rounded-xl border-2 border-ink-soft bg-white px-4 py-2 text-ink focus:border-sky'
const labelClass = 'block font-bold'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}

async function EditEvent({ params, searchParams }: Props) {
  const { supabase } = await requireAdmin()
  const { id } = await params
  const { error: errorMessage } = await searchParams
  if (!isUuid(id)) notFound()

  const [{ data: event }, { data: orgs }] = await Promise.all([
    supabase.from('events').select('*').eq('id', id).maybeSingle(),
    supabase.from('organizations').select('id, name').order('name'),
  ])

  if (!event) notFound()

  return (
    <>
      <Link href="/admin/events" className="font-bold text-ink-soft underline underline-offset-4">
        ← All events
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold">Edit event</h1>

      {errorMessage && (
        <p role="alert" className="mt-6 rounded-xl border-2 border-berry bg-berry-light p-4 font-bold">
          {errorMessage}
        </p>
      )}

      <form action={updateEvent} className="mt-8 grid gap-5 rounded-2xl bg-white p-6 shadow-md ring-1 ring-ink/5 sm:grid-cols-2 sm:p-8">
        <input type="hidden" name="id" value={event.id} />

        <div className="sm:col-span-2">
          <label htmlFor="title" className={labelClass}>Title *</label>
          <input id="title" name="title" required defaultValue={event.title} className={inputClass} />
        </div>

        <div>
          <label htmlFor="status" className={labelClass}>Status</label>
          <select id="status" name="status" defaultValue={event.status} className={inputClass}>
            <option value="approved">Approved (public)</option>
            <option value="pending">Pending (hidden)</option>
            <option value="rejected">Rejected (hidden)</option>
          </select>
        </div>

        <div>
          <label htmlFor="event_type" className={labelClass}>Type</label>
          <select id="event_type" name="event_type" defaultValue={event.event_type} className={inputClass}>
            <option value="rally">Rally / March</option>
            <option value="meeting">Meeting</option>
            <option value="volunteer">Volunteer</option>
            <option value="town_hall">Town Hall</option>
            <option value="training">Training / Workshop</option>
            <option value="social">Social</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="org_id" className={labelClass}>Group</label>
          <select id="org_id" name="org_id" defaultValue={event.org_id ?? ''} className={inputClass}>
            <option value="">None / not listed</option>
            {(orgs ?? []).map((org) => (
              <option key={org.id} value={org.id}>{org.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="submitted_org_name" className={labelClass}>Typed-in group name</label>
          <input
            id="submitted_org_name" name="submitted_org_name"
            defaultValue={event.submitted_org_name ?? ''}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="starts_at" className={labelClass}>Starts * (Central)</label>
          <input
            id="starts_at" name="starts_at" type="datetime-local" required
            defaultValue={toChicagoInput(event.starts_at)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="ends_at" className={labelClass}>Ends (Central)</label>
          <input
            id="ends_at" name="ends_at" type="datetime-local"
            defaultValue={toChicagoInput(event.ends_at)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="location_name" className={labelClass}>Location</label>
          <input id="location_name" name="location_name" defaultValue={event.location_name ?? ''} className={inputClass} />
        </div>

        <div>
          <label htmlFor="address" className={labelClass}>Address</label>
          <input id="address" name="address" defaultValue={event.address ?? ''} className={inputClass} />
        </div>

        <div className="flex items-center gap-2">
          <input id="is_online" name="is_online" type="checkbox" defaultChecked={event.is_online} className="h-4 w-4" />
          <label htmlFor="is_online">Online event</label>
        </div>

        <div className="flex items-center gap-2">
          <input id="is_free" name="is_free" type="checkbox" defaultChecked={event.is_free} className="h-4 w-4" />
          <label htmlFor="is_free">Free to attend</label>
        </div>

        <div>
          <label htmlFor="online_url" className={labelClass}>Online link</label>
          <input id="online_url" name="online_url" type="url" defaultValue={event.online_url ?? ''} className={inputClass} />
        </div>

        <div>
          <label htmlFor="rsvp_url" className={labelClass}>RSVP / info link</label>
          <input id="rsvp_url" name="rsvp_url" type="url" defaultValue={event.rsvp_url ?? ''} className={inputClass} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="description" className={labelClass}>Description</label>
          <textarea id="description" name="description" rows={5} defaultValue={event.description ?? ''} className={inputClass} />
        </div>

        <div className="sm:col-span-2">
          <ImageUpload
            id="image"
            name="image_url"
            label="Flyer or image"
            bucket="event-images"
            folder="submissions"
            defaultUrl={event.image_url}
          />
        </div>

        <p className="text-sm text-ink-soft sm:col-span-2">
          Submitted by {event.submitted_by_email ?? 'unknown'}
        </p>

        <div className="sm:col-span-2">
          <button className="rounded-full bg-sunshine px-6 py-3 font-bold shadow-sm hover:bg-sunshine-dark">
            Save changes
          </button>
        </div>
      </form>

      <section aria-labelledby="danger-heading" className="mt-10 rounded-2xl border-2 border-berry p-6">
        <h2 id="danger-heading" className="text-xl font-extrabold">Delete this event</h2>
        <p className="mt-1 text-ink-soft">It will be removed from the calendar permanently.</p>
        <form action={deleteEvent} className="mt-4">
          <input type="hidden" name="id" value={event.id} />
          <ConfirmButton
            message={`Delete “${event.title}”? This can’t be undone.`}
            className="rounded-full bg-white px-5 py-2 font-bold ring-2 ring-berry hover:bg-berry-light"
          >
            Delete event
          </ConfirmButton>
        </form>
      </section>
    </>
  )
}

export default function EditEventPage(props: Props) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <AdminNav />
      <Suspense fallback={<p className="text-ink-soft">Loading…</p>}>
        <EditEvent {...props} />
      </Suspense>
    </main>
  )
}