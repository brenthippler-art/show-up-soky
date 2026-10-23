import { formatInTimeZone, fromZonedTime } from 'date-fns-tz'

export const TZ = 'America/Chicago'

// ---------- Day keys ("2026-10-31") ----------

export function dayKey(date: Date | string) {
  return formatInTimeZone(date, TZ, 'yyyy-MM-dd')
}

export function todayKey() {
  return dayKey(new Date())
}

export function addDays(key: string, days: number) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10)
}

export function isDayKey(value: string | undefined): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const parsed = new Date(`${value}T00:00:00Z`)
  return !isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
}

export function startOfDayUtc(key: string) {
  return fromZonedTime(`${key}T00:00:00`, TZ)
}

export function labelForKey(
  key: string,
  options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' }
) {
  return new Intl.DateTimeFormat('en-US', { ...options, timeZone: 'UTC' }).format(
    new Date(`${key}T12:00:00Z`)
  )
}

// ---------- Times ----------

export function formatTime(iso: string) {
  return formatInTimeZone(iso, TZ, 'h:mm a')
}

export function shortDay(iso: string) {
  return formatInTimeZone(iso, TZ, 'EEE')
}

// ---------- Months ("2026-11") ----------

export function isMonthKey(value: string | undefined): value is string {
  return !!value && /^\d{4}-(0[1-9]|1[0-2])$/.test(value)
}

export function addMonths(month: string, count: number) {
  const [y, m] = month.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1 + count, 1)).toISOString().slice(0, 7)
}

export function monthLabel(month: string) {
  const [y, m] = month.split('-').map(Number)
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(y, m - 1, 1))
  )
}

export function monthGrid(month: string): (string | null)[][] {
  const [y, m] = month.split('-').map(Number)
  const firstWeekday = new Date(Date.UTC(y, m - 1, 1)).getUTCDay()
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate()

  const cells: (string | null)[] = Array(firstWeekday).fill(null)
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(`${month}-${String(d).padStart(2, '0')}`)
  }
  while (cells.length % 7 !== 0) cells.push(null)

  const weeks: (string | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}