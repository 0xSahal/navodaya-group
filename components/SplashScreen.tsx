'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { motion } from 'framer-motion'
import { Logo } from '@/components/brand/Logo'
import { siteConfig } from '@/lib/site-config'

const EASE = [0.22, 1, 0.36, 1] as const

/** Phase timings, in ms. Kept in one place so the sequence stays readable. */
const EXIT_AT = 1850
const REVEAL_AT = 2050
const FINISH_AT = 2900

const COUNT_DELAY = 350
const COUNT_DURATION = 1350

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

function subscribeToMotionPreference(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}
const getMotionPreference = () => window.matchMedia(REDUCED_MOTION).matches
const getServerMotionPreference = () => false

/** Matches the `premium` easing curve so the count decelerates with everything else. */
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * Opening curtain.
 *
 * Built as a drawing title block rather than a spinner: the wordmark rises out
 * of a mask, a hairline rule draws itself under it, and a counter runs up in the
 * corner. `onReveal` deliberately fires as the curtain *starts* lifting, not
 * after, so the hero's own clip-wipe plays through the last of it and the two
 * read as one move.
 */
export function SplashScreen({
  onReveal,
  onFinished,
}: {
  onReveal: () => void
  onFinished: () => void
}) {
  const reduced = useSyncExternalStore(
    subscribeToMotionPreference,
    getMotionPreference,
    getServerMotionPreference,
  )

  const [exiting, setExiting] = useState(false)
  const [count, setCount] = useState(0)

  // `onReveal` and `onFinished` are memoised by IntroProvider, so depending on
  // them directly will not restart the timeline.
  useEffect(() => {
    if (reduced) {
      onReveal()
      onFinished()
      return
    }

    const timers = [
      setTimeout(() => setExiting(true), EXIT_AT),
      // Matches the curtain's own start (EXIT_AT + its 0.2s delay), so the hero
      // begins exactly as the lift does.
      setTimeout(onReveal, REVEAL_AT),
      setTimeout(onFinished, FINISH_AT),
    ]
    return () => timers.forEach(clearTimeout)
  }, [reduced, onReveal, onFinished])

  useEffect(() => {
    if (reduced) return

    let frame = 0
    let start = 0
    const tick = (now: number) => {
      if (!start) start = now
      const elapsed = now - start - COUNT_DELAY
      const t = Math.min(Math.max(elapsed / COUNT_DURATION, 0), 1)
      setCount(Math.round(easeOut(t) * 100))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [reduced])

  if (reduced) return null

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-ink"
      initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      animate={exiting ? { clipPath: 'inset(0% 0% 100% 0%)' } : { clipPath: 'inset(0% 0% 0% 0%)' }}
      transition={{ duration: 0.85, delay: exiting ? 0.2 : 0, ease: EASE }}
      aria-hidden="true"
    >
      {/* Type leaves just before the curtain, so the lift never fights the wordmark. */}
      <motion.div
        className="flex h-full flex-col justify-between px-6 py-8 md:px-10 md:py-10"
        animate={exiting ? { opacity: 0, y: -18 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <div aria-hidden="true" />

        <div className="flex flex-col items-center">
          {/*
           * The client's own lockup rises out of the mask. Strapline included:
           * full screen is the one place it is comfortably legible.
           */}
          <span className="block overflow-hidden">
            <motion.span
              className="block"
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.95, delay: 0.1, ease: EASE }}
            >
              <Logo
                variant="lockup"
                tone="dark"
                className="h-[clamp(7rem,23vw,15rem)] w-auto"
              />
            </motion.span>
          </span>

          {/* Hairline track with the accent drawing across it, in step with the count. */}
          {/* Width tracks the lockup above it, so the two read as one block. */}
          <span className="relative mt-7 block h-px w-[min(22rem,66vw)] bg-bone/20">
            <motion.span
              className="absolute inset-0 origin-left bg-clay-light"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: COUNT_DURATION / 1000, delay: COUNT_DELAY / 1000, ease: EASE }}
            />
          </span>

        </div>

        <motion.div
          className="flex items-end justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.45, ease: EASE }}
        >
          <span className="text-eyebrow uppercase text-bone/40">
            Since {siteConfig.foundedYear}
          </span>
          <span className="text-eyebrow uppercase tabular-nums text-clay-light">
            {String(count).padStart(3, '0')}
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
