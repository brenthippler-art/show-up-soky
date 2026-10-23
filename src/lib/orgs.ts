import { cacheLife, cacheTag } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/public'

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