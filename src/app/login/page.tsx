import type { Metadata } from 'next'
import { Suspense } from 'react'
import LoginForm from './LoginForm'

export const metadata: Metadata = {
  title: 'Admin Sign In | Show Up SOKY',
  robots: { index: false },
}

async function LoginFormWithParams({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  return <LoginForm notAdmin={error === 'not-admin'} />
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-extrabold">Admin sign in</h1>
      <div className="mt-8 rounded-2xl bg-white p-6 shadow-md ring-1 ring-ink/5 sm:p-8">
        <Suspense fallback={<p className="text-ink-soft">Loading…</p>}>
          <LoginFormWithParams searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  )
}