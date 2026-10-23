import { focusLabel } from '@/lib/focus-area'

export default function FocusPill({ value }: { value: string }) {
  return (
    <span className="inline-block rounded-full bg-white px-3 py-1 text-sm font-bold ring-2 ring-ink">
      {focusLabel(value)}
    </span>
  )
}