import Link from "next/link";

function SunMark() {
  return (
    <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden="true">
      <g stroke="var(--color-tangerine)" strokeWidth="3" strokeLinecap="round">
        <line x1="20" y1="2" x2="20" y2="8" />
        <line x1="20" y1="32" x2="20" y2="38" />
        <line x1="2" y1="20" x2="8" y2="20" />
        <line x1="32" y1="20" x2="38" y2="20" />
        <line x1="7.3" y1="7.3" x2="11.5" y2="11.5" />
        <line x1="28.5" y1="28.5" x2="32.7" y2="32.7" />
        <line x1="7.3" y1="32.7" x2="11.5" y2="28.5" />
        <line x1="28.5" y1="11.5" x2="32.7" y2="7.3" />
      </g>
      <circle cx="20" cy="20" r="9" fill="var(--color-sunshine)" />
    </svg>
  );
}

export default function Header() {
  return (
    <header className="border-b-4 border-sunshine bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <SunMark />
          <span className="font-display text-2xl font-extrabold tracking-tight">
            Show Up <span className="text-tangerine">SOKY</span>
          </span>
        </Link>

        <nav aria-label="Main">
          <ul className="flex items-center gap-2 sm:gap-4">
            <li>
              <Link
                href="/"
                className="rounded-full px-3 py-2 font-bold hover:bg-sunshine-light"
              >
                Events
              </Link>
            </li>
            <li>
              <Link
                href="/submit"
                className="rounded-full bg-sunshine px-4 py-2 font-bold shadow-sm hover:bg-sunshine-dark"
              >
                Submit an event
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
