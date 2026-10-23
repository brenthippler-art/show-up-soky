import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { connection } from 'next/server'

export async function requireAdmin() {
  await connection()
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: admin } = await supabase
    .from('admins')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!admin) redirect('/login?error=not-admin')

  return { supabase, user }
}