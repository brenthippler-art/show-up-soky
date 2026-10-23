'use server'

import { fromZonedTime } from 'date-fns-tz'
import { createPublicClient } from '@/lib/supabase/public'

const EVENT_TYPES = ['rally', 'meeting', 'volunteer', 'town_hall', 'training', 'social', 'other'] as const

export type SubmitState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  errors?: Record<string, string>
  values?: Record<string, string>
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export async function submitEvent(
  _prevState: SubmitState,
  formData: FormData
): Promise<SubmitState> {
  // Honeypot: real people never see or fill this field. Bots usually do.
  if (formData.get('website')) {
    return { status: 'success' }
  }

  const get = (key: string) => String(formData.get(key) ?? '').trim()

  const values = {
    title: get('title'),
    description: get('description'),
    starts_at: get('starts_at'),
    ends_at: get('ends_at'),
    location_name: get('location_name'),
    address: get('address'),
    online_url: get('online_url'),
    rsvp_url: get('rsvp_url'),
    event_type: get('event_type'),
    org_id: get('org_id'),
    submitted_org_name: get('submitted_org_name'),
    submitted_by_email: get('submitted_by_email'),
  }
  const isOnline = formData.get('is_online') === 'on'
  const isFree = formData.get('is_free') === 'on'

  const errors: Record<string, string> = {}

  if (!values.title) errors.title = 'Give your event a title.'
  if (!values.starts_at) errors.starts_at = 'When does it start?'
  if (!EVENT_TYPES.includes(values.event_type as (typeof EVENT_TYPES)[number])) {
    errors.event_type = 'Pick an event type.'
  }
  if (!values.org_id && !values.submitted_org_name) {
    errors.org = 'Choose your group, or type its name if it isn’t listed.'
  }
  if (!values.submitted_by_email.includes('@')) {
    errors.submitted_by_email = 'We need a valid email in case we have questions.'
  }
  if (!isOnline && !values.location_name) {
    errors.location_name = 'Where is it? (Or check "online event.")'
  }
  if (isOnline && values.online_url && !isValidUrl(values.online_url)) {
    errors.online_url = 'That link doesn’t look right. Include https://'
  }
  if (values.rsvp_url && !isValidUrl(values.rsvp_url)) {
    errors.rsvp_url = 'That link doesn’t look right. Include https://'
  }

  // Convert Central time to real UTC timestamps
  const startsAt = values.starts_at ? fromZonedTime(values.starts_at, 'America/Chicago') : null
  const endsAt = values.ends_at ? fromZonedTime(values.ends_at, 'America/Chicago') : null

  if (startsAt && startsAt < new Date()) {
    errors.starts_at = 'That date is in the past.'
  }
  if (startsAt && endsAt && endsAt <= startsAt) {
    errors.ends_at = 'The end time needs to be after the start.'
  }

  if (Object.keys(errors).length > 0) {
    return { status: 'error', message: 'Please fix the highlighted fields.', errors, values }
  }

  const supabase = createPublicClient()

  const { error } = await supabase.from('events').insert({
    title: values.title,
    description: values.description || null,
    starts_at: startsAt!.toISOString(),
    ends_at: endsAt ? endsAt.toISOString() : null,
    location_name: values.location_name || null,
    address: values.address || null,
    is_online: isOnline,
    online_url: isOnline ? values.online_url || null : null,
    is_free: isFree,
    rsvp_url: values.rsvp_url || null,
    event_type: values.event_type,
    org_id: values.org_id || null,
    submitted_org_name: values.submitted_org_name || null,
    submitted_by_email: values.submitted_by_email,
    status: 'pending',
    source: 'form',
  })

  if (error) {
    console.error('Event submission failed:', error)
    return {
      status: 'error',
      message: 'Something went wrong saving your event. Please try again.',
      values,
    }
  }

  return { status: 'success' }
}