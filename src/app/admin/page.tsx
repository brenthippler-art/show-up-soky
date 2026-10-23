import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import {
  approveEvent,
  rejectEvent,
  signOut,
  createOrgFromEvent,
} from "./actions";
import { Suspense } from "react";
import Image from "next/image";
import Loading from "./loading";
import AdminNav from "@/components/AdminNav";


export const metadata: Metadata = {
  title: "Review Queue | Show Up SOKY",
  robots: { index: false },
};

type PendingEvent = {
  id: string;
  title: string;
  description: string | null;
  starts_at: string;
  location_name: string | null;
  address: string | null;
  is_online: boolean;
  online_url: string | null;
  event_type: string;
  rsvp_url: string | null;
  image_url: string | null;
  submitted_org_name: string | null;
  submitted_by_email: string | null;
  created_at: string;
  organizations: { name: string } | null;
};

async function ReviewQueue() {
  const { supabase, user } = await requireAdmin();

  const { data, error } = await supabase
    .from("events")
    .select(
      `
      id, title, description, starts_at, location_name, address,
      is_online, online_url, event_type, rsvp_url, image_url,
      submitted_org_name, submitted_by_email, created_at,
      organizations ( name )
    `,
    )
    .eq("status", "pending")
    .order("starts_at", { ascending: true });

  const pending = (data ?? []) as unknown as PendingEvent[];

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <AdminNav />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Review queue</h1>
          <p className="mt-1 text-ink-soft">Signed in as {user.email}</p>
        </div>
        <form action={signOut}>
          <button className="rounded-full px-4 py-2 font-bold ring-2 ring-ink hover:bg-sunshine-light">
            Sign out
          </button>
        </form>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-6 rounded-xl border-2 border-berry bg-berry-light p-4 font-bold"
        >
          Couldn’t load submissions: {error.message}
        </p>
      )}

      <div className="mt-8 space-y-6">
        {pending.length === 0 ? (
          <div className="rounded-2xl bg-meadow-light p-8 text-center">
            <p className="text-xl font-bold">All caught up! 🎉</p>
            <p className="mt-1 text-ink-soft">
              No submissions waiting for review.
            </p>
          </div>
        ) : (
          pending.map((event) => (
            <article
              key={event.id}
              className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-ink/5"
            >
              <p className="text-sm font-bold uppercase tracking-wide text-ink-soft">
                {event.event_type.replace("_", " ")}
              </p>
              <h2 className="mt-1 text-2xl font-extrabold">{event.title}</h2>
              <p className="mt-2 font-bold text-ink-soft">
                {formatDate(event.starts_at)}
              </p>

              <dl className="mt-4 grid gap-x-4 gap-y-2 text-sm sm:grid-cols-[auto_1fr]">
                <dt className="font-bold">Group</dt>
                <dd>
                  {event.organizations?.name ?? (
                    <div className="flex flex-wrap items-center gap-2">
                      <span>{event.submitted_org_name}</span>
                      <span className="rounded-full bg-tangerine-light px-2 py-0.5 text-xs font-bold">
                        Not registered
                      </span>
                      {event.submitted_org_name && (
                        <form action={createOrgFromEvent}>
                          <input
                            type="hidden"
                            name="eventId"
                            value={event.id}
                          />
                          <input
                            type="hidden"
                            name="orgName"
                            value={event.submitted_org_name}
                          />
                          <button className="rounded-full px-3 py-1 text-xs font-bold ring-2 ring-ink hover:bg-sunshine-light">
                            Create group &amp; link
                          </button>
                        </form>
                      )}
                    </div>
                  )}
                </dd>

                <dt className="font-bold">Where</dt>
                <dd>
                  {event.is_online
                    ? `Online${event.online_url ? ` (${event.online_url})` : ""}`
                    : [event.location_name, event.address]
                        .filter(Boolean)
                        .join(", ")}
                </dd>

                {event.rsvp_url && (
                  <>
                    <dt className="font-bold">Link</dt>
                    <dd className="break-all">{event.rsvp_url}</dd>
                  </>
                )}

                <dt className="font-bold">Submitted by</dt>
                <dd>{event.submitted_by_email}</dd>
              </dl>

              {event.description && (
                <p className="mt-4 leading-relaxed">{event.description}</p>
              )}
              {event.image_url && (
                <a
                  href={event.image_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block"
                >
                  <Image
                    src={event.image_url}
                    alt={`Submitted flyer for ${event.title}`}
                    width={300}
                    height={400}
                    className="h-56 w-auto rounded-xl bg-sunshine-light object-contain ring-1 ring-ink/10"
                  />
                  <span className="sr-only">
                    {" "}
                    (opens full size in a new tab)
                  </span>
                </a>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <form action={approveEvent}>
                  <input type="hidden" name="id" value={event.id} />
                  <button className="rounded-full bg-meadow px-6 py-2 font-bold text-ink shadow-sm hover:brightness-95">
                    Approve<span className="sr-only"> {event.title}</span>
                  </button>
                </form>
                <form action={rejectEvent}>
                  <input type="hidden" name="id" value={event.id} />
                  <button className="rounded-full bg-white px-6 py-2 font-bold ring-2 ring-berry hover:bg-berry-light">
                    Reject<span className="sr-only"> {event.title}</span>
                  </button>
                </form>
              </div>
            </article>
          ))
        )}
      </div>
    </main>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ReviewQueue />
    </Suspense>
  );
}
