import { cacheLife, cacheTag } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/public'
import type { Event } from '@/types/event'
import { startOfDayUtc, todayKey } from '@/lib/dates'

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
    .gte('starts_at', startOfDayUtc(todayKey()).toISOString())
    .order('starts_at', { ascending: true })

  if (error) throw error

  return (data ?? []) as unknown as Event[]
}

export type EventDetail = Event & {
  organizations: {
    name: string
    slug: string
    logo_url: string | null
    description: string | null
  } | null
}

export async function getEvent(id: string): Promise<EventDetail | null> {
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
      organizations ( name, slug, logo_url, description )
    `)
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  return (data as unknown as EventDetail) ?? null
}