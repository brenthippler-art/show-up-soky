import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import AdminNav from '@/components/AdminNav'
import ConfirmButton from '@/components/ConfirmButton'
import ImageUpload from '@/components/ImageUpload'
import { requireAdmin } from '@/lib/auth'
import { isUuid } from '@/lib/url'
import { updateOrg, deleteOrg } from '../actions'

export const metadata: Metadata = {
  title: 'Edit Group | Show Up SOKY Admin',
  robots: { index: false },
}

const inputClass =
  'mt-1 w-full rounded-xl border-2 border-ink-soft bg-white px-4 py-2 text-ink focus:border-sky'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}

async function EditOrg({ params, searchParams }: Props) {
  const { supabase } = await requireAdmin()
  const { id } = await params
  const { error: errorMessage } = await searchParams
  if (!isUuid(id)) notFound()

  const { data: org } = await supabase
    .from('organizations')
    .select('id, name, slug, description, website_url, contact_email, ical_url, logo_url, status')
    .eq('id', id)
    .maybeSingle()

  if (!org) notFound()

  return (
    <>
      <Link href="/admin/orgs" className="font-bold text-ink-soft underline underline-offset-4">
        ← All groups
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold">Edit {org.name}</h1>
      <p className="mt-1 text-ink-soft">Public page: /orgs/{org.slug}</p>

      {errorMessage && (
        <p role="alert" className="mt-6 rounded-xl border-2 border-berry bg-berry-light p-4 font-bold">
          {errorMessage}
        </p>
      )}

      <form action={updateOrg} className="mt-8 grid gap-5 rounded-2xl bg-white p-6 shadow-md ring-1 ring-ink/5 sm:grid-cols-2 sm:p-8">
        <input type="hidden" name="id" value={org.id} />

        <div className="sm:col-span-2">
          <label htmlFor="name" className="block font-bold">Name *</label>
          <input id="name" name="name" required defaultValue={org.name} className={inputClass} />
        </div>

        <div>
          <label htmlFor="status" className="block font-bold">Status</label>
          <select id="status" name="status" defaultValue={org.status} className={inputClass}>
            <option value="approved">Approved (public)</option>
            <option value="pending">Pending (hidden)</option>
          </select>
        </div>

        <div>
          <label htmlFor="contact_email" className="block font-bold">Contact email</label>
          <input id="contact_email" name="contact_email" type="email" defaultValue={org.contact_email ?? ''} className={inputClass} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="website_url" className="block font-bold">Website</label>
          <input id="website_url" name="website_url" type="url" defaultValue={org.website_url ?? ''} className={inputClass} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="ical_url" className="block font-bold">Calendar feed (iCal URL)</label>
          <input id="ical_url" name="ical_url" type="url" defaultValue={org.ical_url ?? ''} className={inputClass} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="description" className="block font-bold">Description</label>
          <textarea id="description" name="description" rows={4} defaultValue={org.description ?? ''} className={inputClass} />
        </div>

        <div className="sm:col-span-2">
          <ImageUpload
            id="logo"
            name="logo_url"
            label="Logo"
            bucket="org-logos"
            folder="logos"
            defaultUrl={org.logo_url}
            help="JPG, PNG or WebP, up to 2 MB."
          />
        </div>

        <div className="sm:col-span-2">
          <button className="rounded-full bg-sunshine px-6 py-3 font-bold shadow-sm hover:bg-sunshine-dark">
            Save changes
          </button>
        </div>
      </form>

      <section aria-labelledby="danger-heading" className="mt-10 rounded-2xl border-2 border-berry p-6">
        <h2 id="danger-heading" className="text-xl font-extrabold">Delete this group</h2>
        <p className="mt-1 text-ink-soft">
          Its events stay on the calendar but lose their “Hosted by” link. This can’t be undone.
        </p>
        <form action={deleteOrg} className="mt-4">
          <input type="hidden" name="id" value={org.id} />
          <ConfirmButton
            message={`Delete ${org.name}? This can’t be undone.`}
            className="rounded-full bg-white px-5 py-2 font-bold ring-2 ring-berry hover:bg-berry-light"
          >
            Delete group
          </ConfirmButton>
        </form>
      </section>
    </>
  )
}

export default function EditOrgPage(props: Props) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <AdminNav />
      <Suspense fallback={<p className="text-ink-soft">Loading…</p>}>
        <EditOrg {...props} />
      </Suspense>
    </main>
  )
}