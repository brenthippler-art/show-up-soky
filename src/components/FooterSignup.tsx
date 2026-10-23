"use client";

import { usePathname } from "next/navigation";
import SignupForm from "@/components/SignupForm";

const HIDDEN_EXACT = ["/", "/events"];
const HIDDEN_PREFIX = ["/subscribe", "/unsubscribe", "/admin", "/login"];

export default function FooterSignup() {
  const pathname = usePathname();

  const hidden =
    HIDDEN_EXACT.includes(pathname) ||
    HIDDEN_PREFIX.some((path) => pathname.startsWith(path));
  if (hidden) return null;

  return (
    <section
      aria-labelledby="footer-signup-heading"
      className="rounded-2xl bg-sunshine p-6 text-ink"
    >
      <h2 id="footer-signup-heading" className="text-2xl font-extrabold">
        Never miss a chance to show up.
      </h2>
      <p className="mt-2">
        One email every Monday with the week’s events. Unsubscribe anytime.
      </p>
      <div className="mt-4">
        <SignupForm idPrefix="footer" />
      </div>
    </section>
  );
}
