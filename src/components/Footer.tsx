import Link from "next/link";
import { Suspense } from "react";
import FooterSignup from "@/components/FooterSignup";

export default function Footer() {
  return (
    <footer className="mt-16 bg-ink text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-2 lg:items-start">
        <div>
          <p className="font-display text-2xl font-bold">Show Up SOKY</p>
          <p className="mt-2 max-w-xl text-cream/80">
            Connecting neighbors to events that move rights and freedoms forward
            for every person in South Central Kentucky.
          </p>
          <nav aria-label="Footer" className="mt-6">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 font-bold">
              <li>
                <Link
                  href="/events"
                  className="hover:underline underline-offset-4"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  href="/orgs"
                  className="hover:underline underline-offset-4"
                >
                  Groups
                </Link>
              </li>
              <li>
                <Link
                  href="/submit"
                  className="hover:underline underline-offset-4"
                >
                  Submit an event
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="hover:underline underline-offset-4"
                >
                  Register your group
                </Link>
              </li>
            </ul>
          </nav>
          <p className="mt-6 text-sm text-cream/60">
            Events and groups are submitted by the community and reviewed before
            posting.
          </p>
        </div>

        <Suspense fallback={null}>
          <FooterSignup />
        </Suspense>
      </div>
    </footer>
  );
}
