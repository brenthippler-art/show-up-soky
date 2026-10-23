import Link from 'next/link'
import { addMonths, labelForKey, monthGrid, monthLabel } from '@/lib/dates'
import type { HrefFn } from './links'

const WEEKDAYS = [
  { short: 'S', full: 'Sunday' },
  { short: 'M', full: 'Monday' },
  { short: 'T', full: 'Tuesday' },
  { short: 'W', full: 'Wednesday' },
  { short: 'T', full: 'Thursday' },
  { short: 'F', full: 'Friday' },
  { short: 'S', full: 'Saturday' },
]

type Props = {
  month: string
  today: string
  selectedKey: string | null
  counts: Record<string, number>
  keepParams: { date?: string; view?: 'week' }
  href: HrefFn
}

export default function MonthCalendar({ month, today, selectedKey, counts, keepParams, href }: Props) {
  const weeks = monthGrid(month)
  const prev = addMonths(month, -1)
  const next = addMonths(month, 1)
  const canGoBack = prev >= today.slice(0, 7)

  const navClass = 'flex h-9 w-9 items-center justify-center rounded-full text-lg font-bold hover:bg-sunshine-light'

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-ink/5">
      <div className="flex items-center justify-between">
        {canGoBack ? (
          <Link href={href({ ...keepParams, month: prev })} className={navClass} scroll={false}>
            <span aria-hidden="true">←</span>
            <span className="sr-only">Previous month, {monthLabel(prev)}</span>
          </Link>
        ) : (
          <span className="h-9 w-9" aria-hidden="true" />
        )}

        <p className="font-display text-lg font-extrabold">{monthLabel(month)}</p>

        <Link href={href({ ...keepParams, month: next })} className={navClass} scroll={false}>
          <span aria-hidden="true">→</span>
          <span className="sr-only">Next month, {monthLabel(next)}</span>
        </Link>
      </div>

      <table className="mt-3 w-full table-fixed border-collapse text-center" aria-label={`${monthLabel(month)} calendar`}>
        <thead>
          <tr>
            {WEEKDAYS.map((day) => (
              <th key={day.full} scope="col" className="pb-2 text-xs font-bold text-ink-soft">
                <abbr title={day.full} className="no-underline">{day.short}</abbr>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, i) => (
            <tr key={i}>
              {week.map((key, j) => (
                <td key={j} className="p-0.5">
                  {key && (
                    <DayCell
                      dayKey={key}
                      today={today}
                      selected={key === selectedKey}
                      count={counts[key] ?? 0}
                      href={href}
                    />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function DayCell({
  dayKey,
  today,
  selected,
  count,
  href,
}: {
  dayKey: string
  today: string
  selected: boolean
  count: number
  href: HrefFn
}) {
  const dayNumber = Number(dayKey.slice(8))

  if (dayKey < today) {
    return <span className="block rounded-lg py-1.5 text-sm text-ink-soft/40">{dayNumber}</span>
  }

  const isToday = dayKey === today
  const label = `${labelForKey(dayKey)}${isToday ? ', today' : ''}, ${
    count === 0 ? 'no events' : `${count} event${count === 1 ? '' : 's'}`
  }`

  return (
    <Link
      href={href({ date: dayKey })}
      aria-label={label}
      aria-current={selected ? 'date' : undefined}
      className={`relative block rounded-lg py-1.5 text-sm font-bold ${
        selected
          ? 'bg-ink text-cream'
          : isToday
            ? 'ring-2 ring-sunshine-dark hover:bg-sunshine-light'
            : 'hover:bg-sunshine-light'
      }`}
    >
      {dayNumber}
      {count > 0 && (
        <span
          aria-hidden="true"
          className={`absolute bottom-0.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full ${
            selected ? 'bg-sunshine' : 'bg-tangerine'
          }`}
        />
      )}
    </Link>
  )
}