/*
 * ⚠ NOT LIVE CONTENT. Sanity is the source of truth for this collection; the
 * site reads it through `sanity/content.ts`.
 *
 * This file is kept for two reasons only:
 *   1. the exported *types*, which the components still use as their contract
 *   2. `scripts/seed-sanity.ts`, which reads these arrays to populate Sanity
 *
 * Editing the data below changes nothing on the site. Edit in the Studio.
 */

import { unsplash } from '@/lib/images'
import { siteConfig } from '@/lib/site-config'

export type HeroSlide = {
  id: string
  image: string
  alt: string
  eyebrow: string
  /** One or two display lines. */
  title: string[]
  lead: string
  cta: { label: string; href: string }
}

/**
 * Homepage hero slides. Images are Unsplash placeholders - swap for Navodaya
 * photography before launch.
 */
export const heroSlides: HeroSlide[] = [
  {
    id: 'design-build',
    image: unsplash('photo-1600607688969-a5bfcd646154', 2400),
    alt: 'House clad in weathered steel and charcoal panels, wrapped around a mature tree',
    eyebrow: `Since ${siteConfig.foundedYear}`,
    title: ['We design it.', 'Then we build it.'],
    lead: 'Interior and architecture design, contracting and project management from one studio. Twenty years of taking projects from the first site visit to the day you get the keys.',
    cta: { label: 'Start a project', href: '#contact' },
  },
  {
    id: 'spaces',
    image: unsplash('photo-1600585154340-be6161a56a0c', 2400),
    alt: 'Dark-clad two storey house lit from within at dusk',
    eyebrow: 'Houses & workplaces',
    title: ['Spaces drawn', 'for how you live.'],
    lead: 'Homes, offices and commercial interiors planned for light, climate and daily use - then built by the same team that signed the drawings.',
    cta: { label: 'View projects', href: '/projects' },
  },
  {
    id: 'one-roof',
    image: unsplash('photo-1600607687939-ce8a6c25118c', 2400),
    alt: 'Double-height living room with a concrete stair and warm daylight',
    eyebrow: 'One contract',
    title: ['One studio.', 'One programme.'],
    lead: 'No handoff between architect and contractor. One lead, one cost position, and a snag list closed before you take the keys.',
    cta: { label: 'How we work', href: '/#process' },
  },
]
