import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { unsubscribe } from '../subscribe/actions'

export const metadata: Metadata = {
  title: 'Unsubscribe | Show Up SOKY',
  robots: { index: false },
}

type Params = Promise<{ token?: string; status?: string }>

async function UnsubscribeContent({ searchParams }: { searchParams: Params }) {
  const { token, status } = await searchParams

  if (status === 'done') {
    return (
      <>
        <h1 className="text-3xl font-extrabold">You’ve been unsubscribed</h1>
        <p className="mt-3 text-lg text-ink-soft">
          We’ve removed your email. You can always check the calendar anytime.
        </p>
        <Link href="/" className="mt-6 inline-block font-bold underline underline-offset-4">
          Back to the homepage
        </Link>
      </>
    )
  }

  if (status === 'invalid' || !token) {
    return (
      <>
        <h1 className="text-3xl font-extrabold">That link didn’t work</h1>
        <p className="mt-3 text-lg text-ink-soft">
          You may already be unsubscribed. If you’re still getting emails, reply to one and
          we’ll remove you.
        </p>
      </>
    )
  }

  return (
    <>
      <h1 className="text-3xl font-extrabold">Unsubscribe from Show Up SOKY?</h1>
      <p className="mt-3 text-lg text-ink-soft">
        You’ll stop getting the weekly events email.
      </p>
      <form action={unsubscribe} className="mt-6">
        <input type="hidden" name="token" value={token} />
        <button className="rounded-full bg-white px-6 py-3 font-bold ring-2 ring-ink hover:bg-berry-light">
          Yes, unsubscribe me
        </button>
      </form>
    </>
  )
}

export default function UnsubscribePage({ searchParams }: { searchParams: Params }) {
  return (
    <main className="mx-auto max-w-xl px-4 py-16">
      <Suspense fallback={<p className="text-ink-soft">Loading…</p>}>
        <UnsubscribeContent searchParams={searchParams} />
      </Suspense>
    </main>
  )
}