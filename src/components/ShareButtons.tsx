"use client";

import { useState, useSyncExternalStore } from "react";

type Props = { url: string; title: string };

function subscribeToNothing() {
  return () => {};
}

export default function ShareButtons({ url, title }: Props) {
  const [copied, setCopied] = useState(false);
  const canNativeShare = useSyncExternalStore(
    subscribeToNothing,
    () => "share" in navigator,
    () => false,
  );

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt("Copy this link:", url);
    }
  }

  async function nativeShare() {
    try {
      await navigator.share({ title, url });
    } catch {
      // The person closed the share sheet. Nothing to do.
    }
  }

  const buttonClass =
    "rounded-full bg-white px-5 py-2 font-bold shadow-sm ring-2 ring-ink hover:bg-sunshine-light";

  return (
    <div className="flex flex-wrap items-center gap-3">
      {canNativeShare && (
        <button type="button" onClick={nativeShare} className={buttonClass}>
          Share
        </button>
      )}
      <button type="button" onClick={copyLink} className={buttonClass}>
        {copied ? "Link copied! ✓" : "Copy link"}
      </button>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
      >
        Share on Facebook<span className="sr-only"> (opens in a new tab)</span>
      </a>
      <span role="status" className="sr-only">
        {copied ? "Link copied to clipboard" : ""}
      </span>
    </div>
  );
}
