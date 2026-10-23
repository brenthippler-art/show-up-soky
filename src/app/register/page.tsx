import type { Metadata } from 'next'
import RegisterForm from './RegisterForm'

export const metadata: Metadata = {
  title: 'Register Your Group | Show Up SOKY',
  description: 'Add your organization to the Show Up SOKY directory.',
}

export default function RegisterPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-4xl font-extrabold">Register your group</h1>
      <p className="mt-3 text-lg text-ink-soft">
        Get your organization listed in the Show Up SOKY directory so neighbors can find you, learn
        when you meet and get involved. We review every registration before it goes live.
      </p>
      <div className="mt-8">
        <RegisterForm />
      </div>
    </main>
  )
}