import type { SupabaseClient } from '@supabase/supabase-js'

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

export async function uniqueSlug(supabase: SupabaseClient, name: string) {
  const base = slugify(name) || 'group'

  const { data } = await supabase
    .from('organizations')
    .select('slug')
    .like('slug', `${base}%`)

  const taken = new Set((data ?? []).map((row) => row.slug))
  if (!taken.has(base)) return base

  let n = 2
  while (taken.has(`${base}-${n}`)) n++
  return `${base}-${n}`
}