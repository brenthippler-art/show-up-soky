"use client";

import { useActionState } from "react";
import { subscribe, type SubscribeState } from "@/app/subscribe/actions";

const initialState: SubscribeState = { status: "idle" };

export default function SignupForm() {
  const [state, formAction, isPending] = useActionState(
    subscribe,
    initialState,
  );

  if (state.status === "success") {
    return (
      <p role="status" className="rounded-xl bg-meadow-light p-4 font-bold">
        {state.message ?? "Thanks!"}
      </p>
    );
  }

  return (
    <div className="@container">
      <form action={formAction} className="flex flex-col gap-3 @md:flex-row">
        <div aria-hidden="true" className="hidden">
          <label htmlFor="company">Company</label>
          <input
            id="company"
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <label htmlFor="signup-email" className="sr-only">
          Email address
        </label>
        <input
          id="signup-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          aria-describedby={
            state.status === "error" ? "signup-error" : undefined
          }
          className="flex-1 rounded-full border-2 border-ink-soft bg-white px-5 py-3 text-ink"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-ink px-6 py-3 font-bold text-cream shadow-md hover:bg-ink-soft disabled:opacity-60"
        >
          {isPending ? "Signing up…" : "Get the weekly list"}
        </button>

        {state.status === "error" && (
          <p
            id="signup-error"
            role="alert"
            className="text-sm font-bold text-red-700 @md:basis-full"
          >
            {state.message}
          </p>
        )}
      </form>
    </div>
  );
}
