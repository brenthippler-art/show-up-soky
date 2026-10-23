import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import AddToCalendar from '@/components/AddToCalendar'
import OrgAvatar from '@/components/OrgAvatar'
import ShareButtons from '@/components/ShareButtons'
import { getEvent } from '@/lib/events'
import { EVENT_TYPE_STYLES } from '@/lib/event-types'
import { formatEventTime } from '@/lib/format'
import { isUuid } from '@/lib/url'
import { connection } from 'next/server'

type Params = Promise<{ id: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params
  if (!isUuid(id)) return { title: 'Event not found | Show Up SOKY' }

  const event = await getEvent(id)
  if (!event) return { title: 'Event not found | Show Up SOKY' }

  const when = formatEventTime(event.starts_at, event.ends_at)
  const description = `${when}${event.location_name ? ` · ${event.location_name}` : ''}`

  return {
    title: `${event.title} | Show Up SOKY`,
    description,
    openGraph: {
      title: event.title,
      description,
      url: `/events/${event.id}`,
      type: 'website',
      images: event.image_url ? [{ url: event.image_url, alt: `Flyer for ${event.title}` }] : undefined,
    },
    twitter: {
      card: event.image_url ? 'summary_large_image' : 'summary',
    },
  }
}

function directionsUrl(location: string | null, address: string | null) {
  const query = address ?? (location ? `${location}, Kentucky` : null)
  if (!query) return null
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

async function EventContent({ params }: { params: Params }) {
  await connection()
  const { id } = await params
  if (!isUuid(id)) notFound()

  const event = await getEvent(id)
  if (!event) notFound()

  const type = EVENT_TYPE_STYLES[event.event_type]
  const isPast = new Date(event.ends_at ?? event.starts_at) < new Date()
  const directions = event.is_online ? null : directionsUrl(event.location_name, event.address)
  const shareUrl = `${process.env.SITE_URL}/events/${event.id}`

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Link href="/events" className="font-bold text-ink-soft underline underline-offset-4">
        ← All events
      </Link>

      {isPast && (
        <p className="mt-6 rounded-xl bg-tangerine-light p-4 font-bold">
          This event has already happened.{' '}
          <Link href="/events" className="underline underline-offset-4">See what’s coming up</Link>
        </p>
      )}

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_320px]">
        <article>
          <div className="flex flex-wrap gap-2">
            <span className={`rounded-full px-3 py-1 text-sm font-bold ${type.pill}`}>{type.label}</span>
            {event.is_free && (
              <span className="rounded-full bg-meadow-light px-3 py-1 text-sm font-bold">Free</span>
            )}
            {event.is_online && (
              <span className="rounded-full bg-sky-light px-3 py-1 text-sm font-bold">Online</span>
            )}
          </div>

          <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">{event.title}</h1>

          <dl className="mt-6 space-y-4 text-lg">
            <div>
              <dt className="text-sm font-bold uppercase tracking-wide text-ink-soft">When</dt>
              <dd className="font-bold">
                <time dateTime={event.starts_at}>{formatEventTime(event.starts_at, event.ends_at)}</time>
              </dd>
            </div>

            <div>
              <dt className="text-sm font-bold uppercase tracking-wide text-ink-soft">Where</dt>
              <dd>
                {event.is_online ? (
                  event.online_url ? (
                    <a
                      href={event.online_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold underline decoration-sunshine-dark decoration-2 underline-offset-4"
                    >
                      Join online<span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : (
                    'Online'
                  )
                ) : (
                  <>
                    <span className="font-bold">{event.location_name}</span>
                    {event.address && <span className="block text-ink-soft">{event.address}</span>}
                    {directions && (
                      <a
                        href={directions}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-block text-base font-bold underline decoration-sunshine-dark decoration-2 underline-offset-4"
                      >
                        Get directions<span className="sr-only"> (opens Google Maps in a new tab)</span>
                      </a>
                    )}
                  </>
                )}
              </dd>
            </div>
          </dl>

          {!isPast && (
            <div className="mt-8">
              <AddToCalendar event={event} pageUrl={shareUrl} />
            </div>
          )}

          {event.rsvp_url && !isPast && (
            <a
              href={event.rsvp_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block rounded-full bg-sunshine px-8 py-3 text-lg font-bold shadow-md hover:bg-sunshine-dark"
            >
              RSVP<span className="sr-only"> for {event.title} (opens in a new tab)</span>
            </a>
          )}

          {event.description && (
            <div className="mt-8">
              <h2 className="text-2xl font-extrabold">About this event</h2>
              <p className="mt-3 whitespace-pre-line text-lg leading-relaxed">{event.description}</p>
            </div>
          )}

          <div className="mt-10">
            <h2 className="text-xl font-extrabold">Spread the word</h2>
            <div className="mt-3">
              <ShareButtons url={shareUrl} title={event.title} />
            </div>
          </div>
        </article>

        <aside className="space-y-6">
          {event.image_url && (
            <a
              href={event.image_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block overflow-hidden rounded-2xl bg-sunshine-light shadow-md ring-1 ring-ink/5"
            >
              <Image
                src={event.image_url}
                alt={`Flyer for ${event.title}`}
                width={640}
                height={800}
                sizes="(max-width: 1024px) 100vw, 320px"
                className="h-auto w-full object-contain"
                priority
              />
              <span className="sr-only"> (opens full size in a new tab)</span>
            </a>
          )}

          {event.organizations && (
            <div className="rounded-2xl bg-white p-5 shadow-md ring-1 ring-ink/5">
              <p className="text-sm font-bold uppercase tracking-wide text-ink-soft">Hosted by</p>
              <div className="mt-3 flex items-center gap-3">
                <OrgAvatar name={event.organizations.name} logoUrl={event.organizations.logo_url} size="md" />
                <p className="text-lg font-extrabold">{event.organizations.name}</p>
              </div>
              {event.organizations.description && (
                <p className="mt-3 line-clamp-4 text-ink-soft">{event.organizations.description}</p>
              )}
              <Link
                href={`/orgs/${event.organizations.slug}`}
                className="mt-4 inline-block font-bold underline decoration-sunshine-dark decoration-2 underline-offset-4"
              >
                More from {event.organizations.name} →
              </Link>
            </div>
          )}
        </aside>
      </div>
    </main>
  )
}

export default function EventPage({ params }: { params: Params }) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-4xl px-4 py-16">
          <p className="text-ink-soft">Loading event…</p>
        </main>
      }
    >
      <EventContent params={params} />
    </Suspense>
  )
}