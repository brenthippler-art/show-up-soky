"use client";

import { useActionState, useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import { FOCUS_AREAS } from "@/lib/focus-area";
import { registerOrg, type RegisterState } from "./actions";

const initialState: RegisterState = { status: "idle" };

const inputClass =
  "mt-1 w-full rounded-xl border-2 border-ink-soft bg-white px-4 py-3 text-ink placeholder:text-ink-soft/60 focus:border-sky";

type FieldProps = {
  id: string;
  label: string;
  required?: boolean;
  help?: string;
  error?: string;
  defaultValue?: string;
  type?: string;
  placeholder?: string;
  multiline?: boolean;
  maxLength?: number;
};

function Field({
  id,
  label,
  required,
  help,
  error,
  defaultValue,
  type = "text",
  placeholder,
  multiline,
  maxLength,
}: FieldProps) {
  const describedBy =
    [help && `${id}-help`, error && `${id}-error`].filter(Boolean).join(" ") ||
    undefined;
  const shared = {
    id,
    name: id,
    defaultValue,
    placeholder,
    maxLength,
    required,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    className: inputClass,
  };

  return (
    <div>
      <label htmlFor={id} className="block font-bold">
        {label} {required && <span aria-hidden="true">*</span>}
      </label>
      {help && (
        <p id={`${id}-help`} className="mt-1 text-sm text-ink-soft">
          {help}
        </p>
      )}
      {multiline ? (
        <textarea rows={4} {...shared} />
      ) : (
        <input type={type} {...shared} />
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm font-bold text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

function RegisterFormInner({ onReset }: { onReset: () => void }) {
  const [state, formAction, isPending] = useActionState(
    registerOrg,
    initialState,
  );
  const v = state.values ?? {};
  const e = state.errors ?? {};
  const [focus, setFocus] = useState(v.focus_area ?? "");

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="rounded-2xl border-2 border-meadow bg-meadow-light p-8"
      >
        <h2 className="text-2xl font-extrabold">Thanks for registering! 🎉</h2>
        <p className="mt-2">
          We’ll review your group’s profile and reach out if we have questions.
          Once it’s approved, it will appear in the Groups directory.
        </p>
        <button
          type="button"
          onClick={onReset}
          className="mt-6 rounded-full bg-white px-6 py-2 font-bold ring-2 ring-ink hover:bg-sunshine-light"
        >
          Register another group
        </button>
      </div>
    );
  }

  const sectionClass =
    "space-y-5 rounded-2xl bg-white p-6 shadow-md ring-1 ring-ink/5 sm:p-8";
  const legendClass =
    "float-left mb-4 w-full font-display text-2xl font-extrabold";

  return (
    <form action={formAction} className="space-y-8" noValidate>
      {state.status === "error" && state.message && (
        <p
          role="alert"
          className="rounded-xl border-2 border-berry bg-berry-light p-4 font-bold"
        >
          {state.message}
        </p>
      )}

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

      <fieldset className={sectionClass}>
        <legend className={legendClass}>About your group</legend>
        <Field
          id="name"
          label="Group name"
          required
          defaultValue={v.name}
          error={e.name}
        />
        <Field
          id="tagline"
          label="Tagline"
          required
          maxLength={140}
          help="One sentence about what you do. Up to 140 characters."
          placeholder="Neighbors organizing for fair housing in Warren County"
          defaultValue={v.tagline}
          error={e.tagline}
        />
        <Field
          id="description"
          label="About"
          required
          multiline
          help="Who you are, what you work on and why."
          defaultValue={v.description}
          error={e.description}
        />

        <fieldset
          aria-describedby={e.focus_area ? "focus_area-error" : undefined}
        >
          <legend className="font-bold">
            Main focus area <span aria-hidden="true">*</span>
          </legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {FOCUS_AREAS.map((area) => (
              <label
                key={area.value}
                className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 ring-1 ring-ink/15 has-[:checked]:bg-sunshine-light has-[:checked]:ring-2 has-[:checked]:ring-ink"
              >
                <input
                  type="radio"
                  name="focus_area"
                  value={area.value}
                  defaultChecked={v.focus_area === area.value}
                  onChange={() => setFocus(area.value)}
                  required
                  className="h-4 w-4"
                />
                {area.label}
              </label>
            ))}
          </div>
          {e.focus_area && (
            <p
              id="focus_area-error"
              className="mt-1 text-sm font-bold text-red-700"
            >
              {e.focus_area}
            </p>
          )}

          {focus === "other" && (
            <div className="mt-4">
              <Field
                id="focus_area_other"
                label="Describe your focus"
                required
                maxLength={40}
                help="A few words, like “Food justice” or “Veterans’ rights.” Up to 40 characters."
                defaultValue={v.focus_area_other}
                error={e.focus_area_other}
              />
            </div>
          )}
        </fieldset>

        <ImageUpload
          id="logo"
          name="logo_url"
          label="Logo"
          bucket="org-logos"
          folder="submissions"
          help="Optional. JPG, PNG or WebP, up to 2 MB. Square images look best."
        />
      </fieldset>

      <fieldset className={sectionClass}>
        <legend className={legendClass}>Meetings</legend>
        <Field
          id="meeting_schedule"
          label="When do you meet?"
          placeholder="2nd Tuesday of every month, 6:30 PM"
          defaultValue={v.meeting_schedule}
        />
        <Field
          id="meeting_location"
          label="Where do you meet?"
          placeholder="Warren County Public Library, Kentucky St."
          defaultValue={v.meeting_location}
        />
        <Field
          id="get_involved"
          label="How can people get involved?"
          multiline
          placeholder="Come to any meeting, no experience needed!"
          defaultValue={v.get_involved}
        />
      </fieldset>

      <fieldset className={sectionClass}>
        <legend className={legendClass}>Public contact info</legend>
        <p className="text-sm text-ink-soft">
          This will be shown on your group’s page.
        </p>
        <Field
          id="public_email"
          label="Contact email"
          type="email"
          required
          defaultValue={v.public_email}
          error={e.public_email}
        />
        <Field id="phone" label="Phone" type="tel" defaultValue={v.phone} />
        <Field
          id="website_url"
          label="Website"
          type="url"
          placeholder="https://"
          defaultValue={v.website_url}
          error={e.website_url}
        />
        <Field
          id="facebook_url"
          label="Facebook page"
          type="url"
          placeholder="https://facebook.com/..."
          defaultValue={v.facebook_url}
          error={e.facebook_url}
        />
        <Field
          id="instagram_url"
          label="Instagram"
          type="url"
          placeholder="https://instagram.com/..."
          defaultValue={v.instagram_url}
          error={e.instagram_url}
        />
      </fieldset>

      <fieldset className={sectionClass}>
        <legend className={legendClass}>Your info (private)</legend>
        <p className="text-sm text-ink-soft">
          Only used to verify your group and follow up. Never shown publicly.
        </p>
        <Field
          id="organizer_name"
          label="Your name"
          required
          defaultValue={v.organizer_name}
          error={e.organizer_name}
        />
        <Field
          id="organizer_email"
          label="Your email"
          type="email"
          required
          defaultValue={v.organizer_email}
          error={e.organizer_email}
        />
      </fieldset>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-sunshine px-8 py-3 text-lg font-bold shadow-md hover:bg-sunshine-dark disabled:opacity-60"
      >
        {isPending ? "Submitting…" : "Register our group"}
      </button>
    </form>
  );
}

export default function RegisterForm() {
  const [formKey, setFormKey] = useState(0);
  return (
    <RegisterFormInner key={formKey} onReset={() => setFormKey((k) => k + 1)} />
  );
}
