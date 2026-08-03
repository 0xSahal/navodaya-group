'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

/**
 * The site's one scroll animation: a short rise and fade, once, on entry.
 * Everything else on the page is static by design. `MotionConfig reducedMotion`
 * in LenisProvider collapses this to an instant state change when asked.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className = '',
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
