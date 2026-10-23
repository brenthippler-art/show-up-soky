"use client";

import { useActionState, useState } from "react";
import { submitEvent, type SubmitState } from "./actions";
import type { OrgOption } from "@/lib/orgs";
import ImageUpload from "@/components/ImageUpload";

const initialState: SubmitState = { status: "idle" };

const inputClass =
  "mt-1 w-full rounded-xl border-2 border-ink-soft bg-white px-4 py-3 text-ink placeholder:text-ink-soft/60 focus:border-sky";
const labelClass = "block font-bold";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1 text-sm text-red-700">
      {message}
    </p>
  );
}

function SubmitFormInner({
  orgs,
  onReset,
}: {
  orgs: OrgOption[];
  onReset: () => void;
}) {
  const [state, formAction, isPending] = useActionState(
    submitEvent,
    initialState,
  );
  const v = state.values ?? {};
  const e = state.errors ?? {};

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="rounded-2xl border-2 border-meadow bg-meadow-light p-8"
      >
        <h2 className="text-2xl font-extrabold">
          Thank you for showing up! 🎉
        </h2>
        <p className="mt-2">
          Your event was submitted. We’ll review it shortly, and once it’s
          approved it’ll appear on the calendar.
        </p>
        <button
          type="button"
          onClick={onReset}
          className="mt-6 rounded-full bg-white px-6 py-2 font-bold ring-2 ring-ink hover:bg-sunshine-light"
        >
          Submit another event
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6" noValidate>
      {state.status === "error" && state.message && (
        <p
          role="alert"
          className="rounded border border-red-300 bg-red-50 p-3 text-red-800"
        >
          {state.message}
        </p>
      )}

      {/* Honeypot: hidden from people and screen readers */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div>
        <label htmlFor="title" className={labelClass}>
          Event title *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={v.title}
          aria-invalid={!!e.title}
          aria-describedby={e.title ? "title-error" : undefined}
          className={inputClass}
        />
        <FieldError id="title-error" message={e.title} />
      </div>

      <div>
        <label htmlFor="event_type" className={labelClass}>
          Type of event *
        </label>
        <select
          id="event_type"
          name="event_type"
          required
          defaultValue={v.event_type ?? ""}
          aria-invalid={!!e.event_type}
          aria-describedby={e.event_type ? "event_type-error" : undefined}
          className={inputClass}
        >
          <option value="" disabled>
            Choose one
          </option>
          <option value="rally">Rally / March</option>
          <option value="meeting">Meeting</option>
          <option value="volunteer">Volunteer</option>
          <option value="town_hall">Town Hall</option>
          <option value="training">Training / Workshop</option>
          <option value="social">Social</option>
          <option value="other">Other</option>
        </select>
        <FieldError id="event_type-error" message={e.event_type} />
      </div>

      <fieldset>
        <legend className={labelClass}>Hosting group *</legend>
        <label htmlFor="org_id" className="mt-1 block text-sm text-gray-600">
          Choose from the list
        </label>
        <select
          id="org_id"
          name="org_id"
          defaultValue={v.org_id ?? ""}
          aria-describedby={e.org ? "org-error" : undefined}
          className={inputClass}
        >
          <option value="">Not listed</option>
          {orgs.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
        <label
          htmlFor="submitted_org_name"
          className="mt-3 block text-sm text-gray-600"
        >
          Not listed? Type your group’s name
        </label>
        <input
          id="submitted_org_name"
          name="submitted_org_name"
          type="text"
          defaultValue={v.submitted_org_name}
          aria-describedby={e.org ? "org-error" : undefined}
          className={inputClass}
        />
        <FieldError id="org-error" message={e.org} />
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="starts_at" className={labelClass}>
            Starts *
          </label>
          <input
            id="starts_at"
            name="starts_at"
            type="datetime-local"
            required
            defaultValue={v.starts_at}
            aria-invalid={!!e.starts_at}
            aria-describedby={e.starts_at ? "starts_at-error" : undefined}
            className={inputClass}
          />
          <FieldError id="starts_at-error" message={e.starts_at} />
        </div>
        <div>
          <label htmlFor="ends_at" className={labelClass}>
            Ends
          </label>
          <input
            id="ends_at"
            name="ends_at"
            type="datetime-local"
            defaultValue={v.ends_at}
            aria-invalid={!!e.ends_at}
            aria-describedby={e.ends_at ? "ends_at-error" : undefined}
            className={inputClass}
          />
          <FieldError id="ends_at-error" message={e.ends_at} />
        </div>
      </div>
      <p className="-mt-4 text-sm text-gray-600">All times are Central Time.</p>

      <div>
        <label htmlFor="location_name" className={labelClass}>
          Location
        </label>
        <input
          id="location_name"
          name="location_name"
          type="text"
          placeholder="e.g. Warren County Public Library"
          defaultValue={v.location_name}
          aria-invalid={!!e.location_name}
          aria-describedby={e.location_name ? "location_name-error" : undefined}
          className={inputClass}
        />
        <FieldError id="location_name-error" message={e.location_name} />
      </div>

      <div>
        <label htmlFor="address" className={labelClass}>
          Address
        </label>
        <input
          id="address"
          name="address"
          type="text"
          defaultValue={v.address}
          className={inputClass}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="is_online"
          name="is_online"
          type="checkbox"
          className="h-4 w-4"
        />
        <label htmlFor="is_online">This is an online event</label>
      </div>

      <div>
        <label htmlFor="online_url" className={labelClass}>
          Online link (Zoom, etc.)
        </label>
        <input
          id="online_url"
          name="online_url"
          type="url"
          placeholder="https://"
          defaultValue={v.online_url}
          aria-invalid={!!e.online_url}
          aria-describedby={e.online_url ? "online_url-error" : undefined}
          className={inputClass}
        />
        <FieldError id="online_url-error" message={e.online_url} />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="is_free"
          name="is_free"
          type="checkbox"
          defaultChecked
          className="h-4 w-4"
        />
        <label htmlFor="is_free">Free to attend</label>
      </div>

      <div>
        <label htmlFor="rsvp_url" className={labelClass}>
          RSVP or info link
        </label>
        <input
          id="rsvp_url"
          name="rsvp_url"
          type="url"
          placeholder="https://"
          defaultValue={v.rsvp_url}
          aria-invalid={!!e.rsvp_url}
          aria-describedby={e.rsvp_url ? "rsvp_url-error" : undefined}
          className={inputClass}
        />
        <FieldError id="rsvp_url-error" message={e.rsvp_url} />
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          defaultValue={v.description}
          className={inputClass}
        />
      </div>
      <ImageUpload
        id="image"
        name="image_url"
        label="Flyer or image"
        bucket="event-images"
        folder="submissions"
        help="Optional. JPG, PNG, WebP or GIF, up to 5 MB."
      />
      <div>
        <label htmlFor="submitted_by_email" className={labelClass}>
          Your email *
        </label>
        <input
          id="submitted_by_email"
          name="submitted_by_email"
          type="email"
          required
          autoComplete="email"
          defaultValue={v.submitted_by_email}
          aria-invalid={!!e.submitted_by_email}
          aria-describedby="email-help email-error"
          className={inputClass}
        />
        <p id="email-help" className="mt-1 text-sm text-gray-600">
          Only used if we have questions. Never shown publicly.
        </p>
        <FieldError id="email-error" message={e.submitted_by_email} />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-sunshine px-8 py-3 text-lg font-bold shadow-md hover:bg-sunshine-dark disabled:opacity-60"
      >
        {isPending ? "Submitting…" : "Submit event"}
      </button>
    </form>
  );
}

export default function SubmitForm({ orgs }: { orgs: OrgOption[] }) {
  const [formKey, setFormKey] = useState(0);

  return (
    <SubmitFormInner
      key={formKey}
      orgs={orgs}
      onReset={() => setFormKey((k) => k + 1)}
    />
  );
}
