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
}

export async function getOrgDirectory(): Promise<OrgProfile[]> {
  'use cache'
  cacheLife('hours')
  cacheTag('orgs')

  const supabase = createPublicClient()

  const { data, error } = await supabase
    .from('organizations')
    .select('id, name, slug, description, website_url, logo_url')
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
    .select('id, name, slug, description, website_url, logo_url')
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