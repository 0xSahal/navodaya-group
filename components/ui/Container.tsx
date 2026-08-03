import type { ReactNode } from 'react'

/** Centered max-width wrapper. Its `mx-auto` is what centers the whole site. */
export function Container({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`mx-auto w-full max-w-content px-6 md:px-10 lg:px-14 ${className}`}>
      {children}
    </div>
  )
}
