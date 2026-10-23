'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

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