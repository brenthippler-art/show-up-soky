import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SunMark from "@/components/SunMark";

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
        <SiteNav />
      </div>
    </header>
  );
}
