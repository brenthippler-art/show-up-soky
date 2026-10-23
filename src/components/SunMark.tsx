export const SUNSHINE = '#ffd23f'
export const TANGERINE = '#ff8c42'

type Props = { size?: number; animated?: boolean }

export default function SunMark({ size = 36, animated = false }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <g
        stroke={TANGERINE}
        strokeWidth="3"
        strokeLinecap="round"
        className={`sun-rays${animated ? ' sun-rays-animated' : ''}`}
      >
        <line x1="20" y1="2" x2="20" y2="8" />
        <line x1="20" y1="32" x2="20" y2="38" />
        <line x1="2" y1="20" x2="8" y2="20" />
        <line x1="32" y1="20" x2="38" y2="20" />
        <line x1="7.3" y1="7.3" x2="11.5" y2="11.5" />
        <line x1="28.5" y1="28.5" x2="32.7" y2="32.7" />
        <line x1="7.3" y1="32.7" x2="11.5" y2="28.5" />
        <line x1="28.5" y1="11.5" x2="32.7" y2="7.3" />
      </g>
      <circle cx="20" cy="20" r="9" fill={SUNSHINE} />
    </svg>
  )
}