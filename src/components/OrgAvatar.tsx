import Image from 'next/image'

const SIZES = {
  sm: { box: 'h-8 w-8 text-xs', px: 32 },
  md: { box: 'h-14 w-14 text-lg', px: 56 },
  lg: { box: 'h-24 w-24 text-3xl', px: 96 },
}

const FALLBACK_COLORS = [
  'bg-sunshine',
  'bg-tangerine-light',
  'bg-sky-light',
  'bg-meadow-light',
  'bg-berry-light',
]

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]!.toUpperCase())
    .join('')
}

function colorFor(name: string) {
  let hash = 0
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return FALLBACK_COLORS[hash % FALLBACK_COLORS.length]
}

type Props = {
  name: string
  logoUrl: string | null
  size?: keyof typeof SIZES
}

export default function OrgAvatar({ name, logoUrl, size = 'md' }: Props) {
  const { box, px } = SIZES[size]

  if (logoUrl) {
    return (
      <Image
        src={logoUrl}
        alt=""
        width={px * 2}
        height={px * 2}
        className={`${box} shrink-0 rounded-xl bg-white object-contain p-0.5 ring-1 ring-ink/10`}
      />
    )
  }

  return (
    <span
      aria-hidden="true"
      className={`${box} ${colorFor(name)} inline-flex shrink-0 items-center justify-center rounded-xl font-display font-extrabold text-ink ring-1 ring-ink/10`}
    >
      {initials(name)}
    </span>
  )
}