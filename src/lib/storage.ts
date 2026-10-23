export type Bucket = 'event-images' | 'org-logos'

export function isStorageUrl(url: string, bucket: Bucket) {
  const prefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/`
  return url.startsWith(prefix)
}