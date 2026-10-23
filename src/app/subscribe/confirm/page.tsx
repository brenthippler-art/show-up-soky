import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { confirmSubscription } from '../actions'

export const metadata: Metadata = {
  title: 'Confirm Subscription | Show Up SOKY',
  robots: { index: false },
}

type Params = Promise<{ token?: string; status?: string }>

async function ConfirmContent({ searchParams }: { searchParams: Params }) {
  const { token, status } = await searchParams

  if (status === 'confirmed') {
    return (
      <>
        <h1 className="text-4xl font-extrabold">You’re in! ☀️</h1>
        <p className="mt-3 text-lg text-ink-soft">
          Look for your first list of events next Monday morning.
        </p>
        <Link href="/" className="mt-6 inline-block rounded-full bg-sunshine px-6 py-3 font-bold shadow-md hover:bg-sunshine-dark">
          See upcoming events
        </Link>
      </>
    )
  }

  if (status === 'invalid' || !token) {
    return (
      <>
        <h1 className="text-3xl font-extrabold">That link didn’t work</h1>
        <p className="mt-3 text-lg text-ink-soft">
          It may have expired or already been used. You can sign up again from the homepage.
        </p>
        <Link href="/" className="mt-6 inline-block font-bold underline underline-offset-4">
          Back to the homepage
        </Link>
      </>
    )
  }

  return (
    <>
      <h1 className="text-3xl font-extrabold">One last step</h1>
      <p className="mt-3 text-lg text-ink-soft">
        Click below to confirm you want the weekly Show Up SOKY email.
      </p>
      <form action={confirmSubscription} className="mt-6">
        <input type="hidden" name="token" value={token} />
        <button className="rounded-full bg-sunshine px-6 py-3 text-lg font-bold shadow-md hover:bg-sunshine-dark">
          Confirm my subscription
        </button>
      </form>
    </>
  )
}

export default function ConfirmPage({ searchParams }: { searchParams: Params }) {
  return (
    <main className="mx-auto max-w-xl px-4 py-16">
      <Suspense fallback={<p className="text-ink-soft">Loading…</p>}>
        <ConfirmContent searchParams={searchParams} />
      </Suspense>
    </main>
  )
}