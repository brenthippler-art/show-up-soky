import type { Metadata } from "next";
import SubmitForm from "./SubmitForm";
import { getApprovedOrgs } from "@/lib/orgs";

export const metadata: Metadata = {
  title: "Submit an Event | Show Up SOKY",
};

export default async function SubmitPage() {
  const orgs = await getApprovedOrgs();

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-4xl font-extrabold">Submit an event</h1>
      <p className="mt-3 text-lg text-ink-soft">
        Hosting something in South Central Kentucky? Share it here. We review
        every submission before it goes on the calendar.
      </p>
      <div className="mt-8 rounded-2xl bg-white p-6 shadow-md ring-1 ring-ink/5 sm:p-8">
        <SubmitForm orgs={orgs} />
      </div>
    </main>
  );
}
