export default function ComingSoon({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-block rounded-full bg-tangerine-light px-2.5 py-0.5 align-middle text-xs font-bold uppercase tracking-wide text-ink ${className}`}
    >
      Coming soon
    </span>
  )
}