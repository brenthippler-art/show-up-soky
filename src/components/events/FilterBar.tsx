import Link from "next/link";
import { EVENT_TYPE_ORDER, EVENT_TYPE_STYLES } from "@/lib/event-types";
import { hasFilters, eventsHref, type Filters, type HrefParams } from "./links";

type Props = { filters: Filters; keep: HrefParams };

function chipClass(active: boolean) {
  return `inline-flex items-center rounded-full px-3 py-1 text-sm font-bold ring-2 ${
    active
      ? "bg-ink text-cream ring-ink"
      : "bg-white ring-ink/20 hover:ring-ink"
  }`;
}

export default function FilterBar({ filters, keep }: Props) {
  const link = (next: Filters) => eventsHref({ ...keep, ...next });

  return (
    <nav
      aria-label="Filter events"
      className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-ink/5"
    >
      <div role="group" aria-labelledby="filter-type-label">
        <p
          id="filter-type-label"
          className="text-sm font-bold uppercase tracking-wide text-ink-soft"
        >
          Filter by type:
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Link
            href={link({ ...filters, type: undefined })}
            scroll={false}
            aria-current={!filters.type ? "true" : undefined}
            className={chipClass(!filters.type)}
          >
            All
          </Link>
          {EVENT_TYPE_ORDER.map((type) => {
            const active = filters.type === type;
            return (
              <Link
                key={type}
                href={link({ ...filters, type: active ? undefined : type })}
                scroll={false}
                aria-current={active ? "true" : undefined}
                className={chipClass(active)}
              >
                <span
                  aria-hidden="true"
                  className={`mr-1.5 inline-block h-2.5 w-2.5 rounded-full ${EVENT_TYPE_STYLES[type].bar}`}
                />
                {EVENT_TYPE_STYLES[type].label}
              </Link>
            );
          })}
        </div>
      </div>

      <div role="group" aria-labelledby="filter-show-label" className="mt-4">
        <p
          id="filter-show-label"
          className="text-sm font-bold uppercase tracking-wide text-ink-soft"
        >
          Show:
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Link
            href={link({ ...filters, free: !filters.free })}
            scroll={false}
            aria-current={filters.free ? "true" : undefined}
            className={chipClass(!!filters.free)}
          >
            {filters.free && (
              <span aria-hidden="true" className="mr-1">
                ✓
              </span>
            )}
            Free only
          </Link>
          <Link
            href={link({ ...filters, online: !filters.online })}
            scroll={false}
            aria-current={filters.online ? "true" : undefined}
            className={chipClass(!!filters.online)}
          >
            {filters.online && (
              <span aria-hidden="true" className="mr-1">
                ✓
              </span>
            )}
            Online only
          </Link>

          {hasFilters(filters) && (
            <Link
              href={link({})}
              scroll={false}
              className="ml-auto text-sm font-bold underline underline-offset-4"
            >
              Clear filters
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
