import { cacheLife, cacheTag } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/public'
import type { Event } from '@/types/event'

// ---------- For the submit form dropdown ----------

export type OrgOption = { id: string; name: string }

export async function getApprovedOrgs(): Promise<OrgOption[]> {
  'use cache'
  cacheLife('hours')
  cacheTag('orgs')

  const supabase = createPublicClient()

  const { data, error } = await supabase
    .from('organizations')
    .select('id, name')
    .order('name', { ascending: true })

  if (error) throw error
  return data ?? []
}

// ---------- For the public Groups pages ----------

export type OrgProfile = {
  id: string
  name: string
  slug: string
  description: string | null
  website_url: string | null
  logo_url: string | null
  tagline: string | null
  focus_areas: string[]
  focus_area_other: string | null
  meeting_schedule: string | null
  meeting_location: string | null
  get_involved: string | null
  public_email: string | null
  phone: string | null
  facebook_url: string | null
  instagram_url: string | null
}

const ORG_PROFILE_COLUMNS = `
  id, name, slug, description, website_url, logo_url, tagline, focus_areas, focus_area_other,
  meeting_schedule, meeting_location, get_involved, public_email, phone,
  facebook_url, instagram_url
`

export async function getOrgDirectory(): Promise<OrgProfile[]> {
  'use cache'
  cacheLife('hours')
  cacheTag('orgs')

  const supabase = createPublicClient()

  const { data, error } = await supabase
    .from('organizations')
        .select(ORG_PROFILE_COLUMNS)
    .order('name', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function getOrgPage(slug: string) {
  'use cache'
  cacheLife('minutes')
  cacheTag('orgs', 'events')

  const supabase = createPublicClient()

  const { data: org, error } = await supabase
    .from('organizations')
        .select(ORG_PROFILE_COLUMNS)
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw error
  if (!org) return null

  const { data: events, error: eventsError } = await supabase
    .from('events')
    .select(`
      id, title, description, starts_at, ends_at,
      location_name, address, is_online, online_url,
      event_type, is_free, rsvp_url, image_url,
      organizations ( name, slug, logo_url )
    `)
    .eq('org_id', org.id)
    .gte('starts_at', new Date().toISOString())
    .order('starts_at', { ascending: true })

  if (eventsError) throw eventsError

  return { org: org as OrgProfile, events: (events ?? []) as unknown as Event[] }
}