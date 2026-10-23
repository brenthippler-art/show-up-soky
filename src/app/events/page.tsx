import { Suspense } from "react";
import { connection } from "next/server";
import EventsPanel from "@/components/events/EventsPanel";
import FilterBar from "@/components/events/FilterBar";
import MonthCalendar from "@/components/events/MonthCalendar";
import QuickPicks, { type QuickSection } from "@/components/events/QuickPicks";
import {
  hasFilters,
  eventsHref,
  type Filters,
  type HrefParams,
  type Selection,
} from "@/components/events/links";
import { getUpcomingEvents } from "@/lib/events";
import { addDays, dayKey, isDayKey, isMonthKey, todayKey } from "@/lib/dates";
import { isEventType } from "@/lib/event-types";
import type { Event } from "@/types/event";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events | Show Up SOKY",
  description:
    "Upcoming rallies, meetings, trainings and volunteer days across South Central Kentucky.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function groupByDay(events: Event[]) {
  const map = new Map<string, Event[]>();
  for (const event of events) {
    const key = dayKey(event.starts_at);
    const list = map.get(key) ?? [];
    list.push(event);
    map.set(key, list);
  }
  return map;
}

async function HomeContent({ searchParams }: { searchParams: SearchParams }) {
  await connection();
  const params = await searchParams;

  let allEvents: Event[];
  try {
    allEvents = await getUpcomingEvents();
  } catch (error) {
    console.error(error);
    return (
      <p className="rounded-2xl bg-berry-light p-6 font-bold">
        Couldn&apos;t load events right now. Please try again in a moment.
      </p>
    );
  }

  // ---------- Filters ----------
  const typeParam = one(params.type);
  const filters: Filters = {
    type: isEventType(typeParam) ? typeParam : undefined,
    free: one(params.free) === "1",
    online: one(params.online) === "1",
  };
  const filtered = hasFilters(filters);

  const events = allEvents.filter(
    (event) =>
      (!filters.type || event.event_type === filters.type) &&
      (!filters.free || event.is_free) &&
      (!filters.online || event.is_online),
  );

  // Every homepage link keeps the current filters
  const href = (p: HrefParams) => eventsHref({ ...p, ...filters });

  // ---------- Dates ----------
  const today = todayKey();
  const tomorrow = addDays(today, 1);
  const weekKeys = Array.from({ length: 7 }, (_, i) => addDays(today, i));

  const byDay = groupByDay(events);
  const sortedDays = [...byDay.keys()].sort();
  const counts = Object.fromEntries(
    [...byDay].map(([key, list]) => [key, list.length]),
  );

  // ---------- Selection ----------
  const dateParam = one(params.date);
  let selection: Selection;

  if (one(params.view) === "week") {
    selection = { kind: "week" };
  } else if (isDayKey(dateParam)) {
    selection = { kind: "day", key: dateParam };
  } else {
    const firstWithEvents = byDay.has(today)
      ? today
      : sortedDays.find((key) => key >= today);
    selection =
      firstWithEvents && firstWithEvents !== today
        ? { kind: "day", key: firstWithEvents, fallbackFrom: today }
        : { kind: "day", key: today };
  }

  const selectedKey = selection.kind === "day" ? selection.key : null;
  const explicitDate =
    selection.kind === "day" && !selection.fallbackFrom
      ? selection.key
      : undefined;

  const monthParam = one(params.month);
  const month = isMonthKey(monthParam)
    ? monthParam
    : (selectedKey ?? today).slice(0, 7);

  const keepParams: { date?: string; view?: "week" } =
    selection.kind === "week" ? { view: "week" } : { date: explicitDate };

  const sections: QuickSection[] = [
    {
      id: "today",
      label: "Today",
      href: href({ date: today }),
      active: selectedKey === today,
      events: byDay.get(today) ?? [],
    },
    {
      id: "tomorrow",
      label: "Tomorrow",
      href: href({ date: tomorrow }),
      active: selectedKey === tomorrow,
      events: byDay.get(tomorrow) ?? [],
    },
    {
      id: "week",
      label: "This Week",
      href: href({ view: "week" }),
      active: selection.kind === "week",
      events: weekKeys.flatMap((key) => byDay.get(key) ?? []),
    },
  ];

  const calendar = (
    <MonthCalendar
      month={month}
      today={today}
      selectedKey={selectedKey}
      counts={counts}
      keepParams={keepParams}
      href={href}
    />
  );

  return (
    <>
      <FilterBar
        filters={filters}
        keep={{
          ...keepParams,
          month: isMonthKey(monthParam) ? monthParam : undefined,
        }}
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-3 lg:items-start">
        <aside aria-label="Choose dates" className="space-y-4">
          <QuickPicks sections={sections} />

          <details className="rounded-2xl bg-white shadow-sm ring-1 ring-ink/5 lg:hidden">
            <summary className="cursor-pointer px-5 py-3 font-bold">
              Pick a date
            </summary>
            <div className="px-2 pb-2">{calendar}</div>
          </details>

          <div className="hidden lg:block">{calendar}</div>
        </aside>

        <div id="events" className="scroll-mt-6 lg:col-span-2">
          <EventsPanel
            selection={selection}
            today={today}
            byDay={byDay}
            sortedDays={sortedDays}
            weekKeys={weekKeys}
            href={href}
            filtered={filtered}
            clearHref={eventsHref(keepParams)}
          />
        </div>
      </div>
    </>
  );
}

export default function EventsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <>
      <section className="bg-linear-to-br from-sunshine-light via-cream to-tangerine-light">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
            Upcoming events
          </h1>
          <p className="mt-2 max-w-2xl text-lg text-ink-soft">
            Pick a day, the week ahead, or filter by what you care about.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <Suspense
          fallback={
            <p className="text-lg font-bold text-ink-soft">Loading events…</p>
          }
        >
          <HomeContent searchParams={searchParams} />
        </Suspense>
      </main>
    </>
  );
}
