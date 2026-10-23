import type { Event } from '@/types/event'

type CalendarEvent = Pick<
  Event,
  'id' | 'title' | 'description' | 'starts_at' | 'ends_at' |
  'location_name' | 'address' | 'is_online' | 'online_url'
>

const ONE_HOUR = 60 * 60 * 1000

function endDate(event: CalendarEvent) {
  return event.ends_at
    ? new Date(event.ends_at)
    : new Date(new Date(event.starts_at).getTime() + ONE_HOUR)
}

// 2026-10-31T23:00:00.000Z → 20261031T230000Z
export function calendarStamp(date: Date) {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

function locationText(event: CalendarEvent) {
  if (event.is_online) return event.online_url ?? 'Online'
  return [event.location_name, event.address].filter(Boolean).join(', ')
}

function detailsText(event: CalendarEvent, pageUrl: string) {
  return [event.description, `More info: ${pageUrl}`].filter(Boolean).join('\n\n')
}

// ---------- Google Calendar ----------

export function googleCalendarUrl(event: CalendarEvent, pageUrl: string) {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${calendarStamp(new Date(event.starts_at))}/${calendarStamp(endDate(event))}`,
    details: detailsText(event, pageUrl),
    location: locationText(event),
  })
  return `https://calendar.google.com/calendar/render?${params}`
}

// ---------- .ics file ----------

function escapeIcs(text: string) {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')
}

function fold(line: string) {
  if (line.length <= 75) return line
  const parts = [line.slice(0, 75)]
  for (let i = 75; i < line.length; i += 74) {
    parts.push(' ' + line.slice(i, i + 74))
  }
  return parts.join('\r\n')
}

export function buildIcs(event: CalendarEvent, pageUrl: string, now = new Date()) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Show Up SOKY//Events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.id}@showupsoky`,
    `DTSTAMP:${calendarStamp(now)}`,
    `DTSTART:${calendarStamp(new Date(event.starts_at))}`,
    `DTEND:${calendarStamp(endDate(event))}`,
    `SUMMARY:${escapeIcs(event.title)}`,
    `DESCRIPTION:${escapeIcs(detailsText(event, pageUrl))}`,
    `LOCATION:${escapeIcs(locationText(event))}`,
    `URL:${pageUrl}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  return lines.map(fold).join('\r\n') + '\r\n'
}