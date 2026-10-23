'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/admin', label: 'Review queue' },
  { href: '/admin/events', label: 'Events' },
  { href: '/admin/orgs', label: 'Groups' },
]

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <nav aria-label="Admin" className="mb-8">
      <ul className="flex flex-wrap gap-2">
        {links.map((link) => {
          const active =
            link.href === '/admin' ? pathname === '/admin' : pathname.startsWith(link.href)
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={`rounded-full px-4 py-2 font-bold ${
                  active ? 'bg-ink text-cream' : 'ring-2 ring-ink hover:bg-sunshine-light'
                }`}
              >
                {link.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}