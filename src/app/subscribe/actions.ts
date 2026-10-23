'use server'

import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendConfirmationEmail } from '@/lib/email'

export type SubscribeState = { status: 'idle' | 'success' | 'error'; message?: string }

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function subscribe(
  _prevState: SubscribeState,
  formData: FormData
): Promise<SubscribeState> {
  // Honeypot
  if (formData.get('company')) return { status: 'success' }

  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  if (!email.includes('@') || email.length > 254) {
    return { status: 'error', message: 'Please enter a valid email address.' }
  }

  const supabase = createAdminClient()

  const { data: existing } = await supabase
    .from('subscribers')
    .select('confirmed, confirm_token')
    .eq('email', email)
    .maybeSingle()

  try {
    if (!existing) {
      const { data: created, error } = await supabase
        .from('subscribers')
        .insert({ email })
        .select('confirm_token')
        .single()

      if (error) throw error
      await sendConfirmationEmail(email, created.confirm_token)
    } else if (!existing.confirmed) {
      await sendConfirmationEmail(email, existing.confirm_token)
    }
    // Already confirmed: do nothing, but show the same message below.
  } catch (err) {
    console.error('Subscribe failed:', err)
    return { status: 'error', message: 'Something went wrong. Please try again in a moment.' }
  }

  return {
    status: 'success',
    message: 'Almost there! Check your inbox for a confirmation link.',
  }
}

export async function confirmSubscription(formData: FormData) {
  const token = String(formData.get('token') ?? '')
  if (!UUID_PATTERN.test(token)) redirect('/subscribe/confirm?status=invalid')

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('subscribers')
    .update({ confirmed: true })
    .eq('confirm_token', token)
    .select('id')

  if (error || !data?.length) redirect('/subscribe/confirm?status=invalid')
  redirect('/subscribe/confirm?status=confirmed')
}

export async function unsubscribe(formData: FormData) {
  const token = String(formData.get('token') ?? '')
  if (!UUID_PATTERN.test(token)) redirect('/unsubscribe?status=invalid')

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('subscribers')
    .delete()
    .eq('unsubscribe_token', token)
    .select('id')

  if (error || !data?.length) redirect('/unsubscribe?status=invalid')
  redirect('/unsubscribe?status=done')
}