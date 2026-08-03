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

export type Testimonial = {
  id: string
  quote: string
  author: string
  role: string
  project: string
}

/**
 * DEMO CONTENT. These are written placeholders, not real client quotes. Do not
 * publish them under a real client name without written approval from that
 * client. Deliberately typographic on the page, with no stock headshots
 * attached, so nothing here can be mistaken for a real person.
 */
export const testimonials: Testimonial[] = [
  {
    id: 't-1',
    quote:
      'We had been quoted by an architect and two contractors separately. Navodaya took the whole thing, and it was the first time the drawings and the site actually agreed with each other.',
    author: 'R. Patel',
    role: 'Homeowner',
    project: 'Mr. Shekhar Agarwal Living Room, Pune',
  },
  {
    id: 't-2',
    quote:
      'Forty thousand square feet, occupied floor by floor while we kept trading. They handed over on the date they gave us in the first meeting.',
    author: 'S. Mehta',
    role: 'Director',
    project: 'MBD Office, ITO, New Delhi',
  },
  {
    id: 't-3',
    quote:
      'What sold us was the material board. Everything we were shown is what turned up on site, down to the handles.',
    author: 'A. Shah',
    role: 'Homeowner',
    project: 'Smaaash, Gurgaon',
  },
]
