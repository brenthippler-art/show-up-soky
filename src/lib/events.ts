import { cacheLife, cacheTag } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/public'
import type { Event } from '@/types/event'

export async function getUpcomingEvents(): Promise<Event[]> {
  'use cache'
  cacheLife('minutes')
  cacheTag('events')

  const supabase = createPublicClient()

  const { data, error } = await supabase
    .from('events')
    .select(`
      id, title, description, starts_at, ends_at,
      location_name, address, is_online, online_url,
      event_type, is_free, rsvp_url, image_url,
      organizations ( name, slug, logo_url )
    `)
    .gte('starts_at', new Date().toISOString())
    .order('starts_at', { ascending: true })

  if (error) throw error

  return (data ?? []) as unknown as Event[]
}