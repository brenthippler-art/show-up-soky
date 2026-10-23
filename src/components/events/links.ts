import type { EventType } from '@/types/event'

export type Selection =
  | { kind: 'week' }
  | { kind: 'day'; key: string; fallbackFrom?: string }

export type Filters = { type?: EventType; free?: boolean; online?: boolean }

export type HrefParams = { date?: string; view?: 'week'; month?: string }
export type HrefFn = (params: HrefParams) => string

export function eventsHref(params: HrefParams & Filters) {
  const search = new URLSearchParams()
  if (params.view) search.set('view', params.view)
  if (params.date) search.set('date', params.date)
  if (params.month) search.set('month', params.month)
  if (params.type) search.set('type', params.type)
  if (params.free) search.set('free', '1')
  if (params.online) search.set('online', '1')
  const query = search.toString()
  return query ? `/events?${query}` : '/events'
}

export function hasFilters(filters: Filters) {
  return Boolean(filters.type || filters.free || filters.online)
}