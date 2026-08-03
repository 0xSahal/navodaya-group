'use client'

import { useEffect, useSyncExternalStore, type ReactNode } from 'react'
import { MotionConfig } from 'framer-motion'
import Lenis from 'lenis'
import { useIntroFinished } from '@/components/providers/IntroProvider'

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

/**
 * Read the media query as an external store rather than mirroring it into state
 * from an effect, which would cause a cascading render on every mount.
 */
function subscribeToMotionPreference(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

const getMotionPreference = () => window.matchMedia(REDUCED_MOTION).matches

/** The server cannot know the preference, so it renders the animated default. */
const getServerMotionPreference = () => false

/**
 * Smooth scroll, plus the single place motion is switched off.
 *
 * Lenis is never instantiated when the visitor prefers reduced motion (it would
 * hijack native scrolling), and MotionConfig turns every Framer animation into
 * an instant state change at the same time.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  const reduced = useSyncExternalStore(
    subscribeToMotionPreference,
    getMotionPreference,
    getServerMotionPreference,
  )

  /*
   * Lenis must not exist while the splash is up. It converts wheel events into
   * programmatic scrolls, and `overflow: hidden` only blocks *user* scrolling,
   * so with Lenis running a single wheel gesture drags the page down behind the
   * curtain. Waiting for the curtain to be fully gone, rather than merely
   * lifting, closes that off for the whole of the intro.
   */
  const introFinished = useIntroFinished()

  useEffect(() => {
    if (reduced || !introFinished) return

    const lenis = new Lenis({
      duration: 1.05,
      // Matches the `premium` easing token so page scroll and element motion
      // decelerate on the same curve.
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      touchMultiplier: 1.6,
    })

    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    // Lenis intercepts wheel events, so in-page anchors need routing through it.
    const onAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement)?.closest?.('a[href^="#"]')
      if (!(anchor instanceof HTMLAnchorElement)) return

      const id = anchor.getAttribute('href')
      if (!id || id === '#') return

      const target = document.querySelector(id)
      if (!target) return

      event.preventDefault()
      lenis.scrollTo(target as HTMLElement, { offset: -96 })
    }

    document.addEventListener('click', onAnchorClick)

    return () => {
      document.removeEventListener('click', onAnchorClick)
      cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [reduced, introFinished])

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
