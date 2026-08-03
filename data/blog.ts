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

export type BlogBlock =
  | { type: 'heading'; level: 2 | 3; text: string; id: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered?: boolean; items: string[] }
  | { type: 'quote'; text: string; cite?: string }
  | { type: 'image'; src: string; alt: string; caption?: string }

/**
 * One journal post. Hub and `/blog/[slug]` both read from this shape - field
 * names stay Sanity-ready for a later CMS swap.
 *
 * Author names are invented placeholders for the demo. Replace with Navodaya’s
 * real voices before this is shown as fact.
 */
export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  category: string
  publishedAt: string
  readingMinutes: number
  cover: { src: string; alt: string }
  author: { name: string; role: string }
  body: BlogBlock[]
}

export const posts: BlogPost[] = [
  {
    slug: 'design-and-build-under-one-roof',
    title: 'Designing and building under one roof',
    excerpt:
      'Why splitting the drawing set from the site team is where most budgets and timelines quietly fail - and how one studio closes the gap.',
    category: 'Practice',
    publishedAt: '2025-11-12',
    readingMinutes: 7,
    cover: {
      src: unsplash('photo-1600585154340-be6161a56a0c', 1600),
      alt: 'Dark-clad house lit from within at dusk',
    },
    author: { name: 'Arjun Mehta', role: 'Principal, Design' },
    body: [
      {
        type: 'paragraph',
        text: 'Most clients do not set out to hire two firms. They hire an architect, then a contractor, then discover that the joinery detail that looked perfect on paper does not survive the first monsoon on site. The gap between those two offices is where cost and calendar usually go wrong.',
      },
      {
        type: 'heading',
        level: 2,
        id: 'the-handoff-problem',
        text: 'The handoff problem',
      },
      {
        type: 'paragraph',
        text: 'A handoff is not a document package. It is a moment when accountability thins. The designer moves on to the next brief. The builder invents what the drawing left open. Neither owns the whole outcome.',
      },
      {
        type: 'list',
        items: [
          'Details that were “to be confirmed” become site improvisation',
          'Material boards approved under studio lighting fail under site LEDs',
          'Programme slips while two offices argue over whose drawing was wrong',
        ],
      },
      {
        type: 'heading',
        level: 2,
        id: 'one-contract-one-lead',
        text: 'One contract, one lead',
      },
      {
        type: 'paragraph',
        text: 'When design and build sit in the same studio, the person who set the massing is still in the room when the waterproofing is decided. Change orders stay on paper. Snags have a name attached.',
      },
      {
        type: 'quote',
        text: 'If a detail is wrong, there is no one else to blame. That is not a risk - it is the product.',
        cite: 'Studio principle',
      },
      {
        type: 'heading',
        level: 3,
        id: 'what-clients-actually-buy',
        text: 'What clients actually buy',
      },
      {
        type: 'paragraph',
        text: 'They are not buying a prettier PDF. They are buying a building that matches what they signed off - and a programme that still holds when the monsoon arrives two weeks early.',
      },
      {
        type: 'heading',
        level: 2,
        id: 'when-separation-still-makes-sense',
        text: 'When separation still makes sense',
      },
      {
        type: 'paragraph',
        text: 'Large institutional work sometimes needs independent review. For houses, workplaces and commercial interiors at the scale we run, one roof is usually the cleaner answer. Honesty about that boundary is part of the brief.',
      },
      {
        type: 'image',
        src: unsplash('photo-1600607687939-ce8a6c25118c', 1400),
        alt: 'Double-height living room with a concrete stair',
        caption: 'The drawing and the room should describe the same life.',
      },
    ],
  },
  {
    slug: 'weekly-site-programme',
    title: 'How a weekly site programme actually works',
    excerpt:
      'A programme is not a Gantt chart you ignore after kickoff. Here is the rhythm that keeps cost and calendar from becoming surprises.',
    category: 'Project management',
    publishedAt: '2025-09-28',
    readingMinutes: 6,
    cover: {
      src: unsplash('photo-1503387762-592deb58ef4e', 1600),
      alt: 'Architectural drawings and plans on a work table',
    },
    author: { name: 'Meera Kapoor', role: 'Head of Project Management' },
    body: [
      {
        type: 'paragraph',
        text: 'Clients ask for a timeline. What they need is a weekly habit: what finished last week, what is live this week, what is blocked, and what it costs if the block holds.',
      },
      {
        type: 'heading',
        level: 2,
        id: 'the-monday-note',
        text: 'The Monday note',
      },
      {
        type: 'paragraph',
        text: 'Every Monday the project lead sends a short note - photographs, percent complete by trade, and a single sentence on cash position. No novel. No surprise invoice buried in a paragraph.',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'What closed last week (with photos)',
          'What is in play this week (named trades)',
          'What is waiting on a decision - and whose decision',
          'Revised finish date if anything moved',
        ],
      },
      {
        type: 'heading',
        level: 2,
        id: 'critical-path-vs-busy-work',
        text: 'Critical path versus busy work',
      },
      {
        type: 'paragraph',
        text: 'A site can look busy and still be late. Waterproofing before finishes, electrical before false ceiling, joinery after plaster - the sequence is the product. The programme protects that sequence, not the appearance of activity.',
      },
      {
        type: 'quote',
        text: 'If the critical path is wrong, every green tick on the board is decoration.',
      },
      {
        type: 'heading',
        level: 2,
        id: 'when-dates-move',
        text: 'When dates move',
      },
      {
        type: 'paragraph',
        text: 'Monsoon, municipal delay, a client change to the kitchen - dates move. The rule is that they move in writing, with the cost of the move named the same week. Silence is how “two weeks” becomes three months.',
      },
      {
        type: 'heading',
        level: 3,
        id: 'client-decisions',
        text: 'Client decisions on the critical path',
      },
      {
        type: 'paragraph',
        text: 'Material boards and layout sign-offs belong on the programme with owners and due dates. A late tile choice is not a preference - it is a programme event.',
      },
    ],
  },
  {
    slug: 'materials-that-age-honestly',
    title: 'Materials that age honestly in Indian light',
    excerpt:
      'Soft schemes that look perfect under studio LEDs often fail on site. How we choose finishes that hold up in heat, dust and monsoon.',
    category: 'Materials',
    publishedAt: '2025-07-14',
    readingMinutes: 8,
    cover: {
      src: unsplash('photo-1618221195710-dd6b41faaea6', 1600),
      alt: 'Warm living room with timber ceiling and garden window',
    },
    author: { name: 'Priya Shah', role: 'Principal, Interiors' },
    body: [
      {
        type: 'paragraph',
        text: 'Indian light is not a filter. It is a material. West façades bleach. Everything collects dust. Monsoon humidity finds the shortcut in a poorly detailed joint. Finish boards that ignore that are theatre.',
      },
      {
        type: 'heading',
        level: 2,
        id: 'approve-under-site-light',
        text: 'Approve under site light',
      },
      {
        type: 'paragraph',
        text: 'We hold boards on site before paint goes on. Warm timber that felt calm in the studio can turn orange under cool LED. Correcting that before the painters arrive is cheaper than living with it for ten years.',
      },
      {
        type: 'heading',
        level: 2,
        id: 'materials-that-earn-their-keep',
        text: 'Materials that earn their keep',
      },
      {
        type: 'list',
        items: [
          'Stone and plaster that can be repaired, not films that peel',
          'Timber sealed for local humidity, not imported looks without a maintenance plan',
          'Metals chosen for patina you will accept, not polish you will chase',
        ],
      },
      {
        type: 'image',
        src: unsplash('photo-1616486338812-3dadae4b4ace', 1400),
        alt: 'Kitchen with stone counters and open shelving',
        caption: 'Stone and timber that can take daily use - not just a photoshoot.',
      },
      {
        type: 'heading',
        level: 2,
        id: 'climate-before-moodboard',
        text: 'Climate before moodboard',
      },
      {
        type: 'paragraph',
        text: 'Deep eaves, cross-ventilation and honest envelope detailing do more for comfort than any beige palette. Interiors inherit the climate decisions architecture already made - or they fight them forever.',
      },
      {
        type: 'quote',
        text: 'If the material needs a disclaimer every monsoon, it was the wrong material.',
        cite: 'Finish review note',
      },
      {
        type: 'heading',
        level: 3,
        id: 'maintenance-as-design',
        text: 'Maintenance as design',
      },
      {
        type: 'paragraph',
        text: 'We write a short care note into handover: what to oil, what to leave alone, what fails if you pressure-wash it. Longevity is a specification, not a hope.',
      },
    ],
  },
  {
    slug: 'briefing-interiors-that-match-architecture',
    title: 'Briefing an interior that matches the architecture',
    excerpt:
      'When rooms and envelope are drawn by different teams, the house feels stitched together. Here is how we brief interiors as one set.',
    category: 'Interiors',
    publishedAt: '2025-05-03',
    readingMinutes: 6,
    cover: {
      src: unsplash('photo-1600210492486-724fe5c67fb0', 1600),
      alt: 'Dining area with a long timber table under pendant lights',
    },
    author: { name: 'Priya Shah', role: 'Principal, Interiors' },
    body: [
      {
        type: 'paragraph',
        text: 'An interior brief that starts after the building is frozen is already late. Joinery depths, lighting layers and storage belong in the same drawing set as the structure - or the rooms will always feel like they arrived later.',
      },
      {
        type: 'heading',
        level: 2,
        id: 'start-with-how-the-day-runs',
        text: 'Start with how the day runs',
      },
      {
        type: 'paragraph',
        text: 'We ask where bags land, where children do homework, where guests actually sit. Moodboards come after that. A beautiful sofa in the wrong place is still a planning failure.',
      },
      {
        type: 'heading',
        level: 2,
        id: 'one-drawing-set',
        text: 'One drawing set',
      },
      {
        type: 'list',
        items: [
          'Furniture and joinery coordinated with structure and MEP',
          'Lighting designed with the electrical set, not as afterthought pendants',
          'Finish schedules that a site team can buy against without guessing',
        ],
      },
      {
        type: 'heading',
        level: 3,
        id: 'storage-as-architecture',
        text: 'Storage as architecture',
      },
      {
        type: 'paragraph',
        text: 'Wardrobes and utility walls should thicken the plan, not float as furniture. When storage is designed early, living rooms stay calm without looking empty.',
      },
      {
        type: 'quote',
        text: 'If the envelope and the interior describe different lives, the client will feel it every morning.',
      },
      {
        type: 'heading',
        level: 2,
        id: 'sign-off-that-means-something',
        text: 'Sign-off that means something',
      },
      {
        type: 'paragraph',
        text: 'Client approval is a dated set - plans, elevations, finish board photographs. Verbal “looks fine” is not a sign-off. The site only builds what is written.',
      },
    ],
  },
  {
    slug: 'what-handover-should-include',
    title: 'What handover should include before you take the keys',
    excerpt:
      'Keys are not the finish line. A proper handover closes snags in writing and leaves you with drawings, warranties and a team that still answers the phone.',
    category: 'Handover',
    publishedAt: '2025-02-18',
    readingMinutes: 5,
    cover: {
      src: unsplash('photo-1600566753190-17f0baa2a6c3', 1600),
      alt: 'Covered outdoor dining with warm evening light',
    },
    author: { name: 'Rahul Desai', role: 'Director, Contracting' },
    body: [
      {
        type: 'paragraph',
        text: 'Handover is when many contractors disappear. For us it is a named phase on the programme - joint walkthrough, written snag list, and a close-out pack you can hold.',
      },
      {
        type: 'heading',
        level: 2,
        id: 'the-joint-walkthrough',
        text: 'The joint walkthrough',
      },
      {
        type: 'paragraph',
        text: 'Client, project lead and finishing supervisor walk the building room by room. Every mark goes on a list with an owner and a date. Nothing is “we will look at it later” without a name.',
      },
      {
        type: 'heading',
        level: 2,
        id: 'the-close-out-pack',
        text: 'The close-out pack',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'As-built drawings and key product data sheets',
          'Warranties and service contacts for equipment',
          'Paint and finish schedules for future repair',
          'Snag list signed closed - or still open items with dates',
        ],
      },
      {
        type: 'quote',
        text: 'If you cannot find who to call six months later, handover failed - even if the photos looked finished.',
      },
      {
        type: 'heading',
        level: 2,
        id: 'after-the-keys',
        text: 'After the keys',
      },
      {
        type: 'paragraph',
        text: 'We stay reachable for seasonal settlement and genuine defects covered by the agreement. That is not unlimited free work - it is continuity. The difference matters, and it should be written down.',
      },
      {
        type: 'heading',
        level: 3,
        id: 'a-simple-test',
        text: 'A simple test',
      },
      {
        type: 'paragraph',
        text: 'Before you celebrate, ask: do I have the drawings, the warranties, the closed snag list, and a phone number that still works? If any answer is no, you do not have handover yet - you have a ceremony.',
      },
    ],
  },
]

export function getTocItems(post: BlogPost) {
  return post.body
    .filter((block): block is Extract<BlogBlock, { type: 'heading' }> => block.type === 'heading')
    .map((block) => ({ id: block.id, text: block.text, level: block.level }))
}

export function formatPostDate(iso: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso))
}
