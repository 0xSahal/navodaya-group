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

export type ServiceScopeItem = string

export type ServiceGalleryItem = {
  src: string
  alt: string
  /** Optional span hint for the editorial gallery grid. */
  span?: 'normal' | 'wide'
}

export type ServiceDeliverable = {
  title: string
  text: string
}

/**
 * One practice pillar. The homepage teasers and the dedicated `/services/[slug]`
 * pages both read from this shape.
 */
export type Service = {
  id: string
  slug: string
  index: string
  title: string
  line: string
  detail: string
  scope: ServiceScopeItem[]
  image: string
  alt: string
  /** Service-page hero headline. */
  headline: string
  /** Longer lead under the headline. */
  lead: string
  /** Body paragraphs for the overview. */
  body: string[]
  deliverables: ServiceDeliverable[]
  outcomes: string[]
  gallery: ServiceGalleryItem[]
  /** Atmosphere band on the detail page: video loop and/or still poster. */
  video: {
    /** Optional; when omitted the poster is shown as a full-bleed still. */
    src?: string
    poster: string
    caption: string
  }
}

/**
 * The three pillars. All three carry equal visual weight on purpose: the firm is
 * routinely mistaken for an interiors-only practice, and the page has to correct
 * that in one glance.
 */
export const services: Service[] = [
  {
    id: 'interior-architecture-design',
    slug: 'interior-architecture-design',
    index: '01',
    title: 'Interior & Architecture Design',
    line: 'Buildings and rooms drawn as one set - from massing to the last millimetre of joinery.',
    detail:
      'Site studies, massing, layouts, materials and lighting. We design for local light and climate, then detail interiors so what gets built matches what you were shown.',
    scope: ['Concept and massing', 'Space planning', 'Working drawings', 'Material and finish'],
    image: '/images/services/interior-architecture-design.png',
    alt: 'Daylit living space opening to a garden through timber-framed glass doors',
    headline: 'Outside and in, the same drawing set.',
    lead: 'We start with how the building wants to sit on its plot - light, breeze, entry, privacy - then plan rooms for circulation, storage and finish so the envelope and the interior describe the same life.',
    body: [
      'Architecture and interiors here are not two handovers. The same team that sets massing writes the working drawings, plans joinery and lighting, walks the sanction desk when needed, and stays on site when a detail has to change.',
      'We design for the climates we build in: deep overhangs, cross-ventilation, material that ages honestly. Finish boards are real samples you can hold - soft schemes that change under site lighting get corrected before they reach the paint shop.',
    ],
    deliverables: [
      {
        title: 'Brief and site study',
        text: 'Survey, setbacks, solar path and a written brief you can hold the design against.',
      },
      {
        title: 'Concept, massing and space planning',
        text: 'How the building sits and how rooms work at seven in the morning - sketched before we sink cost into details.',
      },
      {
        title: 'Working drawings and joinery',
        text: 'Plans, sections, elevations, schedules and millimetre joinery that a site team can build from without guessing.',
      },
      {
        title: 'Material, lighting and approvals',
        text: 'Finish boards, layered lighting with the electrical set, and municipal filings where needed.',
      },
    ],
    outcomes: [
      'One drawing set from concept through interiors',
      'Climate-led orientation and envelope',
      'Joinery and finish coordinated with the build',
      'A project lead who stays past handover of drawings',
    ],
    gallery: [
      {
        src: unsplash('photo-1600585154340-be6161a56a0c', 1400),
        alt: 'Contemporary house with timber screens and deep eaves',
        span: 'wide',
      },
      {
        src: unsplash('photo-1618221195710-dd6b41faaea6', 1000),
        alt: 'Calm living room with linen sofas and warm timber floors',
      },
      {
        src: unsplash('photo-1600607687939-ce8a6c25118c', 1000),
        alt: 'Double-height living room with a concrete stair',
      },
      {
        src: unsplash('photo-1616486338812-3dadae4b4ace', 1200),
        alt: 'Kitchen with stone counters and open shelving',
        span: 'wide',
      },
    ],
    video: {
      poster: '/images/services/interior-architecture-massing.png',
      caption: 'Massing and rooms - the building and how it is lived in.',
    },
  },
  {
    id: 'contracting',
    slug: 'contracting',
    index: '02',
    title: 'Contracting',
    line: 'Our own site teams building what our studio drew.',
    detail:
      'Civil work, MEP, finishing and handover, run by our own supervisors. One contract, one programme, one number to call when something needs deciding.',
    scope: ['Civil and structure', 'MEP coordination', 'Finishing and fit-out', 'Snagging and handover'],
    image: '/images/services/contracting.png',
    alt: 'Site leads reviewing drawings on an active concrete frame with a crane behind',
    headline: 'Drawn here. Built here.',
    lead: 'The people who signed the drawing set are still on the call when the slab is cast. That is the whole argument for keeping design and build under one roof.',
    body: [
      'Contracting is not a handover to a third party with a different interpretation of the drawing. Our supervisors run civil, MEP and finish against the approved set, with weekly progress you can actually track.',
      'Snagging is written, not verbal. Warranties and as-built drawings leave with the keys - and we stay reachable after the last invoice.',
    ],
    deliverables: [
      {
        title: 'Programme and cost',
        text: 'A dated programme and a running cost position, updated as the site moves.',
      },
      {
        title: 'Civil and structure',
        text: 'Foundations, frame and envelope executed to the structural and architectural set.',
      },
      {
        title: 'MEP coordination',
        text: 'Electrical, plumbing and HVAC laid out against the furniture and finish plans.',
      },
      {
        title: 'Finish and handover',
        text: 'Fit-out, snag list closed in writing, and a documented handover package.',
      },
    ],
    outcomes: [
      'One contract across design and build',
      'Weekly site notes and photographs',
      'MEP coordinated before finishes land',
      'Written snag closure before keys',
    ],
    gallery: [
      {
        src: unsplash('photo-1541888946425-d81bb19240f5', 1400),
        alt: 'Construction crane above a concrete frame',
        span: 'wide',
      },
      {
        src: unsplash('photo-1503387762-592deb58ef4e', 1000),
        alt: 'Architect reviewing drawings on a building site',
      },
      {
        src: unsplash('photo-1504917595217-d4dc5ebe6122', 1000),
        alt: 'Workers installing structural steel',
      },
      {
        src: unsplash('photo-1589939705384-5185137a7f0f', 1200),
        alt: 'Finished interior shortly after site handover',
        span: 'wide',
      },
    ],
    video: {
      src: 'https://videos.pexels.com/video-files/5532760/5532760-uhd_2560_1440_25fps.mp4',
      poster: unsplash('photo-1504307651254-35680f356dfd', 1600),
      caption: 'Site pace - the drawing set becoming a building.',
    },
  },
  {
    id: 'project-management',
    slug: 'project-management',
    index: '03',
    title: 'Project Management',
    line: 'One programme that keeps design, cost and site in step.',
    detail:
      'Brief to handover under a single lead: schedules, budgets, consultants and site decisions coordinated so nothing waits on a missing email.',
    scope: ['Programme and milestones', 'Cost control', 'Consultant coordination', 'Quality and handover'],
    image: '/images/services/project-management.png',
    alt: 'Plans, schedule and material samples on a desk with a construction site beyond',
    headline: 'The calendar, the budget, the call.',
    lead: 'Someone has to own the whole path from brief to keys. We put a project lead on that path - so design, procurement and site share one programme instead of three calendars.',
    body: [
      'Project management here is not a separate layer that audits from outside. The same studio that draws and builds runs the programme: milestones, cash flow, consultant packages and site decisions in one thread you can follow.',
      'When a detail changes, cost and date move with it - written, not verbal. You get a clear view of where the project stands, what is blocking next week, and who is closing it.',
    ],
    deliverables: [
      {
        title: 'Programme and milestones',
        text: 'A dated programme from kickoff to handover, updated as the site and supply chain move.',
      },
      {
        title: 'Cost position',
        text: 'A running cost report against the approved budget, with variations logged before they become surprises.',
      },
      {
        title: 'Consultant coordination',
        text: 'Structural, MEP and specialist packages sequenced so drawings arrive when the site needs them.',
      },
      {
        title: 'Quality and close-out',
        text: 'Inspection notes, snag tracking and a documented handover so keys leave with a clear paper trail.',
      },
    ],
    outcomes: [
      'One project lead across design and build',
      'Visible programme and cost at every stage',
      'Consultants sequenced to the site calendar',
      'Written close-out before handover',
    ],
    gallery: [
      {
        src: unsplash('photo-1503387762-592deb58ef4e', 1400),
        alt: 'Team reviewing drawings on a construction site',
        span: 'wide',
      },
      {
        src: unsplash('photo-1432888498266-38ffec3eaf0a', 1000),
        alt: 'Meeting table with plans and a laptop open',
      },
      {
        src: unsplash('photo-1541888946425-d81bb19240f5', 1000),
        alt: 'Crane and concrete frame under construction',
      },
      {
        src: unsplash('photo-1486406146926-c627a92ad1ab', 1200),
        alt: 'Completed commercial building exterior',
        span: 'wide',
      },
    ],
    video: {
      poster: '/images/services/project-management.png',
      caption: 'Programme and site - the path from brief to keys.',
    },
  },
]

