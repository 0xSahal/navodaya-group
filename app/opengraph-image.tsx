import { ImageResponse } from 'next/og'
import { siteConfig } from '@/lib/site-config'

export const alt = `${siteConfig.legalName} - ${siteConfig.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const MARK_PATHS = [
  'M 0 165.93 L 224.01 78.65 L 224.01 40.71 L 0 133.77 Z',
  'M 224.26 40.6 L 506.76 157.93 L 506.76 130.94 L 224.01 0 L 224.01 40.71 Z',
  'M 506.76 193.58 L 224.01 78.65 L 224.01 125.83 L 224.01 125.94 L 506.76 223.49 Z',
  'M 224.01 161.01 L 224.01 125.94 L 223.87 125.89 L 0 213.46 L 0 245.72 Z',
]

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#16130F',
          color: '#F5F2EC',
          padding: '72px 80px',
          fontFamily: 'Georgia, ui-serif, serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <svg
            width="88"
            height="70"
            viewBox="120 0 210 165.93"
            style={{ display: 'flex' }}
          >
            {MARK_PATHS.map((d) => (
              <path key={d} d={d} fill="#C2724A" fillRule="evenodd" />
            ))}
          </svg>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div
            style={{
              fontSize: 56,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              maxWidth: 900,
            }}
          >
            {siteConfig.legalName}
          </div>
          <div
            style={{
              fontSize: 28,
              color: '#C2724A',
              fontFamily: 'ui-sans-serif, system-ui, sans-serif',
            }}
          >
            {siteConfig.tagline}
          </div>
          <div
            style={{
              marginTop: 12,
              fontSize: 22,
              color: '#E7E1D6',
              fontFamily: 'ui-sans-serif, system-ui, sans-serif',
            }}
          >
            Architecture, interiors and contracting · New Delhi
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
