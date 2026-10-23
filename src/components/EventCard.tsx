import Image from 'next/image'
import Link from 'next/link'
import OrgAvatar from '@/components/OrgAvatar'
import { EVENT_TYPE_STYLES } from '@/lib/event-types'
import { formatDate } from '@/lib/format'
import type { Event } from '@/types/event'

export default function EventCard({ event }: { event: Event }) {
  const style = EVENT_TYPE_STYLES[event.event_type]

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-ink/5 transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className={`h-2 ${style.bar}`} />

      {event.image_url && (
        <Link
          href={`/events/${event.id}`}
          aria-hidden="true"
          tabIndex={-1}
          className="block bg-sunshine-light"
        >
          <Image
            src={event.image_url}
            alt=""
            width={800}
            height={1000}
            sizes="(max-width: 768px) 100vw, 768px"
            className="mx-auto h-auto max-h-96 w-auto object-contain transition hover:opacity-90"
          />
        </Link>
      )}

      <div className="p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-sm font-bold ${style.pill}`}>
            {style.label}
          </span>
          {event.is_free && (
            <span className="rounded-full bg-meadow-light px-3 py-1 text-sm font-bold">Free</span>
          )}
          {event.is_online && (
            <span className="rounded-full bg-sky-light px-3 py-1 text-sm font-bold">Online</span>
          )}
        </div>

        <h2 className="mt-3 text-2xl font-extrabold leading-tight">
          <Link
            href={`/events/${event.id}`}
            className="hover:underline hover:decoration-sunshine-dark hover:decoration-4 hover:underline-offset-4"
          >
            {event.title}
          </Link>
        </h2>

        <p className="mt-2 font-bold text-ink-soft">
          <time dateTime={event.starts_at}>{formatDate(event.starts_at)}</time>
        </p>

        {event.location_name && (
          <p className="mt-1 text-ink-soft">
            {event.location_name}
            {event.address && <span className="block text-sm">{event.address}</span>}
          </p>
        )}

        {event.description && <p className="mt-4 leading-relaxed">{event.description}</p>}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          {event.organizations ? (
            <p className="flex items-center gap-2 text-sm text-ink-soft">
              <OrgAvatar
                name={event.organizations.name}
                logoUrl={event.organizations.logo_url}
                size="sm"
              />
              <span>
                Hosted by{' '}
                <Link
                  href={`/orgs/${event.organizations.slug}`}
                  className="font-bold text-ink underline decoration-sunshine-dark decoration-2 underline-offset-4 hover:decoration-ink"
                >
                  {event.organizations.name}
                </Link>
              </span>
            </p>
          ) : (
            <span />
          )}

          {event.rsvp_url && (
            <a
              href={event.rsvp_url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-sunshine px-5 py-2 font-bold shadow-sm hover:bg-sunshine-dark"
            >
              RSVP<span className="sr-only"> for {event.title} (opens in a new tab)</span>
            </a>
          )}
        </div>
      </div>
    </article>
  )
}