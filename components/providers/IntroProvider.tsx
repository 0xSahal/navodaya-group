'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { SplashScreen } from '@/components/SplashScreen'

type IntroState = {
  /**
   * The page's starting gun, thrown as the curtain *begins* lifting. The hero
   * holds its entrance until this flips, so the two sequences read as one
   * continuous move rather than two animations fighting over the same second.
   */
  ready: boolean
  /** The curtain has finished lifting and is unmounted. Scroll is free again. */
  done: boolean
}

const IntroContext = createContext<IntroState>({ ready: false, done: false })

/** True once the hero may begin its entrance. */
export const useIntroReady = () => useContext(IntroContext).ready

/** True once the curtain is fully gone. Anything that scrolls must wait for this. */
export const useIntroFinished = () => useContext(IntroContext).done

export function IntroProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [done, setDone] = useState(false)

  // A reload restores the previous scroll position, which would put the page
  // mid-document behind the curtain and reveal the wrong thing when it lifts.
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  }, [])

  /*
   * Nothing should scroll behind the curtain.
   *
   * `html` is the scrolling element here, and body-to-viewport overflow
   * propagation does not hold once Lenis is mounted, so locking `body` alone
   * lets a wheel gesture move the page behind the splash. Lock both.
   */
  useEffect(() => {
    if (done) return

    const root = document.documentElement
    const previousRoot = root.style.overflow
    const previousBody = document.body.style.overflow
    root.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    return () => {
      root.style.overflow = previousRoot
      document.body.style.overflow = previousBody
    }
  }, [done])

  /** Fires as the curtain starts lifting, not after. */
  const onReveal = useCallback(() => setReady(true), [])
  const onFinished = useCallback(() => setDone(true), [])

  const value = useMemo(() => ({ ready, done }), [ready, done])

  return (
    <IntroContext.Provider value={value}>
      {!done ? <SplashScreen onReveal={onReveal} onFinished={onFinished} /> : null}
      {children}
    </IntroContext.Provider>
  )
}
