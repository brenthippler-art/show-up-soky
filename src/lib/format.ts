import { formatInTimeZone } from 'date-fns-tz'

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/Chicago',
  }).format(new Date(iso))
}

export function toChicagoInput(iso: string | null) {
  if (!iso) return ''
  return formatInTimeZone(iso, 'America/Chicago', "yyyy-MM-dd'T'HH:mm")
}