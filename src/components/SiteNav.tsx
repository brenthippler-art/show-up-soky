'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const LINKS = [
  { href: '/events', label: 'Events' },
  { href: '/orgs', label: 'Groups' },
]

const CTA = { href: '/submit', label: 'Submit an event' }

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      {open ? (
        <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="18" y1="6" x2="6" y2="18" />
        </g>
      ) : (
        <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="20" y2="17" />
        </g>
      )}
    </svg>
  )
}

export default function SiteNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  const close = () => setOpen(false)

  return (
    <>
      {/* Tablet and desktop */}
      <nav aria-label="Main" className="hidden md:block">
        <ul className="flex items-center gap-4">
          {LINKS.map((link) => {
            const active = isActive(pathname, link.href)
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`rounded-full px-3 py-2 font-bold ${
                    active ? 'bg-sunshine-light' : 'hover:bg-sunshine-light'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            )
          })}
          <li>
            <Link
              href={CTA.href}
              aria-current={isActive(pathname, CTA.href) ? 'page' : undefined}
              className="rounded-full bg-sunshine px-4 py-2 font-bold shadow-sm hover:bg-sunshine-dark"
            >
              {CTA.label}
            </Link>
          </li>
        </ul>
      </nav>

      {/* Phones */}
      <div className="md:hidden">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="flex items-center gap-2 rounded-full px-4 py-2 font-bold ring-2 ring-ink hover:bg-sunshine-light"
        >
          <MenuIcon open={open} />
          {open ? 'Close' : 'Menu'}
        </button>

        <nav
          id="mobile-menu"
          aria-label="Main"
          hidden={!open}
          className="absolute inset-x-0 top-full z-50 border-b-4 border-sunshine bg-white shadow-lg"
        >
          <ul className="mx-auto max-w-6xl space-y-1 px-4 py-4">
            {[...LINKS, { href: '/register', label: 'Register your group' }].map((link) => {
              const active = isActive(pathname, link.href)
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={close}
                    aria-current={active ? 'page' : undefined}
                    className={`block rounded-xl px-4 py-3 text-lg font-bold ${
                      active ? 'bg-sunshine-light' : 'hover:bg-sunshine-light'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
            <li className="pt-2">
              <Link
                href={CTA.href}
                onClick={close}
                className="block rounded-full bg-sunshine px-4 py-3 text-center text-lg font-bold shadow-sm hover:bg-sunshine-dark"
              >
                {CTA.label}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  )
}