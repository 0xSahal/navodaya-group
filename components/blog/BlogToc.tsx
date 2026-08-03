'use client'

import { useEffect, useState } from 'react'

export type TocItem = {
  id: string
  text: string
  level: 2 | 3
}

/**
 * Sticky table of contents with active-section highlight via IntersectionObserver.
 */
export function BlogToc({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '')

  useEffect(() => {
    if (items.length === 0) return

    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el))

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id)
        }
      },
      {
        rootMargin: '-20% 0px -55% 0px',
        threshold: [0, 0.25, 0.5, 1],
      },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [items])

  if (items.length === 0) return null

  return (
    <nav aria-label="Table of contents">
      <p className="text-eyebrow uppercase text-clay">On this page</p>
      <ol className="mt-5 space-y-1 border-t border-line pt-5">
        {items.map((item) => {
          const active = item.id === activeId
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`block border-l py-2 text-sm leading-snug transition-colors duration-300 ${
                  item.level === 3 ? 'pl-6' : 'pl-4'
                } ${
                  active
                    ? 'border-clay text-ink'
                    : 'border-transparent text-stone hover:border-line hover:text-ink'
                }`}
              >
                {item.text}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
