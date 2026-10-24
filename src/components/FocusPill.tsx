import { focusLabel } from '@/lib/focus-area'

type Props = { value: string; other?: string | null }

export default function FocusPill({ value, other }: Props) {
  const label = value === 'other' && other ? other : focusLabel(value)

  return (
    <span className="inline-block rounded-full bg-white px-3 py-1 text-sm font-bold ring-2 ring-ink">
      {label}
    </span>
  )
}