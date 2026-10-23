import Link from 'next/link'
import { Suspense } from 'react'
import SiteNav from '@/components/SiteNav'
import SunMark from '@/components/SunMark'
import { NAV_CTA, NAV_LINKS } from '@/lib/nav'

function NavFallback() {
  return (
    <>
      <nav aria-label="Main" className="hidden md:block">
        <ul className="flex items-center gap-4">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="rounded-full px-3 py-2 font-bold hover:bg-sunshine-light">
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href={NAV_CTA.href}
              className="rounded-full bg-sunshine px-4 py-2 font-bold shadow-sm hover:bg-sunshine-dark"
            >
              {NAV_CTA.label}
            </Link>
          </li>
        </ul>
      </nav>
      <span
        aria-hidden="true"
        className="invisible rounded-full px-4 py-2 font-bold ring-2 ring-ink md:hidden"
      >
        Menu
      </span>
    </>
  )
}

export default function Header() {
  return (
    <header className="relative border-b-4 border-sunshine bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="sun-logo flex items-center gap-2">
          <SunMark size={36} animated />
          <span className="font-display text-2xl font-extrabold tracking-tight">
            Show Up <span className="text-tangerine">SOKY</span>
          </span>
        </Link>
        <Suspense fallback={<NavFallback />}>
          <SiteNav />
        </Suspense>
      </div>
    </header>
  )
}