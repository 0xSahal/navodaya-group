import type { Config } from 'tailwindcss'

/**
 * Every design token for the site lives here. Components must not hardcode a
 * hex value, a radius or a shadow. To rebrand, change this file plus
 * `lib/site-config.ts` and `data/*`.
 *
 * Palette is deliberately three-note: warm charcoal (ink), warm paper (bone /
 * sand), and one accent (clay). No second accent, no gradients on surfaces.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './data/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#16130F',
          soft: '#241F19',
          mute: '#3A332B',
        },
        bone: '#F5F2EC',
        sand: '#E7E1D6',
        // Secondary text. Darkened from #6B6259, which only cleared AA by a
        // hair and read washed out against `bone` at body sizes.
        stone: '#5A5249',
        line: '#DDD5C8',
        clay: {
          DEFAULT: '#9C4F2E',
          light: '#C2724A',
        },
        whatsapp: '#25D366',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'ui-serif', 'Georgia', 'serif'],
      },
      fontSize: {
        // Display sizes carry their own leading and tracking so headings stay
        // tight and consistent wherever they are used.
        'display-xl': ['clamp(3rem, 7.5vw, 6rem)', { lineHeight: '0.98', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2.25rem, 4.6vw, 3.75rem)', { lineHeight: '1.04', letterSpacing: '-0.018em' }],
        'display-md': ['clamp(1.75rem, 3vw, 2.5rem)', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
        'display-sm': ['clamp(1.25rem, 1.8vw, 1.5rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        // Uppercase micro-label used for section numbers and project tags.
        eyebrow: ['0.6875rem', { lineHeight: '1', letterSpacing: '0.2em' }],
      },
      maxWidth: {
        content: '1280px',
        prose: '58ch',
      },
      borderRadius: {
        // Architecture reads as square. Radii stay near zero on purpose.
        tight: '1px',
        card: '2px',
        pill: '999px',
      },
      spacing: {
        section: 'clamp(5.5rem, 11vw, 10rem)',
      },
      boxShadow: {
        // The only shadow in the system, and only on hover, never at rest.
        lift: '0 24px 60px -28px rgba(22, 19, 15, 0.45)',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'draw-line': {
          from: { transform: 'scaleX(0)' },
          to: { transform: 'scaleX(1)' },
        },
      },
      animation: {
        'draw-line': 'draw-line 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards',
      },
    },
  },
  plugins: [],
}

export default config
