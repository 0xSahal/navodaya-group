import 'server-only'
import { sanityFetch, sanityFetchFresh } from './client'
import { toSiteImage, type SiteImage } from './image'
import * as Q from './queries'
import type { BlogBlock, BlogPost } from '@/data/blog'
import type { Project, ProjectCategory } from '@/data/projects'
import type { Service } from '@/data/services'
import type { Testimonial } from '@/data/testimonials'
import type { HeroSlide } from '@/data/hero'
import type { TeamMember, TimelineItem, AboutValue } from '@/data/about'
import type { Reason, ProcessStep, Stat } from '@/data/studio'

/*
 * This module is the seam between Sanity and the site. Every function returns
 * the same shapes the components already used when content lived in `data/*`,
 * so the CMS swap is invisible to the JSX.
 */

/** `01`, `02`, ... derived from position rather than stored, so order is truth. */
const numbered = (index: number) => String(index + 1).padStart(2, '0')

type PortableBlock = {
  _type: string
  _key?: string
  style?: string
  listItem?: string
  children?: { text?: string }[]
  [key: string]: unknown
}

/** Flattens paragraph-only Portable Text. Marks are disabled on these fields. */
function toParagraphs(blocks: PortableBlock[] | undefined): string[] {
  if (!Array.isArray(blocks)) return []
  return blocks
    .filter((block) => block._type === 'block')
    .map((block) => (block.children ?? []).map((child) => child.text ?? '').join(''))
    .filter((text) => text.trim().length > 0)
}

/** Stable heading id for the article table of contents. */
const headingId = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)

/**
 * Portable Text back into the block union the article template renders.
 *
 * Consecutive list items are merged into one list block, which is how the
 * editor thinks of them and how the template expects them.
 */
function toBlogBlocks(blocks: PortableBlock[] | undefined): BlogBlock[] {
  if (!Array.isArray(blocks)) return []
  const out: BlogBlock[] = []

  for (const block of blocks) {
    if (block._type === 'figure') {
      const image = toSiteImage(block as never, 1600)
      if (image) {
        out.push({
          type: 'image',
          src: image.src,
          alt: image.alt,
          ...(image.caption ? { caption: image.caption } : {}),
        })
      }
      continue
    }

    if (block._type !== 'block') continue

    const text = (block.children ?? []).map((child) => child.text ?? '').join('')
    if (!text.trim()) continue

    if (block.listItem) {
      const ordered = block.listItem === 'number'
      const previous = out[out.length - 1]
      if (previous?.type === 'list' && Boolean(previous.ordered) === ordered) {
        previous.items.push(text)
      } else {
        out.push({ type: 'list', ordered, items: [text] })
      }
      continue
    }

    if (block.style === 'h2' || block.style === 'h3') {
      out.push({
        type: 'heading',
        level: block.style === 'h3' ? 3 : 2,
        text,
        id: headingId(text),
      })
      continue
    }

    if (block.style === 'blockquote') {
      out.push({ type: 'quote', text })
      continue
    }

    out.push({ type: 'paragraph', text })
  }

  return out
}

/** Reading time from the actual words, so it cannot drift from the text. */
function readingMinutes(blocks: BlogBlock[]): number {
  const words = blocks
    .map((block) => {
      if (block.type === 'paragraph' || block.type === 'heading' || block.type === 'quote') {
        return block.text
      }
      if (block.type === 'list') return block.items.join(' ')
      return ''
    })
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.round(words / 220))
}

/** The CMS exposes three safe presets; the grid needs a span and a ratio. */
function fromEmphasis(emphasis: string | undefined): Pick<Project, 'span' | 'ratio'> {
  if (emphasis === 'tall') return { span: 5, ratio: 'portrait' }
  if (emphasis === 'wide') return { span: 7, ratio: 'landscape' }
  return { span: 5, ratio: 'landscape' }
}

const fallbackImage = (image: SiteImage | null) => image ?? { src: '', alt: '' }

// ---------------------------------------------------------------- projects --

function mapProjectCard(raw: Record<string, unknown>): Project {
  const cover = fallbackImage(toSiteImage(raw.cover as never, 1400))
  return {
    id: raw.id as string,
    slug: raw.slug as string,
    title: raw.title as string,
    category: raw.category as ProjectCategory,
    location: raw.location as string,
    year: raw.year as string,
    scope: raw.scope as string,
    client: (raw.client as string) ?? '',
    image: cover.src,
    alt: cover.alt,
    ...fromEmphasis(raw.emphasis as string | undefined),
    headline: (raw.headline as string) ?? '',
    lead: (raw.lead as string) ?? '',
    body: toParagraphs(raw.body as PortableBlock[]),
    challenge: (raw.challenge as string) ?? '',
    approach: (raw.approach as string) ?? '',
    outcomes: (raw.outcomes as string[]) ?? [],
    gallery: ((raw.gallery as unknown[]) ?? [])
      .map((item) => toSiteImage(item as never, 1400))
      .filter(Boolean)
      .map((image) => ({ src: image!.src, alt: image!.alt, span: image!.span })),
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const raw = await sanityFetch<Record<string, unknown>[]>(Q.FEATURED_PROJECTS_QUERY)
  return raw.map(mapProjectCard)
}

export async function getAllProjects(): Promise<Project[]> {
  const raw = await sanityFetch<Record<string, unknown>[]>(Q.ALL_PROJECTS_QUERY)
  return raw.map(mapProjectCard)
}

export async function getProject(slug: string): Promise<Project | null> {
  const raw = await sanityFetch<Record<string, unknown> | null>(Q.PROJECT_BY_SLUG_QUERY, { slug })
  return raw ? mapProjectCard(raw) : null
}

export async function getProjectSlugs(): Promise<string[]> {
  return sanityFetchFresh<string[]>(Q.PROJECT_SLUGS_QUERY)
}

export async function getProjectFilters(): Promise<Array<'All' | ProjectCategory>> {
  const raw = await sanityFetch<{ title: ProjectCategory }[]>(Q.PROJECT_CATEGORIES_QUERY)
  return ['All', ...raw.map((category) => category.title)]
}

/**
 * Same category first, then anything else, to a fixed count. Mirrors the
 * behaviour of the old in-memory helper so the pages read identically.
 */
export async function getRelatedProjects(slug: string, limit = 3): Promise<Project[]> {
  const all = await getAllProjects()
  const current = all.find((project) => project.slug === slug)
  if (!current) return []

  const others = all.filter((project) => project.slug !== slug)
  const sameCategory = others.filter((project) => project.category === current.category)
  const rest = others.filter((project) => project.category !== current.category)
  return [...sameCategory, ...rest].slice(0, limit)
}

// ---------------------------------------------------------------- services --

function mapService(raw: Record<string, unknown>, index: number): Service {
  const cover = fallbackImage(toSiteImage(raw.cover as never, 1200))
  const atmosphere = (raw.atmosphere ?? {}) as Record<string, unknown>
  const poster = toSiteImage(atmosphere.poster as never, 1600)

  return {
    id: raw.id as string,
    slug: raw.slug as string,
    index: numbered(index),
    title: raw.title as string,
    line: raw.line as string,
    detail: raw.detail as string,
    scope: (raw.scope as string[]) ?? [],
    image: cover.src,
    alt: cover.alt,
    headline: (raw.headline as string) ?? '',
    lead: (raw.lead as string) ?? '',
    body: toParagraphs(raw.body as PortableBlock[]),
    deliverables: ((raw.deliverables as { title: string; text: string }[]) ?? []).map((item) => ({
      title: item.title,
      text: item.text,
    })),
    outcomes: (raw.outcomes as string[]) ?? [],
    gallery: ((raw.gallery as unknown[]) ?? [])
      .map((item) => toSiteImage(item as never, 1400))
      .filter(Boolean)
      .map((image) => ({ src: image!.src, alt: image!.alt, span: image!.span })),
    video: {
      ...(atmosphere.videoUrl ? { src: atmosphere.videoUrl as string } : {}),
      poster: poster?.src ?? cover.src,
      caption: (atmosphere.caption as string) ?? '',
    },
  }
}

export async function getServices(): Promise<Service[]> {
  const raw = await sanityFetch<Record<string, unknown>[]>(Q.ALL_SERVICES_QUERY)
  return raw.map(mapService)
}

/**
 * The detail page needs the full document, not the card projection used by the
 * lists. Reading it through `getServices()` silently dropped headline, lead,
 * body, deliverables and outcomes, which rendered the page as empty bands.
 */
export async function getService(slug: string): Promise<Service | null> {
  const raw = await sanityFetch<{
    service: Record<string, unknown> | null
    slugOrder: string[]
  }>(Q.SERVICE_BY_SLUG_QUERY, { slug })

  if (!raw?.service) return null

  const position = raw.slugOrder?.indexOf(slug) ?? -1
  return mapService(raw.service, position === -1 ? 0 : position)
}

export async function getServiceSlugs(): Promise<string[]> {
  return sanityFetchFresh<string[]>(Q.SERVICE_SLUGS_QUERY)
}

// -------------------------------------------------------------------- blog --

function mapPost(raw: Record<string, unknown>): BlogPost {
  const cover = fallbackImage(toSiteImage(raw.cover as never, 1600))
  const body = toBlogBlocks(raw.body as PortableBlock[])
  const author = (raw.author ?? {}) as { name?: string; role?: string }

  return {
    slug: raw.slug as string,
    title: raw.title as string,
    excerpt: raw.excerpt as string,
    category: (raw.category as string) ?? '',
    publishedAt: (raw.publishedAt as string)?.slice(0, 10) ?? '',
    readingMinutes: readingMinutes(body),
    cover: { src: cover.src, alt: cover.alt },
    author: { name: author.name ?? '', role: author.role ?? '' },
    body,
  }
}

export async function getPosts(): Promise<BlogPost[]> {
  const raw = await sanityFetch<Record<string, unknown>[]>(Q.ALL_POSTS_QUERY)
  return raw.map(mapPost)
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  const raw = await sanityFetch<Record<string, unknown> | null>(Q.POST_BY_SLUG_QUERY, { slug })
  return raw ? mapPost(raw) : null
}

export async function getPostSlugs(): Promise<string[]> {
  return sanityFetchFresh<string[]>(Q.POST_SLUGS_QUERY)
}

/** Same category first, then anything else. Matches the old in-memory helper. */
export async function getRelatedPosts(slug: string, limit = 3): Promise<BlogPost[]> {
  const all = await getPosts()
  const current = all.find((post) => post.slug === slug)
  if (!current) return []

  const others = all.filter((post) => post.slug !== slug)
  const sameCategory = others.filter((post) => post.category === current.category)
  const rest = others.filter((post) => post.category !== current.category)
  return [...sameCategory, ...rest].slice(0, limit)
}

/** Posts are ordered newest first, so "previous" is the older neighbour. */
export async function getAdjacentPosts(slug: string) {
  const ordered = await getPosts()
  const index = ordered.findIndex((post) => post.slug === slug)
  if (index === -1) return { prev: undefined, next: undefined }
  return { prev: ordered[index + 1], next: ordered[index - 1] }
}

/** Every service except the one being viewed, for the "other practices" rail. */
export async function getOtherServices(id: string): Promise<Service[]> {
  const all = await getServices()
  return all.filter((service) => service.id !== id)
}

// ------------------------------------------------------------ homepage bits --

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const raw = await sanityFetch<Record<string, unknown>[]>(Q.HERO_SLIDES_QUERY)
  return raw.map((slide) => {
    const image = fallbackImage(toSiteImage(slide.image as never, 2400))
    const cta = (slide.cta ?? {}) as { label?: string; href?: string }
    return {
      id: slide.id as string,
      image: image.src,
      alt: image.alt,
      eyebrow: (slide.eyebrow as string) ?? '',
      title: (slide.headline as string[]) ?? [],
      lead: (slide.lead as string) ?? '',
      cta: { label: cta.label ?? 'Start a project', href: cta.href ?? '/contact' },
    }
  })
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const raw = await sanityFetch<Record<string, unknown>[]>(Q.TESTIMONIALS_QUERY)
  return raw.map((item) => ({
    id: item.id as string,
    quote: item.quote as string,
    author: item.author as string,
    role: (item.role as string) ?? '',
    project: (item.project as string) ?? '',
  }))
}

export async function getHomePage(): Promise<{
  reasons: Reason[]
  processSteps: ProcessStep[]
  whyImage: SiteImage | null
}> {
  const raw = await sanityFetch<Record<string, unknown> | null>(Q.HOME_PAGE_QUERY)

  const reasons = (((raw?.reasons as Record<string, string>[]) ?? []) as Record<string, string>[])
    .map((item, index) => ({
      index: numbered(index),
      title: item.title,
      body: item.body,
    }))

  const processSteps = (((raw?.processSteps as Record<string, string>[]) ?? []) as Record<
    string,
    string
  >[]).map((item, index) => ({
    index: numbered(index),
    title: item.title,
    body: item.body,
    duration: item.meta ?? '',
  }))

  return { reasons, processSteps, whyImage: toSiteImage(raw?.whyImage as never, 1200) }
}

// -------------------------------------------------------------------- about --

export async function getTeam(): Promise<TeamMember[]> {
  const raw = await sanityFetch<Record<string, unknown>[]>(Q.TEAM_QUERY)
  return raw.map((member) => {
    const portrait = fallbackImage(toSiteImage(member.portrait as never, 900))
    return {
      name: member.name as string,
      role: member.role as string,
      bio: member.bio as string,
      image: portrait.src,
      alt: portrait.alt,
    }
  })
}

export async function getAboutPage() {
  const raw = await sanityFetch<Record<string, unknown> | null>(Q.ABOUT_PAGE_QUERY)
  const hero = fallbackImage(toSiteImage(raw?.heroImage as never, 2400))
  const story = fallbackImage(toSiteImage(raw?.storyImage as never, 1400))

  const values: AboutValue[] = (((raw?.values as Record<string, string>[]) ?? []) as Record<
    string,
    string
  >[]).map((item, index) => ({
    index: numbered(index),
    title: item.title,
    body: item.body,
  }))

  return {
    hero: {
      eyebrow: (raw?.eyebrow as string) ?? 'About',
      headline: (raw?.headline as string) ?? '',
      lead: (raw?.lead as string) ?? '',
      image: hero.src,
      alt: hero.alt,
    },
    story: {
      title: (raw?.storyTitle as string) ?? '',
      body: toParagraphs(raw?.storyBody as PortableBlock[]),
      image: story.src,
      alt: story.alt,
    },
    timeline: ((raw?.timeline as TimelineItem[]) ?? []).map((item) => ({
      year: item.year,
      title: item.title,
      text: item.text,
    })),
    values,
    stats: ((raw?.stats as Stat[]) ?? []).map((item) => ({
      value: item.value,
      label: item.label,
    })),
  }
}

// ----------------------------------------------------------------- settings --

export type SiteSettings = {
  legalName: string
  shortName: string
  tagline: string
  description: string
  foundedYear: number
  phoneDisplay: string
  phoneHref: string
  whatsappNumber: string
  whatsappDisplay: string
  email: string
  addressLines: string[]
  locationLabel: string
  hours: string
  social: { facebook?: string; instagram?: string; linkedin?: string; x?: string }
}

/** Digits only, for `tel:` and `wa.me`. Derived so the forms cannot drift. */
const digits = (value: string) => value.replace(/\D/g, '')

/**
 * Ready for a future cutover. Live contact/brand currently comes from
 * `lib/site-config.ts`; nothing calls this yet. See CMS.md.
 */
export async function getSiteSettings(): Promise<SiteSettings | null> {
  const raw = await sanityFetch<Record<string, unknown> | null>(Q.SITE_SETTINGS_QUERY)
  if (!raw) return null

  const phone = (raw.phone as string) ?? ''
  const whatsapp = (raw.whatsapp as string) || phone

  return {
    legalName: raw.legalName as string,
    shortName: raw.shortName as string,
    tagline: raw.tagline as string,
    description: raw.description as string,
    foundedYear: raw.foundedYear as number,
    phoneDisplay: phone,
    phoneHref: `+${digits(phone)}`,
    whatsappNumber: digits(whatsapp),
    whatsappDisplay: whatsapp,
    email: raw.email as string,
    addressLines: (raw.addressLines as string[]) ?? [],
    locationLabel: raw.locationLabel as string,
    hours: raw.hours as string,
    social: (raw.social as SiteSettings['social']) ?? {},
  }
}
