export type EventType =
  | 'rally'
  | 'meeting'
  | 'volunteer'
  | 'town_hall'
  | 'training'
  | 'social'
  | 'other'

export type Event = {
  id: string
  title: string
  description: string | null
  starts_at: string
  ends_at: string | null
  location_name: string | null
  address: string | null
  is_online: boolean
  online_url: string | null
  event_type: EventType
  is_free: boolean
  rsvp_url: string | null
  organizations: { name: string; slug: string } | null
}