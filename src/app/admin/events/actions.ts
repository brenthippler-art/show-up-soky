'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { fromZonedTime } from 'date-fns-tz'
import { requireAdmin } from '@/lib/auth'
import { isStorageUrl } from '@/lib/storage'
import { cleanUrl } from '@/lib/url'

const EVENT_TYPES = ['rally', 'meeting', 'volunteer', 'town_hall', 'training', 'social', 'other']
const STATUSES = ['pending', 'approved', 'rejected']

function refresh() {
  updateTag('events')
  revalidatePath('/admin')
  revalidatePath('/admin/events')
}

export async function updateEvent(formData: FormData) {
  const { supabase } = await requireAdmin()
  const get = (key: string) => String(formData.get(key) ?? '').trim()

  const id = get('id')
  const back = (message: string) =>
    redirect(`/admin/events/${id}?error=${encodeURIComponent(message)}`)

  const title = get('title')
  const eventType = get('event_type')
  const status = get('status')
  const startsLocal = get('starts_at')
  const endsLocal = get('ends_at')
  const isOnline = formData.get('is_online') === 'on'
  const imageUrl = get('image_url')
  const orgId = get('org_id')

  if (!title) back('Title is required.')
  if (!startsLocal) back('Start time is required.')
  if (!EVENT_TYPES.includes(eventType)) back('Pick a valid event type.')
  if (!STATUSES.includes(status)) back('Pick a valid status.')

  const startsAt = fromZonedTime(startsLocal, 'America/Chicago')
  const endsAt = endsLocal ? fromZonedTime(endsLocal, 'America/Chicago') : null
  if (endsAt && endsAt <= startsAt) back('The end time needs to be after the start.')

  const { error } = await supabase
    .from('events')
    .update({
      title,
      event_type: eventType,
      status,
      starts_at: startsAt.toISOString(),
      ends_at: endsAt ? endsAt.toISOString() : null,
      org_id: orgId || null,
      submitted_org_name: orgId ? null : get('submitted_org_name') || null,
      location_name: get('location_name') || null,
      address: get('address') || null,
      is_online: isOnline,
      online_url: isOnline ? cleanUrl(get('online_url')) : null,
      is_free: formData.get('is_free') === 'on',
      rsvp_url: cleanUrl(get('rsvp_url')),
      description: get('description') || null,
      image_url: imageUrl && isStorageUrl(imageUrl, 'event-images') ? imageUrl : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) back(error.message)

  refresh()
  redirect('/admin/events')
}

export async function deleteEvent(formData: FormData) {
  const { supabase } = await requireAdmin()
  const id = String(formData.get('id') ?? '')

  const { error } = await supabase.from('events').delete().eq('id', id)
  if (error) throw new Error(`Couldn’t delete event: ${error.message}`)

  refresh()
  redirect('/admin/events')
}