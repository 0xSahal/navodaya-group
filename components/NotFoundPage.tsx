import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { ArrowLink } from '@/components/ui/ArrowLink'
import { siteConfig } from '@/lib/site-config'

const destinations = [
  { label: 'Projects', href: '/projects', line: 'Work we have designed and built' },
  { label: 'Services', href: '/services', line: 'Design, contracting and project management' },
  { label: 'Contact', href: '/contact', line: 'Start a brief with the studio' },
] as const

/**
 * Architectural floor plan used as the 404 signature: a complete shell with one
 * room left open in dashed clay. Reads as a drawing-office missheet, not a
 * generic error illustration.
 */
function MissingRoomPlan({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Outer shell */}
      <rect x="24" y="28" width="272" height="224" stroke="currentColor" strokeWidth="1.25" />

      {/* Living / hall */}
      <path d="M24 140h120" stroke="currentColor" strokeWidth="1" />
      <path d="M144 28v112" stroke="currentColor" strokeWidth="1" />

      {/* Kitchen / service */}
      <path d="M144 140h152" stroke="currentColor" strokeWidth="1" />
      <path d="M220 140v112" stroke="currentColor" strokeWidth="1" />

      {/* Door swing */}
      <path d="M24 140v-16" stroke="currentColor" strokeWidth="1.25" />
      <path d="M24 108v-80" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M24 124a16 16 0 0 1 16-16"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeLinecap="round"
      />

      {/* Furniture marks: quiet drafting language */}
      <rect x="40" y="44" width="72" height="40" stroke="currentColor" strokeWidth="0.75" opacity="0.55" />
      <rect x="168" y="48" width="48" height="64" stroke="currentColor" strokeWidth="0.75" opacity="0.45" />
      <circle cx="256" cy="88" r="14" stroke="currentColor" strokeWidth="0.75" opacity="0.45" />

      {/* Dimension ticks along the base */}
      <path d="M24 264v6M296 264v6M24 267h272" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />

      {/* The missing room: dashed clay outline where a page should be */}
      <rect
        x="144"
        y="140"
        width="76"
        height="112"
        className="stroke-clay"
        strokeWidth="1.25"
        strokeDasharray="5 4"
      />
      <text
        x="182"
        y="200"
        textAnchor="middle"
        className="fill-clay"
        style={{
          fontSize: '11px',
          letterSpacing: '0.18em',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        }}
      >
        VOID
      </text>
    </svg>
  )
}

/**
 * Branded 404: a drawing title sheet with one room left off the plan.
 * Sits on bone so the solid header (used on unknown routes) reads correctly,
 * and the page feels like a sheet from the drawing office.
 */
export function NotFoundPage() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-bone py-section">
      {/* Drafting grid on the sheet */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full text-ink opacity-[0.04]"
        aria-hidden="true"
      >
        <defs>
          <pattern id="not-found-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M48 0H0V48" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#not-found-grid)" />
      </svg>

      {/* Large plan watermark */}
      <div
        className="pointer-events-none absolute -right-6 bottom-0 w-[min(58vw,22rem)] text-ink/15 md:right-8 md:bottom-8 md:w-[min(42vw,30rem)] lg:right-14"
        aria-hidden="true"
      >
        <MissingRoomPlan className="h-auto w-full" />
      </div>

      <Container className="relative">
        {/* Title-block corners */}
        <div className="mb-12 flex items-start justify-between gap-6 md:mb-16">
          <Reveal>
            <p className="text-eyebrow uppercase text-stone/70">
              {siteConfig.shortName}
              <span className="mx-2 text-line" aria-hidden="true">
                /
              </span>
              Drawing office
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="text-eyebrow uppercase tabular-nums text-clay">Sheet 404</p>
          </Reveal>
        </div>

        <div className="grid gap-14 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7 lg:col-span-6">
            <Reveal>
              <p className="font-display text-[clamp(5.5rem,18vw,9.5rem)] leading-[0.85] tracking-[-0.03em] text-ink">
                404
              </p>
            </Reveal>

            {/* Clay hairline drawing under the number, same language as the splash */}
            <Reveal delay={0.08}>
              <span className="relative mt-6 block h-px w-full max-w-xs overflow-hidden bg-line">
                <span className="absolute inset-0 origin-left animate-draw-line bg-clay" />
              </span>
            </Reveal>

            <Reveal delay={0.12}>
              <h1 className="mt-8 max-w-lg text-display-lg text-ink">
                This room is not on the drawings.
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-6 max-w-md text-base leading-relaxed text-stone">
                The page you asked for is not in the plan. It may have moved, or
                the address was never issued. Return home, or open a live part of
                the site.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-10">
                <ArrowLink href="/" tone="clay">
                  Return home
                </ArrowLink>
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-5 md:col-start-8 lg:col-span-4 lg:col-start-9">
            <Reveal delay={0.18}>
              <p className="text-eyebrow uppercase text-stone/70">Continue from here</p>
              <ul className="mt-6 divide-y divide-line border-y border-line">
                {destinations.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="group flex flex-col gap-1 py-5 transition-colors duration-300"
                    >
                      <span className="text-display-sm text-ink transition-colors duration-300 group-hover:text-clay">
                        {item.label}
                      </span>
                      <span className="text-sm text-stone/70">{item.line}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.24}>
          <p className="mt-16 text-eyebrow uppercase text-stone/50 md:mt-20">
            {siteConfig.tagline}
          </p>
        </Reveal>
      </Container>
    </section>
  )
}
