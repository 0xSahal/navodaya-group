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

export type Reason = {
  index: string
  title: string
  body: string
}

/** The three arguments that close an architecture-and-build client. */
export const reasons: Reason[] = [
  {
    index: '01',
    title: 'Design and build under one roof',
    body: 'The people who drew it are the people who build it. No gap between architect and contractor for a problem to fall into, and no one to blame but us if a detail is wrong.',
  },
  {
    index: '02',
    title: 'A team that has done this before',
    body: 'Architects, interior designers, site engineers and finishing crews who have worked together for years. Most of our supervisors have been with the firm for over a decade.',
  },
  {
    index: '03',
    title: 'Handed over when we said',
    body: 'One programme agreed at the start, tracked weekly, and a written snag list closed before you get the keys. Dates are a commitment, not an estimate.',
  },
]

export const studioImage = {
  src: unsplash('photo-1600585154526-990dced4db0d', 1200),
  alt: 'Timber-lined entrance of a dark clad house lit at dusk',
}

export type Stat = { value: string; label: string }

/**
 * Intentionally empty. Invented figures were never migrated. Only directors'
 * confirmed numbers belong here / in aboutPage.stats in Sanity. The seed script
 * also writes an empty array.
 */
export const stats: Stat[] = []

export type ProcessStep = {
  index: string
  title: string
  body: string
  duration: string
}

export const processSteps: ProcessStep[] = [
  {
    index: '01',
    title: 'Consult',
    duration: 'Week 1',
    body: 'We walk the site, listen to how you want to use the space, and come back with a written brief, a realistic budget band and a programme.',
  },
  {
    index: '02',
    title: 'Design',
    duration: 'Weeks 2 to 8',
    body: 'Concept, then drawings, then materials you can hold. You sign off on a set that leaves nothing open to interpretation on site.',
  },
  {
    index: '03',
    title: 'Build',
    duration: 'The main stretch',
    body: 'Our own site team executes the approved set. Weekly progress notes, photographs and a running cost position, so nothing arrives as a surprise.',
  },
  {
    index: '04',
    title: 'Handover',
    duration: 'Final 2 weeks',
    body: 'Joint snagging, every item closed in writing, warranties and drawings handed over. We stay reachable long after the last invoice.',
  },
]
