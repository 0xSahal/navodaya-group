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

export type ProjectCategory = 'Residential' | 'Commercial' | 'Interior'

export type ProjectGalleryItem = {
  src: string
  alt: string
  /** Optional span hint for the editorial gallery grid. */
  span?: 'normal' | 'wide'
}

/**
 * One portfolio case study. Homepage teasers, `/projects`, and `/projects/[slug]`
 * all read from this shape - field names stay Sanity-ready for a later CMS swap.
 */
export type Project = {
  id: string
  slug: string
  title: string
  category: ProjectCategory
  location: string
  year: string
  scope: string
  client: string
  image: string
  alt: string
  /** Column span within the 12-column editorial grid. */
  span: 5 | 6 | 7
  /** Deliberately mixed so the grid staggers instead of marching in rows. */
  ratio: 'landscape' | 'portrait' | 'square'
  /** Detail-page hero headline. */
  headline: string
  /** Longer lead under the headline. */
  lead: string
  /** Body paragraphs for the story band. */
  body: string[]
  challenge: string
  approach: string
  outcomes: string[]
  gallery: ProjectGalleryItem[]
}

/**
 * Portfolio case studies. Photography and project names are Navodaya work;
 * some location/year/copy fields remain studio placeholders until verified.
 */
export const projects: Project[] = [
  {
    id: 'mr-shekhar-agarwal-living-room',
    slug: 'mr-shekhar-agarwal-living-room',
    title: 'Mr. Shekhar Agarwal Living Room',
    category: 'Interior',
    location: 'Pune',
    year: '2015',
    scope: 'Interior Design',
    client: 'Mr. Shekhar Agarwal',
    image: '/images/projects/mr-shekhar-agarwal-living-room/cover.png',
    alt: 'Mr. Shekhar Agarwal living room with grey sofa, green leaf-pattern chairs, black tables, and checkered marble floor',
    span: 7,
    ratio: 'landscape',
    headline: 'A living room held by geometry, fabric, and a quiet black centre.',
    lead: 'A full living-room interior for Mr. Shekhar Agarwal - checkered stone underfoot, charcoal soft seating, lime-to-forest accent chairs, and glossy black drum tables that anchor the plan.',
    body: [
      'The room needed to feel composed without becoming stiff. We set a large-scale checkered floor as the primary order, kept the wall planes calm, and let colour arrive through custom lounge chairs rather than painted drama.',
      'Upholstery and timber pieces were drawn as one set with the layout: a low grey sofa for daily use, curved wood frames for the formal pair, and black cylindrical tables that read as sculpture instead of clutter.',
    ],
    challenge:
      'Turn a bright, open living floor into a room with clear seating zones, durable materials, and a palette that stays calm while still carrying a strong accent.',
    approach:
      'Lead with the floor geometry, place soft seating against a quiet wall, introduce colour only in the accent chairs, and keep tables and joinery in deep black and dark wood so the fabric can speak.',
    outcomes: [
      'A seating plan that reads clear from the entry',
      'Accent chairs that carry colour without loud walls',
      'Black drum tables as a calm visual centre',
      'Furniture and layout coordinated as one interior set',
    ],
    gallery: [
      {
        src: '/images/projects/mr-shekhar-agarwal-living-room/cover.png',
        alt: 'Living room with grey sofa, green accent chairs, and checkered stone floor',
        span: 'wide',
      },
      {
        src: '/images/projects/mr-shekhar-agarwal-living-room/01-living-room.webp',
        alt: 'Grey modular sofa with charcoal cushions and glossy black coffee tables',
      },
      {
        src: '/images/projects/mr-shekhar-agarwal-living-room/02-accent-chairs.webp',
        alt: 'Pair of lounge chairs with lime-to-forest green upholstery',
      },
      {
        src: '/images/projects/mr-shekhar-agarwal-living-room/03-wood-armchairs.webp',
        alt: 'Curved dark wood armchairs with moss-green seat cushions',
        span: 'wide',
      },
      {
        src: '/images/projects/mr-shekhar-agarwal-living-room/04-sofa.webp',
        alt: 'Three-seater sofa in grey pinstripe fabric',
      },
      {
        src: '/images/projects/mr-shekhar-agarwal-living-room/05-armchair.webp',
        alt: 'Boxy armchair in ribbed taupe-grey upholstery',
      },
    ],
  },
  {
    id: 'mbd-office',
    slug: 'mbd-office',
    title: 'MBD Office',
    category: 'Commercial',
    location: 'ITO, New Delhi',
    year: '2015',
    scope: 'Interior + Fit-out',
    client: 'MBD',
    image: '/images/projects/mbd-office/cover.png',
    alt: 'MBD Office open-plan interior with glass railings, blue accent walls, tan chairs, and globe pendants',
    span: 5,
    ratio: 'landscape',
    headline: 'A workspace that stays bright, graphic, and ready for a full floor of desks.',
    lead: 'A commercial office interior at ITO, New Delhi - linear workstations, glass zoning, geometric privacy screens, and a typographic city wall that gives the floor a clear identity.',
    body: [
      'The brief asked for density without feeling sealed. We organised the floor as clear desk rows with a central aisle, used frosted glass for side privacy, and saved colour for the desk screens and accent walls instead of painting every surface.',
      'Suspended mesh frames and globe pendants lift the ceiling plane; blue columns and the city wallpaper pin the brand of the space. Furniture, partitions and graphics were one coordinated set from layout through fit-out.',
    ],
    challenge:
      'Fit a high-density open office into a city-centre floor plate while keeping daylight, acoustic privacy at each desk, and a design that felt energetic rather than generic corporate.',
    approach:
      'Lead with a simple desk grid, layer privacy with glass and printed screens, wrap key walls in typography, and keep joinery in light wood so the colour accents can carry the room.',
    outcomes: [
      'Clear workstation rows with an open circulation aisle',
      'Privacy screens that add colour without closing the room',
      'Glass partitions that keep teams visible and zoned',
      'A feature wall that gives the office a memorable centre',
    ],
    gallery: [
      {
        src: '/images/projects/mbd-office/cover.png',
        alt: 'MBD Office with glass railings, blue accent walls, curved desk, and warm pendant lighting',
        span: 'wide',
      },
      {
        src: '/images/projects/mbd-office/01-workstations.webp',
        alt: 'Open-plan desks with colourful geometric dividers and city wallpaper',
      },
      {
        src: '/images/projects/mbd-office/02-open-plan.webp',
        alt: 'Office interior with typographic wall, globe pendants, and blue accent column',
        span: 'wide',
      },
      {
        src: '/images/projects/mbd-office/03-desk-rows.webp',
        alt: 'Two rows of wood desks with tan chairs and frosted glass screens',
      },
      {
        src: '/images/projects/mbd-office/04-glass-partition.webp',
        alt: 'Desks viewed through glass with suspended metal mesh frames above',
      },
      {
        src: '/images/projects/mbd-office/05-feature-wall.webp',
        alt: 'Glass-zoned workspace with city-name wallpaper and curved timber counter',
        span: 'wide',
      },
      {
        src: '/images/projects/mbd-office/06-ceiling-detail.webp',
        alt: 'Typography wall meeting a black ceiling with suspended white panels and globe lights',
      },
    ],
  },
  {
    id: 'mahagun-sector-137',
    slug: 'mahagun-sector-137',
    title: 'Project at Mahagun, Sector 137',
    category: 'Interior',
    location: 'Sector 137, Noida',
    year: '2023',
    scope: 'Interior Design',
    client: 'Private family',
    image: '/images/projects/mahagun-sector-137/cover.png',
    alt: 'Double-height living room with marble mantel, terracotta seating, zebra ottomans, and tall cream drapes',
    span: 5,
    ratio: 'landscape',
    headline: 'A double-height home interior held by marble, warm metal, and careful light.',
    lead: 'A full residential interior at Mahagun, Sector 137 - a grand living floor, marble kitchens, and bedrooms finished as complete rooms rather than leftover spaces.',
    body: [
      'The living volume needed to feel tall without feeling empty. We set a marble mantel and lit niches as the vertical order, hung a cascading chandelier into the void, and kept seating low so the height could do the work.',
      'Kitchens run in taupe gloss, warm timber, and veined marble with an island that becomes the dining table. Bedrooms shift tone room by room - damask and tufting in one, quiet wood and storage in another - but share the same lighting discipline and joinery language.',
    ],
    challenge:
      'Turn a high-ceiling apartment shell into rooms with clear hierarchy - a living floor that holds scale, kitchens that work hard, and private rooms that feel finished without competing with the main volume.',
    approach:
      'Lead with the double-height living composition, use marble and metal as the public-room register, then carry warm timber and layered lighting into kitchens and bedrooms as a quieter second register.',
    outcomes: [
      'A living floor that uses full height instead of fighting it',
      'Kitchen and dining joined as one working island',
      'Bedrooms with distinct character under one material family',
      'Lighting and joinery coordinated across public and private rooms',
    ],
    gallery: [
      {
        src: '/images/projects/mahagun-sector-137/cover.png',
        alt: 'Double-height living room with marble mantel, terracotta seating, and tall cream drapes',
        span: 'wide',
      },
      {
        src: '/images/projects/mahagun-sector-137/01-living-room.webp',
        alt: 'Living room with marble arch niche and layered cream curtains',
      },
      {
        src: '/images/projects/mahagun-sector-137/02-living-mantel.webp',
        alt: 'Living room with marble mantel, jali niches, and crystal chandelier',
        span: 'wide',
      },
      {
        src: '/images/projects/mahagun-sector-137/03-living-windows.webp',
        alt: 'Living seating facing marble mantel and tall glazed windows',
      },
      {
        src: '/images/projects/mahagun-sector-137/04-kitchen-island.webp',
        alt: 'Kitchen with marble island extending into a timber dining table',
      },
      {
        src: '/images/projects/mahagun-sector-137/05-kitchen.webp',
        alt: 'Taupe and timber kitchen with marble counters and cove lighting',
      },
      {
        src: '/images/projects/mahagun-sector-137/06-kitchen-dining.webp',
        alt: 'Kitchen island with spherical pendants over the dining edge',
        span: 'wide',
      },
      {
        src: '/images/projects/mahagun-sector-137/07-master-bedroom.webp',
        alt: 'Master bedroom with damask feature wall and tufted headboard',
      },
      {
        src: '/images/projects/mahagun-sector-137/08-bedroom.webp',
        alt: 'Bedroom with TV feature wall, zig-zag bookshelf, and pendant lights',
      },
      {
        src: '/images/projects/mahagun-sector-137/09-bedroom-lounge.webp',
        alt: 'Bedroom with wood leaf feature wall and lounge seating',
      },
    ],
  },
  {
    id: 'smaaash-gurgaon',
    slug: 'smaaash-gurgaon',
    title: 'Smaaash, Gurgaon',
    category: 'Commercial',
    location: 'Gurgaon',
    year: '2017',
    scope: 'Interior + Fit-out',
    client: 'Smaaash',
    image: '/images/projects/smaaash-gurgaon/cover.png',
    alt: 'Smaaash banquet hall with black table settings, pink chair ribbons, and suspended circular ceiling panels',
    span: 7,
    ratio: 'landscape',
    headline: 'Event rooms that can flip from banquet to briefing without losing the room.',
    lead: 'Commercial interiors for Smaaash in Gurgaon - banquet floors, a seminar room, and themed walls under one ceiling language of suspended circular panels and warm point light.',
    body: [
      'The halls had to host formal dinners and corporate sessions in the same shell. We kept the floor open and reflective, hung a field of circular panels into the black ceiling, and let wall graphics carry the theme - clocks and gears toward Champions Lounge, library sketches in the seminar room, music motifs on the banquet side.',
      'Furniture and lighting were planned as a flexible set: round tables for banquet service, theatre rows for presentations, and the same warm ceiling glow reading correctly in both modes.',
    ],
    challenge:
      'Fit entertainment-venue energy into rooms that also need to host formal dining and clean presentations, without the spaces feeling like temporary event hire.',
    approach:
      'Unify the halls with one ceiling and lighting system, zone themes through wall graphics rather than heavy construction, and keep furniture layouts that can reset between banquet and seminar.',
    outcomes: [
      'A ceiling treatment that holds every hall together',
      'Banquet and seminar modes in the same fit-out language',
      'Themed walls that brand the rooms without clutter',
      'Warm lighting that works for dinner and projection',
    ],
    gallery: [
      {
        src: '/images/projects/smaaash-gurgaon/cover.png',
        alt: 'Black banquet setup with circular ceiling discs and graphic walls',
        span: 'wide',
      },
      {
        src: '/images/projects/smaaash-gurgaon/01-banquet-beige.webp',
        alt: 'Beige banquet tables under suspended circular ceiling panels',
      },
      {
        src: '/images/projects/smaaash-gurgaon/02-seminar.webp',
        alt: 'Seminar room with library mural and rows facing a projection screen',
      },
      {
        src: '/images/projects/smaaash-gurgaon/03-champions-lounge.webp',
        alt: 'Themed banquet hall with clock wall graphics and Champions Lounge entry',
        span: 'wide',
      },
      {
        src: '/images/projects/smaaash-gurgaon/04-themed-banquet.webp',
        alt: 'Banquet tables with music and clock wall graphics',
      },
    ],
  },
  {
    id: 'jasola-residence',
    slug: 'jasola-residence',
    title: 'Residential Project in Jasola, New Delhi',
    category: 'Interior',
    location: 'Jasola, New Delhi',
    year: '2023',
    scope: 'Interior Design',
    client: 'Private family',
    image: '/images/projects/jasola-residence/cover.webp',
    alt: 'Living room with grey L-shaped sofa, teal cushions, and gold diamond lattice feature wall',
    span: 6,
    ratio: 'landscape',
    headline: 'A city home finished in soft neutrals, teal accents, and careful gold light.',
    lead: 'A full residential interior in Jasola, New Delhi - living and dining rooms with lattice and mirror detail, a teal kitchen, and bedrooms planned as complete suites with storage and seating.',
    body: [
      'Public rooms needed polish without hardness. We set living seating against gold lattice and mirror panels, kept dining under a ringed chandelier on a black table, and let teal appear as a controlled accent across sofas, cushions, and kitchen cabinets.',
      'Private rooms repeat the same discipline: tall wardrobes, layered cove lighting, and feature walls that change tone room by room - soft beige in the master, darker wood and lit niches where a bedroom also works as a study.',
    ],
    challenge:
      'Deliver a complete apartment interior with a clear public-room identity and private rooms that feel finished, while keeping storage, lighting, and materials under one coordinated language.',
    approach:
      'Lead with living and dining as the showpiece register, carry teal and gold as accents rather than themes, and resolve bedrooms as suites with wardrobe, lighting, and a seating or work edge built in.',
    outcomes: [
      'Living and dining rooms with a clear material hierarchy',
      'A kitchen that continues the accent colour without noise',
      'Bedrooms resolved as suites, not leftover boxes',
      'Lighting and joinery coordinated across the flat',
    ],
    gallery: [
      {
        src: '/images/projects/jasola-residence/cover.webp',
        alt: 'Living room with grey sofa, teal cushions, and gold diamond lattice wall',
        span: 'wide',
      },
      {
        src: '/images/projects/jasola-residence/01-dining.webp',
        alt: 'Dining room with black table, bouclé chairs, and gold ring chandelier',
      },
      {
        src: '/images/projects/jasola-residence/02-living-teal.webp',
        alt: 'Teal channel sofa with mustard cushions against gold-framed wall panels',
      },
      {
        src: '/images/projects/jasola-residence/03-living-lounge.webp',
        alt: 'Living lounge with bronze accent wall and gold bird wall art',
        span: 'wide',
      },
      {
        src: '/images/projects/jasola-residence/04-kitchen.webp',
        alt: 'U-shaped kitchen with teal lower cabinets and marble backsplash',
      },
      {
        src: '/images/projects/jasola-residence/05-master-bedroom.webp',
        alt: 'Master bedroom with beige headboard, lounge seating, and cove lighting',
      },
      {
        src: '/images/projects/jasola-residence/06-bedroom.webp',
        alt: 'Bedroom with tall white wardrobes and textured gold feature wall',
      },
      {
        src: '/images/projects/jasola-residence/07-bedroom-suite.webp',
        alt: 'Bedroom suite with wardrobe, lit vanity, and patterned rug',
        span: 'wide',
      },
      {
        src: '/images/projects/jasola-residence/08-studio-bedroom.webp',
        alt: 'Bedroom with built-in desk, lounge seating, and full-height wardrobe',
      },
      {
        src: '/images/projects/jasola-residence/09-dark-bedroom.webp',
        alt: 'Bedroom with black slatted feature wall, lit niches, and study desk',
      },
    ],
  },
  {
    id: 'pune-residence',
    slug: 'pune-residence',
    title: 'Residential Project in Pune',
    category: 'Interior',
    location: 'Pune',
    year: '2022',
    scope: 'Interior Design',
    client: 'Private family',
    image: '/images/projects/pune-residence/cover.webp',
    alt: 'Open living and dining with orange leather sofa, wood media wall, and floral dining chairs',
    span: 6,
    ratio: 'landscape',
    headline: 'A home that opens warm - timber grain, orange seating, and rooms lit from under the furniture.',
    lead: 'A residential interior in Pune - living and dining as one open floor, a grain-forward entry, and bedrooms finished with murals, brick, and layered LED glow.',
    body: [
      'The public rooms needed to feel continuous. We set an orange leather sofa against a horizontal timber media wall, kept dining beside it under small pendants, and let floor-to-ceiling curtains hold the long glazed edge.',
      'Private rooms shift character without leaving the same lighting language: a mural bedroom with cage pendant and blue accents, a brick-and-pattern bedroom that floats on under-bed light, and a master with backlit niches on an orange wall.',
    ],
    challenge:
      'Connect living, dining and entry as one warm public sequence, then give each bedroom a clear identity without breaking the material and lighting system of the flat.',
    approach:
      'Lead with timber and warm metal in the public rooms, use murals and texture for bedroom character, and rely on cove, under-furniture and niche lighting rather than a single bright centre.',
    outcomes: [
      'Living and dining that read as one open room',
      'An entry that announces the home through wood and light',
      'Bedrooms with distinct character under one lighting approach',
      'Furniture and joinery coordinated with layered LEDs',
    ],
    gallery: [
      {
        src: '/images/projects/pune-residence/cover.webp',
        alt: 'Open living and dining with orange sofa and wood media wall',
        span: 'wide',
      },
      {
        src: '/images/projects/pune-residence/01-dining.webp',
        alt: 'Dining table with floral chairs and sunburst mirror',
      },
      {
        src: '/images/projects/pune-residence/02-living.webp',
        alt: 'Living room with wood media wall, lit shelves, and orange sectional',
      },
      {
        src: '/images/projects/pune-residence/03-entry.webp',
        alt: 'Foyer with high-contrast wood door, chandelier, and petal-lit cabinet ledge',
        span: 'wide',
      },
      {
        src: '/images/projects/pune-residence/04-master-bedroom.webp',
        alt: 'Master bedroom with orange wall, backlit headboard niches, and under-bed glow',
      },
      {
        src: '/images/projects/pune-residence/05-bedroom-mural.webp',
        alt: 'Bedroom with Mediterranean street mural and tufted headboard',
      },
      {
        src: '/images/projects/pune-residence/06-bedroom-brick.webp',
        alt: 'Bedroom with brick inset, green swirl wallpaper, and floating bed lighting',
        span: 'wide',
      },
      {
        src: '/images/projects/pune-residence/07-bedroom-street.webp',
        alt: 'Bedroom with street-scene mural, blue pillows, and cage pendant light',
      },
    ],
  },
]

