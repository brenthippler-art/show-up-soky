import { ImageResponse } from 'next/og'
import SunMark from '@/components/SunMark'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fff4c2',
        }}
      >
        <SunMark size={140} />
      </div>
    ),
    size
  )
}