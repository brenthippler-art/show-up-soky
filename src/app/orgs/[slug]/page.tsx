import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import EventCard from "@/components/EventCard";
import { getOrgPage } from "@/lib/orgs";
import OrgAvatar from "@/components/OrgAvatar";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getOrgPage(slug);
  if (!result) return { title: "Group not found | Show Up SOKY" };

  return {
    title: `${result.org.name} | Show Up SOKY`,
    description:
      result.org.description ?? `Upcoming events from ${result.org.name}.`,
  };
}

async function OrgContent({ params }: { params: Params }) {
  const { slug } = await params;
  const result = await getOrgPage(slug);
  if (!result) notFound();

  const { org, events } = result;

  return (
    <>
      <section className="bg-linear-to-br from-sky-light via-cream to-sunshine-light">
        <div className="mx-auto max-w-3xl px-4 py-14">
          <Link
            href="/orgs"
            className="font-bold text-ink-soft underline underline-offset-4"
          >
            ← All groups
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-5">
            <OrgAvatar name={org.name} logoUrl={org.logo_url} size="lg" />
            <h1 className="text-4xl font-extrabold sm:text-5xl">{org.name}</h1>
          </div>
          {org.description && (
            <p className="mt-4 max-w-2xl text-lg leading-relaxed">
              {org.description}
            </p>
          )}
          {org.website_url && (
            <a
              href={org.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block rounded-full bg-white px-5 py-2 font-bold shadow-sm ring-2 ring-ink hover:bg-sunshine-light"
            >
              Visit their website
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
        </div>
      </section>

      <main className="mx-auto max-w-3xl px-4 py-12">
        <h2 className="text-3xl font-extrabold">Upcoming events</h2>
        <div className="mt-6 space-y-6">
          {events.length === 0 ? (
            <p className="rounded-2xl bg-sunshine-light p-8 text-center">
              No upcoming events from {org.name} right now. Check back soon!
            </p>
          ) : (
            events.map((event) => <EventCard key={event.id} event={event} />)
          )}
        </div>
      </main>
    </>
  );
}

export default function OrgPage({ params }: { params: Params }) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-3xl px-4 py-16">
          <p className="text-ink-soft">Loading…</p>
        </main>
      }
    >
      <OrgContent params={params} />
    </Suspense>
  );
}
