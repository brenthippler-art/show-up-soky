'use client'

import { useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import type { Bucket } from '@/lib/storage'

const MAX_BYTES: Record<Bucket, number> = {
  'event-images': 5 * 1024 * 1024,
  'org-logos': 2 * 1024 * 1024,
}

const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

type Props = {
  id: string
  name: string
  label: string
  bucket: Bucket
  folder: string
  help?: string
  defaultUrl?: string | null
}

export default function ImageUpload({ id, name, label, bucket, folder, help, defaultUrl }: Props) {
  const [url, setUrl] = useState<string | null>(defaultUrl ?? null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)

    const ext = EXTENSIONS[file.type]
    if (!ext || (bucket === 'org-logos' && ext === 'gif')) {
      setError('Please choose a JPG, PNG or WebP image.')
      return
    }

    if (file.size > MAX_BYTES[bucket]) {
      setError(`That image is too large. The limit is ${MAX_BYTES[bucket] / 1024 / 1024} MB.`)
      return
    }

    setUploading(true)

    const supabase = createClient()
    const path = `${folder}/${crypto.randomUUID()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, { contentType: file.type })

    setUploading(false)

    if (uploadError) {
      console.error(uploadError)
      setError('Upload failed. Please try again.')
      return
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    setUrl(data.publicUrl)
  }

  const describedBy = [help && `${id}-help`, error && `${id}-error`].filter(Boolean).join(' ')

  return (
    <div>
      <label htmlFor={id} className="block font-bold">{label}</label>
      {help && (
        <p id={`${id}-help`} className="mt-1 text-sm text-ink-soft">{help}</p>
      )}

      <input
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleChange}
        disabled={uploading}
        aria-describedby={describedBy || undefined}
        className="mt-2 block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-sunshine file:px-4 file:py-2 file:font-bold hover:file:bg-sunshine-dark"
      />

      {/* Only the URL is submitted with the form, never the file itself */}
      <input type="hidden" name={name} value={url ?? ''} />

      {uploading && (
        <p role="status" className="mt-2 text-sm font-bold text-ink-soft">Uploading…</p>
      )}

      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm font-bold text-red-700">
          {error}
        </p>
      )}

      {url && (
        <div className="mt-3 flex items-end gap-4">
          <Image
            src={url}
            alt="Preview of your uploaded image"
            width={240}
            height={240}
            className="h-40 w-auto rounded-xl bg-sunshine-light object-contain"
          />
          <button
            type="button"
            onClick={() => setUrl(null)}
            className="rounded-full px-4 py-1 text-sm font-bold ring-2 ring-ink hover:bg-berry-light"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  )
}