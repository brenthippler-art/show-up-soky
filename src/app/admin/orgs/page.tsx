import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import AdminNav from "@/components/AdminNav";
import ImageUpload from "@/components/ImageUpload";
import OrgAvatar from "@/components/OrgAvatar";
import { requireAdmin } from "@/lib/auth";
import { approveOrg, deleteOrg, setOrgLogo, removeOrgLogo } from "./actions";

export const metadata: Metadata = {
  title: "Groups | Show Up SOKY Admin",
  robots: { index: false },
};

type Org = {
  id: string;
  name: string;
  slug: string;
  website_url: string | null;
  contact_email: string | null;
  logo_url: string | null;
  status: "pending" | "approved";
  tagline: string | null;
  organizer_name: string | null;
  organizer_email: string | null;
};

async function OrgsList() {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from("organizations")
    .select(
      "id, name, slug, website_url, contact_email, logo_url, status, tagline, organizer_name, organizer_email",
    )
    .order("status", { ascending: false })
    .order("name", { ascending: true });

  const orgs = (data ?? []) as Org[];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-sunshine-light p-5">
        <p className="font-bold">
          Adding a group for someone? Use the public form, then approve it here.
        </p>
        <Link
          href="/register"
          className="rounded-full bg-sunshine px-5 py-2 font-bold shadow-sm hover:bg-sunshine-dark"
        >
          Register a group
        </Link>
      </div>

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
                    {org.tagline && <p className="text-sm">{org.tagline}</p>}
                    {org.organizer_name && (
                      <p className="text-sm text-ink-soft">
                        Registered by {org.organizer_name}
                        {org.organizer_email && <> ({org.organizer_email})</>}
                      </p>
                    )}
                    <p className="text-sm text-ink-soft">
                      /orgs/{org.slug}
                      {org.website_url && <> · {org.website_url}</>}
                      {org.contact_email && <> · {org.contact_email}</>}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/admin/orgs/${org.id}`}
                    className="rounded-full px-4 py-2 text-sm font-bold ring-2 ring-ink hover:bg-sunshine-light"
                  >
                    Edit<span className="sr-only"> {org.name}</span>
                  </Link>
                  {org.status === "pending" && (
                    <>
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
                    </>
                  )}
                </div>
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