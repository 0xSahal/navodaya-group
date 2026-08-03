'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { Reveal } from '@/components/ui/Reveal'
import { ArrowLink } from '@/components/ui/ArrowLink'
import type { Project, ProjectCategory } from '@/data/projects'

type ProjectGridProps = {
  /** Fetched by whichever server component renders the grid. */
  projects: Project[]
  filters: Array<'All' | ProjectCategory>
  /** Limit tiles on the homepage teaser; omit for the full hub index. */
  limit?: number
  className?: string
  /** Show a trailing link under the grid (homepage teaser). */
  viewAllHref?: string
  /** Hub keeps filters + motion; teaser is a calm static grid. */
  variant?: 'hub' | 'teaser'
}

/**
 * Uniform portfolio index - even columns, one aspect ratio, clear meta.
 * Shared by the homepage teaser and `/projects` hub.
 */
export function ProjectGrid({
  projects,
  filters,
  limit,
  className = '',
  viewAllHref,
  variant = 'hub',
}: ProjectGridProps) {
  const [active, setActive] = useState<'All' | ProjectCategory>('All')
  const teaser = variant === 'teaser'

  const pool = active === 'All' ? projects : projects.filter((p) => p.category === active)
  const visible = typeof limit === 'number' ? pool.slice(0, limit) : pool

  return (
    <div className={className}>
      {!teaser ? (
        <Reveal>
          <div
            className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-t border-line pt-6"
            role="group"
            aria-label="Filter projects by type"
          >
            <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
              {filters.map((filter) => {
                const isActive = filter === active
                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActive(filter)}
                    aria-pressed={isActive}
                    className={`group relative cursor-pointer pb-1.5 text-sm tracking-wide transition-colors duration-300 ${
                      isActive ? 'text-ink' : 'text-stone hover:text-ink'
                    }`}
                  >
                    {filter}
                    <span
                      className={`absolute inset-x-0 bottom-0 h-px origin-left bg-clay transition-transform duration-500 ease-premium ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </button>
                )
              })}
            </div>

            <span className="text-eyebrow uppercase tabular-nums text-stone/70">
              {String(visible.length).padStart(2, '0')} / {String(pool.length).padStart(2, '0')}
            </span>
          </div>
        </Reveal>
      ) : null}

      {teaser ? (
        <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2">
          {visible.map((project, index) => (
            <Reveal key={project.id} delay={index * 0.05}>
              <ProjectCard project={project} index={index} />
            </Reveal>
          ))}
        </div>
      ) : (
        <motion.div
          layout
          className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((project, index) => (
              <motion.article
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="group"
              >
                <ProjectCardInner project={project} index={index} />
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {viewAllHref ? (
        <Reveal>
          <div className="mt-14 flex justify-start border-t border-line pt-8 md:justify-end">
            <ArrowLink href={viewAllHref} tone="clay">
              View all projects
            </ArrowLink>
          </div>
        </Reveal>
      ) : null}
    </div>
  )
}

function ProjectCard({
  project,
  index,
}: {
  project: Project
  index: number
}) {
  return (
    <article className="group">
      <ProjectCardInner project={project} index={index} />
    </article>
  )
}

function ProjectCardInner({
  project,
  index,
}: {
  project: Project
  index: number
}) {
  return (
    <Link href={`/projects/${project.slug}`} className="flex h-full flex-col">
      <div className="relative aspect-4/3 overflow-hidden bg-sand">
        <Image
          src={project.image}
          alt={project.alt}
          fill
          quality={95}
          unoptimized
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover object-center transition-transform duration-[1200ms] ease-premium group-hover:scale-[1.02]"
        />
        <span
          className="absolute inset-0 bg-ink/0 transition-colors duration-700 group-hover:bg-ink/12"
          aria-hidden="true"
        />
      </div>

      <div className="mt-5 flex flex-1 flex-col border-t border-line pt-5">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-eyebrow uppercase tabular-nums text-clay">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="text-eyebrow uppercase text-stone/70">{project.category}</span>
        </div>

        <h3 className="mt-3 text-display-sm text-ink transition-colors duration-300 group-hover:text-clay">
          {project.title}
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-stone">
          {project.location}
          <span className="mx-2 text-line" aria-hidden="true">
            ·
          </span>
          <span className="tabular-nums">{project.year}</span>
        </p>

        <p className="mt-auto pt-3 text-xs uppercase tracking-[0.14em] text-stone/65">
          {project.scope}
        </p>
      </div>
    </Link>
  )
}
