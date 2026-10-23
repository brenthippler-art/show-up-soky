import type { Metadata } from "next";
import Link from "next/link";
import { getOrgDirectory } from "@/lib/orgs";
import OrgAvatar from "@/components/OrgAvatar";

export const metadata: Metadata = {
  title: "Groups | Show Up SOKY",
  description:
    "Community groups working for rights and freedoms across South Central Kentucky.",
};

export default async function OrgsPage() {
  const orgs = await getOrgDirectory();

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-extrabold">The groups doing the work</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink-soft">
        Local organizations moving rights and freedoms forward for every person
        in South Central Kentucky. Find one that fits and show up.
      </p>

      {orgs.length === 0 ? (
        <p className="mt-10 rounded-2xl bg-sunshine-light p-8 text-center font-bold">
          No groups listed yet.
        </p>
      ) : (
        <ul className="mt-10 grid gap-6 sm:grid-cols-2">
          {orgs.map((org) => (
            <li key={org.id}>
              <Link
                href={`/orgs/${org.slug}`}
                className="block h-full rounded-2xl bg-white p-6 shadow-md ring-1 ring-ink/5 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <OrgAvatar name={org.name} logoUrl={org.logo_url} size="md" />
                  <h2 className="text-2xl font-extrabold">{org.name}</h2>
                </div>
                {org.description && (
                  <p className="mt-2 line-clamp-3 text-ink-soft">
                    {org.description}
                  </p>
                )}
                <p className="mt-4 font-bold text-ink">View events →</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
