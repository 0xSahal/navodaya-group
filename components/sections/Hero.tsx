'use client'

import Image from 'next/image'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { Container } from '@/components/ui/Container'
import { useIntroReady } from '@/components/providers/IntroProvider'
import type { HeroSlide } from '@/data/hero'
import { BLUR } from '@/lib/images'

const EASE = [0.22, 1, 0.36, 1] as const
const AUTO_MS = 7000
const DRAG_THRESHOLD = 60

/**
 * Full-bleed hero slider: each slide owns image + copy.
 * Manual prev/next, drag/swipe, keyboard; autoplay pauses on hover/focus/drag.
 */
export function Hero({ slides: heroSlides }: { slides: HeroSlide[] }) {
  const ready = useIntroReady()
  const reduceMotion = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const dragStart = useRef<{ x: number; y: number } | null>(null)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [progressKey, setProgressKey] = useState(0)

  const slide = heroSlides[index] ?? heroSlides[0]
  const count = heroSlides.length
  const autoPaused = paused || dragging

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '14%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '38%'])
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const goTo = useCallback(
    (next: number) => {
      setIndex(((next % count) + count) % count)
      setProgressKey((key) => key + 1)
    },
    [count],
  )

  const goPrev = useCallback(() => goTo(index - 1), [goTo, index])
  const goNext = useCallback(() => goTo(index + 1), [goTo, index])

  useEffect(() => {
    if (!ready || reduceMotion || autoPaused || count < 2) return

    const timer = window.setTimeout(() => {
      goTo(index + 1)
    }, AUTO_MS)

    return () => window.clearTimeout(timer)
  }, [ready, reduceMotion, autoPaused, index, count, goTo])

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return
    dragStart.current = { x: event.clientX, y: event.clientY }
    setDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function onPointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    const start = dragStart.current
    dragStart.current = null
    setDragging(false)

    if (!start) return

    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    if (Math.abs(dx) < DRAG_THRESHOLD || Math.abs(dx) <= Math.abs(dy)) return

    if (dx < 0) goNext()
    else goPrev()
  }

  function onPointerCancel() {
    dragStart.current = null
    setDragging(false)
  }

  function onKeyDown(event: ReactKeyboardEvent<HTMLElement>) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goPrev()
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      goNext()
    }
  }

  return (
    <section
      id="top"
      ref={ref}
      tabIndex={0}
      data-nav-hero
      className="relative h-[100svh] min-h-[620px] overflow-hidden bg-ink outline-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false)
        }
      }}
      onKeyDown={onKeyDown}
      aria-roledescription="carousel"
      aria-label="Featured studio stories"
    >
      <motion.div
        className={`absolute inset-0 ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        initial={{ clipPath: 'inset(12% 12% 12% 12%)' }}
        animate={ready ? { clipPath: 'inset(0% 0% 0% 0%)' } : undefined}
        transition={{ duration: 1.5, ease: EASE }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
      >
        <motion.div className="absolute inset-0" style={{ y: imageY }}>
          {heroSlides.map((item, i) => (
            <motion.div
              key={item.id}
              className="absolute inset-0"
              initial={false}
              animate={{
                opacity: i === index ? 1 : 0,
                scale: i === index && ready ? 1 : 1.06,
              }}
              transition={{
                opacity: { duration: reduceMotion ? 0.01 : 1.1, ease: EASE },
                scale: { duration: reduceMotion ? 0.01 : 6, ease: EASE },
              }}
              aria-hidden={i !== index}
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                priority={i === 0}
                placeholder="blur"
                blurDataURL={BLUR}
                sizes="100vw"
                className="pointer-events-none object-cover select-none"
                draggable={false}
              />
            </motion.div>
          ))}
        </motion.div>

        <div className="pointer-events-none absolute inset-0 bg-ink/45" aria-hidden="true" />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/35 to-ink/90"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/25 to-transparent to-65%"
          aria-hidden="true"
        />
      </motion.div>

      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="pointer-events-none relative flex h-full flex-col justify-end pb-16 md:pb-20"
      >
        <Container>
          <div className="max-w-4xl">
            <div className="min-h-[14rem] md:min-h-[16rem]" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.id}
                  initial={
                    ready && !reduceMotion ? { opacity: 0, y: 18 } : { opacity: 1, y: 0 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
                  transition={{ duration: reduceMotion ? 0.01 : 0.55, ease: EASE }}
                >
                  <p className="text-eyebrow uppercase text-bone/70">{slide.eyebrow}</p>

                  <h1 className="mt-4 text-display-xl text-bone">
                    {slide.title.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </h1>

                  <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
                    <p className="max-w-md text-base leading-relaxed text-bone/80">{slide.lead}</p>

                    <a
                      href={slide.cta.href}
                      className="pointer-events-auto group inline-flex shrink-0 items-center gap-3 border-b border-bone/40 pb-2 text-sm tracking-wide text-bone transition-colors duration-500 hover:border-bone"
                    >
                      {slide.cta.label}
                      <svg
                        width="18"
                        height="8"
                        viewBox="0 0 18 8"
                        fill="none"
                        aria-hidden="true"
                        className="transition-transform duration-500 ease-premium group-hover:translate-x-1.5"
                      >
                        <path
                          d="M0 4h16M13 1l3.2 3-3.2 3"
                          stroke="currentColor"
                          strokeWidth="1"
                        />
                      </svg>
                    </a>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <motion.div
              className="pointer-events-auto mt-12 flex flex-wrap items-center justify-between gap-6"
              initial={{ opacity: 0 }}
              animate={ready ? { opacity: 1 } : undefined}
              transition={{ duration: 0.7, delay: 1, ease: EASE }}
            >
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2" role="tablist" aria-label="Hero slides">
                  {heroSlides.map((item, i) => {
                    const active = i === index
                    return (
                      <button
                        key={item.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        aria-label={`Show slide ${i + 1}: ${item.title.join(' ')}`}
                        onClick={() => goTo(i)}
                        className="group relative h-px w-10 cursor-pointer bg-bone/25 md:w-14"
                      >
                        <span
                          key={active ? `${progressKey}-${i}` : `idle-${i}`}
                          className={`absolute inset-y-0 left-0 bg-bone ${
                            active && ready && !reduceMotion && !autoPaused
                              ? 'hero-progress-fill'
                              : active
                                ? 'w-full'
                                : 'w-0 group-hover:w-1/3'
                          }`}
                        />
                      </button>
                    )
                  })}
                </div>

                <p className="text-eyebrow uppercase tabular-nums text-bone/55">
                  {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous slide"
                  onClick={goPrev}
                  className="inline-flex size-11 cursor-pointer items-center justify-center border border-bone/35 text-bone transition-colors duration-300 hover:border-bone hover:bg-bone/10"
                >
                  <svg width="18" height="8" viewBox="0 0 18 8" fill="none" aria-hidden="true">
                    <path d="M18 4H2M5 1 1.8 4 5 7" stroke="currentColor" strokeWidth="1" />
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label="Next slide"
                  onClick={goNext}
                  className="inline-flex size-11 cursor-pointer items-center justify-center border border-bone/35 text-bone transition-colors duration-300 hover:border-bone hover:bg-bone/10"
                >
                  <svg width="18" height="8" viewBox="0 0 18 8" fill="none" aria-hidden="true">
                    <path d="M0 4h16M13 1l3.2 3-3.2 3" stroke="currentColor" strokeWidth="1" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </div>
        </Container>
      </motion.div>
    </section>
  )
}
