import { ImageResponse } from 'next/og'
import SunMark, { TANGERINE } from '@/components/SunMark'

export const alt = 'Show Up SOKY: community events across South Central Kentucky'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const INK = '#1f2440'
const INK_SOFT = '#4a4f6a'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #fff4c2 0%, #fffbf0 50%, #ffe3cf 100%)',
          color: INK,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <SunMark size={120} />
          <div style={{ display: 'flex', marginLeft: 28, fontSize: 76, fontWeight: 800 }}>
            Show Up
            <span style={{ color: TANGERINE, marginLeft: 20 }}>SOKY</span>
          </div>
        </div>

        <div style={{ display: 'flex', marginTop: 48, fontSize: 52, fontWeight: 700 }}>
          Show up for each other.
        </div>

        <div style={{ display: 'flex', marginTop: 20, maxWidth: 940, fontSize: 32, lineHeight: 1.35, color: INK_SOFT }}>
          Rallies, meetings, trainings and volunteer days moving rights and freedoms forward across
          South Central Kentucky.
        </div>
      </div>
    ),
    size
  )
}