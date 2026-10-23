export type Selection =
  | { kind: 'week' }
  | { kind: 'day'; key: string; fallbackFrom?: string }

export function homeHref(params: { date?: string; view?: 'week'; month?: string }) {
  const search = new URLSearchParams()
  if (params.view) search.set('view', params.view)
  if (params.date) search.set('date', params.date)
  if (params.month) search.set('month', params.month)
  const query = search.toString()
  return query ? `/?${query}` : '/'
}