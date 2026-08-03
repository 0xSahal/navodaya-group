import type { ReactNode } from 'react'

/**
 * The site's one call to action. Two tones, one behaviour: a hairline underline
 * that fills from the left and an arrow that nudges. Never a filled pill.
 */
export function ArrowLink({
  href,
  children,
  tone = 'ink',
  className = '',
}: {
  href: string
  children: ReactNode
  tone?: 'ink' | 'bone' | 'clay'
  className?: string
}) {
  const color =
    tone === 'bone' ? 'text-bone' : tone === 'clay' ? 'text-clay' : 'text-ink'
  const rule =
    tone === 'bone' ? 'bg-bone/30' : tone === 'clay' ? 'bg-clay/30' : 'bg-ink/20'
  const fill = tone === 'bone' ? 'bg-bone' : tone === 'clay' ? 'bg-clay' : 'bg-ink'

  return (
    <a
      href={href}
      className={`group inline-flex flex-col gap-2 text-sm tracking-wide ${color} ${className}`}
    >
      <span className="inline-flex items-center gap-3">
        {children}
        <svg
          width="18"
          height="8"
          viewBox="0 0 18 8"
          fill="none"
          aria-hidden="true"
          className="transition-transform duration-500 ease-premium group-hover:translate-x-1.5"
        >
          <path d="M0 4h16M13 1l3.2 3-3.2 3" stroke="currentColor" strokeWidth="1" />
        </svg>
      </span>
      <span className={`relative h-px w-full overflow-hidden ${rule}`} aria-hidden="true">
        <span
          className={`absolute inset-0 origin-left scale-x-0 transition-transform duration-500 ease-premium group-hover:scale-x-100 ${fill}`}
        />
      </span>
    </a>
  )
}
