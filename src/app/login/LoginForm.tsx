"use client";

import { useActionState } from "react";
import { signIn, type LoginState } from "./actions";

const inputClass =
  "mt-1 w-full rounded-xl border-2 border-ink-soft bg-white px-4 py-3 text-ink focus:border-sky";

export default function LoginForm({ notAdmin }: { notAdmin: boolean }) {
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    signIn,
    {},
  );

  return (
    <form action={formAction} className="space-y-5">
      {(state.error || notAdmin) && (
        <p
          role="alert"
          className="rounded-xl border-2 border-berry bg-berry-light p-4 font-bold"
        >
          {state.error ?? "That account doesn’t have admin access."}
        </p>
      )}

      <div>
        <label htmlFor="email" className="block font-bold">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="password" className="block font-bold">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-sunshine px-6 py-3 text-lg font-bold shadow-md hover:bg-sunshine-dark disabled:opacity-60"
      >
        {isPending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
