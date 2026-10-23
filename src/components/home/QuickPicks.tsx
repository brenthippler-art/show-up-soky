import Link from 'next/link'
import type { Event } from '@/types/event'
import { formatTime, shortDay } from '@/lib/dates'

export type QuickSection = {
  id: 'today' | 'tomorrow' | 'week'
  label: string
  href: string
  active: boolean
  events: Event[]
}

const MAX_PILLS = 4

export default function QuickPicks({ sections }: { sections: QuickSection[] }) {
  return (
    <nav aria-label="Quick dates">
      <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-4">
        {sections.map((section) => {
          const extra = section.events.length - MAX_PILLS

          return (
            <li
              key={section.id}
              className="lg:rounded-2xl lg:bg-white lg:p-5 lg:shadow-sm lg:ring-1 lg:ring-ink/5"
            >
              <Link
                href={section.href}
                aria-current={section.active ? 'true' : undefined}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-bold ring-2 ring-ink lg:rounded-none lg:p-0 lg:text-xl lg:font-extrabold lg:ring-0 ${
                  section.active
                    ? 'bg-ink text-cream lg:bg-transparent lg:text-ink lg:underline lg:decoration-sunshine-dark lg:decoration-4 lg:underline-offset-8'
                    : 'hover:bg-sunshine-light lg:hover:bg-transparent lg:hover:underline lg:hover:decoration-sunshine-dark lg:hover:decoration-4 lg:hover:underline-offset-8'
                }`}
              >
                {section.label}
                <span className="rounded-full bg-sunshine px-2 text-sm font-bold text-ink">
                  {section.events.length}
                  <span className="sr-only"> events</span>
                </span>
              </Link>

              {section.events.length > 0 ? (
                <ul className="mt-3 hidden flex-wrap gap-2 lg:flex">
                  {section.events.slice(0, MAX_PILLS).map((event) => (
                    <li key={event.id} className="max-w-full">
                      <Link
                        href={`/events/${event.id}`}
                        className="block max-w-full truncate rounded-full bg-sunshine-light px-3 py-1 text-sm font-bold hover:bg-sunshine"
                      >
                        {section.id === 'week' && `${shortDay(event.starts_at)} · `}
                        {formatTime(event.starts_at)} · {event.title}
                      </Link>
                    </li>
                  ))}
                  {extra > 0 && (
                    <li>
                      <Link
                        href={section.href}
                        className="block rounded-full px-3 py-1 text-sm font-bold underline underline-offset-4"
                      >
                        +{extra} more
                      </Link>
                    </li>
                  )}
                </ul>
              ) : (
                <p className="mt-2 hidden text-sm text-ink-soft lg:block">Nothing scheduled</p>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}