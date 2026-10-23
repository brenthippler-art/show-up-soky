'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/slug'

async function setEventStatus(formData: FormData, status: 'approved' | 'rejected') {
  const { supabase } = await requireAdmin()
  const id = String(formData.get('id') ?? '')

  const { error } = await supabase
    .from('events')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw new Error(`Couldn’t update event: ${error.message}`)

  updateTag('events')
  revalidatePath('/admin')
  redirect('/admin')
}

export async function approveEvent(formData: FormData) {
  await setEventStatus(formData, 'approved')
}

export async function rejectEvent(formData: FormData) {
  await setEventStatus(formData, 'rejected')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function createOrgFromEvent(formData: FormData) {
  const { supabase } = await requireAdmin()
  const eventId = String(formData.get('eventId') ?? '')
  const name = String(formData.get('orgName') ?? '').trim()
  if (!eventId || !name) return

  const slug = slugify(name) || 'group'

  // Reuse a group with the same slug if it already exists
  const { data: existing } = await supabase
    .from('organizations')
    .select('id')
    .eq('slug', slug)
    .maybeSingle()

  let orgId = existing?.id

  if (!orgId) {
    const { data: created, error } = await supabase
      .from('organizations')
      .insert({ name, slug, status: 'approved' })
      .select('id')
      .single()

    if (error) throw new Error(`Couldn’t create group: ${error.message}`)
    orgId = created.id
  }

  const { error: linkError } = await supabase
    .from('events')
    .update({ org_id: orgId, submitted_org_name: null })
    .eq('id', eventId)

  if (linkError) throw new Error(`Couldn’t link event: ${linkError.message}`)

  updateTag('orgs')
  updateTag('events')
  revalidatePath('/admin')
  redirect('/admin')
}