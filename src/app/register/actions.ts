'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { uniqueSlug } from '@/lib/slug'
import { cleanUrl } from '@/lib/url'
import { isStorageUrl } from '@/lib/storage'
import { isFocusArea } from '@/lib/focus-area'
import { after } from 'next/server'
import { sendAdminNotification } from '@/lib/email'
import { focusLabel } from '@/lib/focus-area'

export type RegisterState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  errors?: Record<string, string>
  values?: Record<string, string>
}

const TAGLINE_MAX = 140

export async function registerOrg(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  if (formData.get('website')) return { status: 'success' } // honeypot

  const get = (key: string) => String(formData.get(key) ?? '').trim()

  const values = {
    name: get('name'),
    tagline: get('tagline'),
    description: get('description'),
    focus_area: get('focus_area'),
    meeting_schedule: get('meeting_schedule'),
    meeting_location: get('meeting_location'),
    get_involved: get('get_involved'),
    public_email: get('public_email'),
    phone: get('phone'),
    website_url: get('website_url'),
    facebook_url: get('facebook_url'),
    instagram_url: get('instagram_url'),
    organizer_name: get('organizer_name'),
    organizer_email: get('organizer_email'),
  }
  const logo = get('logo_url')

  const errors: Record<string, string> = {}

  if (!values.name) errors.name = 'What’s your group called?'
  if (!values.tagline) errors.tagline = 'Add a one-sentence tagline.'
  else if (values.tagline.length > TAGLINE_MAX) {
    errors.tagline = `Keep it under ${TAGLINE_MAX} characters.`
  }
  if (!values.description) errors.description = 'Tell people a bit about your group.'
  if (!isFocusArea(values.focus_area)) errors.focus_area = 'Choose your main focus area.'
  if (!values.public_email.includes('@')) errors.public_email = 'Add an email the public can use.'
  if (!values.organizer_name) errors.organizer_name = 'We need a name to follow up with.'
  if (!values.organizer_email.includes('@')) errors.organizer_email = 'We need your email to follow up.'

  for (const key of ['website_url', 'facebook_url', 'instagram_url'] as const) {
    if (values[key] && !cleanUrl(values[key])) {
      errors[key] = 'That link doesn’t look right. Include https://'
    }
  }

  if (Object.keys(errors).length > 0) {
    return { status: 'error', message: 'Please fix the highlighted fields.', errors, values }
  }

  const supabase = createAdminClient()

  const { error } = await supabase.from('organizations').insert({
    name: values.name,
    slug: await uniqueSlug(supabase, values.name),
    tagline: values.tagline,
    description: values.description,
    focus_areas: [values.focus_area],
    meeting_schedule: values.meeting_schedule || null,
    meeting_location: values.meeting_location || null,
    get_involved: values.get_involved || null,
    public_email: values.public_email,
    phone: values.phone || null,
    website_url: cleanUrl(values.website_url),
    facebook_url: cleanUrl(values.facebook_url),
    instagram_url: cleanUrl(values.instagram_url),
    logo_url: logo && isStorageUrl(logo, 'org-logos') ? logo : null,
    organizer_name: values.organizer_name,
    organizer_email: values.organizer_email.toLowerCase(),
    status: 'pending',
  })

  if (error) {
    console.error('Group registration failed:', error)
    return {
      status: 'error',
      message: 'Something went wrong saving your group. Please try again.',
      values,
    }
  }

    after(async () => {
    try {
      await sendAdminNotification({
        subject: `New group to review: ${values.name}`,
        heading: values.name,
        rows: [
          ['Tagline', values.tagline],
          ['Focus area', focusLabel(values.focus_area)],
          ['Meets', values.meeting_schedule],
          ['Public email', values.public_email],
          ['Organizer', `${values.organizer_name} (${values.organizer_email})`],
          ['Logo', logo ? 'Yes' : null],
        ],
        buttonLabel: 'Review groups',
        buttonPath: '/admin/orgs',
      })
    } catch (error) {
      console.error('Admin notification failed:', error)
    }
  })

  return { status: 'success' }
}