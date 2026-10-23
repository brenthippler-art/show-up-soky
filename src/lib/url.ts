export function cleanUrl(value: string) {
  if (!value) return null
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : null
  } catch {
    return null
  }
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isUuid(value: string) {
  return UUID_PATTERN.test(value)
}

export function mapsUrl(place: string | null | undefined) {
  if (!place) return null
  const query = /kentucky|\bky\b/i.test(place) ? place : `${place}, Kentucky`
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}