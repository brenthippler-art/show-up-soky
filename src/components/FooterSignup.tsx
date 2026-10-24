"use client";

import { usePathname } from "next/navigation";
import SignupForm from "@/components/SignupForm";
import ComingSoon from "@/components/ComingSoon";
import { DIGEST_LIVE } from "@/lib/features";

const HIDDEN_EXACT = ["/"];
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
        {!DIGEST_LIVE && <ComingSoon className="ml-2" />}
      </h2>
      <p className="mt-2">
        {DIGEST_LIVE
          ? "One email every Monday with the week’s events. Unsubscribe anytime."
          : "A Monday email with the week’s events is on the way. Join the list and we’ll let you know when it launches."}
      </p>
      <div className="mt-4">
        <SignupForm idPrefix="footer" />
      </div>
    </section>
  );
}
