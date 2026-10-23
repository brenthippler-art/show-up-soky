import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import EventCard from "@/components/EventCard";
import FocusPill from "@/components/FocusPill";
import OrgAvatar from "@/components/OrgAvatar";
import { getOrgPage, type OrgProfile } from "@/lib/orgs";
import { mapsUrl } from "@/lib/url";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getOrgPage(slug);
  if (!result) return { title: "Group not found | Show Up SOKY" };

  const { org } = result;
  const description =
    org.tagline ?? org.description ?? `Upcoming events from ${org.name}.`;

  return {
    title: `${org.name} | Show Up SOKY`,
    description,
    openGraph: {
      title: org.name,
      description,
      url: `/orgs/${org.slug}`,
      images: org.logo_url ? [{ url: org.logo_url, alt: "" }] : undefined,
    },
  };
}

const linkClass =
  "font-bold underline decoration-sunshine-dark decoration-2 underline-offset-4 hover:decoration-ink";

function SidebarCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-ink/5">
      <h2 className="text-xl font-extrabold">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={linkClass}
    >
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

function ContactCard({ org }: { org: OrgProfile }) {
  const hasContact =
    org.public_email ||
    org.phone ||
    org.website_url ||
    org.facebook_url ||
    org.instagram_url;
  if (!hasContact) return null;

  return (
    <SidebarCard title="Contact">
      <ul className="space-y-2">
        {org.public_email && (
          <li>
            <a
              href={`mailto:${org.public_email}`}
              className={`${linkClass} break-all`}
            >
              {org.public_email}
            </a>
          </li>
        )}
        {org.phone && (
          <li>
            <a
              href={`tel:${org.phone.replace(/[^\d+]/g, "")}`}
              className={linkClass}
            >
              {org.phone}
            </a>
          </li>
        )}
        {org.website_url && (
          <li>
            <ExternalLink href={org.website_url}>Website</ExternalLink>
          </li>
        )}
        {org.facebook_url && (
          <li>
            <ExternalLink href={org.facebook_url}>Facebook</ExternalLink>
          </li>
        )}
        {org.instagram_url && (
          <li>
            <ExternalLink href={org.instagram_url}>Instagram</ExternalLink>
          </li>
        )}
      </ul>
    </SidebarCard>
  );
}

async function OrgContent({ params }: { params: Params }) {
  const { slug } = await params;
  const result = await getOrgPage(slug);
  if (!result) notFound();

  const { org, events } = result;
  const meetingMap = mapsUrl(org.meeting_location);
  const contactEmail = process.env.CONTACT_EMAIL;
  const updateHref = contactEmail
    ? `mailto:${contactEmail}?subject=${encodeURIComponent(`Update for ${org.name}`)}`
    : null;

  return (
    <>
      <section className="bg-linear-to-br from-meadow-light via-cream to-sunshine-light">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <Link
            href="/orgs"
            className="font-bold text-ink-soft underline underline-offset-4"
          >
            ← All groups
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-5">
            <OrgAvatar name={org.name} logoUrl={org.logo_url} size="lg" />
            <div>
              <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
                {org.name}
              </h1>
              {org.tagline && (
                <p className="mt-2 max-w-2xl text-xl">{org.tagline}</p>
              )}
            </div>
          </div>

          {org.focus_areas.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {org.focus_areas.map((area) => (
                <FocusPill key={area} value={area} />
              ))}
            </div>
          )}
        </div>
      </section>

      <main className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-3">
        <div className="space-y-10 lg:col-span-2">
          {org.description && (
            <section aria-labelledby="about-heading">
              <h2 id="about-heading" className="text-3xl font-extrabold">
                About
              </h2>
              <p className="mt-3 whitespace-pre-line text-lg leading-relaxed">
                {org.description}
              </p>
            </section>
          )}

          {org.get_involved && (
            <section
              aria-labelledby="involved-heading"
              className="rounded-2xl bg-sunshine-light p-6 sm:p-8"
            >
              <h2 id="involved-heading" className="text-2xl font-extrabold">
                How to get involved
              </h2>
              <p className="mt-3 whitespace-pre-line text-lg leading-relaxed">
                {org.get_involved}
              </p>
            </section>
          )}

          <section aria-labelledby="events-heading">
            <h2 id="events-heading" className="text-3xl font-extrabold">
              Upcoming events
            </h2>
            <div className="mt-6 space-y-6">
              {events.length === 0 ? (
                <p className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-ink/5">
                  No upcoming events from {org.name} right now. Check back soon!
                </p>
              ) : (
                events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))
              )}
            </div>
          </section>
        </div>

        <aside className="space-y-6 lg:self-start">
          {(org.meeting_schedule || org.meeting_location) && (
            <SidebarCard title="Meetings">
              {org.meeting_schedule && (
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-ink-soft">
                    When
                  </p>
                  <p className="font-bold">{org.meeting_schedule}</p>
                </div>
              )}
              {org.meeting_location && (
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-ink-soft">
                    Where
                  </p>
                  <p className="font-bold">{org.meeting_location}</p>
                  {meetingMap && (
                    <a
                      href={meetingMap}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${linkClass} mt-1 inline-block text-sm`}
                    >
                      Get directions
                      <span className="sr-only">
                        {" "}
                        (opens Google Maps in a new tab)
                      </span>
                    </a>
                  )}
                </div>
              )}
            </SidebarCard>
          )}

          <ContactCard org={org} />

          {updateHref && (
            <section className="rounded-2xl border-2 border-dashed border-ink/20 p-5 text-sm">
              <p className="font-bold">Is this your group?</p>
              <p className="mt-1 text-ink-soft">
                To update your profile,{" "}
                <a href={updateHref} className={linkClass}>
                  email us
                </a>
                .
              </p>
            </section>
          )}
        </aside>
      </main>
    </>
  );
}

export default function OrgPage({ params }: { params: Params }) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-6xl px-4 py-16">
          <p className="text-ink-soft">Loading…</p>
        </main>
      }
    >
      <OrgContent params={params} />
    </Suspense>
  );
}
