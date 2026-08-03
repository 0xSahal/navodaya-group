import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

/**
 * Section masthead: a numbered hairline rule, then the title, then an optional
 * standfirst set beside it. The number carries the editorial register, so
 * sections do not need the uppercase kicker every template reaches for.
 */
export function SectionHead({
  index,
  title,
  standfirst,
  tone = 'light',
  align = 'split',
}: {
  index: string
  title: ReactNode
  standfirst?: ReactNode
  tone?: 'light' | 'dark'
  align?: 'split' | 'stacked'
}) {
  const dark = tone === 'dark'

  return (
    <div>
      <Reveal>
        <div className="flex items-center gap-5">
          <span
            className={`text-eyebrow font-sans uppercase ${dark ? 'text-clay-light' : 'text-clay'}`}
          >
            {index}
          </span>
          <span
            className={`h-px flex-1 origin-left ${dark ? 'bg-ink-mute' : 'bg-line'}`}
            aria-hidden="true"
          />
        </div>
      </Reveal>

      <div
        className={
          align === 'split'
            ? 'mt-8 grid gap-x-12 gap-y-5 md:grid-cols-12'
            : 'mt-8 max-w-prose'
        }
      >
        <Reveal className={align === 'split' ? 'md:col-span-6' : undefined}>
          <h2
            className={`text-display-lg ${dark ? 'text-bone' : 'text-ink'}`}
          >
            {title}
          </h2>
        </Reveal>

        {standfirst ? (
          <Reveal
            delay={0.08}
            className={align === 'split' ? 'md:col-span-5 md:col-start-8 md:self-end' : 'mt-5'}
          >
            <p className={`max-w-prose text-base ${dark ? 'text-sand/70' : 'text-stone'}`}>
              {standfirst}
            </p>
          </Reveal>
        ) : null}
      </div>
    </div>
  )
}
