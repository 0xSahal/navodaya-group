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

export type AboutHero = {
  eyebrow: string
  headline: string
  lead: string
  image: string
  alt: string
}

export type AboutStory = {
  title: string
  body: string[]
  image: string
  alt: string
}

export type TimelineItem = {
  year: string
  title: string
  text: string
}

export type AboutValue = {
  index: string
  title: string
  body: string
}

/**
 * Leadership placeholders for the demo. Names and bios are invented - replace
 * with Navodaya’s real team before this page is shown as fact.
 */
export type TeamMember = {
  name: string
  role: string
  bio: string
  image: string
  alt: string
}

export const aboutHero: AboutHero = {
  eyebrow: 'About',
  headline: 'A studio that draws the building and builds what it drew.',
  lead: `${siteConfig.yearsOfExperience} years of interior and architecture design, contracting and project management - one office accountable from brief to keys.`,
  image: unsplash('photo-1497366216548-37526070297c', 2400),
  alt: 'Daylit studio workspace with long desks and soft natural light',
}

export const aboutStory: AboutStory = {
  title: 'Built for the gap most projects fall into.',
  body: [
    `Navodaya Design and Contract began in ${siteConfig.foundedYear} with a simple refusal: stop handing drawings to one firm and the site to another, then watching the brief drift between them.`,
    'We keep design, contracting and project management under one roof so the people who set the massing are the people who answer for the finish. Homes, workplaces and commercial interiors - drawn carefully, built honestly, handed over when we said.',
    `From our studio in ${siteConfig.contact.locationLabel}, we still run projects the same way: one programme, one cost position, one lead you can call.`,
  ],
  image: unsplash('photo-1600585154526-990dced4db0d', 1400),
  alt: 'Contemporary residence with a cantilevered upper floor over a planted court',
}

/**
 * Demo chronology. Years and milestones are invented for the pitch - confirm
 * every date with the client before publishing.
 */
export const timeline: TimelineItem[] = [
  {
    year: '2005',
    title: 'Studio founded',
    text: 'Navodaya opens as a design-and-build practice - drawings and site under the same contract from day one.',
  },
  {
    year: '2010',
    title: 'In-house site teams',
    text: 'Supervisors and finishing crews join permanently so programme and quality stop depending on whoever is free that week.',
  },
  {
    year: '2015',
    title: 'Three practices, one roof',
    text: 'Interior and architecture design, contracting and project management formalised as equal pillars - not add-ons.',
  },
  {
    year: '2020',
    title: 'Wider commercial work',
    text: 'Workplaces and hospitality fit-outs join the residential core, still run on the same weekly programme discipline.',
  },
  {
    year: '2024',
    title: 'Still accountable for the keys',
    text: 'Two decades on, the offer is unchanged: one studio, one programme, and a snag list closed before handover.',
  },
]

export const values: AboutValue[] = [
  {
    index: '01',
    title: 'Design and build under one roof',
    body: 'The people who drew it are the people who build it. No gap between architect and contractor for a problem to fall into, and no one to blame but us if a detail is wrong.',
  },
  {
    index: '02',
    title: 'A team that has done this before',
    body: 'Architects, interior designers, site engineers and finishing crews who have worked together for years. Continuity on site is part of the product.',
  },
  {
    index: '03',
    title: 'Programme as a commitment',
    body: 'One programme agreed at the start, tracked weekly, and a written snag list closed before you get the keys. Dates are a commitment, not an estimate.',
  },
  {
    index: '04',
    title: 'Craft that survives the site',
    body: 'Materials you can hold, joinery that builds from the set, and finishes corrected under real site light - not a board that only looked good in the studio.',
  },
]

export const team: TeamMember[] = [
  {
    name: 'Arjun Mehta',
    role: 'Principal, Design',
    bio: 'Leads concept, massing and the drawing set from brief through sanction.',
    image: unsplash('photo-1560250097-0b93528c311a', 900),
    alt: 'Portrait of a professional man in a dark blazer',
  },
  {
    name: 'Priya Shah',
    role: 'Principal, Interiors',
    bio: 'Owns space planning, materials and joinery so rooms match the building.',
    image: unsplash('photo-1573496359142-b8d87734a5a2', 900),
    alt: 'Portrait of a professional woman in a light blazer',
  },
  {
    name: 'Rahul Desai',
    role: 'Director, Contracting',
    bio: 'Runs site teams, cost position and the weekly programme to handover.',
    image: unsplash('photo-1472099645785-5658abf4ff4e', 900),
    alt: 'Portrait of a professional man in a light shirt',
  },
  {
    name: 'Meera Kapoor',
    role: 'Head of Project Management',
    bio: 'Keeps client, consultants and trades on one calendar and one cost story.',
    image: unsplash('photo-1580489944761-15a19d654956', 900),
    alt: 'Portrait of a professional woman with a calm expression',
  },
]

export const studioVisit = {
  title: 'Visit the studio',
  text: `We work from ${siteConfig.contact.locationLabel}. Share a brief, book a walkthrough, or come see how we run a live programme.`,
  hours: siteConfig.contact.hours,
  addressLines: siteConfig.contact.addressLines,
}
