import type { Metadata } from "next";
import { Suspense } from "react";
import AdminNav from "@/components/AdminNav";
import { requireAdmin } from "@/lib/auth";
import ImageUpload from "@/components/ImageUpload";
import OrgAvatar from "@/components/OrgAvatar";
import {
  createOrg,
  approveOrg,
  deleteOrg,
  setOrgLogo,
  removeOrgLogo,
} from "./actions";

export const metadata: Metadata = {
  title: "Groups | Show Up SOKY Admin",
  robots: { index: false },
};

const inputClass =
  "mt-1 w-full rounded-xl border-2 border-ink-soft bg-white px-4 py-2 text-ink focus:border-sky";

type Org = {
  id: string;
  name: string;
  slug: string;
  website_url: string | null;
  contact_email: string | null;
  logo_url: string | null;
  status: "pending" | "approved";
};

async function OrgsList() {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from("organizations")
    .select("id, name, slug, website_url, contact_email, logo_url, status")
    .order("status", { ascending: false })
    .order("name", { ascending: true });

  const orgs = (data ?? []) as Org[];

  return (
    <>
      <section
        aria-labelledby="add-heading"
        className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-ink/5"
      >
        <h2 id="add-heading" className="text-2xl font-extrabold">
          Add a group
        </h2>
        <form action={createOrg} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="name" className="block font-bold">
              Name *
            </label>
            <input id="name" name="name" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="website_url" className="block font-bold">
              Website
            </label>
            <input
              id="website_url"
              name="website_url"
              type="url"
              placeholder="https://"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="contact_email" className="block font-bold">
              Contact email
            </label>
            <input
              id="contact_email"
              name="contact_email"
              type="email"
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="ical_url" className="block font-bold">
              Calendar feed (iCal URL)
            </label>
            <input
              id="ical_url"
              name="ical_url"
              type="url"
              placeholder="https://"
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <ImageUpload
              id="new-logo"
              name="logo_url"
              label="Logo"
              bucket="org-logos"
              folder="logos"
              help="Optional. JPG, PNG or WebP, up to 2 MB. Square images look best."
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="description" className="block font-bold">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <button className="rounded-full bg-sunshine px-6 py-2 font-bold shadow-sm hover:bg-sunshine-dark">
              Add group
            </button>
          </div>
        </form>
      </section>

      {error && (
        <p
          role="alert"
          className="mt-6 rounded-xl border-2 border-berry bg-berry-light p-4 font-bold"
        >
          Couldn’t load groups: {error.message}
        </p>
      )}

      <section aria-labelledby="list-heading" className="mt-10">
        <h2 id="list-heading" className="text-2xl font-extrabold">
          All groups ({orgs.length})
        </h2>
        <ul className="mt-4 space-y-3">
          {orgs.map((org) => (
            <li
              key={org.id}
              className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink/5"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <OrgAvatar name={org.name} logoUrl={org.logo_url} size="md" />
                  <div>
                    <p className="text-lg font-bold">
                      {org.name}{" "}
                      {org.status === "pending" && (
                        <span className="rounded-full bg-tangerine-light px-2 py-0.5 text-xs font-bold">
                          Pending
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-ink-soft">
                      /orgs/{org.slug}
                      {org.website_url && <> · {org.website_url}</>}
                      {org.contact_email && <> · {org.contact_email}</>}
                    </p>
                  </div>
                </div>

                {org.status === "pending" && (
                  <div className="flex gap-2">
                    <form action={approveOrg}>
                      <input type="hidden" name="id" value={org.id} />
                      <button className="rounded-full bg-meadow px-4 py-2 text-sm font-bold hover:brightness-95">
                        Approve<span className="sr-only"> {org.name}</span>
                      </button>
                    </form>
                    <form action={deleteOrg}>
                      <input type="hidden" name="id" value={org.id} />
                      <button className="rounded-full px-4 py-2 text-sm font-bold ring-2 ring-berry hover:bg-berry-light">
                        Remove<span className="sr-only"> {org.name}</span>
                      </button>
                    </form>
                  </div>
                )}
              </div>

              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-bold text-ink-soft hover:text-ink">
                  Change logo<span className="sr-only"> for {org.name}</span>
                </summary>
                <div className="mt-3 flex flex-wrap items-end gap-4">
                  <form
                    action={setOrgLogo}
                    className="flex flex-wrap items-end gap-4"
                  >
                    <input type="hidden" name="id" value={org.id} />
                    <ImageUpload
                      id={`logo-${org.id}`}
                      name="logo_url"
                      label="New logo"
                      bucket="org-logos"
                      folder="logos"
                    />
                    <button className="rounded-full bg-sunshine px-4 py-2 text-sm font-bold hover:bg-sunshine-dark">
                      Save logo
                    </button>
                  </form>
                  {org.logo_url && (
                    <form action={removeOrgLogo}>
                      <input type="hidden" name="id" value={org.id} />
                      <button className="rounded-full px-4 py-2 text-sm font-bold ring-2 ring-berry hover:bg-berry-light">
                        Remove logo
                      </button>
                    </form>
                  )}
                </div>
              </details>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export default function OrgsAdminPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <AdminNav />
      <h1 className="mb-8 text-3xl font-extrabold">Groups</h1>
      <Suspense fallback={<p className="text-ink-soft">Loading groups…</p>}>
        <OrgsList />
      </Suspense>
    </main>
  );
}
