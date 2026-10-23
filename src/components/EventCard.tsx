import Link from "next/link";
import Image from "next/image";
import type { Event, EventType } from "@/types/event";
import { formatDate } from "@/lib/format";
import OrgAvatar from "@/components/OrgAvatar";

const typeStyles: Record<
  EventType,
  { label: string; bar: string; pill: string }
> = {
  rally: { label: "Rally", bar: "bg-berry", pill: "bg-berry-light" },
  meeting: { label: "Meeting", bar: "bg-sky", pill: "bg-sky-light" },
  volunteer: { label: "Volunteer", bar: "bg-meadow", pill: "bg-meadow-light" },
  town_hall: {
    label: "Town Hall",
    bar: "bg-tangerine",
    pill: "bg-tangerine-light",
  },
  training: {
    label: "Training",
    bar: "bg-sunshine",
    pill: "bg-sunshine-light",
  },
  social: { label: "Social", bar: "bg-berry", pill: "bg-berry-light" },
  other: { label: "Event", bar: "bg-sky", pill: "bg-sky-light" },
};

export default function EventCard({ event }: { event: Event }) {
  const style = typeStyles[event.event_type];

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-ink/5 transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className={`h-2 ${style.bar}`} />
      {event.image_url && (
        <a
          href={event.image_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-sunshine-light"
        >
          <Image
            src={event.image_url}
            alt={`Flyer for ${event.title}`}
            width={800}
            height={1000}
            sizes="(max-width: 768px) 100vw, 768px"
            className="mx-auto h-auto max-h-96 w-auto object-contain"
          />
          <span className="sr-only"> (opens full size in a new tab)</span>
        </a>
      )}
      <div className="p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-sm font-bold ${style.pill}`}
          >
            {style.label}
          </span>
          {event.is_free && (
            <span className="rounded-full bg-meadow-light px-3 py-1 text-sm font-bold">
              Free
            </span>
          )}
          {event.is_online && (
            <span className="rounded-full bg-sky-light px-3 py-1 text-sm font-bold">
              Online
            </span>
          )}
        </div>

        <h2 className="mt-3 text-2xl font-extrabold leading-tight">
          {event.title}
        </h2>

        <p className="mt-2 font-bold text-ink-soft">
          <time dateTime={event.starts_at}>{formatDate(event.starts_at)}</time>
        </p>

        {event.location_name && (
          <p className="mt-1 text-ink-soft">
            {event.location_name}
            {event.address && (
              <span className="block text-sm">{event.address}</span>
            )}
          </p>
        )}

        {event.description && (
          <p className="mt-4 leading-relaxed">{event.description}</p>
        )}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          {event.organizations ? (
            <p className="flex items-center gap-2 text-sm text-ink-soft">
              <OrgAvatar
                name={event.organizations.name}
                logoUrl={event.organizations.logo_url}
                size="sm"
              />
              <span>
                Hosted by{" "}
                <Link
                  href={`/orgs/${event.organizations.slug}`}
                  className="font-bold text-ink underline decoration-sunshine-dark decoration-2 underline-offset-4 hover:decoration-ink"
                >
                  {event.organizations.name}
                </Link>
              </span>
            </p>
          ) : (
            <span />
          )}

          {event.rsvp_url && (
            <a
              href={event.rsvp_url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-sunshine px-5 py-2 font-bold shadow-sm hover:bg-sunshine-dark"
            >
              RSVP
              <span className="sr-only">
                {" "}
                for {event.title} (opens in a new tab)
              </span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
