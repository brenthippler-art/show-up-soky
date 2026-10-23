import { connection } from 'next/server'
import { getEvent } from '@/lib/events'
import { buildIcs } from '@/lib/calendar'
import { slugify } from '@/lib/slug'
import { isUuid } from '@/lib/url'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connection()
  const { id } = await params

  if (!isUuid(id)) return new Response('Not found', { status: 404 })

  const event = await getEvent(id)
  if (!event) return new Response('Not found', { status: 404 })

  const pageUrl = `${process.env.SITE_URL}/events/${event.id}`
  const filename = `${slugify(event.title) || 'event'}.ics`

  return new Response(buildIcs(event, pageUrl), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}