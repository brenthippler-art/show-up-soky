'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { uniqueSlug } from '@/lib/slug'
import { isStorageUrl } from '@/lib/storage'
import { cleanUrl } from '@/lib/url'

function logoFrom(formData: FormData) {
  const url = String(formData.get('logo_url') ?? '').trim()
  return url && isStorageUrl(url, 'org-logos') ? url : null
}

function refresh() {
  updateTag('orgs')
  updateTag('events')
  revalidatePath('/admin/orgs')
}

export async function createOrg(formData: FormData) {
  const { supabase } = await requireAdmin()

  const name = String(formData.get('name') ?? '').trim()
  if (!name) return

  const { error } = await supabase.from('organizations').insert({
    name,
    slug: await uniqueSlug(supabase, name),
    description: String(formData.get('description') ?? '').trim() || null,
    website_url: cleanUrl(String(formData.get('website_url') ?? '').trim()),
    contact_email: String(formData.get('contact_email') ?? '').trim() || null,
    ical_url: cleanUrl(String(formData.get('ical_url') ?? '').trim()),
    status: 'approved',
    logo_url: logoFrom(formData),
  })

  if (error) throw new Error(`Couldn’t create group: ${error.message}`)
  refresh()
}

export async function approveOrg(formData: FormData) {
  const { supabase } = await requireAdmin()
  const id = String(formData.get('id') ?? '')

  const { error } = await supabase.from('organizations').update({ status: 'approved' }).eq('id', id)
  if (error) throw new Error(`Couldn’t approve group: ${error.message}`)
  refresh()
}

export async function deleteOrg(formData: FormData) {
  const { supabase } = await requireAdmin()
  const id = String(formData.get('id') ?? '')

  const { error } = await supabase.from('organizations').delete().eq('id', id)
  if (error) throw new Error(`Couldn’t delete group: ${error.message}`)
  refresh()
  redirect('/admin/orgs')
}

export async function setOrgLogo(formData: FormData) {
  const { supabase } = await requireAdmin()
  const id = String(formData.get('id') ?? '')
  const logoUrl = logoFrom(formData)
  if (!id || !logoUrl) return

  const { error } = await supabase.from('organizations').update({ logo_url: logoUrl }).eq('id', id)
  if (error) throw new Error(`Couldn’t save logo: ${error.message}`)
  refresh()
}

export async function removeOrgLogo(formData: FormData) {
  const { supabase } = await requireAdmin()
  const id = String(formData.get('id') ?? '')

  const { error } = await supabase.from('organizations').update({ logo_url: null }).eq('id', id)
  if (error) throw new Error(`Couldn’t remove logo: ${error.message}`)
  refresh()
}
export async function updateOrg(formData: FormData) {
  const { supabase } = await requireAdmin()
  const id = String(formData.get('id') ?? '')
  const name = String(formData.get('name') ?? '').trim()
  const status = String(formData.get('status') ?? '')

  if (!name) {
    redirect(`/admin/orgs/${id}?error=${encodeURIComponent('Name is required.')}`)
  }
  if (status !== 'pending' && status !== 'approved') {
    redirect(`/admin/orgs/${id}?error=${encodeURIComponent('Invalid status.')}`)
  }

  const { error } = await supabase
    .from('organizations')
    .update({
      name,
      status,
      description: String(formData.get('description') ?? '').trim() || null,
      website_url: cleanUrl(String(formData.get('website_url') ?? '').trim()),
      contact_email: String(formData.get('contact_email') ?? '').trim() || null,
      ical_url: cleanUrl(String(formData.get('ical_url') ?? '').trim()),
      logo_url: logoFrom(formData),
    })
    .eq('id', id)

  if (error) {
    redirect(`/admin/orgs/${id}?error=${encodeURIComponent(error.message)}`)
  }

  refresh()
  redirect('/admin/orgs')
}