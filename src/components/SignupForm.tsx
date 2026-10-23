'use client'

import { useActionState } from 'react'
import { subscribe, type SubscribeState } from '@/app/subscribe/actions'

const initialState: SubscribeState = { status: 'idle' }

export default function SignupForm({ idPrefix = 'signup' }: { idPrefix?: string }) {
  const [state, formAction, isPending] = useActionState(subscribe, initialState)

  const emailId = `${idPrefix}-email`
  const errorId = `${idPrefix}-error`
  const honeypotId = `${idPrefix}-company`

  if (state.status === 'success') {
    return (
      <p role="status" className="rounded-xl bg-meadow-light p-4 font-bold text-ink">
        {state.message ?? 'Thanks!'}
      </p>
    )
  }

  return (
    <div className="@container">
      <form action={formAction} className="flex flex-col gap-3 @md:flex-row @md:flex-wrap">
        <div aria-hidden="true" className="hidden">
          <label htmlFor={honeypotId}>Company</label>
          <input id={honeypotId} name="company" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <label htmlFor={emailId} className="sr-only">Email address</label>
        <input
          id={emailId}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          aria-describedby={state.status === 'error' ? errorId : undefined}
          className="flex-1 rounded-full border-2 border-ink-soft bg-white px-5 py-3 text-ink"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-ink px-6 py-3 font-bold text-cream shadow-md hover:bg-ink-soft disabled:opacity-60"
        >
          {isPending ? 'Signing up…' : 'Get the weekly list'}
        </button>

        {state.status === 'error' && (
          <p id={errorId} role="alert" className="text-sm font-bold text-red-700 @md:basis-full">
            {state.message}
          </p>
        )}
      </form>
    </div>
  )
}