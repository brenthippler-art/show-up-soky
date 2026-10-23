import { googleCalendarUrl } from '@/lib/calendar'
import type { Event } from '@/types/event'

const buttonClass =
  'inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 font-bold shadow-sm ring-2 ring-ink hover:bg-sunshine-light'

export default function AddToCalendar({ event, pageUrl }: { event: Event; pageUrl: string }) {
  return (
    <div>
      <p className="text-sm font-bold uppercase tracking-wide text-ink-soft">Add to your calendar</p>
      <div className="mt-2 flex flex-wrap gap-3">
        <a
          href={googleCalendarUrl(event, pageUrl)}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass}
        >
          <span aria-hidden="true">📅</span> Google Calendar
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        <a href={`/events/${event.id}/ics`} download className={buttonClass}>
          <span aria-hidden="true">🗓️</span> Apple, Outlook &amp; more
        </a>
      </div>
    </div>
  )
}