import { LOGO_VIEWBOX, MARK_PATHS, STRAPLINE_PATHS, WORDMARK_PATHS } from './logo-geometry'

/**
 * The client's logo, recreated as vector from their own artwork.
 *
 * The geometry is untouched: only the colour changes, blue to the site's clay.
 * The original is two-tone (blue mark and wordmark, grey strapline) and that
 * relationship is preserved on both backgrounds.
 */
type Variant =
  /** Mark, wordmark and strapline. Needs room, or the strapline turns to mud. */
  | 'lockup'
  /** Mark and wordmark, no strapline. The small-size lockup. */
  | 'stacked'
  /** Building mark on its own. */
  | 'mark'

/** Which background the logo is sitting on, not the logo's own colour. */
type Tone = 'light' | 'dark'

const PRIMARY: Record<Tone, string> = {
  light: 'fill-clay',
  dark: 'fill-clay-light',
}

const SECONDARY: Record<Tone, string> = {
  light: 'fill-stone',
  dark: 'fill-sand/60',
}

export function Logo({
  variant = 'lockup',
  tone = 'light',
  className = '',
  title,
}: {
  variant?: Variant
  tone?: Tone
  className?: string
  /** Give this only when the logo is not next to the name in text. */
  title?: string
}) {
  const showWordmark = variant !== 'mark'
  const showStrapline = variant === 'lockup'

  return (
    <svg
      viewBox={LOGO_VIEWBOX[variant]}
      className={className}
      fill="none"
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}

      <g
        className={`${PRIMARY[tone]} transition-[fill] duration-500 ease-premium`}
        fillRule="evenodd"
      >
        {MARK_PATHS.map((d) => (
          <path key={d} d={d} />
        ))}
        {showWordmark
          ? WORDMARK_PATHS.map((d) => <path key={d} d={d} />)
          : null}
      </g>

      {showStrapline ? (
        <g
          className={`${SECONDARY[tone]} transition-[fill] duration-500 ease-premium`}
          fillRule="evenodd"
        >
          {STRAPLINE_PATHS.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      ) : null}
    </svg>
  )
}
